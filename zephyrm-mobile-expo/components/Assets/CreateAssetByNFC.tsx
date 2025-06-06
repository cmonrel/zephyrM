/**
 * CreateAssetByNFC component
 *
 * @module components/Assets/CreateAssetByNFC
 */

import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useMemo } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useAssetsStore } from "../../hooks/assetsHooks/useAssetsStore";
import { useForm } from "../../hooks/useForm";
import { useUsersStore } from "../../hooks/users/useUsersStore";
import { Asset } from "../../interfaces";
import { User } from "../../interfaces/login/userInterface";

/**
 * Creates a new asset with the given NFC tag
 *
 * @param {string} nfcTag - The NFC tag to assign to the new asset
 * @param {() => void} onClose - A callback to call when the form is submitted or cancelled
 * @returns {JSX.Element} The form
 */
export default function CreateAssetByNFC({
  nfcTag,
  onClose,
}: {
  nfcTag: string;
  onClose: () => void;
}) {
  const { users } = useUsersStore();
  const { startSavingAsset } = useAssetsStore();

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
    state: [(value: string) => value.length > 0, "State is required"] as [
      (value: any) => boolean,
      string
    ],
  };

  const stateOptions: Asset["state"][] = [
    "Free",
    "On loan",
    "Under maintenance",
    "Broken",
  ];

  const initialForm = useMemo(
    () => ({
      title: "",
      category: "",
      description: "",
      acquisitionDate: new Date(),
      location: "",
      state: stateOptions[0],
      user: undefined,
      nfcTag: nfcTag,
    }),
    [nfcTag]
  );

  const { formState, onInputChange } = useForm(initialForm, formValidations);

  /**
   * Handles the event when the user presses the save button after filling out the new asset form.
   *
   * @remarks
   * This function saves the asset to the server, resets the state to not render any assets,
   * and resets the new asset flag to false.
   */
  const handleSave = async () => {
    await startSavingAsset(formState);

    onClose();
  };

  /**
   * Handles the event when the user presses the cancel button.
   *
   * @remarks
   * This function closes the asset creation modal without saving any changes.
   */
  const handleCancel = () => {
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.header}>
          <Ionicons name="information-circle-outline" size={20} /> Asset Details
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>NFC Tag:</Text>
          <Text style={styles.value}>{formState.nfcTag}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={formState.title}
            onChangeText={(value) =>
              onInputChange({ target: { name: "title", value } })
            }
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>

          <TextInput
            style={styles.input}
            value={formState.category}
            onChangeText={(value) =>
              onInputChange({ target: { name: "category", value } })
            }
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>

          <TextInput
            style={styles.input}
            value={formState.description}
            onChangeText={(value) =>
              onInputChange({ target: { name: "description", value } })
            }
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Acquisition Date:</Text>
          <Text style={styles.value}>
            {formState.acquisitionDate
              ? new Date(formState.acquisitionDate).toLocaleDateString(
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

          <TextInput
            style={styles.input}
            value={formState.location}
            onChangeText={(value) =>
              onInputChange({ target: { name: "location", value } })
            }
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>State:</Text>

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
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Assigned User:</Text>

          <Picker
            selectedValue={formState.user}
            onValueChange={(value) =>
              onInputChange({ target: { name: "user", value } })
            }
            style={styles.picker}
          >
            <Picker.Item label="Unassigned" value={null} />
            {users.map((user: User) => (
              <Picker.Item key={user.uid} label={user.name} value={user.uid} />
            ))}
          </Picker>
        </View>
        <>
          <View style={styles.footer}>
            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Ionicons name="save-outline" size={30} />
              <Text style={styles.saveText}>Save</Text>
            </Pressable>

            <Pressable onPress={handleCancel} style={styles.CancelBtn}>
              <Ionicons name="close-circle-outline" size={30} />
              <Text style={styles.CancelText}>Cancel</Text>
            </Pressable>
          </View>
        </>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    minWidth: "80%",
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
    color: "#222",
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
  CancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  CancelText: {
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
