import "./i18n";
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./navigation/types";
import HomeScreen from "./screens/HomeScreen";
import Login from "./screens/Login/Login";
import useAuthStore from "./storage/authStore";
import LoginOptions from "./screens/Login/LoginOptions";
import LoginWithEmail from "./screens/Login/LoginWithEmail";
import EmailOtpValidationScreen from "./screens/Login/EmailOtpValidation";
import DepositCrypto from "./screens/Deposit/DepositCrypto";
import Recipients from "./screens/Recipients";
import Send from "./screens/Send";
import SendConfirmation from "./screens/SendConfirmation";
import SendSuccess from "./screens/SendSuccess";
import { Providers } from "./components/Providers";


const Stack = createNativeStackNavigator<RootStackParamList>();


const AppIndex = () => {
  const [loaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const { logged } = useAuthStore((state) => ({ logged: state.logged }));

  // TODO: Implement Splash Screen while loading fonts
  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<></>}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Providers>
            <Stack.Navigator initialRouteName={logged ? "Home" : "Login"}>
              <Stack.Group>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Login"
                  component={Login}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                  }}
                  name="LoginOptions"
                  component={LoginOptions}
                />
              </Stack.Group>

              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={HomeScreen}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="Recipients"
                component={Recipients}
              />


              <Stack.Screen
                options={{ headerShown: false }}
                name="LoginWithEmail"
                component={LoginWithEmail}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="EmailOtpValidation"
                component={EmailOtpValidationScreen}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="DepositCrypto"
                component={DepositCrypto}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="Send"
                component={Send}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="SendConfirmation"
                component={SendConfirmation}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="SendSuccess"
                component={SendSuccess}
              />

            </Stack.Navigator>
          </Providers>
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
};

export default AppIndex;