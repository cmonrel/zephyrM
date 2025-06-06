/**
 * Calendar screen
 *
 * @module app/(protected)/(workersTabs)/Calendar
 */

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
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
 * Calendar screen component for workers
 *
 * @remarks
 * This component renders a calendar interface where workers can view and select
 * specific days to see scheduled events. It handles loading events from a store,
 * displaying them on the calendar, and rendering a list of events for the selected day.
 * Users can also clear the event list by pressing outside of it.
 *
 * @returns A JSX element representing the worker's calendar screen
 */
export default function CalendarScreen() {
  const { user } = useAuthStore();
  const { events, startLoadingEvents } = useCalendarStore();

  const currenDate = new Date().toDateString().split("T")[0];
  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;
  const [eventsToRender, setEventsToRender] = useState<EventInter[]>([]);

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
   * Handles the event when the component is focused.
   *
   * @remarks
   * This function loads events and updates the last loaded time if necessary.
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
        {eventsToRender.length > 0 &&
          eventsToRender.map((event) => (
            <CalendarEvent
              key={event.eid}
              event={event}
              editing={false}
              onSave={() => {}}
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
});
