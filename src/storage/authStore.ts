import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import zustandStorage from "./storage";

interface AuthState {
  logged: boolean;
  updateLogged: (status: boolean) => void;
  reset: () => void;
}

const initialState = {
  logged: false,
};

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        logged: false,
        updateLogged: (status) => set(() => ({ logged: status })),
        reset: () => set(() => ({ logged: initialState.logged })),
      }),
      {
        name: "auth-storage", // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useAuthStore;
