# Usage
This command will save the payout address to the SourceCred account corresponding to the user of the command. The payout address is saved directly to the configured instance's Ledger.
```
/setpayoutaddress 0xF6mSADFk42fdDdsE42FKEfdlkz6
```

You can also use these commands to enable and disable your account for receiving Grain distributions.
```
/activate
/deactivate
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
   1. GITHUB_SECRET
1. Invite the bot to your server(s) with the following link (substitute with your own client id):
```
https://discord.com/api/oauth2/authorize?client_id=555555555555555&permissions=84992&scope=bot
```