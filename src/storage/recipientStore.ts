import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { RecipientReadWithExternalAccount } from "../client";
import zustandStorage from "./storage";

interface RecipientState {
  recipient: RecipientReadWithExternalAccount;
  setRecipient: (recipient: RecipientReadWithExternalAccount) => void;
  resetAll: () => void;
}

const initialState = {
  recipient: {} as RecipientReadWithExternalAccount,
};

const useRecipientStore = create<RecipientState>()(
  devtools(
    persist(
      (set) => ({
        recipient: initialState.recipient,
        setRecipient: (data) => set(() => ({ recipient: data })),
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
