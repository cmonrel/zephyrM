/**
 * Root layout
 *
 * @module app/_layout
 */

import { Stack } from "expo-router";
import NfcManager from "react-native-nfc-manager";
import { Provider } from "react-redux";

import { useEffect } from "react";
import { store } from "../store/store";

/**
 * Root layout of the application
 *
 * This component is the root of the application and
 * wraps the entire app in the Redux store provider.
 *
 * It also starts the NFC service when the component mounts.
 *
 * @returns {React.ReactElement} The root layout element
 */
export default function RootLayout() {
  /**
   * Effect hook to start the NFC service
   *
   * @returns {Promise<void>} A promise that resolves when the NFC manager is successfully started.
   *
   * @remarks
   * This function starts the NFC manager and logs a message upon successful initialization.
   * If there is an error during the initialization, it logs an error message.
   */
  useEffect(() => {
    const startNFC = async () => {
      await NfcManager.start()
        .then(() => console.log("NFC initialized"))
        .catch((err) => console.log("NFC error", err));
    };

    startNFC();
  }, []);

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
