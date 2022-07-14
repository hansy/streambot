import { ethers } from "ethers";
import type { TokenGateParams } from "../models/tokenGateParams";
import * as abis from "../abis";

export const hasBalance = async (
  params: TokenGateParams,
  userAddress: string
): Promise<boolean> => {
  const provider = new ethers.providers.InfuraProvider(
    params.chain,
    process.env.NEXT_PUBLIC_INFURA_ID
  );
  const tokenType = params.token;
  const abi = abis[tokenType as keyof typeof abis];

  try {
    const contract = new ethers.Contract(
      params.contract_address,
      abi,
      provider
    );
    let balance;

    if (tokenType === "erc1155") {
      balance = await contract.balanceOf(userAddress, params.token_id);
    } else {
      balance = await contract.balanceOf(userAddress);
    }

    return balance.gte(params.token_num);
  } catch (e) {
    console.error("Error checking balance", e);

    return false;
  }
};
