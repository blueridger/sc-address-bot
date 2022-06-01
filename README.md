# Usage
This command will save the payout address to the SourceCred account corresponding to the user of the command. The payout address is saved directly to the configured instance's Ledger.
```
/setpayoutaddress 0xEdd000B7Db3cb8931d4E0cb1D0DBe6B947Ceb09A
```

You can also use these commands to enable and disable your account for receiving Grain distributions.
```
/activate
/deactivate
```

# Installation
This bot should work self-hosted (.env) or on repl.it (repl secrets)

1. Copy .example.env to .env
2. Open Config.js
   1. Verify that the details added are correct for the Discord Guild (server ID) and Token (NATION)
   2. Currently configured to push to a test branch *activation-bot-test* of the NationCred instance once tested, update and redeploy (NOTE: this banch must exist in the repo, it is not automatically created)
3. Create a Discord Application
   1. Navigate to [Discord Developer Portal](https://discord.com/developers/applications)
   2. Click *New Application*
   3. Give the application a sensible name like *Nation3 SourceCred Activation*
4. Create Bot
   1. Click Bot menu and add a new Bot
   2. Reset the *Token* and copy the generated value
   3. That token should be set in the .env file on the Production environment in the BOT_SECRET element 
5. Add Bot to Discord
   1. Open the *OAuth2* menu and select the *URL Generator* sub-menu
   2. Check the *applications.commands* role and copy the generated URL
   3. Open the generated URL in the browser as a Discord user with permission to administer the Discord server
   4. Select correct server and add
6. Copy Client ID from OAuth2 > General *CLIENT ID* to the .env file on the Production environment in the CLIENT_ID element
7. Copy the public key to the .env file on the Production environment in the PUBLIC_KEY element 
8. Add a Personal Access Token with write access to the SourceCred repository to the .env file on the Production environment in the GITHUB_SECRET element
9. Deploy the app somewhere with Node 16 and run `npm start`
