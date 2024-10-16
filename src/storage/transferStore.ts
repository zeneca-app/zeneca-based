import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { TransferRead } from "../client";
import { TransferCrypto } from "../lib/types/transfer";
import zustandStorage from "./storage";

interface TransferState {
  transfer?: TransferRead;
  transferCrypto?: TransferCrypto;
  setTransfer: (transfer: TransferRead) => void;
  setTransferCrypto: (transfer: TransferCrypto) => void;
  resetAll: () => void;
}

const initialState = {
  transfer: {} as TransferRead,
  transferCrypto: {} as TransferCrypto,
};

const useTransferStore = create<TransferState>()(
  devtools(
    persist(
      (set) => ({
        transfer: initialState.transfer,
        transferCrypto: initialState.transferCrypto,
        setTransfer: (data: TransferRead) => set(() => ({ transfer: data })),
        setTransferCrypto: (data: TransferCrypto) =>
          set(() => ({ transferCrypto: data })),
        resetAll: () => set(() => initialState),
      }),
      {
        name: "transfer-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useTransferStore;
