import { chain } from "wagmi";

interface Chain {
  name: string;
  network: string;
}

export const chainOptions = [
  chain.mainnet,
  chain.arbitrum,
  chain.optimism,
  chain.polygon,
];
