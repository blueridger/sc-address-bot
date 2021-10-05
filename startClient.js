const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const sc = require("sourcecred").sourcecred;
const util = require("./util.js")
const config = require("./config.js")

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;
const DECAY = env.DECAY;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'tally') {
    await interaction.deferReply();
    const [,channelId,messageId] = interaction.options.getString("message").match(/https\:\/\/discord\.com\/channels\/[0-9]*\/([0-9]*)\/([0-9]*)/)

    const message = await (await (await interaction.guild.channels.fetch(channelId)).messages.fetch(messageId)).fetch()

    console.log(message.reactions.cache)

    const reactions = await message.reactions.cache
        .each(async (reaction) => await reaction.users.fetch())
        .reduce(async (arr, value, key) => {
            (await arr).push({
                emoji: key,
                users: (await value.users.fetch()).filter(u => u.bot === false)
            });
            return arr;
        }, []);

    const credGrainView = await sc.instance.readInstance.getNetworkReadInstance("https://raw.githubusercontent.com/sourcecred/cred/gh-pages/").readCredGrainView()

    let reactionsWithData = reactions.map(x => {
        const userAddresses = x.users.map(u => util.getDiscordAddressFromId(u.id, false));
        const participants = userAddresses.map(u => credGrainView.participants().find(
            p => p.identity.aliases.some(a => a.address == u)));
        const scores = participants.map(
            p => p.cred
        );
        const decayedTotalScore = scores.reduce(
            (acc, cred) => acc * (1 - config.decay) + cred,
            0
        );
        return {
            ...x,
            userAddresses,
            participants,
            scores,
            decayedTotalScore
        }
    })

    const totalScore = reactionsWithData.reduce(
        (a,b) => a + b.decayedTotalScore,
        0
    )
    const maxScore = Array.from(new Set(
        reactionsWithData.map(x => x.participants).flat()
    )).reduce(
        (a,b) => a + b.cred,
        0
    )
    reactionsWithData = reactionsWithData.map(x => ({
        ...x,
        percent: 100 * x.decayedTotalScore / totalScore,
        percentMax: 100 * x.decayedTotalScore / maxScore
    }))

    const percentResults = reactionsWithData
        .sort((a,b) => b.percent - a.percent)
        .map(x => `${x.emoji}  ${(x.percent).toFixed(2)}%`)
        .join('\n')

    const absoluteResults = reactionsWithData
        .sort((a,b) => b.decayedTotalScore - a.decayedTotalScore)
        .map(x => `${x.emoji}  ${x.decayedTotalScore.toLocaleString(
  "en-US",
  { maximumFractionDigits: 2 }
)}`)
        .join('\n')

    const percentMaxResults = reactionsWithData
        .sort((a,b) => b.percentMax - a.percentMax)
        .map(x => `${x.emoji}  ${(x.percentMax).toFixed(2)}%`)
        .join('\n')

    await interaction.editReply(`
**Cred-weighted Tally** with decay of ${config.decay}

**Message Link:** ${interaction.options.getString("message")}
**Message Content:**
> ${message.content.replace(/\n/g, "\n> ")}

**Results by Percent of All Voting Activity**
${percentResults}

**Results by Percent of Total Respondent Cred**
${percentMaxResults}

**Results by Cred Total** (max possible: ${maxScore.toLocaleString(
  "en-US",
  { maximumFractionDigits: 2 }
)})
${absoluteResults}
`.trim());
  }
});

client.login(BOT_SECRET);