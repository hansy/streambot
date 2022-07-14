import type { NextApiRequest, NextApiResponse } from "next";
import { verifyMessage } from "ethers/lib/utils";
import { getTgParamsFromStreamId } from "../../../models/tokenGateParams";
import { hasBalance } from "../../../util/contracts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    payload: { requestUrl },
  } = req.body;
  const url = new URL(requestUrl);
  const sig = String(url.searchParams.get("sig"));
  const message = String(url.searchParams.get("message"));
  const streamId = String(url.searchParams.get("streamId"));

  try {
    const address = verifyMessage(message, sig);
    const tokenGateParams = await getTgParamsFromStreamId(streamId);
    const isValid = await hasBalance(tokenGateParams, address);

    if (isValid) {
      return res.status(200).send("yes");
    }
  } catch {}

  res.status(401).send("no");
}
