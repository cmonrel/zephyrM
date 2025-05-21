import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useRequestsStore } from "../../../hooks/requests/useRequestsStore";
import { RequestInter } from "../../../interfaces/request/requestInterface";

export default function Requests() {
  const { user } = useAuthStore();
  const {
    requests,
    startLoadingRequests,
    isLoadingRequests,
    startDeletingRequest,
  } = useRequestsStore();

  const userRequests: [] = requests.filter(
    (request: RequestInter) => request.user === user.uid
  );

  const handleDelete = (rid: string | undefined) => {
    startDeletingRequest(rid!);
    startLoadingRequests();
  };

  useEffect(() => {
    startLoadingRequests();
  }, []);

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
        <Pressable
          onPress={() => handleDelete(item.rid)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={30} color="#f44336" />
        </Pressable>
      </View>
    );
  };

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
