import { Address } from "viem";
import { Basename } from "./basenames";

export type TransferCrypto = {
  name?: string | Basename;
  address: Address;
  amount: number;
  fee?: string;
  from_address: Address;
  to_address: Address;
};
