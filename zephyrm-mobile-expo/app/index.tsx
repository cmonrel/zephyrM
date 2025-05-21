import { useRouter } from "expo-router";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect } from "react";
import { useAuthStore } from "../hooks/auth/useAuthStore";
import { useForm } from "../hooks/useForm";
import { LoginFormFields } from "../interfaces";

const loginFormField: LoginFormFields = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const { errorMessage, startLogin } = useAuthStore();
  const { email, password, onInputChange } = useForm(loginFormField);
  const router = useRouter();

  const loginSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    const token = await startLogin(email, password);
    if (!token) return;
    router.replace("/SearchAssetsWorker");
  };

  useEffect(() => {
    if (errorMessage !== undefined && errorMessage !== "") {
      Alert.alert("Authentication error", errorMessage);
    }
  }, [errorMessage]);

  return (
    <View style={styles.container}>
      <View style={styles.loginForm}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(value) =>
            onInputChange({ target: { name: "email", value } })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(value) =>
            onInputChange({ target: { name: "password", value } })
          }
        />
        <TouchableOpacity style={styles.button} onPress={loginSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
