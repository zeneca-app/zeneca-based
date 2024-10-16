import { isAddress } from "viem";

export const shortenAddress = (address: string) => {
  if (!address || !isAddress(address)) return "";
  return `${address.slice(0, 6)}····${address.slice(-4)}`;
};
