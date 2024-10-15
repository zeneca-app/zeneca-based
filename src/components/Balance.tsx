import { StyleSheet, View, Text } from "react-native";
import { useBalance } from "wagmi";
import { Address } from "viem"
import { useTranslation } from "react-i18next";
import tokens from "../constants/tokens";
import { useChainStore } from "../storage/chainStore";
import { useWalletStore } from "../storage/walletStore";
import { formatCurrency } from "../utils/currencyUtils";


const Balance = () => {
    const chain = useChainStore((state) => state.chain);

    const { t } = useTranslation();
    const smartAccountAddress = useWalletStore((state) => state.address);

    const {
        data: balance,
        isLoading: isLoadingBalance,
        refetch: refetchBalance,
    } = useBalance({
        address: smartAccountAddress,
        token: tokens.USDC[chain.id] as Address,
    });

    return (<View style={styles.balanceContainer}>
        <Text style={styles.currencySign}>$</Text>
        <Text style={styles.balanceAmount}>
            {formatCurrency(Number(balance?.formatted ?? "0"), "USD")}
        </Text>
        <Text style={styles.balanceUsd}>{t("home.currency")}</Text>

    </View>);
};

const styles = StyleSheet.create({
    balanceContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    currencySign: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Manrope_700Bold",
        color: "white",
        marginRight: 4,
        marginTop: 4,
    },
    balanceAmount: {
        fontSize: 38,
        fontWeight: "bold",
        fontFamily: "Manrope_700Bold",
        color: "white",
    },
    balanceUsd: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: "white",
        marginLeft: 5,
        marginBottom: 7,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sendButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
    },
    sendButtonText: {
        color: "black",
        fontSize: 16,
    },
});

export default Balance;