const sc = require("sourcecred").sourcecred;

module.exports = {
    getDiscordAddressFromId: (discordUserId, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "discord",
            "MEMBER",
            isBot ? "bot" : "user",
            discordUserId
        ]);
    }
};