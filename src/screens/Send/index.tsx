import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors } from "../../styles/colors";
import Keypad from "../../components/Keypad";
import useRecipientStore from "../../storage/recipientStore";
import { shortenAddress } from "../../utils/address";
import { Address } from "viem";
import { formatCurrency } from "../../utils/currencyUtils";

const SendScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [amount, setAmount] = useState('0');
    const [fontSize, setFontSize] = useState(48);

    const { recipientCrypto } = useRecipientStore((state) => ({
        recipientCrypto: state.recipientCrypto,
    }));

    const [balance, setBalance] = useState(0);

    const handleKeyPress = (key: string | number) => {
        if (key === 'backspace') {
            setAmount(prev => prev.slice(0, -1) || '0');
        } else if (key === '.' && amount.includes('.')) {
            // Prevent multiple decimal points
            return;
        } else {
            setAmount(prev => (prev === '0' ? String(key) : prev + key));
        }
    };

    useEffect(() => {
        // Adjust font size based on amount length
        if (amount.length > 15) {
            setFontSize(25);
        } else if (amount.length > 10) {
            setFontSize(35);
        } else if (amount.length > 8) {
            setFontSize(48);
        } else {
            setFontSize(60);
        }
    }, [amount]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{t("sendCrypto.title")}</Text>
            <View style={styles.content}>
                <View style={styles.recipientContainer}>
                    <Text style={styles.label}>{t("sendCrypto.recipientLabel")}</Text>
                    <Text
                        style={styles.recipient}
                    >{recipientCrypto?.name || shortenAddress(recipientCrypto?.address as Address)}</Text>
                </View>

                <View style={styles.amountWrapper}>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>{t("sendCrypto.availableLabel")}</Text>
                        <Text style={styles.balanceText}> ${formatCurrency(balance, "USD")}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={[styles.amountPrefix, { fontSize: fontSize * 0.4 }]}>$</Text>
                        <Text style={[styles.amount, { fontSize }]}>
                            {amount}
                        </Text>
                    </View>
                </View>


                <View style={styles.keypadContainer}>
                    <Keypad onKeyPress={handleKeyPress} />
                    <TouchableOpacity style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>{t("sendCrypto.continueButton")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#19181B",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    backButton: {
        marginLeft: 20,
        marginBottom: 20,
    },
    title: {
        marginLeft: 25,
        fontSize: 32,
        color: 'white',
        marginBottom: 15,
        fontFamily: "Manrope_500Medium"
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    recipientContainer: {
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 30,
        flexDirection: 'row',
        backgroundColor: '#262429',
        borderRadius: 22,
        marginBottom: 24,
    },
    label: {
        color: '#888',
        marginRight: 10,
        fontFamily: "Manrope_400Regular"
    },
    recipient: {
        color: 'white',
        fontSize: 16,
        fontFamily: "Manrope_400Regular"
    },
    amountWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: 24,
        position: 'relative',
    },
    amountPrefix: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 30,
        position: 'absolute',
        left: -20, // Adjust this value as needed
        top: 3, // Adjust this value as needed
    },
    amount: {
        color: 'white',
        fontWeight: 'bold',
    },
    amountSuffix: {
        color: '#3498db',
        fontSize: 16,
        marginLeft: 8,
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    balanceText: {
        color: '#96939F',
        fontSize: 14,
    },
    balanceLabel: {
        color: '#96939F',
        fontSize: 14,
    },
    maxButton: {
        backgroundColor: '#3498db',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    maxButtonText: {
        color: 'white',
        fontSize: 12,
    },
    keypadContainer: {
        marginTop: 'auto', // This pushes the keypad to the bottom
    },
    continueButton: {
        flexDirection: 'row',
        width: '100%',
        height: 55,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        marginBottom: 25,
    },
    continueButtonText: {
        color: colors.darkHighlight,
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
    },
});

export default SendScreen;