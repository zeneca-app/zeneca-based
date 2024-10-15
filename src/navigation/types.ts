/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TransactionReceipt: undefined;
  SendSuccess: undefined;
  LoginOptions: undefined;
  LoginWithEmail: undefined;
  EmailOtpValidation: undefined;
  DepositCrypto: undefined;
  Recipients: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
