import {
  InteractionResponseType,
  MessageComponentTypes,
  TextStyleTypes,
} from "discord-interactions";
import type { InteractionResponse } from "../..";
import { upsertTokenGateParams } from "../../../../../../models/tokenGateParams";
import { chainOptions } from "../../../../../../util/chains";

export const handleSetupCommand = (): InteractionResponse => {
  return {
    type: InteractionResponseType.APPLICATION_MODAL,
    data: {
      custom_id: "setupModal",
      title: "Token-gating parameters",
      flags: 64,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              placeholder: "Pick a chain",
              custom_id: "chain",
              required: true,
              label: "Chain",
              options: chainOptions.map((chain) => ({
                label: chain.name,
                value: chain.network,
              })),
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              placeholder: "Pick a token type",
              custom_id: "token",
              required: true,
              label: "Token Type",
              options: [
                {
                  label: "ERC-20",
                  value: "erc20",
                },
                {
                  label: "ERC-721",
                  value: "erc721",
                },
                {
                  label: "ERC-1155",
                  value: "erc1155",
                },
              ],
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: "token_id",
              min_length: 0,
              label: "Token ID (only if ERC-1155 chosen above)",
              style: TextStyleTypes.SHORT,
              required: false,
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: "token_num",
              label: "How many tokens should the user own?",
              style: TextStyleTypes.SHORT,
              min_length: 1,
              value: 1,
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: "contract_address",
              label: "Contract Address",
              style: TextStyleTypes.SHORT,
              required: true,
              min_length: 1,
            },
          ],
        },
      ],
    },
  };
};

export const handleSetupModal = async (
  interaction: any
): Promise<InteractionResponse> => {
  const params: any = {
    discord_guild_id: interaction.guild_id,
  };

  interaction.data.components.forEach((row: any) => {
    row.components.forEach((component: any) => {
      let value = component.value;

      if (component.type === MessageComponentTypes.STRING_SELECT) {
        value = component.values[0];
      }

      if (["token_id", "token_num"].includes(component.custom_id)) {
        value = Number(value);
      }

      params[component.custom_id] = value;
    });
  });

  try {
    await upsertTokenGateParams(params);

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          "Token gating params saved! Now try creating a stream with the `/create-stream` command!",
        flags: 64,
      },
    };
  } catch {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "There was an error adding your data. Please try again.",
        flags: 64,
      },
    };
  }
};
