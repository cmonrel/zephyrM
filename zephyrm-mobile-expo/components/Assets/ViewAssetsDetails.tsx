/**
 * ViewAssetsDetails component
 *
 * @module components/Assets/ViewAssetsDetails
 */

import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useAssetsStore } from "../../hooks/assetsHooks/useAssetsStore";
import { useCategoriesStore } from "../../hooks/assetsHooks/useCategoriesStore";
import { useAuthStore } from "../../hooks/auth/useAuthStore";
import { useNotificationStore } from "../../hooks/notifications/useNotificationStore";
import { useRequestsStore } from "../../hooks/requests/useRequestsStore";
import { useForm } from "../../hooks/useForm";
import { useUsersStore } from "../../hooks/users/useUsersStore";
import { Asset, Category } from "../../interfaces";
import { User } from "../../interfaces/login/userInterface";

/**
 * @description Component to view and edit asset details
 * @param {Function} onDelete Optional function to delete an asset
 * @param {Function} onClear Optional function to clear the active asset
 * @returns {JSX.Element} The ViewAssetsDetails component
 */
export default function ViewAssetsDetails({
  onDelete,
  onClear,
}: {
  onDelete?: (asset: Asset) => void;
  onClear?: () => void;
}) {
  const { user } = useAuthStore();
  const { users } = useUsersStore();
  const { activeAsset, setActiveAsset, startSavingAsset } = useAssetsStore();
  const { startSendingNotificationRequest } = useNotificationStore();
  const { startSavingRequest } = useRequestsStore();
  const { categories, startLoadingCategories, startDeletingCategory } =
    useCategoriesStore();

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

  /**
   * Returns the color code associated with the given asset state.
   *
   * @param {Asset["state"]} state - The state of the asset.
   * @returns {string} The hexadecimal color code representing the asset state.
   */
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

  /**
   * Handles the event when the user presses the clear button.
   *
   * @remarks
   * This function triggers the onClear callback to clear the form or reset the asset state.
   */
  const handleClear = () => {
    onClear!();
  };

  /**
   * Handles the event when the user presses the save button.
   *
   * @remarks
   * This function saves the asset by calling the startSavingAsset function and
   * updates the active asset state by calling setActiveAsset with the new values.
   */
  const handleSave = () => {
    setIsEditing(false);
    setActiveAsset(formState);
    startSavingAsset(formState);
  };

  /**
   * Handles the event when the user presses the delete button.
   *
   * @remarks
   * This function calls the onDelete callback with the active asset as an argument.
   * The onDelete callback is responsible for deleting the asset and updating the application state.
   * The onDelete callback is required and must be a function that takes a single asset as an argument.
   */
  const handleDelete = () => {
    onDelete!(activeAsset);
  };

  /**
   * Handles the event when the user presses the delete category button.
   *
   * @remarks
   * This function finds the category that matches the category title in the form state
   * and calls startDeletingCategory with the category's cid.
   */
  const handleDeleteCategory = () => {
    const category = categories.find(
      (category: Category) => category.title === formState.category
    );
    startDeletingCategory(category!.cid);
  };

  /**
   * Handles the event when the user presses the send request button.
   *
   * @remarks
   * This function sends a request for the active asset to the server and
   * saves the request in the application state. It also shows a success
   * message. If an error occurs, it displays an error message.
   */
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

  /**
   * Effect hook to load categories when the component mounts.
   */
  useEffect(() => {
    startLoadingCategories();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>
          <Ionicons name="information-circle-outline" size={20} /> Asset Details
        </Text>

        <View style={styles.footer}>
          <View style={styles.row}>
            <Text style={styles.label}>NFC Tag:</Text>
            <Text style={styles.value}>{activeAsset.nfcTag}</Text>
          </View>
          {activeAsset.nfcTag && user.role === "admin" && (
            <Pressable style={styles.deleteBtn} onPress={() => handleClear()}>
              <Ionicons name="remove-circle" size={25} color="#f44336" />
            </Pressable>
          )}
        </View>

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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formState.category}
                onValueChange={(value) =>
                  onInputChange({ target: { name: "category", value } })
                }
                style={styles.pickerCategory}
              >
                {categories.map((category: Category) => (
                  <Picker.Item
                    key={category.title}
                    label={category.title}
                    value={category.title}
                  />
                ))}
              </Picker>
              <TouchableOpacity onPress={() => handleDeleteCategory()}>
                <Ionicons name="trash-outline" size={20} color="#d00" />
              </TouchableOpacity>
            </View>
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
              style={[styles.picker, { color: getStateColor(formState.state) }]}
            >
              {stateOptions.map((state) => (
                <Picker.Item
                  style={{ color: getStateColor(state) }}
                  key={state}
                  label={state}
                  value={state}
                />
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
              <Picker.Item label="Unassigned" value={null} />
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
              {isEditing ? (
                <Pressable onPress={handleSave} style={styles.saveBtn}>
                  <Ionicons name="save-outline" size={30} />
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleDelete()}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={30} />
                  <Text style={styles.deleteText}>Delete</Text>
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
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                      <TextInput
                        style={[styles.input, { marginBottom: 8 }]}
                        placeholder="Write your motivation..."
                        value={motivation}
                        onChangeText={setMotivation}
                        multiline
                      />
                    </TouchableWithoutFeedback>

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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  pickerCategory: {
    flex: 1,
    color: "#222",
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
    color: "#888",
  },
  picker: {
    color: "#222",
    backgroundColor: "#e9e9e9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    fontSize: 16,
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
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  deleteText: {
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
