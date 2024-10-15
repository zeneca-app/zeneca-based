import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { TransferRead } from "../client";
import zustandStorage from "./storage";

interface TransferState {
  transfer: TransferRead;
  setTransfer: (transfer: TransferRead) => void;
  resetAll: () => void;
}

const initialState = {
  transfer: {} as TransferRead,
};

const useTransferStore = create<TransferState>()(
  devtools(
    persist(
      (set) => ({
        transfer: initialState.transfer,
        setTransfer: (data: TransferRead) => set(() => ({ transfer: data })),
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
