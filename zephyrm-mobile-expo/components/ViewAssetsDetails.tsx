import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAssetsStore } from "../hooks/assetsHooks/useAssetsStore";
import { useAuthStore } from "../hooks/auth/useAuthStore";
import { useNotificationStore } from "../hooks/notifications/useNotificationStore";
import { useRequestsStore } from "../hooks/requests/useRequestsStore";
import { useForm } from "../hooks/useForm";
import { useUsersStore } from "../hooks/users/useUsersStore";
import { Asset } from "../interfaces";
import { User } from "../interfaces/login/userInterface";

export default function ViewAssetsDetails() {
  const { user } = useAuthStore();
  const { users } = useUsersStore();
  const { activeAsset, setActiveAsset, startSavingAsset } = useAssetsStore();
  const { startSendingNotificationRequest } = useNotificationStore();
  const { startSavingRequest } = useRequestsStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [motivation, setMotivation] = useState("");

  const formValidations = {
    title: [(value: string) => value.length > 0, "Title is required"] as [
      (value: any) => boolean,
      string
    ],
    category: [(value: string) => value.length > 0, "Category is required"] as [
      (value: any) => boolean,
      string
    ],
    location: [(value: string) => value.length > 0, "Location is required"] as [
      (value: any) => boolean,
      string
    ],
    description: [
      (value: string) => value.length > 0,
      "Description is required",
    ] as [(value: any) => boolean, string],
  };

  const stateOptions: Asset["state"][] = [
    "Free",
    "On loan",
    "Under maintenance",
    "Broken",
  ];

  const { formState, onInputChange } = useForm(activeAsset, formValidations);

  const getStateColor = (state: Asset["state"]) => {
    switch (state) {
      case "Free":
        return "#4caf50";
      case "On loan":
        return "#fbc02d";
      case "Under maintenance":
        return "#03a9f4";
      case "Broken":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setActiveAsset(formState);
    startSavingAsset(formState);
  };

  const handleSendRequest = async () => {
    if (activeAsset.state !== "Free") return;
    setIsSent(true);

    try {
      await startSendingNotificationRequest(activeAsset);
      await startSavingRequest({
        title: `Request for ${activeAsset.title} (${activeAsset.category})`,
        motivation: motivation,
        user: user.uid,
        asset: activeAsset.aid,
      });
    } catch (error: any) {
      Alert.alert("Error sending request", error.response.data.msg);
      setIsSent(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>
          <Ionicons name="information-circle-outline" size={20} /> Asset Details
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Title:</Text>

          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formState.title}
              onChangeText={(value) =>
                onInputChange({ target: { name: "title", value } })
              }
            />
          ) : (
            <Text style={styles.value}>{activeAsset.title}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formState.category}
              onChangeText={(value) =>
                onInputChange({ target: { name: "category", value } })
              }
            />
          ) : (
            <Text style={styles.value}>{formState.category}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formState.description}
              onChangeText={(value) =>
                onInputChange({ target: { name: "description", value } })
              }
            />
          ) : (
            <Text style={styles.value}>{formState.description}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Acquisition Date:</Text>
          <Text style={styles.value}>
            {activeAsset.acquisitionDate
              ? new Date(activeAsset.acquisitionDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              : "Not specified"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formState.location}
              onChangeText={(value) =>
                onInputChange({ target: { name: "location", value } })
              }
            />
          ) : (
            <Text style={styles.value}>{formState.location}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>State:</Text>
          {isEditing ? (
            <Picker
              selectedValue={formState.state}
              onValueChange={(value) =>
                onInputChange({ target: { name: "state", value } })
              }
              style={styles.picker}
            >
              {stateOptions.map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          ) : (
            <Text
              style={[
                styles.value,
                { color: getStateColor(activeAsset.state), fontWeight: "600" },
              ]}
            >
              {activeAsset.state}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Assigned User:</Text>
          {isEditing ? (
            <Picker
              selectedValue={formState.user}
              onValueChange={(value) =>
                onInputChange({ target: { name: "user", value } })
              }
              style={styles.picker}
            >
              <Picker.Item label="Unassigned" value="" />
              {users.map((user: User) => (
                <Picker.Item
                  key={user.uid}
                  label={user.name}
                  value={user.uid}
                />
              ))}
            </Picker>
          ) : (
            <Text style={styles.value}>
              {users.find((user: User) => user.uid === activeAsset.user)
                ?.name || "Unassigned"}
            </Text>
          )}
        </View>

        {user.role === "admin" ? (
          <>
            <View style={styles.footer}>
              <Pressable
                onPress={() => setIsEditing((prev) => !prev)}
                style={styles.saveBtn}
              >
                <Ionicons
                  name={isEditing ? "close-circle-outline" : "create-outline"}
                  size={30}
                />
                {isEditing && <Text style={styles.cancelText}>Cancel</Text>}
              </Pressable>
              {isEditing && (
                <Pressable onPress={handleSave} style={styles.saveBtn}>
                  <Ionicons name="save-outline" size={30} />
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              )}
            </View>
          </>
        ) : (
          <>
            {activeAsset.state === "Free" && !isSent && (
              <View style={styles.footerWorker}>
                {!showRequestForm ? (
                  <Pressable
                    onPress={() => setShowRequestForm(true)}
                    style={styles.saveBtn}
                  >
                    <Ionicons name="paper-plane-outline" size={30} />
                  </Pressable>
                ) : (
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={[styles.input, { marginBottom: 8 }]}
                      placeholder="Write your motivation..."
                      value={motivation}
                      onChangeText={setMotivation}
                      multiline
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Pressable
                        onPress={() => setShowRequestForm(false)}
                        style={[styles.saveBtn, { marginRight: 12 }]}
                      >
                        <Ionicons
                          name="close-outline"
                          size={24}
                          color="#f44336"
                        />
                        <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleSendRequest}
                        style={styles.saveBtn}
                      >
                        <Ionicons
                          name="send-outline"
                          size={24}
                          color="#43a047"
                        />
                        <Text style={styles.saveText}>Send</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    color: "#222",
    marginTop: 2,
  },
  input: {
    fontSize: 16,
    color: "#222",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 2,
    marginTop: 2,
  },
  picker: {
    marginTop: 2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  editText: {
    marginLeft: 6,
    color: "#1e88e5",
    fontWeight: "500",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    marginLeft: 6,
    color: "#43a047",
    fontWeight: "500",
  },
  cancelText: {
    marginLeft: 6,
    color: "#f44336",
    fontWeight: "500",
  },
  footerWorker: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
