import { create } from "zustand";

type WalletStore = {
  address: `0x${string}`;
  setAddress: (address: `0x${string}`) => void;
};

export const useWalletStore = create<WalletStore>((set, get) => ({
  address: "0x9431AC46710F81e560f896b9BD385d0518733ca0" as `0x${string}`,
  setAddress: (address) => set({ address }),
}));
