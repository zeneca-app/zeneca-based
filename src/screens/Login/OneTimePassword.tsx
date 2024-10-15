import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

const OneTimePassword = () => {
  return (
    <View>
      <OtpInput numberOfDigits={6} />
    </View>
  );
};

export default OneTimePassword;
