import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { OtpInput } from "react-native-otp-entry";
import useAuthStore from "../../storage/authStore";
import { useLoginWithEmail } from '@privy-io/expo';

type EmailOtpValidationScreenProps = {
    route: {
        params: {
            email: string;
        }
    }
}

const EmailOtpValidationScreen = ({ route }: EmailOtpValidationScreenProps) => {
    const { t } = useTranslation();
    const { email } = route.params;
    const [verificationCode, setVerificationCode] = useState('');
    const navigation = useNavigation();

    const { updateLogged } = useAuthStore((state) => ({
        updateLogged: state.updateLogged,
    }));

    const { loginWithCode } = useLoginWithEmail({
        onLoginSuccess(user, isNewUser) {

            console.log("onLoginSuccess user", user);
            console.log("onLoginSuccess isNewUser", isNewUser);
            updateLogged(true);
            navigation.navigate("Home");
        },
        onError: (error) => {
            console.log("error", error);
        },
    });

    const handleOtpFilled = (otp: string) => {
        setVerificationCode(otp);
    };

    const handleContinue = () => {
        loginWithCode({ code: verificationCode, email: email });
    };

    const isCodeFilled = verificationCode.length === 6;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.mainContainer}

        >
            <SafeAreaView style={styles.safeAreaContainer}>
                <View style={styles.topContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{t("emailOtpValidation.title")}</Text>
                    <Text style={styles.subtitle}>{t("emailOtpValidation.subtitle")} {email}</Text>
                    <View style={styles.codeInputContainer}>
                        <OtpInput
                            numberOfDigits={6}
                            focusColor="#5A10EF"
                            focusStickBlinkingDuration={500}
                            onTextChange={(text) => setVerificationCode(text)}
                            onFilled={handleOtpFilled}
                            theme={{
                                containerStyle: styles.otpContainer,
                                inputsContainerStyle: styles.otpInputsContainer,
                                pinCodeContainerStyle: styles.otpPinCodeContainer,
                                pinCodeTextStyle: styles.otpPinCodeText,
                                focusStickStyle: styles.otpFocusStick,
                                focusedPinCodeContainerStyle: styles.otpActivePinCodeContainer,
                            }}
                        />
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !isCodeFilled && styles.continueButtonDisabled
                        ]}
                        disabled={!isCodeFilled}
                        onPress={handleContinue}>
                        <Text style={[
                            styles.continueButtonText,
                            !isCodeFilled && styles.continueButtonTextDisabled
                        ]}>{t("emailOtpValidation.continueButton")}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#0D0B0D',
    },
    safeAreaContainer: {
        flex: 1,
    },
    topContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        fontFamily: "Manrope_500Medium",
    },
    subtitle: {
        fontSize: 16,
        color: '#95929F',
        marginBottom: 30,
        fontFamily: "Manrope_400Regular",
    },
    codeInputContainer: {
        marginBottom: 30,
    },
    otpContainer: {
        width: '100%',
    },
    otpInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otpPinCodeContainer: {
        width: 40,
        height: 50,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#313036',
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    otpPinCodeText: {
        color: '#fff',
        fontSize: 24,
    },
    otpFocusStick: {
        display: 'none', // Hide the focus stick
    },
    otpActivePinCodeContainer: {
        borderBottomColor: '#5A10EF',
        borderBottomWidth: 2
    },
    bottomContent: {
        padding: 20,
    },
    continueButton: {
        borderRadius: 35,
        backgroundColor: "white",
        padding: 16,
        alignItems: "center",
    },
    continueButtonText: {
        color: "black",
        fontSize: 18,
        fontFamily: "Manrope_500Medium",
    },
    continueButtonDisabled: {
        backgroundColor: "rgba(215, 191, 250, 0.17)",
    },
    continueButtonTextDisabled: {
        color: "rgba(233, 220, 251, 0.45)",
        fontSize: 18,
        fontFamily: "Manrope_500Medium",
    },
    footer: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default EmailOtpValidationScreen;