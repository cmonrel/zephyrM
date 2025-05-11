import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from "../../../store";
import { convertEventsToDateEvents } from "../";
import zephyrmApi from "../../../apis/zephyrMAPI";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        // Update
        await zephyrmApi.put(`events/${calendarEvent.id}`, calendarEvent);

        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }

      // Create
      const { data } = await zephyrmApi.post("events", calendarEvent);
      dispatch(
        onAddNewEvent({ ...calendarEvent, id: data.saveEvent.id, user })
      );
    } catch (error) {
      Swal.fire("Error saving", error.response.data.msg, "error");
    }
  };

  const startDeletingEvent = async () => {
    if (!activeEvent) return;
    try {
      await zephyrmApi.delete(`events/${activeEvent.id}`);
      dispatch(onDeleteEvent());
    } catch (error) {
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await zephyrmApi.get("events");
      const events = convertEventsToDateEvents(data.events);
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log("Error loading events");
      console.log(error);
    }
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
    startLoadingEvents,
  };
};
