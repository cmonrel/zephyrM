/**
 * Login screen
 *
 * @module app/index
 */

import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useEffect, useState } from "react";
import { useAuthStore } from "../hooks/auth/useAuthStore";
import { useForm } from "../hooks/useForm";
import { LoginFormFields } from "../interfaces";

const loginFormField: LoginFormFields = {
  email: "",
  password: "",
};

/**
 * LoginScreen component
 *
 * This component is the login screen for the app. It has a form with email and
 * password fields. When the user submits the form, the component will call
 * startLogin from the useAuthStore hook to start the login process. If the
 * login is successful, the component will navigate to the /SearchAssetsWorker
 * route. If there is an error, the component will show an alert with the error
 * message.
 *
 * @returns The LoginScreen component
 */
export default function LoginScreen() {
  const { errorMessage, startLogin } = useAuthStore();
  const { email, password, onInputChange } = useForm(loginFormField);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Function to handle the login form submission
   *
   * This function will first check if the email and password fields are filled
   * in. If either of them are empty, it will show an alert with a message saying
   * that all fields are required. If the fields are filled in, it will call
   * startLogin from the useAuthStore hook to start the login process. If the
   * login is successful, it will navigate to the /SearchAssetsWorker route.
   * If there is an error, the component will show an alert with the error
   * message.
   */
  const loginSubmit = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      setIsLoading(false);
      return;
    }
    const token = await startLogin(email, password);
    setIsLoading(false);
    if (!token) return;
    router.replace("/SearchAssetsWorker");
  };

  /**
   * Handles the event when a user presses outside of the login form.
   *
   * @remarks
   * This function dismisses the keyboard when the user presses outside of the
   * login form.
   */
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  /**
   * UseEffect hook to display an alert with the error message if there is one.
   */
  useEffect(() => {
    if (errorMessage !== undefined && errorMessage !== "") {
      Alert.alert("Authentication error", errorMessage);
    }
  }, [errorMessage]);

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <View style={styles.loginForm}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"#999"}
            placeholder="Email"
            value={email}
            onChangeText={(value) =>
              onInputChange({ target: { name: "email", value } })
            }
          />
          <TextInput
            style={styles.input}
            placeholderTextColor={"#999"}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(value) =>
              onInputChange({ target: { name: "password", value } })
            }
          />
          {isLoading ? (
            <View style={styles.button}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={loginSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loginForm: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: "#000",
  },
  button: {
    backgroundColor: "#0062cc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
