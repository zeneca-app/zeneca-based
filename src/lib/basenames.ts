import type { Address, Chain } from "viem";
import {
  ContractFunctionParameters,
  createPublicClient,
  encodePacked,
  http,
  keccak256,
  namehash,
} from "viem";
import { base, mainnet } from "viem/chains";
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from "../constants/basenames";
import L2ResolverAbi from "../lib/abis/L2ResolverAbi";
import { getChainPublicClient } from "../lib/pimlico";
import {
  Basename,
  GetAddress,
  GetAddressReturnType,
  GetName,
  GetNameReturnType,
} from "../lib/types/basenames";
import { isBase } from "../lib/utils/isBase";
import { isEthereum } from "../lib/utils/isEthereum";

export const BASENAME_L2_RESOLVER_ADDRESS =
  "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

export enum BasenameTextRecordKeys {
  Description = "description",
  Keywords = "keywords",
  Url = "url",
  Email = "email",
  Phone = "phone",
  Github = "com.github",
  Twitter = "com.twitter",
  Farcaster = "xyz.farcaster",
  Lens = "xyz.lens",
  Telegram = "org.telegram",
  Discord = "com.discord",
  Avatar = "avatar",
}

const baseClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export function buildBasenameTextRecordContract(
  basename: Basename,
  key: BasenameTextRecordKeys,
): ContractFunctionParameters {
  return {
    abi: L2ResolverAbi,
    address: BASENAME_L2_RESOLVER_ADDRESS,
    args: [namehash(basename), key],
    functionName: "text",
  };
}

// Get a single TextRecord
export async function getBasenameTextRecord(basename: Basename) {
  try {
    const contractParameters = buildBasenameTextRecordContract(
      basename,
      BasenameTextRecordKeys.Github,
    );
    const textRecord = await baseClient.readContract(contractParameters);
    return textRecord as string;
  } catch (error) {}
}
/**
 * Convert an address to a reverse node for ENS resolution
 */

/**
 * Convert an chainId to a coinType hex for reverse chain resolution
 */
export const convertChainIdToCoinType = (chainId: number): string => {
  // L1 resolvers to addr
  if (chainId === mainnet.id) {
    return "addr";
  }

  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

/**
 * Convert an address to a reverse node for ENS resolution
 */
export const convertReverseNodeToBytes = (
  address: Address,
  chainId: number,
) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`,
  );

  const addressReverseNode = keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode]),
  );

  return addressReverseNode;
};

export async function getBasename(address: Address) {
  try {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);

    const basename = await baseClient.readContract({
      abi: L2ResolverAbi,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: "name",
      args: [addressReverseNode],
    });

    if (basename) {
      return basename as Basename;
    }
  } catch (error) {}
}

export const getAddress = async ({
  name,
  chain = mainnet,
}: GetAddress): Promise<GetAddressReturnType> => {
  const client = getChainPublicClient(chain);
  // Gets address for ENS name.
  const address = await client.getEnsAddress({
    name,
  });
  return address ?? null;
};

export const isBasename = (username: string) => {
  if (username.endsWith(".base.eth")) {
    return true;
  }
  if (username.endsWith(".basetest.eth")) {
    return true;
  }
  return false;
};

export const getName = async ({
  address,
  chain = mainnet,
}: GetName): Promise<GetNameReturnType> => {
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      "ChainId not supported, name resolution is only supported on Ethereum and Base.",
    );
  }

  let client = getChainPublicClient(chain);

  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    try {
      const basename = await client.readContract({
        abi: L2ResolverAbi,
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        functionName: "name",
        args: [addressReverseNode],
      });
      if (basename) {
        return basename as Basename;
      }
    } catch (_error) {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // Default to mainnet
  client = getChainPublicClient(mainnet);
  // ENS username
  const ensName = await client.getEnsName({
    address,
  });

  return ensName ?? null;
};
