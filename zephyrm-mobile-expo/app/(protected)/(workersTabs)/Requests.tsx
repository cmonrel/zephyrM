/**
 * Requests screen
 *
 * @module app/(protected)/(workersTabs)/Requests
 */

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useRequestsStore } from "../../../hooks/requests/useRequestsStore";
import { RequestInter } from "../../../interfaces/request/requestInterface";

/**
 * Renders a list of all the requests made by the user.
 * The list will show a card for each request with the title, status, date of creation
 * and a denial reason (if any) of each request.
 * The status of each request will be colored according to its status.
 * The component will also render a button for each request to delete it.
 * If the user has no requests, a message will be displayed.
 *
 * @returns {JSX.Element} A JSX element representing the component.
 */
export default function Requests() {
  const { user } = useAuthStore();
  const {
    requests,
    startLoadingRequests,
    isLoadingRequests,
    startDeletingRequest,
  } = useRequestsStore();

  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;

  const userRequests: [] = requests.filter(
    (request: RequestInter) => request.user === user.uid
  );

  /**
   * Deletes a request by its id and reloads the requests list.
   *
   * @param {string | undefined} rid The id of the request to be deleted.
   */
  const handleDelete = (rid: string | undefined) => {
    startDeletingRequest(rid!);
    startLoadingRequests();
  };

  /**
   * Renders a request item as a card component.
   *
   * @param {{ item: RequestInter }} param - The parameter object containing the request item.
   *
   * @returns {JSX.Element} A JSX element representing the request card, displaying the title, status,
   * user's name, creation date, and optional motivation and denial reason. It also includes a button to delete the
   * request with functionality for entering a reason for denial.
   */
  const renderRequestItem = ({ item }: { item: RequestInter }) => {
    const statusColor = getStatusColor(item.status!);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {item.status}
        </Text>
        <Text style={styles.date}>
          Requested on: {new Date(item.creationDate!).toLocaleDateString()}
        </Text>
        {item.motivation && (
          <Text style={styles.reason}>Reason: {item.motivation}</Text>
        )}

        {item.denialMotive && (
          <Text style={styles.reason}>Reason: {item.denialMotive}</Text>
        )}

        <Pressable
          onPress={() => handleDelete(item.rid)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={30} color="#f44336" />
        </Pressable>
      </View>
    );
  };

  /**
   * Loads the requests when the screen is focused and whenever the reload time has passed since the last load.
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

  return (
    <View style={styles.container}>
      {isLoadingRequests ? (
        <ActivityIndicator size="large" color="#0D6EFD" />
      ) : userRequests.length === 0 ? (
        <Text style={styles.noRequests}>You have no requests yet.</Text>
      ) : (
        <FlatList
          data={userRequests}
          keyExtractor={(item, index) => item.rid! ?? index.toString()}
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
  deleteBtn: {
    display: "flex",
    flexWrap: "wrap-reverse",
  },
});
