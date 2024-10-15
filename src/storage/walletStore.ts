import { create } from "zustand";

type WalletStore = {
  address: `0x${string}`;
  setAddress: (address: `0x${string}`) => void;
};

export const useWalletStore = create<WalletStore>((set, get) => ({
  address: "" as `0x${string}`,
  setAddress: (address) => set({ address }),
}));
