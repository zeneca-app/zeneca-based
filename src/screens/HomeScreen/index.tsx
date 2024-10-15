import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { toast } from "burnt";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { customersGetBalance, transfersGetTransfers } from "../../client";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { formatCurrency, CurrencyCode } from "../../utils/currencyUtils";
import { formatQuoteToNumber } from "../../utils/quote";
import useTransferStore from "../../storage/transferStore";
import LineHome from '../../../assets/line-home.svg';
import Balance from "../../components/Balance";


const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { logout } = usePrivy();
  const { updateLogged } = useAuthStore((state) => ({ updateLogged: state.updateLogged }));

  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: customersGetBalance,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: transfersGetTransfers,
  });

  const { setTransfer } = useTransferStore((state) => ({ setTransfer: state.setTransfer }));

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, t("home.date_format"), { locale: es });
  };

  const onLogout = async () => {
    try {
      await logout();
      nextLogout();
    } catch (err) {
      const e = err as Error;
      toast({
        title: e?.message ?? "Login Error",
        preset: "error",
      });
      updateLogged(false);
    }
  };

  const nextLogout = () => {
    updateLogged(false);
    navigation.navigate("Login");
  }

 /*  const onSend = useCallback(
    () => navigation.navigate("Recipients"),
    [navigation],
  ); */

  const renderTransaction = useCallback(({ item }: { item: any }) => {
    const isWithdrawal = item.withdrawal !== null;
    const quote = formatQuoteToNumber(item.quote);

    const formatWithdrawal = (currency: string, amount: string) => {
      const formatted = formatCurrency(amount, currency as CurrencyCode, true)
      return "-" + formatted
    }

    const formatDeposit = (currency: string, amount: string) => {
      const formatted = formatCurrency(amount, currency as CurrencyCode, true)
      return "+" + formatted
    }

    const handlePress = () => {
      setTransfer(item);
      navigation.navigate("TransactionReceipt");
    };

    return (
      <TouchableOpacity style={styles.transactionItem} onPress={handlePress}>
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIcon}>
            {isWithdrawal ? (
              <Feather name="arrow-up-right" size={20} color="white" />
            ) : (
              <Ionicons name="arrow-down" size={20} color="white" />
            )}
          </View>
          <View>
            <Text style={styles.transactionName}>Retiro</Text>
            <Text style={styles.transactionTime}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            { color: isWithdrawal ? "#FF5252" : "#4CAF50" },
          ]}
        >
          {isWithdrawal ? formatWithdrawal(quote.destination.toUpperCase(), quote.amount_out) :
            formatDeposit(quote.source.toUpperCase(), quote.amount_in)}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>
        {t("home.empty_transactions")}
      </Text>
    </View>
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const goDepositCrypto = () => {
    navigation.navigate("DepositCrypto");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <LineHome style={styles.lineHome} />
        </View>

        <View style={styles.wrapperHeader}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileButton} onPress={onLogout}>
              <Ionicons name="person-sharp" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={["#A48BF1", "#80B0F9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Balance />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.depositButton} onPress={goDepositCrypto}>
                <Ionicons name="arrow-down" size={20} color="white" />
                <Text style={styles.buttonText}>{t("home.depositActionText")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton}>
                <Feather name="arrow-up-right" size={20} color="white" />
                <Text style={styles.buttonText}>{t("home.sendActionText")}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsHeader}>{t("home.transactions")}</Text>
          <FlatList
            data={[...(transactions?.data || [])].reverse()}
            renderItem={renderTransaction}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
          />
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineHome: {
    position: 'absolute',
    // Adjust these values to change the position
    top: -30,  // Moves the component up by 50 units
  },
  wrapperHeader: {
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18171A",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    borderRadius: 30,
    padding: 20,
    marginBottom: 3,
  },
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  depositButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyListText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Manrope_600SemiBold",
  },
  transactionsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.darkHighlight,
    borderRadius: 40,
  },
  transactionsHeader: {
    color: "#999",
    fontSize: 12,
    paddingVertical: 20,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  transactionInitial: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionTime: {
    color: "#999",
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeScreen;
