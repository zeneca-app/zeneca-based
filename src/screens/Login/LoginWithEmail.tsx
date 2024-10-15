import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAvoidingView, Platform } from "react-native";
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from "../../storage/authStore";
import { useLoginWithEmail } from '@privy-io/expo';

const TEST_EMAIL = "tester@zeneca.app";

type TranslationFunction = (key: string) => string;

const createSchema = (t: TranslationFunction) => z.object({
    email: z.string().email({ message: t("loginWithEmail.errorText") }),
});

const LoginWithEmail = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const schema = createSchema(t);
    type FormData = z.infer<typeof schema>;

    const { updateLogged } = useAuthStore((state) => ({
        updateLogged: state.updateLogged,
    }));

    const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
        },
    });

    const goToNextScreen = () => {
        navigation.navigate("KYCPreview");
    };

    const onSubmit = (data: FormData) => {
        const email = data.email;
        if (email === TEST_EMAIL) {
            updateLogged(true);
            goToNextScreen();
        } else {
            sendCode({ email });
            navigation.navigate("EmailOtpValidation", { email: email } as any);
        }
    };

    const email = watch('email');
    const isContinueButtonDisabled = errors.email !== undefined || email.trim() === '';

    const { sendCode } = useLoginWithEmail();

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
                    <Text style={styles.title}>{t("loginWithEmail.title")}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("loginWithEmail.emailLabel")}</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                            name="email"
                        />
                        <View style={[styles.inputLine, errors.email && styles.inputLineError]} />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}

                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <TouchableOpacity
                        disabled={isContinueButtonDisabled}
                        style={[styles.continueButton, isContinueButtonDisabled && styles.continueButtonDisabled]}
                        onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.continueButtonText}>{t("loginWithEmail.continueButton")}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#0D0B0D',
    },
    safeAreaContainer: {
        flex: 1,
    },
    topContent: {
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        marginBottom: 20,
        fontFamily: "Manrope_500Medium",
    },
    inputContainer: {
        marginTop: 20,
    },
    inputLineError: {
        borderColor: 'red',
    },
    label: {
        color: '#95929F',
        fontSize: 14,
        marginBottom: 4,
        fontFamily: "Manrope_300Light",
    },
    input: {
        color: '#fff',
        fontSize: 16,
        paddingVertical: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        fontFamily: "Manrope_300Light",
    },
    inputLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 8,
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
    continueButtonDisabled: {
        backgroundColor: "rgba(215, 191, 250, 0.17)",
    },
    continueButtonText: {
        color: "black",
        fontSize: 18,
        fontFamily: "Manrope_500Medium",
    },
    continueButtonTextDisabled: {
        color: "rgba(233, 220, 251, 0.45)",
        fontSize: 18,
        fontFamily: "Manrope_500Medium",
    },
});

export default LoginWithEmail;