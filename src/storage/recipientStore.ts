import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { RecipientReadWithExternalAccount } from "../client";
import { RecipientCrypto } from "../lib/types/recipient";
import zustandStorage from "./storage";

interface RecipientState {
  recipient?: RecipientReadWithExternalAccount;
  recipientCrypto?: RecipientCrypto;
  setRecipient: (recipient: RecipientReadWithExternalAccount) => void;
  setRecipientCrypto: (recipient: RecipientCrypto) => void;
  resetAll: () => void;
}

const initialState = {
  recipient: {} as RecipientReadWithExternalAccount,
  recipientCrypto: {} as RecipientCrypto,
};

const useRecipientStore = create<RecipientState>()(
  devtools(
    persist(
      (set) => ({
        recipient: initialState.recipient,
        recipientCrypto: initialState.recipientCrypto,
        setRecipient: (data) => set(() => ({ recipient: data })),
        setRecipientCrypto: (data) => set(() => ({ recipientCrypto: data })),
        resetAll: () => set(() => initialState),
      }),
      {
        name: "recipient-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useRecipientStore;
