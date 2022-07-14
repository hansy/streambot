import { installCommand, getCommands } from "../pages/api/_util/discord";
import type { Command } from "../pages/api/_util/discord";

// Check if Discord Slash command is registered; if so, update it
// If not, register it
export const upsertDiscordCommand = async (command: Command) => {
  const appId = process.env.DISCORD_APP_ID as string;

  try {
    const data = await getCommands(appId);

    if (data) {
      const installedNames = data.map((c: any) => c.name);

      if (installedNames.includes(command.name)) {
        console.log(`Updating "${command.name}"`);
      } else {
        console.log(`Installing "${command.name}"`);
      }

      await installCommand(appId, command);
    }
  } catch (err) {
    console.error(err);
  }
};
