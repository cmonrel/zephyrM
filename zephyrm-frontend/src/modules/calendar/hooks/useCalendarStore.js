/**
 * Events store hook
 *
 * Custom hook for managing events within the application
 *
 * @module modules/calendar/hooks/useCalendarStore
 */

import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import Swal from "sweetalert2";

import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} from "../../../store";
import { convertEventsToDateEvents } from "../";
import zephyrmApi from "../../../apis/zephyrMAPI";
import { useNotificationStore } from "../../../hooks";

/**
 * This hook provides functions to create, delete, and update events
 * for various events and user actions. It interacts with the server to
 * update event data and dispatches Redux actions to update the
 * application's state.
 *
 * Methods:
 * - `startLoadingEvents()`: Loads all events from the server.
 * - `setActiveEvent(event)`: Sets a single event as active.
 * - `startDeletingEvent(event)`: Deletes an event by its ID.
 * - `startSavingEvent(event)`: Creates a new event or updates an existing one.
 * - `startDeletingUserEvents(uid)`: Deletes all events belonging to a user.
 *
 * These methods handle server communication and manage the application's
 * event state via Redux.
 *
 * @returns {object} An object containing the following properties and methods:
 * - `events`: The list of all available events.
 * - `activeEvent`: The currently active event.
 * - `hasEventSelected`: A flag indicating whether an event is currently selected.
 * - `setActiveEvent(event)`: Sets a single event as active.
 * - `startDeletingEvent(event)`: Deletes an event by its ID.
 * - `startSavingEvent(event)`: Creates a new event or updates an existing one.
 * - `startDeletingUserEvents(uid)`: Deletes all events belonging to a user.
 * - `startLoadingEvents()`: Loads all events from the server.
 */
export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { startCreatingNotification } = useNotificationStore();

  /**
   * Sets a single event as active.
   *
   * It dispatches the onSetActiveEvent action with the provided
   * event to update the application's state.
   * @param {Object} calendarEvent The event to be set as active.
   */
  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  /**
   * Creates a new event or updates an existing one.
   *
   * If the `calendarEvent` has an `eid` property, it will be updated
   * via a PUT request to `/events/:eid`. Otherwise, it will be created
   * via a POST request to `/events`. The `onAddNewEvent` and
   * `onUpdateEvent` actions will be dispatched to update the
   * application's state. If the updated event is different from the
   * currently active event, a notification will be created via the
   * `startCreatingNotification` method.
   *
   * @param {Object} calendarEvent The event to be saved or updated.
   */
  const startSavingEvent = async (calendarEvent) => {
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
    } catch (error) {
      Swal.fire("Error saving", error.response.data.msg, "error");
    }
  };

  /**
   * Deletes an event from the server.
   *
   * This function removes an event identified by its `eid` from
   * the server. It first checks for an active event or the provided
   * event parameter to determine which event to delete. If successful,
   * it dispatches the `onDeleteEvent` action to update the application's
   * state. If an error occurs during the deletion, it displays an error
   * message.
   *
   * @param {Object} event - The event to be deleted.
   */
  const startDeletingEvent = async (event) => {
    if (!activeEvent && !event) return;
    const idEventToDelete = activeEvent?.eid || event.eid;
    if (!idEventToDelete) return;
    try {
      await zephyrmApi.delete(`events/${idEventToDelete}`);
      dispatch(onDeleteEvent());
    } catch (error) {
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

  /**
   * Loads all events from the server.
   *
   * This function makes a GET request to the server to fetch all
   * available events. If the request is successful, it dispatches
   * the onLoadEvents action with the received events to update the
   * application's state. If an error occurs during the request, it
   * displays an error message.
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
   * Deletes all events related to a user from the server.
   *
   * This function iterates over all events and finds those that
   * belong to the provided user `uid`. It then calls the
   * `startDeletingEvent` function to remove each of these events
   * from the server. If any of the deletions fail, it displays an
   * error message.
   *
   * @param {string} uid - The ID of the user whose events to delete.
   */
  const startDeletingUserEvents = (uid) => {
    events.map((event) => {
      if (event.user._id === uid || event.user.uid === uid) {
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
