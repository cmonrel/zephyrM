/**
 * Not found screen
 *
 * @module app/+not-found
 */

import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

/**
 * Screen displayed when the user navigates to an unknown route.
 *
 * Contains a link to go back to the login screen.
 */
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go to Login
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
