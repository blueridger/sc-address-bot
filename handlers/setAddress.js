const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: async (interaction) => {
        await interaction.deferReply();
        const address = interaction.options.getString(commandConstants.SET_ADDRESS_PARAM)
        const config = configs.GUILD_IDS[interaction.guildId]
        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})
            await ledgerManager.reloadLedger()
            const discordAddress = getDiscordAddressFromId(interaction.member.user.id, false)
            const account = ledgerManager.ledger.accountByAddress(discordAddress)
            const uuid = account.identity.id
            ledgerManager.ledger.setPayoutAddress(uuid, address, config.chainId, config.tokenAddress)
            const result = await ledgerManager.persist()
            if (result.error) throw result.error;

            await interaction.editReply({
                content: `Success!\n**New payout address:** ${address}\n**Account:** ${account.identity.name}\n**Chain Id:** ${config.chainId}\n**Token Address:** ${config.tokenAddress}`});
        } catch (e) {
            await interaction.editReply({
                    content: `Failed with message: ` + e});
        }
    }
}