import { InteractionResponseType, InteractionType } from "discord-interactions";
import type { InteractionResponse, Interaction } from "../..";
import { handleSetupCommand, handleSetupModal } from "./setup";
import {
  handleCreateStreamCommand,
  handleCreateStreamModal,
  handleStreamsCommand,
} from "./streams";

export const handleInteraction = async (
  interaction: Interaction
): Promise<InteractionResponse> => {
  if (interaction.type === InteractionType.PING) {
    return { type: InteractionResponseType.PONG };
  }
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const name = interaction.data.name;

    if (name === "setup") {
      return handleSetupCommand();
    }

    if (name === "create-stream") {
      return handleCreateStreamCommand();
    }

    if (name === "streams") {
      return handleStreamsCommand(interaction);
    }
  }
  if (interaction.type === InteractionType.APPLICATION_MODAL_SUBMIT) {
    if (interaction.data.custom_id === "setupModal") {
      return handleSetupModal(interaction);
    }

    if (interaction.data.custom_id === "createStreamModal") {
      return handleCreateStreamModal(interaction);
    }
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "No handler for this command",
    },
  };
};
