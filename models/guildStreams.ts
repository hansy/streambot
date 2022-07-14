import { supabase, handleSupaResponse } from "../pages/api/_util/supabase";

interface GuildStream {
  discord_guild_id: string;
  livepeer_stream_id: string;
}

const TABLE_NAME = "guild_streams";

export const getGuildStreamIds = async (guildId: string) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("livepeer_stream_id")
    .eq("discord_guild_id", guildId);

  if (error) {
    console.error(error);

    return Promise.reject(error);
  }

  return data?.map((d) => d.livepeer_stream_id);
};

export const createGuildStream = async (guildStream: GuildStream) => {
  const { data, error } = await supabase.from(TABLE_NAME).insert(guildStream);

  return handleSupaResponse(data, error);
};
