import { NativeModules } from "react-native";
import reactotronZustand from "reactotron-plugin-zustand";
import Reactotron from "reactotron-react-native";
import useQuoteStore from "./src/storage/quoteStore";
import useRecipientStore from "./src/storage/recipientStore";
import useTransferStore from "./src/storage/transferStore";

// do not allow Reactotron to be used in production and in tests
if (__DEV__ && process.env.JEST_WORKER_ID === undefined) {
  const host = NativeModules.SourceCode.scriptURL.split("://")[1].split(":")[0];
  Reactotron.configure({ host })
    .useReactNative()
    .use(
      reactotronZustand({
        stores: [
          { name: "recipient-storage", zustand: useRecipientStore },
          { name: "quote-storage", zustand: useQuoteStore },
          { name: "transfer-storage", zustand: useTransferStore },
        ],
      }),
    )
    .connect();

  // Logs can be displayed on Reactotron app.
  // console.log = Reactotron.log;
  // console.warn = Reactotron.log;
}
