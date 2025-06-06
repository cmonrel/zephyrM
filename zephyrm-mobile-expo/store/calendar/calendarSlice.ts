/**
 * Calendar slice
 *
 * @module store/calendar/calendarSlice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventInter } from "../../interfaces";

interface CalendarState {
  isLoadingEvents: boolean;
  events: EventInter[];
  activeEvent: EventInter | null;
}

const initialState: CalendarState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
};

/**
 * This slice contains the state and reducers for the calendar module.
 */
export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    /**
     * Sets the active event in the state.
     *
     * @param {EventInter | null} payload - The event to set as active, or null to unset.
     */
    onSetActiveEvent: (
      state,
      { payload }: PayloadAction<EventInter | null>
    ) => {
      state.activeEvent = payload;
    },

    /**
     * Adds a new event to the list of events and sets the active event to null.
     *
     * This reducer is used when a new event is created. It receives the new event
     * object as a payload and adds it to the list of events in the state. It also
     * sets the active event to null.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {Object} { payload } - The payload with the new event object.
     */
    onAddNewEvent: (state, { payload }: PayloadAction<EventInter>) => {
      state.events.push(payload);
      state.activeEvent = null;
    },

    /**
     * Updates an existing event in the list of events.
     *
     * This reducer is used when an event is modified. It receives the updated
     * event object as a payload, finds the event with the matching eid in the
     * state, and replaces it with the updated event. If no matching eid is found,
     * the event remains unchanged.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {Object} { payload } - The payload with the updated event object.
     */
    onUpdateEvent: (state, { payload }: PayloadAction<EventInter>) => {
      state.events = state.events.map((event) => {
        if (event.eid === payload.eid) return payload;
        return event;
      });
    },
    /**
     * Deletes the active event from the list of events and sets the active event to null.
     *
     * This reducer is used when an event is deleted. It receives no payload and deletes the
     * active event from the list of events in the state. It also sets the active event to null.
     *
     * @param {Object} state - The current state of the reducer.
     */
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.eid !== state.activeEvent?.eid
        );
        state.activeEvent = null;
      }
    },

    /**
     * Loads the list of events from the server and adds them to the state.
     *
     * This reducer is used when the events are loaded from the server. It receives
     * the list of events as a payload and adds them to the state. If an event with
     * the same eid already exists in the state, it is skipped.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {Object} { payload } - The payload with the list of events.
     */
    onLoadEvents: (state, { payload = [] }: PayloadAction<EventInter[]>) => {
      state.isLoadingEvents = false;
      payload.forEach((event) => {
        const exists = state.events.some(
          (dbEvent) => dbEvent.eid === event.eid
        );
        if (!exists) {
          state.events.push(event);
        }
      });
    },

    /**
     * Resets the calendar state to its initial state.
     *
     * This reducer is used when the user logs out. It resets the state
     * of the calendar module to its initial value, setting isLoadingEvents
     * to false and clearing the list of events, and sets the active event
     * to null.
     *
     * @param {Object} state The current state of the reducer.
     */
    onLogoutCalendar: (state) => {
      state.isLoadingEvents = false;
      state.events = [];
      state.activeEvent = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} = calendarSlice.actions;
