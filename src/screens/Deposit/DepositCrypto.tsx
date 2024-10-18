import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from "burnt";
import Clipboard from '@react-native-clipboard/clipboard';
import BaseLogo from '../../../assets/base-logo.svg';
import { useTranslation } from 'react-i18next';
import { useWalletStore } from '../../storage/walletStore';
import { shortenAddress } from '../../utils/address';

const DepositCrypto = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const smartAccountAddress = useWalletStore((state) => state.address);

    const walletAddress = smartAccountAddress;

    const copyToClipboard = () => {
        Clipboard.setString(walletAddress);
        toast({
            title: t("depositCrypto.addressCopied"),
            preset: "done",

        });
    };

    return (<SafeAreaView style={{ flex: 1, backgroundColor: "#0D0C0E" }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>{t("depositCrypto.title")}</Text>

            <View style={styles.card}>
                <View style={styles.networkInfo}>
                    <View style={styles.logoContainer}>
                        {/* Replace with actual Polygon logo */}
                        <BaseLogo width={40} height={40} />
                    </View>
                    <Text style={styles.networkName}>Base</Text>
                </View>

                <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>{t("depositCrypto.addressLabel")}</Text>
                    <View style={styles.addressRow}>
                        <Text style={styles.address}>{shortenAddress(walletAddress)}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                            <Ionicons name="copy-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        {t("depositCrypto.infoText")}
                    </Text>

                    <Text style={styles.disclaimerText}>
                        {t("depositCrypto.disclaimerText")}
                    </Text>
                </View>
            </View>
        </View>
    </SafeAreaView>
    )
}

export default DepositCrypto

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginLeft: 20,
        marginBottom: 20,
    },
    title: {
        marginLeft: 25,
        fontSize: 32,
        color: 'white',
        marginBottom: 20,
        fontFamily: "Manrope_500Medium"
    },
    card: {
        marginTop: 20,
        paddingVertical: 40,
        paddingHorizontal: 20,
        width: '100%',
        backgroundColor: '#19181B',
        borderRadius: 40,
    },
    networkInfo: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    networkName: {
        color: 'white',
        fontSize: 20,
        fontFamily: "Manrope_500Medium",
    },
    logoContainer: {
        marginRight: 10,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgb(0, 82, 255)',
    },
    addressContainer: {
        borderRadius: 24,
        padding: 20,
        backgroundColor: '#262429',
        marginBottom: 20,
    },
    addressLabel: {
        color: '#96939F',
        marginBottom: 5,
        fontSize: 12,
        fontFamily: "Manrope_400Regular",
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    address: {
        color: 'white',
        fontSize: 16,
    },
    copyButton: {
        padding: 5,
    },
    separator: {
        height: 1,
        backgroundColor: '#333333', // Adjust color as needed
        marginVertical: 20,
    },
    infoContainer: {
        marginTop: 20,
        flexDirection: 'column',
    },
    infoText: {
        textAlign: 'center',
        color: '#96939F',
        fontFamily: "Manrope_400Regular",
        fontSize: 14,
        marginBottom: 25,
    },
    disclaimerText: {
        marginBottom: 15,
        textAlign: 'center',
        color: '#96939F',
        fontFamily: "Manrope_400Regular",
        fontSize: 14,
    },
});