import type { Command } from "./pages/api/_util/discord";

interface Commands {
  [key: string]: Command;
}

const SETUP_COMMAND: Command = {
  name: "setup",
  description: "StreamBot setup",
  type: 1,
};

const CREATE_STREAM_COMMAND: Command = {
  name: "create-stream",
  description: "Create livestream URL",
  type: 1,
};

const STREAMS_COMMAND: Command = {
  name: "streams",
  description: "View created livestream URLs",
  type: 1,
};

const commands: Commands = {
  SETUP_COMMAND,
  CREATE_STREAM_COMMAND,
  STREAMS_COMMAND,
};

export default commands;
