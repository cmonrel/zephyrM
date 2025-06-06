/**
 * Calendar store hook
 *
 * @module hooks/calendar/useCalendarStore
 */

import { isEqual } from "lodash";
import { useSelector } from "react-redux";

import { Alert } from "react-native";
import { zephyrmApi } from "../../apis";
import { convertEventsToDateEvents } from "../../helpers/calendar/convertEventsToDateEvents";
import { EventInter } from "../../interfaces";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} from "../../store/calendar/calendarSlice";
import { useAppDispatch } from "../../store/store";
import { useNotificationStore } from "../notifications/useNotificationStore";

/**
 * Returns an object with the following properties and methods:
 *
 * - events: The list of events.
 * - activeEvent: The active event.
 * - hasEventSelected: A boolean indicating whether there is an active event.
 * - setActiveEvent: Sets the active event.
 * - startSavingEvent: Saves an event.
 * - startDeletingEvent: Deletes an event.
 * - startDeletingUserEvents: Deletes all events of a user.
 * - startLoadingEvents: Loads all events.
 *
 * @returns {Object} An object with the properties and methods above.
 */
export const useCalendarStore = () => {
  const dispatch = useAppDispatch();
  const { events, activeEvent } = useSelector((state: any) => state.calendar);
  const { startCreatingNotification } = useNotificationStore();

  /**
   * Sets the active event.
   *
   * @param {EventInter | null} calendarEvent - The event to set as active, or null to unset.
   */
  const setActiveEvent = (calendarEvent: EventInter | null) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  /**
   * Saves an event.
   *
   * @param {EventInter} calendarEvent - The event to save.
   *
   * @remarks
   * If the event is an existing one (i.e. has an eid), it will be updated.
   * Otherwise, a new event will be created.
   * If the event is created or updated successfully, a notification will be created
   * if the event is not already the active event.
   * If there is an error, an alert will be shown with the error message.
   */
  const startSavingEvent = async (calendarEvent: EventInter) => {
    if (!calendarEvent) return;
    try {
      if (calendarEvent.eid) {
        // Update
        await zephyrmApi.put(`events/${calendarEvent.eid}`, calendarEvent);
        dispatch(onUpdateEvent(calendarEvent));
        if (!isEqual(calendarEvent, activeEvent)) {
          startCreatingNotification(calendarEvent);
        }
        return;
      }
      // Create
      const { data } = await zephyrmApi.post("events", calendarEvent);
      const newCalendarEvent = { ...calendarEvent, eid: data.saveEvent.eid };
      dispatch(onAddNewEvent(newCalendarEvent));
      startCreatingNotification(newCalendarEvent);
    } catch (error: any) {
      Alert.alert("Error saving", error.response.data.msg);
    }
  };

  /**
   * Deletes an event.
   *
   * @param {EventInter} event - The event to delete. If not provided, the active event will be deleted.
   *
   * @remarks
   * If the event is deleted successfully, the active event will be unset.
   * If there is an error, an alert will be shown with the error message.
   */
  const startDeletingEvent = async (event: EventInter) => {
    if (!activeEvent && !event) return;
    const idEventToDelete = activeEvent?.eid || event.eid;
    if (!idEventToDelete) return;
    try {
      await zephyrmApi.delete(`events/${idEventToDelete}`);
      dispatch(onDeleteEvent());
    } catch (error: any) {
      Alert.alert("Error deleting", error.response.data.msg);
    }
  };

  /**
   * Loads all events from the API.
   *
   * Makes a GET request to the API to fetch all available events.
   * If the request is successful, it dispatches the onLoadEvents action
   * with the received events to update the application's state. If an error
   * occurs during the request, it logs an error message to the console.
   */
  const startLoadingEvents = async () => {
    try {
      const { data } = await zephyrmApi.get("events");
      const events = convertEventsToDateEvents(data.events);
      dispatch(onLogoutCalendar());
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log("Error loading events");
      console.log(error);
    }
  };

  /**
   * Deletes all events of a user.
   *
   * @param {string} uid - The uid of the user whose events should be deleted.
   *
   * @remarks
   * This function loops over the events and calls startDeletingEvent if the
   * event belongs to the user with the given uid.
   */
  const startDeletingUserEvents = (uid: string) => {
    events.map((event: EventInter) => {
      if (event.user?.uid === uid) {
        startDeletingEvent(event);
      }
    });
  };

  return {
    //Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startDeletingUserEvents,
    startLoadingEvents,
  };
};
