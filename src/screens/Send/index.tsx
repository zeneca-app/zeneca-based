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


const SendScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [amount, setAmount] = useState('0');

    const [fontSize, setFontSize] = useState(48);

    const { recipientCrypto } = useRecipientStore((state) => ({
        recipientCrypto: state.recipientCrypto,
    }));

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
        if (amount.length > 10) {
            setFontSize(32);
        } else if (amount.length > 7) {
            setFontSize(40);
        } else {
            setFontSize(48);
        }
    }, [amount]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Send</Text>

            <View style={styles.content}>
                <View style={styles.recipientContainer}>
                    <Text style={styles.label}>To</Text>
                    <Text
                        style={styles.recipient}
                    >{recipientCrypto?.name || shortenAddress(recipientCrypto?.address as Address)}</Text>
                </View>

                <View style={styles.amountContainer}>
                    <Text style={styles.amountPrefix}>$</Text>
                    <Text style={[styles.amount, { fontSize }]}>
                        {amount}
                    </Text>
                    {/*    <Text style={styles.amountSuffix}>0 ↑↓</Text> */}
                </View>
                {/* 
                <View style={styles.balanceContainer}>
                    <View style={styles.balanceLeft}>
                        <Ionicons name="logo-usd" size={24} color="#3498db" />
                        <Text style={styles.balanceText}>0.5499 USDC</Text>
                    </View>
                    <TouchableOpacity style={styles.maxButton}>
                        <Text style={styles.maxButtonText}>Use Max</Text>
                    </TouchableOpacity>
                </View> */}

                <View style={styles.keypadContainer}>
                    <Keypad onKeyPress={handleKeyPress} />
                    <TouchableOpacity style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continue</Text>
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
        paddingHorizontal: 20
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
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: 24,
    },
    amountPrefix: {
        color: 'white',
        fontSize: 36,
        marginRight: 4,
    },
    amount: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
    },
    amountSuffix: {
        color: '#3498db',
        fontSize: 16,
        marginLeft: 8,
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
    },
    balanceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceText: {
        color: 'white',
        marginLeft: 8,
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