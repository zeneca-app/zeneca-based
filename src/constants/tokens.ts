import { base, baseSepolia } from "viem/chains";

export interface Tokens {
  [token: string]: {
    [chainId: number]: string;
  };
}
const tokens: Tokens = {
  USDC: {
    [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
};

export default tokens;
