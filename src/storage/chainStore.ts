import { Chain } from "viem";
import { baseSepolia } from "viem/chains";
import { create } from "zustand";

type ChainStore = {
  chain: Chain;
  setChain: (chain: Chain) => void;
};

export const useChainStore = create<ChainStore>((set, get) => ({
  chain: baseSepolia,
  setChain: (chain) => set({ chain }),
}));
