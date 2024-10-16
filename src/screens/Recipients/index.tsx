import { useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import useRecipientStore from "../../storage/recipientStore";
import { getName, isBasename, getAddress } from "../../lib/basenames";
import { isAddress, Address } from "viem";
import { debounce } from 'lodash';
import { shortenAddress } from "../../utils/address";


type SearchResult = {
    name: string | null;
    address: Address;
}

const RecipientsScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const { setRecipientCrypto } = useRecipientStore((state) => ({
        setRecipientCrypto: state.setRecipientCrypto,
    }));

    const getSearchResults = async (addressOrBasename: string): Promise<SearchResult | null> => {
        if (isBasename(addressOrBasename)) {
            const address = await getAddress({ name: addressOrBasename });
            if (address === null || address === undefined) {
                return null;
            }

            setRecipientCrypto({ name: addressOrBasename, address: address as Address });
            return { name: addressOrBasename, address: address as Address };
        }
        if (isAddress(addressOrBasename)) {
            const basename = await getName({ address: addressOrBasename as Address });

            setRecipientCrypto({ name: basename as string, address: addressOrBasename });
            return { name: basename as string, address: addressOrBasename };
        }
        return null;
    }

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (query) {
                const result = await getSearchResults(query);
                setSearchResult(result);
            } else {
                setSearchResult(null);
            }
            setIsTyping(false);
        }, 300),
        []
    );



    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResult(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{t("recipients.title")}</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={t("recipients.searchPlaceholder")}
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text.toLowerCase());
                        setIsTyping(true);
                        debouncedSearch(text.toLowerCase());
                    }}
                />
                {isTyping ? (
                    <ActivityIndicator size="small" color="#fff" style={styles.loadingIcon} />
                ) : searchQuery ? (
                    <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                        <Ionicons name="close" size={22} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.pasteButton}>
                        <Text style={styles.pasteButtonText}>{t("recipients.pasteButtonText")}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/*  
            <TouchableOpacity style={styles.scanQRButton}>
                <MaterialIcons name="qr-code-scanner" size={24} color="#666" />
                <View style={styles.scanQRTextContainer}>
                    <Text style={styles.scanQRTitle}>Scan QR Code</Text>
                    <Text style={styles.scanQRSubtitle}>Tap to scan an address</Text>
                </View>
            </TouchableOpacity> */}

            {searchResult && (
                <View style={styles.resultContainer}>
                    <View style={styles.resultIconContainer}>
                        <Ionicons name="checkmark-circle" size={22} color="#666" />
                        <Text style={styles.resultLabel}>{t("recipients.searchResultLabel")}</Text>
                    </View>
                    <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate("Send")}>
                        <View style={styles.walletIconContainer}>
                            <Ionicons name="wallet-outline" size={24} color="#666" />
                        </View>
                        <View style={styles.resultItemTextContainer}>
                            <Text style={styles.resultItemTitle}>{searchResult.name ?? shortenAddress(searchResult.address)}</Text>
                            <Text style={styles.resultItemSubtitle}>{shortenAddress(searchResult.address)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D0B0D",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    title: {
        marginLeft: 25,
        fontSize: 32,
        color: 'white',
        marginBottom: 20,
        fontFamily: "Manrope_500Medium"
    },
    loadingIcon: {
        marginRight: 10,
    },
    backButton: {
        marginLeft: 20,
        marginBottom: 20,
    },
    clearButton: {
        borderRadius: 20,
        backgroundColor: "#262429",
        padding: 8,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#19181B",
        borderRadius: 22,
        margin: 16,
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: "white",
    },
    pasteButton: {
        backgroundColor: "#262429",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    pasteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    scanQRButton: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        margin: 16,
        padding: 16,
    },
    scanQRTextContainer: {
        marginLeft: 16,
    },
    scanQRTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Manrope_700Bold",
    },
    scanQRSubtitle: {
        color: "#666",
        fontSize: 14,
    },
    suggestedText: {
        color: "#666",
        fontSize: 14,
        marginLeft: 16,
        marginTop: 16,
    },
    suggestedItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1C1C1E",
        borderRadius: 8,
        margin: 16,
        padding: 16,
    },
    walletIconContainer: {
        backgroundColor: "#333",
        borderRadius: 20,
        padding: 8,
    },
    suggestedItemTextContainer: {
        marginLeft: 16,
    },
    suggestedItemTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    suggestedItemSubtitle: {
        color: "#666",
        fontSize: 14,
    },
    searchIcon: {
        marginRight: 8,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    recipientItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    resultContainer: {
        borderRadius: 8,
        margin: 16,
    },
    resultLabel: {
        color: "#666",
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        marginLeft: 8,
    },
    resultIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    resultItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    resultItemTextContainer: {
        marginLeft: 16,
    },
    resultItemTitle: {
        color: "white",
        fontSize: 18,
        fontFamily: "Manrope_700Bold",
    },
    resultItemSubtitle: {
        color: "#666",
        fontSize: 15,
        fontFamily: "Manrope_400Regular",
    },
    avatarText: {
        color: "white",
        fontWeight: "bold",
    },
    recipientInfo: {
        flex: 1,
    },
    recipientName: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    recipientAddress: {
        color: "#666",
        fontSize: 14,
    },
    flag: {
        fontSize: 20,
        marginLeft: 8,
    },
    addButton: {
        position: "absolute",
        right: 20,
        bottom: 140,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default RecipientsScreen;