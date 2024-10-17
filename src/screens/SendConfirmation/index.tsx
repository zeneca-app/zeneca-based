import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import useRecipientStore from "../../storage/recipientStore";
import * as LocalAuthentication from 'expo-local-authentication';
import FaceIdIcon from "../../../assets/face-id.svg";
import { formatCurrency } from "../../utils/currencyUtils";
import LoadingScreen from "../../components/Loading";
import { shortenAddress } from "../../utils/address";
import { Address } from "viem";
import { colors } from "../../styles/colors";
import useTransferStore from "../../storage/transferStore";
import BaseIcon from "../../../assets/base-logo.svg";
import USDCIcon from "../../../assets/usdc.svg";
import { transferUSDC, getPimlicoSmartAccountClient } from "../../lib/pimlico"
import { useWalletStore } from "../../storage/walletStore";
import { useChainStore } from "../../storage/chainStore";
import { useEmbeddedWallet } from "@privy-io/expo";

const SendConfirmationScreen = () => {
    const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { recipientCrypto } = useRecipientStore((state) => ({
        recipientCrypto: state.recipientCrypto,
    }));

    const { transferCrypto } = useTransferStore((state) => ({
        transferCrypto: state.transferCrypto,
    }));

    const chain = useChainStore((state) => state.chain);
    const wallet = useEmbeddedWallet();

    const amount = transferCrypto?.amount!
    const recipientAddress = recipientCrypto?.address as Address
    const recipientName = recipientCrypto?.name ?? shortenAddress(recipientAddress)


    const sendPayment = async () => {
        try {
            setIsLoadingTransfer(true)
            const signerAddress = wallet?.account?.address as Address;
            const smartAccountClient = await getPimlicoSmartAccountClient(signerAddress, chain, wallet);
            const tx = await transferUSDC(smartAccountClient, amount, chain, recipientAddress);
            setIsLoadingTransfer(false);
        } catch (error) {
            console.error("Error during transaction:", error);
        } finally {
            setIsLoadingTransfer(false);
            navigation.navigate("SendSuccess")
        }
    }

    const handleCreateTransaction = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t("faceId.prompt"),
                fallbackLabel: t("faceId.fallback"),
            });

            if (result.success) {
                sendPayment()

            } else {
                // Handle authentication failure
                console.log("Authentication failed");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };
    const canContinue = true

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>{t("sendConfirmation.title")}</Text>
                    <Text style={styles.amount}>
                        {formatCurrency(amount, "USD")} USDC
                    </Text>
                    <View style={styles.recipientContainer}>
                        <Text style={styles.recipientLabel}>
                            {t("sendConfirmation.to")}
                        </Text>
                        <Text style={styles.recipientName}>{recipientName}</Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.total")}</Text>
                        <Text style={styles.detailValue}>${formatCurrency(amount, "USD")}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.send")} USDC</Text>
                        <View style={styles.logoContainer}>
                            <USDCIcon width={20} height={20} style={styles.logo} />
                            <Text style={styles.detailValue}>{amount}</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.chain")}</Text>
                        <View style={styles.logoContainer}>
                            <BaseIcon width={20} height={20} style={styles.logo} />
                            <Text style={styles.detailValue}>Base</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.fee")}</Text>
                        <Text style={styles.detailValue}>0 USDC</Text>
                    </View>

                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.warning}>{t("sendConfirmation.disclaimer")}</Text>
                    <TouchableOpacity
                        disabled={isLoadingTransfer}
                        onPress={handleCreateTransaction}
                        style={[
                            styles.confirmButton,
                            !canContinue && styles.confirmButtonDisabled
                        ]} >
                        <FaceIdIcon width={24} height={24} />
                        <Text
                            style={[
                                styles.confirmButtonText,
                                !canContinue && styles.confirmButtonTextDisabled
                            ]}
                        >{t("sendConfirmation.confirmButtonText")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <LoadingScreen isVisible={isLoadingTransfer} text={t("sendConfirmation.pendingStatus")} />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D0C0E",
    },
    header: {
        padding: 16,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        color: 'white',
        fontFamily: "Manrope_500Medium",
        marginBottom: 8,
    },
    amount: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#8E8EFF",
        marginBottom: 4,
    },
    recipientContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    recipientLabel: {
        lineHeight: 30,
        fontSize: 20,
        color: "white",
    },
    recipientName: {
        fontSize: 24,
        color: "white",
        marginLeft: 6,
        fontFamily: "Manrope_700Bold"
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        marginRight: 8,
    },
    detailsContainer: {
        backgroundColor: "#19181B",
        borderRadius: 25,
        paddingVertical: 25,
        paddingHorizontal: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailLabel: {
        color: "#96939F",
        fontFamily: "Manrope_400Regular",
        fontSize: 14,
    },
    detailValue: {
        fontSize: 16,
        fontFamily: "Manrope_700Bold",
        color: "white",
    },
    bottomSection: {
        alignItems: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 20, // Add some bottom margin
    },
    timer: {
        color: "#666",
        marginBottom: 16,
    },
    warning: {
        color: "#666",
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    scanIcon: {
        marginRight: 8,
    },
    confirmButton: {
        flexDirection: 'row',
        width: '100%',
        height: 55,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    confirmButtonText: {
        marginLeft: 8, // Add left margin to create space between icon and text
        color: colors.darkHighlight,
        fontWeight: "bold",
    },
    confirmButtonDisabled: {
        backgroundColor: "rgba(215, 191, 250, 0.17)",
    },
    confirmButtonTextDisabled: {
        color: "rgba(233, 220, 251, 0.45)",
        fontSize: 18,
        fontFamily: "Manrope_500Medium",
    },
});


export default SendConfirmationScreen;
