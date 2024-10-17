import { StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useChainStore } from "../storage/chainStore";
import { useWalletStore } from "../storage/walletStore";
import { formatCurrency } from "../utils/currencyUtils";
import { useBalance } from "../context/BalanceContext";

const Balance = () => {
    const { t } = useTranslation();

    const { balanceFormatted, isLoadingBalance, refetchBalance } = useBalance();

    return (<View style={styles.balanceContainer}>
        <Text style={styles.currencySign}>$</Text>
        <Text style={styles.balanceAmount}>
            {formatCurrency(Number(balanceFormatted), "USD")}
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