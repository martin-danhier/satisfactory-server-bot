import { Client } from "discord.js";
import { config } from "./config";
import SatisfactoryWatchdog from "./watchdog";

const client = new Client({
  intents: ["Guilds", "GuildMessages"],
});

let watchdog: SatisfactoryWatchdog | null = null;

client.once("ready", () => {
  const channel = client.channels.cache.get(config.DISCORD_CHANNEL_ID);
  if (!channel) {
    console.error("Channel does not exist");
    return;
  }
  watchdog = new SatisfactoryWatchdog();

  console.log("Bot is ready !");

  const sendMsg = (msg?: string) => {
    if (msg && channel.isSendable()) {
      console.info(msg);
      channel.send(msg);
    }
  };


  // Player count
  watchdog.callbacks.numConnectedPlayers = async (oldValue, newValue) => {
    if (newValue > oldValue) {
      sendMsg(`Someone joined the game! (Player count ${oldValue}->${newValue})`);
    } else if (newValue < oldValue) {
      sendMsg(`Someone left the game! (Player count ${oldValue}->${newValue})`);
    }
  };

  watchdog.callbacks.isGamePaused = async (_, paused) => {
    if (paused) {
      sendMsg(`Server is now paused.`);
    } else {
      sendMsg(`Server is no longer paused.`);
    }
  };

  setInterval(() => {
    watchdog?.update();
  }, config.UPDATE_FREQUENCY_SEC * 1000);
  watchdog?.update();


});

client.login(config.DISCORD_TOKEN);
