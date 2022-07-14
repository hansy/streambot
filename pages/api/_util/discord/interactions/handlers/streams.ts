import {
  InteractionResponseType,
  MessageComponentTypes,
  TextStyleTypes,
} from "discord-interactions";
import type { Interaction, InteractionResponse } from "../..";
import {
  createGuildStream,
  getGuildStreamIds,
} from "../../../../../../models/guildStreams";
import { createStream, getStreams, RTMP_INGEST_URL } from "../../../livepeer";

const streamUrl = (id: string) => {
  return `${process.env.NEXT_PUBLIC_HOST}/streams/${id}`;
};

export const handleCreateStreamCommand = (): InteractionResponse => {
  return {
    type: InteractionResponseType.APPLICATION_MODAL,
    data: {
      title: "Create Stream",
      custom_id: "createStreamModal",
      flags: 64,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: "streamName",
              min_length: 1,
              label: "Stream Name",
              placeholder: "e.g. Community Stream",
              style: TextStyleTypes.SHORT,
              required: true,
            },
          ],
        },
      ],
    },
  };
};

export const handleCreateStreamModal = async (
  interaction: any
): Promise<InteractionResponse> => {
  const streamName = interaction.data.components[0].components[0].value;

  try {
    const stream = await createStream(streamName);

    await createGuildStream({
      discord_guild_id: interaction.guild_id,
      livepeer_stream_id: stream.id,
    });

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `\`${
          stream.name
        }\` created! Here are the details:\n\n**Stream settings for broadcasting:**\n\`\`\`RTMP Ingest URL: ${RTMP_INGEST_URL}\nStream Key: ${
          stream.streamKey
        }\`\`\`\n**URL to watch stream: ${streamUrl(
          stream.id
        )}**\n\nUse \`/streams\` to get a list of all your created streams.`,
        flags: 64,
      },
    };
  } catch {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "There was an error creating the stream. Please try again.",
      },
    };
  }
};

export const handleStreamsCommand = async (
  interaction: Interaction
): Promise<InteractionResponse> => {
  const guildId = interaction.guild_id;
  const streamIds = await getGuildStreamIds(guildId);
  const streams = await getStreams(streamIds);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: streams
        .map((stream) => {
          return `> **Stream Name**: ${
            stream.name
          }\n> **Stream URL**: ${streamUrl(
            stream.id
          )}\n> **RTMP Ingest URL**: ${RTMP_INGEST_URL}\n> **Stream Key**: ${
            stream.streamKey
          }`;
        })
        .join("\n\n"),
      flags: 64,
    },
  };
};
