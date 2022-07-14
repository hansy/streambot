import { supabase, handleSupaResponse } from "../pages/api/_util/supabase";

export interface TokenGateParams {
  [key: string]: string | number | undefined;
  discord_guild_id: string;
  chain: string;
  token: string;
  token_id?: number;
  token_num: number;
  contract_address: string;
}

const TABLE_NAME = "token_gate_params";

export const upsertTokenGateParams = async (params: TokenGateParams) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(params, { onConflict: "discord_guild_id" });

  return handleSupaResponse(data, error);
};

export const getTgParamsFromStreamId = async (streamId: string) => {
  const { data, error } = await supabase
    .from("tgp_by_discord_guild_id_view")
    .select()
    .eq("livepeer_stream_id", streamId)
    .single();

  return handleSupaResponse(data, error);
};
