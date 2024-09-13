# Satisfactory Server Discord Bot

A simple Discord bot that uses the new Satisfactory dedicated server API to keep track of the server state and send a message whenever someone joins or leaves the game.

The API is very limited, so there isn't any way to retrieve chat logs or the player names yet.

## Setup:

- Create a `.env` file containing:

```dotenv
DISCORD_TOKEN=<bot token>
DISCORD_CHANNEL_ID=<server channel id>
SATISFACTORY_TOKEN=<satisfactory server API key>
SATISFACTORY_API_BASE=https://<server_ip>:7777/api/v1
UPDATE_FREQUENCY_SEC=20
```

- Run `pnpm install`
- Run `pnpm build`
- Run `pnpm start`

