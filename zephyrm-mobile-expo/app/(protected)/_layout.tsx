/**
 * Protected layout
 *
 * @module app/(protected)/_layout
 */

import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../hooks/auth/useAuthStore";
import { useSocket } from "../../hooks/useSocket";

/**
 * Protected layout
 *
 * The layout for the protected routes of the application.
 *
 * Handles the authentication status of the user and redirects
 * to the appropriate route based on the user's role.
 *
 * @returns {JSX.Element} The protected layout.
 */
export default function ProtectedLayout() {
  const { status, checkAuthToken, user } = useAuthStore();
  const router = useRouter();
  useSocket(user.uid, process.env.EXPO_PUBLIC_WEBSOCKET_URL!);

  /**
   * Effect hook to redirect the user based on their authentication status.
   */
  useEffect(() => {
    if (status === "not-authenticated") {
      router.replace("/");
    } else if (status === "authenticated") {
      if (user.role === "admin") {
        router.replace("/SearchAssetsAdmin");
      } else if (user.role === "worker") {
        router.replace("/SearchAssetsWorker");
      }
    }
  }, [status, user]);

  /**
   * Effect hook to check the authentication status of the user.
   */
  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status !== "authenticated") {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
  },
});
