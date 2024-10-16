import { Address } from "viem";
import { Basename } from "./basenames";

export type RecipientCrypto = {
  name?: string | Basename;
  address: Address;
};
