import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

import { useAssetsStore } from "../../../hooks/assetsHooks/useAssetsStore";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useRequestsStore } from "../../../hooks/requests/useRequestsStore";
import { NotificationInter } from "../../../interfaces";

export default function WorkersTabLayout() {
  const { user, notifications, startLoadingNotifications, startLogout } =
    useAuthStore();
  const { startLoadingAssets } = useAssetsStore();
  const { startLoadingRequests } = useRequestsStore();
  const router = useRouter();

  const unreadCount = notifications.filter(
    (n: NotificationInter) => !n.read
  ).length;

  const handleLogout = async () => {
    startLogout();
    router.replace("/");
  };

  useEffect(() => {
    startLoadingNotifications(user.uid);
    startLoadingAssets();
    startLoadingRequests();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0D6EFD",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
        headerRight: () => (
          <TouchableOpacity style={styles.container} onPress={handleLogout}>
            <Image
              source={require("../../../assets/images/zephyrLogo.png")}
              style={styles.image}
            />
            <Text style={{ color: "#fff" }}>Log out</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="SearchAssetsWorker"
        options={{
          title: "Assets",
          headerTitle: `Assets - ${user.name}`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search-sharp" : "search-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Requests"
        options={{
          title: "Requests",
          headerTitle: `My Requests - ${user.name}`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "layers-sharp" : "layers-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="NFCTags"
        options={{
          title: "Scan",
          headerTitle: `Scan - ${user.name}`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "camera-sharp" : "camera-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      {unreadCount > 0 ? (
        <Tabs.Screen
          name="Notifications"
          options={{
            title: "Notifications",
            headerTitle: `Notifications(${
              unreadCount > 99 ? "99+" : unreadCount
            }) - ${user.name}`,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "mail-unread-sharp" : "mail-unread-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="Notifications"
          options={{
            title: "Notifications",
            headerTitle: `Notifications - ${user.name}`,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "mail-sharp" : "mail-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: "contain",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
