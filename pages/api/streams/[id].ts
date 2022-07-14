import type { NextApiRequest, NextApiResponse } from "next";
import { getStream } from "../_util/livepeer";
import { Stream } from "../_util/livepeer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (typeof id === "string") {
      try {
        const { playbackId, isActive }: Stream = await getStream(id);

        return res.status(200).json({ playbackId, isActive });
      } catch (e) {
        return res.status(400).json(e);
      }
    }
  }

  res.status(404).json({});
}
