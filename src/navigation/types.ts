/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TransactionReceipt: undefined;
  LoginOptions: undefined;
  LoginWithEmail: undefined;
  EmailOtpValidation: undefined;
  DepositCrypto: undefined;
  Recipients: undefined;
  Send: undefined;
  SendConfirmation: undefined;
  SendSuccess: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
