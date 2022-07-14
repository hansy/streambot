import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { IncomingHttpHeaders } from "node:http2";
import { post, get } from "../../../../util/request";

const API_BASE = "https://discord.com/api/v10/";
const HEADERS = {
  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
};

export interface Command {
  name: string;
  description: string;
  type: number;
  options?: any;
}

export interface Interaction {
  type: InteractionType;
  data?: any;
  guild_id: string;
}

export interface InteractionResponse {
  type: InteractionResponseType;
  data?: any;
}

export const verifyRequest = (
  headers: IncomingHttpHeaders,
  buffer: Buffer
): boolean => {
  const signature = headers["x-signature-ed25519"] as string;
  const timestamp = headers["x-signature-timestamp"] as string;

  return verifyKey(
    buffer,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY as string
  );
};

export const installCommand = async (appId: string, command: Command) => {
  return await post(
    `${API_BASE}/applications/${appId}/commands`,
    command,
    HEADERS
  );
};

export const getCommands = async (appId: string) => {
  return await get(`${API_BASE}/applications/${appId}/commands`, {}, HEADERS);
};
