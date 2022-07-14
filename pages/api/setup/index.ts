import type { NextApiRequest, NextApiResponse } from "next";
import { upsertDiscordCommand } from "../../../setupScripts/installCommands";
import commands from "../../../commands";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    Promise.all(
      Object.keys(commands).map((name: string) =>
        upsertDiscordCommand(commands[name])
      )
    );

    return res.status(200).json({});
  }

  res.status(404).json({});
}
