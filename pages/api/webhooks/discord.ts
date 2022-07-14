import type { NextApiRequest, NextApiResponse } from "next";
import { getBuffer } from "../../../util/request";
import { verifyRequest } from "../_util/discord";
import { handleInteraction } from "../_util/discord/interactions/handlers";
import { inspect } from "util";

// disable default body parser because we want request buffer for
// webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buffer = await getBuffer(req);
  const isValidRequest = verifyRequest(req.headers, buffer);

  if (isValidRequest) {
    if (req.method === "POST") {
      const body = JSON.parse(buffer.toString("utf8"));

      console.log(inspect(body, false, null, true /* enable colors */));

      const interactionResponse = await handleInteraction(body);

      return res.send(interactionResponse);
    }
  }

  res.status(401).send("Bad signature");
}
