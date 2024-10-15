import { EmbeddedWalletState } from "@privy-io/expo";
import {
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from "permissionless";
import {
  signerToSafeSmartAccount,
  signerToSimpleSmartAccount,
} from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import {
  Address,
  Chain,
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  http,
} from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import tokens from "../constants/tokens";
import { getWalletClient } from "../lib/smart-accounts";

const transportUrl = (chain: Chain) =>
  `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.EXPO_PUBLIC_PIMLICO_API_KEY}`;

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/base_sepolia"),
});

export const paymasterClient = (chain: Chain) =>
  createPimlicoPaymasterClient({
    transport: http(transportUrl(chain)),
    entryPoint: entryPoint07Address,
  });

export const pimlicoBundlerClient = (chain: Chain) =>
  createPimlicoBundlerClient({
    transport: http(transportUrl(chain)),
    entryPoint: entryPoint07Address,
  });

export const getPimlicoSmartAccountClient = async (
  address: `0x${string}`,
  chain: Chain,
  wallet: EmbeddedWalletState,
) => {
  const walletClient = getWalletClient(address, chain, wallet);
  const signer = walletClientToSmartAccountSigner(walletClient);
  const simpleAccount = await signerToSimpleSmartAccount(publicClient, {
    entryPoint: entryPoint07Address,
    signer: signer,
    factoryAddress: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985",
  });
  return createSmartAccountClient({
    account: simpleAccount,
    entryPoint: entryPoint07Address,
    chain,
    bundlerTransport: http(transportUrl(chain)),
    middleware: {
      gasPrice: async () =>
        (await pimlicoBundlerClient(chain).getUserOperationGasPrice()).fast,
      sponsorUserOperation: paymasterClient(chain).sponsorUserOperation, 
    },
  });
};

export const transferUSDC = async (
  smartAccountClient: any,
  amount: number,
  chain: Chain,
  toAddress: string,
) => {
  if (!smartAccountClient) {
    throw new Error("Smart account client not found");
  }
  const USDC_ADDRESS = tokens.USDC[chain.id] as Address;
  return await smartAccountClient?.sendTransaction({
    to: USDC_ADDRESS,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress as Address, BigInt(amount * 10 ** 6)],
    }),
  });
};
