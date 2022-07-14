import { chain } from "wagmi";

interface Chain {
  name: string;
  network: string;
}

const chainMapper = (chain: Chain) => {
  return {
    label: chain.name,
    value: chain.network,
  };
};

export const chainOptions = [
  chain.mainnet,
  chain.arbitrum,
  chain.optimism,
  chain.polygon,
];
