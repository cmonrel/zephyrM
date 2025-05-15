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

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { startCreatingNotification } = useNotificationStore();

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

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
      dispatch(onAddNewEvent({ ...calendarEvent, eid: data.saveEvent.eid }));
      startCreatingNotification(calendarEvent);
    } catch (error) {
      Swal.fire("Error saving", error.response.data.msg, "error");
    }
  };

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
