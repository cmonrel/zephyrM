/**
 * Calendar screen
 *
 * @module app/(protected)/(adminTabs)/Calendar
 */

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

import { Ionicons } from "@expo/vector-icons";
import { Theme } from "react-native-calendars/src/types";
import CalendarEvent from "../../../components/calendar/calendarEvent";
import { convertEventsToMarkedDates } from "../../../helpers";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useCalendarStore } from "../../../hooks/calendar/useCalendarStore";
import { EventInter } from "../../../interfaces";

const calendarTheme: Theme = {
  backgroundColor: "#f8f9fa",
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#6c757d",
  selectedDayBackgroundColor: "#0d6efd",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#0d6efd",
  dayTextColor: "#212529",
  textDisabledColor: "#ced4da",
  arrowColor: "#0d6efd",
  monthTextColor: "#343a40",
  indicatorColor: "#0d6efd",
  textDayFontWeight: "500",
  textMonthFontWeight: "600",
  textDayHeaderFontWeight: "500",
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

/**
 * Calendar screen component
 *
 * @remarks
 * This component renders a calendar where the user can select a day and
 * see the events that are scheduled for that day. The user can also create
 * new events and delete or edit existing ones.
 *
 * @returns A JSX element representing the calendar screen
 */
export default function CalendarScreen() {
  const { user } = useAuthStore();
  const { events, startLoadingEvents, startSavingEvent, startDeletingEvent } =
    useCalendarStore();

  const currenDate = new Date().toDateString().split("T")[0];
  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;
  const [eventsToRender, setEventsToRender] = useState<EventInter[]>([]);
  const [newEvent, setNewEvent] = useState<any>();
  const [newEventFlag, setNewEventFlag] = useState(false);

  const markedDates = useMemo(() => {
    const base = convertEventsToMarkedDates(events, user.uid);

    if (eventsToRender.length > 0) {
      const selectedDate = eventsToRender[0].start.toISOString().split("T")[0];
      base[selectedDate] = {
        ...(base[selectedDate] || {}),
        selected: true,
        selectedColor: "#0d6efd",
        disableTouchEvent: true,
        dots: base[selectedDate]?.dots || [],
      };
    }

    return base;
  }, [events, eventsToRender]);

  /**
   * Handles the event when a day is pressed on the calendar.
   *
   * @param day - The date data object representing the day that was pressed.
   *
   * @remarks
   * This function filters the events to find those that are scheduled for the
   * selected day and updates the state to render those events.
   */
  const handleDayPress = async (day: DateData) => {
    const dateStr = day.dateString.split("T")[0];
    const eventsForDate: EventInter[] = events.filter(
      (event: EventInter) => event.start.toISOString().split("T")[0] === dateStr
    );

    setEventsToRender(eventsForDate);
  };

  /**
   * Handles the event when a user presses outside of the event list.
   *
   * @remarks
   * This function resets the state to not render any events.
   */
  const handlePressOutside = () => {
    setEventsToRender([]);
  };

  /**
   * Handles the event when the user presses the save button after creating a new event
   * or editing an existing one.
   *
   * @param event - The event object with the new values.
   *
   * @remarks
   * This function saves the event to the server, resets the state to not render any events,
   * and resets the new event flag to false.
   */
  const handleSave = async (event: EventInter) => {
    await startSavingEvent(event);
    setEventsToRender([]);
    setNewEvent(undefined);
    setNewEventFlag(false);
  };

  /**
   * Handles the deletion of an event.
   *
   * @param event - The event object to be deleted.
   *
   * @remarks
   * This function deletes the specified event from the server, reloads the events,
   * and updates the local state to remove the deleted event from the rendered list.
   */
  const handleDelete = async (event: EventInter) => {
    await startDeletingEvent(event);
    await startLoadingEvents();
    setEventsToRender(eventsToRender.filter((e) => e.eid !== event.eid));
  };

  /**
   * Initializes the process to create a new event.
   *
   * @remarks
   * This function sets up a new event object with default values and updates the state
   * to indicate that a new event is being created.
   */
  const handleCreateEvent = () => {
    setNewEvent({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      user: undefined,
      asset: undefined,
    });
    setNewEventFlag(true);
  };

  /**
   * Resets the state of the component when the user closes the event creation form.
   *
   * @remarks
   * This function is called when the user presses the "Cancel" button while creating a new event.
   * It resets the state of the component to not be creating a new event and clears any
   * existing new event data.
   */
  const handleCloseCreating = () => {
    setNewEventFlag(false);
    setNewEvent(undefined);
  };

  /**
   * Reloads the events if they haven't been loaded recently.
   *
   * @remarks
   * This function checks if the last time the events were loaded is older than the reload time.
   * If it is, it reloads the events and updates the last loaded time.
   */
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();

      if (
        !lastLoadedRef.current ||
        now - lastLoadedRef.current > Number(reloadTime)
      ) {
        startLoadingEvents();
        lastLoadedRef.current = now;
      }
    }, [])
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <View>
          <Calendar
            style={styles.calendarStyle}
            theme={calendarTheme}
            markingType="multi-dot"
            current={currenDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
          />
        </View>
      </TouchableWithoutFeedback>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {!newEventFlag && (
          <TouchableOpacity
            onPress={handleCreateEvent}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>
              <Ionicons name="add" size={30} color="white" />
            </Text>
          </TouchableOpacity>
        )}

        {newEvent && (
          <CalendarEvent
            onSave={handleSave}
            onCloseCreating={handleCloseCreating}
            event={newEvent}
            editing={true}
          />
        )}

        {eventsToRender.length > 0 &&
          eventsToRender.map((event) => (
            <CalendarEvent
              key={event.eid}
              onSave={handleSave}
              onDelete={handleDelete}
              event={event}
              editing={false}
            />
          ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  calendarStyle: {
    borderWidth: 1,
    borderColor: "gray",
    height: 350,
  },
  list: {
    maxHeight: "100%",
  },
  scrollContent: {
    paddingBottom: "5%",
  },
  createButton: {
    display: "flex",
    alignSelf: "center",
    marginTop: "1%",
    marginBottom: "1%",
    backgroundColor: "#0d6efd",
    padding: 13,
    borderRadius: 25,
    elevation: 4,
    zIndex: 10,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
