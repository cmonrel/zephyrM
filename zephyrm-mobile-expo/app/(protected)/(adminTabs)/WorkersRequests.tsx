/**
 * Requests screen
 *
 * @module app/(protected)/(adminTabs)/WorkersRequests
 */

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useNotificationStore } from "../../../hooks/notifications/useNotificationStore";
import { useRequestsStore } from "../../../hooks/requests/useRequestsStore";
import { useForm } from "../../../hooks/useForm";
import { useUsersStore } from "../../../hooks/users/useUsersStore";
import { User } from "../../../interfaces/login/userInterface";
import { RequestInter } from "../../../interfaces/request/requestInterface";

const initialForm = {
  denialMotive: "",
};

/**
 * This component renders a list of all the requests made to the system for the administrator to manage.
 * The list will show the title, status, and date of creation of each request.
 * The status of each request will be colored according to its status.
 * The component will also render two buttons for each request: one for accepting and one for denying.
 * If the deny button is pressed, a text input will appear for the administrator to enter the reason for denial.
 * Once the reason is entered, a notification will be sent to the user with the reason.
 * The component will also show a message if the administrator has no requests.
 *
 * @returns {JSX.Element} A JSX element representing the component.
 */
export default function Requests() {
  const {
    requests,
    startLoadingRequests,
    isLoadingRequests,
    startMarkStatusRequest,
  } = useRequestsStore();
  const { startSendingRequestResponseNotification } = useNotificationStore();
  const { users } = useUsersStore();

  const [isDenied, setIsDenied] = useState(false);
  const { formState, onInputChange } = useForm(initialForm);

  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;

  const adminRequests: [] = requests.filter(
    (request: RequestInter) => request.status === "Pending"
  );

  /**
   * Handles the acceptance of a request. It calls the startMarkStatusRequest hook with the status "Approved" and the user's id.
   * It also calls the startSendingRequestResponseNotification hook with the status "Approved" to send a notification
   * to the user with the reason of the approval.
   * @param {RequestInter} request The request to be accepted.
   */
  const handleAccept = (request: RequestInter) => {
    startMarkStatusRequest(
      request.rid!,
      "Approved",
      request.asset,
      "",
      request.user
    );
    startSendingRequestResponseNotification("Approved", request);
  };

  /**
   * Sets the state to indicate that the denial process is active.
   *
   * @remarks
   * This function is called when the deny button is pressed, triggering the appearance
   * of a text input for entering the reason for denial.
   */
  const handleDeny = () => {
    setIsDenied(true);
  };

  /**
   * Handles the denial of a request. It calls the startMarkStatusRequest hook with the status "Denied" and the user's id.
   * It also calls the startSendingRequestResponseNotification hook with the status "Denied" to send a notification
   * to the user with the reason of the denial.
   * @param {RequestInter} request The request to be denied.
   */
  const actionsDenied = (request: RequestInter) => {
    setIsDenied(false);
    const { denialMotive } = formState;

    startMarkStatusRequest(
      request.rid!,
      "Denied",
      request.asset,
      denialMotive,
      request.user
    );
    startSendingRequestResponseNotification("Denied", request);
  };

  /**
   * Renders a request item as a card component.
   *
   * @param {Object} param - The parameter object containing the request item.
   * @param {RequestInter} param.item - The request item to be rendered.
   *
   * @returns {JSX.Element} A JSX element representing the request card, displaying the title, status,
   * user's name, creation date, and optional motivation. It also includes buttons to accept or deny
   * the request with functionality for entering a reason for denial.
   */
  const renderRequestItem = ({ item }: { item: RequestInter }) => {
    const statusColor = getStatusColor(item.status!);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {item.title} -{" "}
          {users.find((user: User) => user.uid === item.user)?.name}
        </Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {item.status}
        </Text>
        <Text style={styles.date}>
          Requested on: {new Date(item.creationDate!).toLocaleDateString()}
        </Text>
        {item.motivation && (
          <Text style={styles.reason}>Reason: {item.motivation}</Text>
        )}

        {!isDenied ? (
          <View style={styles.btns}>
            <Pressable
              onPress={() => handleAccept(item)}
              style={styles.acceptBtn}
            >
              <Ionicons name="checkmark-outline" size={40} color="#fff" />
            </Pressable>
            <Pressable onPress={handleDeny} style={styles.denyBtn}>
              <Ionicons name="close-outline" size={40} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Reason for Denial"
              value={formState.denialMotive}
              onChangeText={(value) =>
                onInputChange({
                  target: {
                    name: "denialMotive",
                    value: value,
                  },
                })
              }
            ></TextInput>
            <Pressable
              onPress={() => actionsDenied(item)}
              style={styles.sendBtn}
            >
              <Ionicons name="paper-plane-outline" size={40} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  /**
   * Returns the color code associated with the given request status.
   *
   * @param {string} status - The status of the request.
   * @returns {string} The hexadecimal color code representing the request status.
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "#4caf50";
      case "Denied":
        return "#f44336";
      case "Pending":
        return "#fbc02d";
      default:
        return "#9e9e9e";
    }
  };

  /**
   * Use the useFocusEffect hook to load the requests when the screen is focused.
   * It checks if the last loaded time is null or the time has expired, and if so, it loads the requests.
   */
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();

      if (
        !lastLoadedRef.current ||
        now - lastLoadedRef.current > Number(reloadTime)
      ) {
        startLoadingRequests();
        lastLoadedRef.current = now;
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      {isLoadingRequests ? (
        <ActivityIndicator size="large" color="#0D6EFD" />
      ) : adminRequests.length === 0 ? (
        <Text style={styles.noRequests}>You have no requests yet.</Text>
      ) : (
        <FlatList
          data={adminRequests}
          keyExtractor={(item) => item.rid!}
          renderItem={renderRequestItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    marginTop: 6,
    color: "#666",
  },
  reason: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: "italic",
    color: "#555",
  },
  noRequests: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  acceptBtn: {
    backgroundColor: "#4caf50",
    borderRadius: "10%",
  },
  denyBtn: {
    backgroundColor: "#f44336",
    borderRadius: "10%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: "#007BFF",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
