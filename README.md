# Usage
Use the `/tally` command and pass a link to the message you want to tally.
```
/tally https://discord.com/channels/798975165342023700/798975167971196981/894988234331947028
```
# Installation
This bot should work self-hosted (.env) or on repl.it (repl secrets)

1. Fork this repo
1. Change config.js
1. Set up a host on your preferred hosting platform
1. Create an application+bot in the Discord Developer Portal
1. Add the following environment variables to your host:
   1. CLIENT_ID
   1. BOT_SECRET
1. Invite the bot to your server(s) with the following link (substitute with your own client id):
```
https://discord.com/api/oauth2/authorize?client_id=555555555555555&permissions=84992&scope=bot
```