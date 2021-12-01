const keep_alive = require('./keep_alive.js')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commandConstants = require("./commandConstants.js")
require('dotenv').config();

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;

const {setAddressHandler} = require("./handlers/setAddress.js")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === commandConstants.SET_ADDRESS_NAME)
    setAddressHandler(interaction)
});

client.login(BOT_SECRET);