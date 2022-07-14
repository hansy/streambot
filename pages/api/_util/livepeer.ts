import { get, post } from "../../../util/request";

export interface Stream {
  playbackId: string;
  isActive: boolean;
  id: string;
  streamKey: string;
  name: string;
}

const API_BASE = "https://livepeer.studio/api";
export const RTMP_INGEST_URL = "rtmp://ingest.livepeer.engineering/live";

export const getStream = async (id: string) => {
  try {
    return await get(
      `${API_BASE}/stream/${id}`,
      {},
      {
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
      }
    );
  } catch (e) {
    console.error(`Error fetching Livepeer stream ${id}`, e);

    return Promise.reject({ status: 400, message: "Could not get stream" });
  }
};

export const getStreams = async (ids: string[]): Promise<Stream[]> => {
  try {
    return Promise.all(ids.map((id) => getStream(id)));
  } catch (e) {
    console.error(`Error fetching Livepeer streams`, e);

    return [];
  }
};

export const createStream = async (name: string): Promise<Stream> => {
  try {
    return await post(
      `${API_BASE}/stream`,
      { name },
      {
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
      }
    );
  } catch (e) {
    console.error("Error creating livestream", e);

    return Promise.reject(e);
  }
};
