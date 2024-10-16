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
import useTransferStore from "../../storage/transferStore";
import { capitalizeFirstLetter } from "../../utils/string_utils";
import { shortenAddress } from "../../utils/address";
import { Address } from "viem";


const SendConfirmationScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { recipientCrypto } = useRecipientStore((state) => ({
        recipientCrypto: state.recipientCrypto,
    }));

    const isTransactionPending = false
    const amount = 100
    const accountNumber = shortenAddress(recipientCrypto?.address as Address)

    const recipientName = recipientCrypto?.name ?? accountNumber

    const handleCreateTransaction = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t("faceId.prompt"),
                fallbackLabel: t("faceId.fallback"),
            });

            if (result.success) {
                //createTransaction();
                //navigation.navigate("TransactionReceipt");
            } else {
                // Handle authentication failure
                console.log("Authentication failed");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>{t("sendConfirmation.title")}</Text>
                    <Text style={styles.amount}>
                        {formatCurrency(amount, "USD", true)}
                    </Text>
                    <Text style={styles.recipient}>
                        {t("sendConfirmation.to")} <Text style={styles.recipientName}>{recipientName}</Text>
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.accountNumber")}</Text>
                        <Text style={styles.detailValue}>{accountNumber}</Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.amount")}</Text>
                        <Text style={styles.detailValue}>{amount} USDC</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.fee")}</Text>
                        <Text style={styles.detailValue}>0 USDC</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("sendConfirmation.total")}</Text>
                        <Text style={styles.detailValue}>{formatCurrency(amount, "USD")} USDC</Text>
                    </View>
                </View>

                {/* <View style={styles.timerContainer}>
                    {!isTransactionPending && (
                        <Text style={styles.timer}>{t("quoteConfirmation.timerDescription")} {formatTime(timeLeft)}</Text>
                    )}
                </View> */}

                <View style={styles.bottomSection}>
                    <Text style={styles.warning}>{t("sendConfirmation.disclaimer")}</Text>
                    {!isTransactionPending && (
                        <TouchableOpacity
                            disabled={isTransactionPending}
                            onPress={handleCreateTransaction}
                            style={styles.confirmButton}>
                            <FaceIdIcon width={24} height={24} />
                            <Text
                                style={styles.confirmButtonText}

                            >{t("sendConfirmation.confirmButtonText")}</Text>
                        </TouchableOpacity>)}
                </View>
            </View>
            <LoadingScreen isVisible={isTransactionPending} text={t("sendConfirmation.pendingStatus")} />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
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
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    amount: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#8E8EFF",
        marginBottom: 4,
    },
    recipient: {
        fontSize: 22,
        color: "white",
        marginBottom: 16,
    },
    recipientName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
    },
    detailsContainer: {
        backgroundColor: "#1C1C1E",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        color: "#666",
    },
    detailValue: {
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
    confirmButton: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    scanIcon: {
        marginRight: 8,
    },
    confirmButtonText: {
        marginLeft: 8, // Add left margin to create space between icon and text
        color: "black",
        fontWeight: "bold",
    },
});


export default SendConfirmationScreen;
