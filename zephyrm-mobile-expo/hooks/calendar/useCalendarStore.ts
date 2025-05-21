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

export const useCalendarStore = () => {
  const dispatch = useAppDispatch();
  const { events, activeEvent } = useSelector((state: any) => state.calendar);
  const { startCreatingNotification } = useNotificationStore();

  const setActiveEvent = (calendarEvent: EventInter) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

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

  const startDeletingUserEvents = (uid: string) => {
    events.map((event: EventInter) => {
      if (event.user.uid === uid) {
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
