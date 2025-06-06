/**
 * Layout for admin tabs
 *
 * @module app/(protected)/(adminTabs)/_layout
 */

import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { NotificationInter } from "../../../interfaces";

/**
 * The admin tabs layout component
 *
 * This component is the base layout for all the admin tabs. It renders
 * the tabs navigation with the following screens:
 *
 * - SearchAssetsAdmin
 * - WorkersRequests
 * - NFCTags
 * - Calendar
 * - Notifications
 *
 * The header title is set to the current user's name and the title
 * of the screen. The header right button is a logout button.
 *
 * The tabs navigation is set to display the "Assets" screen as the
 * first screen when the user logs in.
 *
 * @returns {JSX.Element} The admin tabs layout component
 */
export default function TabLayout() {
  const { user, notifications, startLogout } = useAuthStore();
  const router = useRouter();

  const unreadCount = notifications.filter(
    (n: NotificationInter) => !n.read
  ).length;

  /**
   * Handles the user logout process.
   *
   * Initiates the logout procedure and redirects the user
   * to the home page after logout is complete.
   */
  const handleLogout = async () => {
    startLogout();
    router.replace("/");
  };

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
        name="SearchAssetsAdmin"
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
        name="WorkersRequests"
        options={{
          title: "Requests",
          headerTitle: `Requests - ${user.name}`,
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

      <Tabs.Screen
        name="CalendarAdmin"
        options={{
          title: "Calendar",
          headerTitle: `Calendar - ${user.name}`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar-sharp" : "calendar-outline"}
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
