console.log(`Hello from Node.js ${process.version}!`);
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("./config.js")
const commandConstants = require("./commandConstants.js")
require('dotenv').config();

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;
const CLIENT_ID = env.CLIENT_ID;

const commandTally = new SlashCommandBuilder()
    .setName(commandConstants.TALLY_NAME)
    .setDescription('Tallies cred-weighted voting on the provided message.')
    .addStringOption(option =>
        option.setName(commandConstants.TALLY_PARAM)
            .setDescription('The link to the message that should be tallied.')
            .setRequired(true))
    .addNumberOption(option =>
        option.setName(commandConstants.TALLY_PARAM_DECAY)
            .setDescription('A decay factor between 0 and 1 where 0 is no decay.')
            .setRequired(false));

const commands = [commandTally];

const rest = new REST({ version: '9' }).setToken(process.env.BOT_SECRET);

(async () => {
    try {
        for (const guild_id of Object.keys(config.GUILD_IDS)) {
            console.log(guild_id + ' Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id),
                { body: commands },
            );

            console.log(guild_id + ' Successfully reloaded application (/) commands.');
        }
    } catch (error) {
        console.error(error);
    }
})();