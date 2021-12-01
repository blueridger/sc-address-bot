const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: async (interaction) => {
        await interaction.deferReply();
        const address = interaction.options.getString(commandConstants.SET_ADDRESS_PARAM)
        const config = configs.GUILD_IDS[interaction.guildId]

        const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.GithubStorage({apiToken: GITHUB_SECRET, repo: config[0], branch: config[1]})})
        await ledgerManager.reloadLedger()
        const discordAddress = getDiscordAddressFromId(interaction.member.user.id, false)
        const uuid = ledgerManager.ledger.accountByAddress(discordAddress).identity.id
        ledgerManager.ledger.setPayoutAddress(uuid, address, config[2], config[3])

        await interaction.editReply({
            //embeds: message.embeds,
            content: `Successfully set payout address to ${address} for chainId ${config[2]} and tokenAddress ${config[3]}`});
    }
}