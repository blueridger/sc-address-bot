console.log(`Hello from Node.js ${process.version}!`);
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;
const CLIENT_ID = env.CLIENT_ID;
const GUILD_ID = env.GUILD_ID;

const commandTally = new SlashCommandBuilder()
    .setName('tally')
    .setDescription('Tallies cred-weighted voting on the provided message.')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('The link to the message that should be tallied.')
            .setRequired(true));

const commands = [commandTally];

const rest = new REST({ version: '9' }).setToken(process.env.BOT_SECRET);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();