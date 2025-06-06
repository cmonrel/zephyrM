/**
 * CalendarEvent component
 *
 * @module components/calendar/calendarEvent
 */

import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/auth/useAuthStore";
import { useUIStore } from "../../hooks/ui/useUiStore";
import { useForm } from "../../hooks/useForm";
import { EventInter } from "../../interfaces";
import { AssetSelectionModal } from "../AssetSelectionModal";
import { UserSelectionModal } from "./UserSelectionModal";

/**
 * CalendarEvent component
 *
 * @param {EventInter} event - The event data
 * @param {boolean} editing - Is the event being edited?
 * @param {(event: EventInter) => void} onSave - Callback to save the event
 * @param {(event: EventInter) => void} onDelete - Callback to delete the event
 * @param {() => void} onCloseCreating - Callback to close the "Create Event" modal
 *
 * @returns {JSX.Element} The CalendarEvent component
 */
export default function CalendarEvent({
  event,
  editing,
  onSave,
  onDelete,
  onCloseCreating,
}: {
  event: EventInter;
  editing: boolean;
  onSave: (event: EventInter) => void;
  onDelete?: (event: EventInter) => void;
  onCloseCreating?: () => void;
}) {
  const { user } = useAuthStore();
  const {
    isAssetSelectionModalOpen,
    isUserSelectionModalOpen,
    openAssetSelectionModal,
    openUserSelectionModal,
  } = useUIStore();

  const { formState, onInputChange, onResetForm } = useForm(event);

  const [isEditing, setIsEditing] = useState(editing);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  /**
   * Handles the event when a user presses an event on the calendar.
   *
   * If the user is an admin, this function will set the state to edit the event.
   */
  const handlePress = () => {
    if (user.role === "admin") setIsEditing(true);
  };

  /**
   * Handles the event when a user presses the save button after editing an event.
   *
   * @remarks
   * This function saves the event to the server by calling the onSave callback with
   * the new event data and resets the state to not edit the event.
   */
  const handleSave = () => {
    onSave(formState);
    setIsEditing(false);
  };

  /**
   * Handles the event when a user presses the delete button after editing an event.
   *
   * @remarks
   * This function calls the onDelete callback with the event data and resets the
   * state to not edit the event.
   */
  const handleDelete = () => {
    onDelete?.(event);
    setIsEditing(false);
  };

  /**
   * Handles the event when a user presses the cancel button while editing an event.
   *
   * @remarks
   * This function resets the form to its initial state and stops the editing process.
   * If the event is a new one without an eid, it triggers the onCloseCreating callback
   * to close the "Create Event" modal.
   */
  const handleCancel = () => {
    onResetForm();
    setIsEditing(false);

    if (!event.eid) onCloseCreating?.();
  };

  return (
    <Pressable onPress={handlePress} key={event.eid} style={styles.eventCard}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.inputTitle}
            value={formState.title}
            onChangeText={(value) =>
              onInputChange({ target: { name: "title", value } })
            }
          />
          <TextInput
            style={styles.inputDescription}
            value={formState.description}
            onChangeText={(value) =>
              onInputChange({ target: { name: "description", value } })
            }
            placeholder="Description"
            multiline
          />

          <View style={styles.eventDetailRow}>
            <Text style={styles.eventLabel}>Start:</Text>

            <View style={styles.dateTimeGroup}>
              <Pressable onPress={() => setShowStartDatePicker(true)}>
                <Text style={styles.dateText}>
                  {formState.start.toLocaleDateString()}
                </Text>
              </Pressable>

              <Pressable onPress={() => setShowStartTimePicker(true)}>
                <Text style={styles.timeText}>
                  {formState.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.eventDetailRow}>
            <Text style={styles.eventLabel}>End:</Text>

            <View style={styles.dateTimeGroup}>
              <Pressable onPress={() => setShowEndDatePicker(true)}>
                <Text style={styles.dateText}>
                  {formState.end.toLocaleDateString()}
                </Text>
              </Pressable>

              <Pressable onPress={() => setShowEndTimePicker(true)}>
                <Text style={styles.timeText}>
                  {formState.end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={formState.start}
              minimumDate={new Date()}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                onInputChange({
                  target: { name: "start", value: selectedDate },
                });
              }}
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              value={formState.start}
              minimumDate={new Date()}
              display="default"
              mode="time"
              onChange={(event, selectedDate) => {
                setShowStartTimePicker(false);
                onInputChange({
                  target: { name: "start", value: selectedDate },
                });
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={formState.end}
              display="default"
              minimumDate={formState.start}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                onInputChange({
                  target: { name: "end", value: selectedDate },
                });
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={formState.end}
              display="default"
              mode="time"
              minimumDate={formState.start}
              onChange={(event, selectedDate) => {
                setShowEndTimePicker(false);
                onInputChange({
                  target: { name: "end", value: selectedDate },
                });
              }}
            />
          )}

          <Pressable
            onPress={openAssetSelectionModal}
            style={styles.eventDetailRow}
          >
            <Text style={styles.eventLabel}>Asset:</Text>
            <Text style={styles.inputValue}>{formState.asset?.title}</Text>
            <TouchableOpacity
              onPress={() =>
                onInputChange({ target: { name: "asset", value: null } })
              }
            >
              {formState.asset && (
                <Ionicons
                  style={{ marginLeft: 10 }}
                  name="remove-circle"
                  size={25}
                  color="#dc3545"
                />
              )}
            </TouchableOpacity>
          </Pressable>

          <Pressable
            onPress={openUserSelectionModal}
            style={styles.eventDetailRow}
          >
            <Text style={styles.eventLabel}>User:</Text>
            <Text style={styles.inputValue}>{formState.user?.name}</Text>
          </Pressable>

          <View style={styles.buttonsRow}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCancel} color="red" />
          </View>

          {isAssetSelectionModalOpen && (
            <AssetSelectionModal
              onSelect={(value) =>
                onInputChange({ target: { name: "asset", value } })
              }
            />
          )}

          {isUserSelectionModalOpen && (
            <UserSelectionModal
              onSelect={(value) =>
                onInputChange({ target: { name: "user", value } })
              }
            />
          )}
        </>
      ) : (
        <>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>

          <View style={styles.eventDetailRow}>
            <Text style={styles.eventLabel}>Start:</Text>

            <View style={styles.dateTimeGroup}>
              <Pressable onPress={() => setShowStartDatePicker(true)}>
                <Text style={styles.dateText}>
                  {formState.start.toLocaleDateString()}
                </Text>
              </Pressable>

              <Pressable onPress={() => setShowStartTimePicker(true)}>
                <Text style={styles.timeText}>
                  {formState.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.eventDetailRow}>
            <Text style={styles.eventLabel}>End:</Text>

            <View style={styles.dateTimeGroup}>
              <Pressable onPress={() => setShowEndDatePicker(true)}>
                <Text style={styles.dateText}>
                  {formState.end.toLocaleDateString()}
                </Text>
              </Pressable>

              <Pressable onPress={() => setShowEndTimePicker(true)}>
                <Text style={styles.timeText}>
                  {formState.end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          </View>

          {event.asset && (
            <View style={styles.eventDetailRow}>
              <Text style={styles.eventLabel}>Asset:</Text>
              <Text style={styles.eventValue}>{event.asset?.title}</Text>
            </View>
          )}

          <View style={styles.eventDetailRowUser}>
            <View style={styles.eventDetailRow}>
              <Text style={styles.eventLabel}>User:</Text>
              <Text style={styles.eventValue}>{event.user?.name}</Text>
            </View>
            {user.role === "admin" && (
              <View>
                <Pressable onPress={handleDelete} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={25} color="#dc3545" />
                </Pressable>
              </View>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d6efd",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 12,
  },
  eventValue: {
    color: "#212529",
    flexShrink: 1,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d6efd",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: "#0d6efd",
    paddingVertical: 4,
  },
  inputDescription: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#495057",
    paddingVertical: 4,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  eventDetailRowUser: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  eventLabel: {
    fontWeight: "bold",
    marginRight: 10,
    fontSize: 16,
  },

  dateTimeGroup: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  dateText: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: "600",
  },

  timeText: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: "600",
  },
  inputValue: {
    flex: 1,
    color: "#212529",
    borderBottomWidth: 1,
    borderColor: "#adb5bd",
    paddingVertical: 2,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  deleteButton: {
    display: "flex",
    flexWrap: "wrap-reverse",
    marginTop: 10,
  },
});
