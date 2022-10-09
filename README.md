# StreamBot

This is the source code for StreamBot, a Discord bot that (when installed) lets any Discord server create and share token-gated livestreams with their members.

## Dev Requirements

- Supabase account
- Discord developer account
- Infura account
- Livepeer account

## Setup

### 1. Add app domain

Add the application's domain to `NEXT_PUBLIC_HOST` as an environment variable. For running locally, `http://localhost:3000` is fine.

### 2. Create Supabase tables

Supabase is the (PostgreSQL) DB that keeps track of installed server IDs and their corresponding token-gating parameters.

After creating a Supabase account (https://supabase.com), add the Supabase Project URL and API Key as `SUPABASE_URL` and `SUPABASE_SECRET`, respectively, to your environment (`.env` file if local).

Create two tables with the following structures:

TABLE NAME: guild_streams

| Column             | Type | Is Nullable? |
| ------------------ | ---- | ------------ |
| discord_guild_id   | text | No           |
| livepeer_stream_id | text | No           |

TABLE NAME: token_gate_params

| Column           | Type | Is Nullable? |
| ---------------- | ---- | ------------ |
| discord_guild_id | text | No           |
| chain            | text | No           |
| token            | text | No           |
| token_id         | int2 | Yes          |
| token_num        | int8 | No           |
| contract_address | text | No           |

Additionally you'll need to create a view to make querying a bit easier. Go into the SQL editor in Supabase and run the following:

```
create view tgp_by_discord_guild_id_view as
select tg.*, gs.livepeer_stream_id
from token_gate_params as tg
join guild_streams as gs on gs.discord_guild_id = tg.discord_guild_id;
```

### 3. Create Discord developer application

The Discord bot needs to be created/registered in Discord's developer portal (https://discord.com/developers). Once you create an application, add the Application ID, Pulic Key, and Discord Bot Token as `DISCORD_APP_ID`, `DISCORD_PUBLIC_KEY`, and `DISCORD_BOT_TOKEN` respectively, to your environment (`.env` file if local).

You'll also need to generate an OAuth URL to get the necessary permissions from the user. This can be generated in the developer portal by going to OAuth2 -> URL Generator.

For the generator you'll need to check:

Scopes:

- bot
- application.commands

Bot Permissions:

- Send Messages
- Use Slash Commands

After specifying the above permissions, add the generated URL as `NEXT_PUBLIC_DISCORD_INSTALL_URL` as an environment variable.

### 4. Get Infura key

Infura is how the application interacts with the blockchain. Specifically for this app, it will be required so users can authenticate their wallet (when viewing a livestream) as well as checking they have the necessary permissions (via token-gating params) to view the stream.

After signing up for an account (https://infura.io), add the Infura API key as `NEXT_PUBLIC_INFURA_ID` as an environment variable.

### 5. Get Livepeer API key and register webhooks

Livepeer provides the infrastructure and API to add livestreaming capabilities to the application.

First create an account with Livepeer Studio (https://livepeer.studio) and generate a new API key. Add the API key as `LIVEPEER_API_KEY` to the environment.

Next we need to configure the webhooks livepeer will send whenever a new user connects to a livestream. The webhooks are where a user is validated against the token-gating params set by the Discord server.

In Livepeer Studio navigate to Developers -> Webhooks. Create a webhook with a URL that points to the domain you'll be deploying this application. The domain of the URL should match the domain of `NEXT_PUBLIC_HOST`. If the domain is localhost, use a tunneling service when constructing the URL.

The URL should look like: `https://yourdomain.com/api/webhooks/livepeer`. Notice the `/api/webhooks/livepeer` appended at the end.

For a bit of security, add a webhook secret as well (can be a randomly generated string). Add the webhook secret as `LIVEPEER_WEBHOOK_SECRET` to the environment.

Finally, select `playback.user.new` as the event to listen for and save the webhook.

## Running the app

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Upon application start, the Discord slash commands (`/setup`, `/create-stream`, `streams`) should automatically be installed for the Discord bot.

## Discord Slash Commands

There are three commands the bot exposes for a Discord server's users. Generally speaking, all of these commands should only be run by the Discord server admins. This application does not include any special permissions, but once the bot is installed, Discord admins should be able to restrict commands within Discord.

### `/setup`

This command lets the Discord server set their token-gating parameters for their livestreams. When run, a modal will pop down allowing the user to specify parameters to be checked against a livestream viewer's wallet.

The parameters include:

- Chain name (e.g. ethereum, polygon, etc)
- Token type (e.g. erc20, erc721, erc1155)
- Token ID (specific to erc1155)
- Number of tokens (how many tokens user should own; default is 1)
- Contract address (the address of the contract to be checked)

### `/create-stream`

This command lets a user dynamically create a livestream by specifying a stream name. After execution, the bot will return stream information including the:

- RTMP URL (for streaming with a broadcaster like OBS)
- Steam key (for streaming with a broadcaster like OBS)
- Playback URL (URL to watch stream; can be shared with Discord members)

### `/streams`

This command lists all created streams and includes the same information as `/create-stream` for each created stream.

## Deploying app

Vercel (https://vercel.com) is probably the simplest way to deploy the app. After adding the required environment variables, connect this Github repo to your Vercel account. On every push to the `main` branch, the application should get automatically deployed.
