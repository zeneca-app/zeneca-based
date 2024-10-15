import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const storage = new MMKV();

interface CustomState {
  clear: () => void;
}

const zustandStorage: StateStorage & CustomState = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
  clear: () => {
    return storage.clearAll();
  },
};

export default zustandStorage;
