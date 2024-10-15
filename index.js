// Import required polyfills first
// IMPORTANT: These polyfills must be installed in this order
import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "./src/server/config";
import { registerRootComponent } from "expo";
import AppIndex from "./src";
import "./ReactotronConfig";

Object.assign(window, {
  addEventListener: () => 0,
  removeEventListener: () => {},
  dispatchEvent: () => true,
  CustomEvent: class CustomEvent {},
});
 
const App = AppIndex;

registerRootComponent(App);
