import { base, baseSepolia } from "viem/chains";

export type isBaseOptions = {
  chainId: number;
  isMainnetOnly?: boolean; // If the chainId check is only allowed on mainnet
};
/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
export function isBase({
  chainId,
  isMainnetOnly = false,
}: isBaseOptions): boolean {
  // If only Base mainnet
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  // If only Base or Base Sepolia
  if (!isMainnetOnly && (chainId === baseSepolia.id || chainId === base.id)) {
    return true;
  }
  return false;
}
