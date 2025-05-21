import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../hooks/auth/useAuthStore";

export default function ProtectedLayout() {
  const { status, checkAuthToken, user } = useAuthStore();
  const router = useRouter();

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
