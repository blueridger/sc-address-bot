const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    activateHandler: async (interaction) => {
        await interaction.deferReply();
        const config = configs.GUILD_IDS[interaction.guildId]
        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})

            const discordAddress = getDiscordAddressFromId(interaction.member.user.id, false)

            await ledgerManager.reloadLedger()

            const account = ledgerManager.ledger.accountByAddress(discordAddress)
            const uuid = account.identity.id
            const oldLength = ledgerManager.ledger.eventLog().length

            ledgerManager.ledger.activate(uuid)
            const result = ledgerManager.ledger.eventLog().length > oldLength ? await ledgerManager.persist() : {}
            if (result.error) throw result.error;

            await interaction.editReply({
                content: `Successfully activated ${account.identity.name}. Note, you might start receiving airdrops automatically.`});
        } catch (e) {
            await interaction.editReply({
                    content: `Failed with message: ` + e});
        }
    },
    deactivateHandler: async (interaction) => {
        await interaction.deferReply();
        const config = configs.GUILD_IDS[interaction.guildId]
        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})

            const discordAddress = getDiscordAddressFromId(interaction.member.user.id, false)

            await ledgerManager.reloadLedger()

            const account = ledgerManager.ledger.accountByAddress(discordAddress)
            const uuid = account.identity.id
            const oldLength = ledgerManager.ledger.eventLog().length

            ledgerManager.ledger.deactivate(uuid)
            const result = ledgerManager.ledger.eventLog().length > oldLength ? await ledgerManager.persist() : {}
            if (result.error) throw result.error;

            await interaction.editReply({
                content: `Successfully deactivated ${account.identity.name}.`});
        } catch (e) {
            await interaction.editReply({
                    content: `Failed with message: ` + e});
        }
    }
}