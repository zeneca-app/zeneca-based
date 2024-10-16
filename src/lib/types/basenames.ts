import { Address } from "viem";
import { Chain } from "viem/chains";

export type Basename = `${string}.base.eth`;

/**
 * Note: exported as public Type
 */
export type GetAddress = {
  name: string | Basename;
  chain?: Chain;
};

export type GetName = {
  address: Address;
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetAddressReturnType = Address | null;
export type GetNameReturnType = string | Basename | null;
