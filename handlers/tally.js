const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const config = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    tallyHandler: async (interaction) => {
        await interaction.deferReply();
        const decay = interaction.options.getNumber(commandConstants.TALLY_PARAM_DECAY) || config.DECAY;
        const [,channelId,messageId] = interaction.options.getString(commandConstants.TALLY_PARAM).match(/https\:\/\/discord\.com\/channels\/[0-9]*\/([0-9]*)\/([0-9]*)/)

        const message = await (await (await interaction.guild.channels.fetch(channelId)).messages.fetch(messageId)).fetch()

        const reactions = await message.reactions.cache
            .each(async (reaction) => await reaction.users.fetch())
            .reduce(async (arr, value, key) => {
                (await arr).push({
                    emoji: key,
                    users: (await value.users.fetch()).filter(u => u.bot === false)
                });
                return arr;
            }, []);

        const credGrainView = await sc.instance.readInstance
            .getNetworkReadInstance(`https://raw.githubusercontent.com/${config.GUILD_IDS[interaction.guildId]}/`)
            .readCredGrainView()

        let reactionsWithData = reactions.map(x => {
            const userAddresses = x.users.map(u => getDiscordAddressFromId(u.id, false));

            const participants = userAddresses.map(u => credGrainView.participants().find(
                p => p.identity.aliases.some(a => a.address == u))
            ).filter(p => p);

            const scores = participants.map(
                p => p.credPerInterval.reduce(
                    (a, b) => a * (1 - decay) + b,
                    0
                )
            );

            const decayedTotalScore = scores.reduce(
                (a, b) => a + b,
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
            (a,b) => a + b.credPerInterval.reduce(
                (a, b) => a * (1 - decay) + b,
                0
            ),
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

        await interaction.editReply({
            embeds: message.embeds,
            content: `
**Cred-weighted Tally** with decay of ${decay}

**Message Link:** ${interaction.options.getString(commandConstants.TALLY_PARAM)}
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
`.trim()});
    }
}