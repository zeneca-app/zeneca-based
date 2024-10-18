
import "./polyfills";
import React from "react";
import { PrivyProvider } from "@privy-io/expo";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, base } from 'wagmi/chains';
import { BalanceProvider } from "../context/BalanceContext";


const queryClient = new QueryClient();

const wagmiConfig = createConfig({
    chains: [baseSepolia, base],
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
});

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? "";
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? "";


export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <PrivyProvider appId={APP_ID} clientId={CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                    <BalanceProvider>
                        {children}
                    </BalanceProvider>
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
};