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
import { useNotificationStore } from "../../../hooks/notifications/useNotificationStore";
import { useRequestsStore } from "../../../hooks/requests/useRequestsStore";
import { useUsersStore } from "../../../hooks/users/useUsersStore";
import { User } from "../../../interfaces/login/userInterface";
import { RequestInter } from "../../../interfaces/request/requestInterface";

export default function Requests() {
  const {
    requests,
    startLoadingRequests,
    isLoadingRequests,
    startMarkStatusRequest,
  } = useRequestsStore();
  const { startSendingRequestResponseNotification } = useNotificationStore();
  const { users } = useUsersStore();

  const adminRequests: [] = requests.filter(
    (request: RequestInter) => request.status === "Pending"
  );

  const handleAccept = (request: RequestInter) => {
    startMarkStatusRequest(
      request.rid!,
      "Approved",
      request.asset,
      request.user
    );
    startSendingRequestResponseNotification("Approved", request);
  };

  const handleDeny = (request: RequestInter) => {
    startMarkStatusRequest(request.rid!, "Denied", request.asset);
    startSendingRequestResponseNotification("Denied", request);
  };

  useEffect(() => {
    startLoadingRequests();
  }, []);

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

        <View style={styles.btns}>
          <Pressable
            onPress={() => handleAccept(item)}
            style={styles.acceptBtn}
          >
            <Ionicons name="checkmark-outline" size={40} color="#fff" />
          </Pressable>
          <Pressable onPress={() => handleDeny(item)} style={styles.denyBtn}>
            <Ionicons name="close-outline" size={40} color="#fff" />
          </Pressable>
        </View>
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
});
