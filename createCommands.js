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

const commandSetAddress = new SlashCommandBuilder()
    .setName(commandConstants.SET_ADDRESS_NAME)
    .setDescription('Sets your wallet payout address.')
    .addStringOption(option =>
        option.setName(commandConstants.SET_ADDRESS_PARAM)
            .setDescription('Your wallet address.')
            .setRequired(true));

const commandActivate = new SlashCommandBuilder()
    .setName(commandConstants.ACTIVATE_NAME)
    .setDescription('Activates you for payouts.');

const commandDeactivate = new SlashCommandBuilder()
    .setName(commandConstants.DEACTIVATE_NAME)
    .setDescription('Deactivates you for payouts.');

const commands = [commandSetAddress, commandActivate, commandDeactivate];

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