import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Quote } from "../utils/quote";
import zustandStorage from "./storage";

interface QuoteState {
  quote: Quote;
  setQuote: (quote: Quote) => void;
  resetAll: () => void;
}

const initialState = {
  quote: {} as Quote,
};

const useQuoteStore = create<QuoteState>()(
  devtools(
    persist(
      (set) => ({
        quote: initialState.quote,
        setQuote: (data) => set(() => ({ quote: data })),
        resetAll: () => set(() => initialState),
      }),
      {
        name: "quote-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useQuoteStore;
