import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect } from "react";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useNotificationStore } from "../../../hooks/notifications/useNotificationStore";
import { NotificationInter } from "../../../interfaces";

export default function Notifications() {
  const { user, notifications, startLoadingNotifications } = useAuthStore();
  const { markAllAsRead, markNotificationRead, startDeletingNotification } =
    useNotificationStore();

  useEffect(() => {
    startLoadingNotifications(user.uid);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => markAllAsRead(notifications)}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((notification: NotificationInter) => (
            <TouchableOpacity
              key={notification.nid}
              style={[
                styles.notificationItem,
                !notification.read && styles.unread,
              ]}
              onPress={() => markNotificationRead(notification)}
            >
              <Text style={styles.message}>{notification.title}</Text>
              <Text style={styles.description}>{notification.description}</Text>
              <View style={styles.dateRow}>
                <Text style={styles.date}>
                  {notification.eventDate
                    ? new Date(notification.eventDate).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })
                    : "Not specified"}
                </Text>
                <TouchableOpacity
                  onPress={() => startDeletingNotification(notification.nid!)}
                >
                  <Ionicons
                    name={notification.read ? "trash-sharp" : "trash-outline"}
                    color="red"
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No notifications</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  header: {
    display: "flex",
    flexWrap: "wrap-reverse",
    marginBottom: 10,
  },
  markAllText: {
    fontSize: 14,
    color: "#007BFF",
  },
  list: {
    maxHeight: "95%",
  },
  notificationItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  unread: {
    backgroundColor: "#e6f0ff",
  },
  message: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    color: "#555",
    marginVertical: 4,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
