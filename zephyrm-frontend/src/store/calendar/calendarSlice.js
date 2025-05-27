/**
 * Calendar slice
 *
 * This slice contains the state and reducers for the calendar module.
 *
 * @module store/calendar/calendarSlice
 */

import { createSlice } from "@reduxjs/toolkit";

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
  },
  reducers: {
    /**
     * Sets the active event to the given event.
     *
     * This reducer is used when a user clicks on an event in the list.
     * It receives the event object as a payload and sets the state
     * with that event.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the event object.
     */
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
    /**
     * Adds a new event to the list of events and sets the active event to null.
     *
     * This reducer is used when a new event is created. It receives the new
     * event object as a payload and adds it to the list of events in the state.
     * It also sets the active event to null.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the new event object.
     */
    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    /**
     * Updates an existing event in the list of events.
     *
     * This reducer is used when an event is updated. It receives the updated
     * event object as a payload and updates the list of events in the state
     * with the new event.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the updated event object.
     */
    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.eid === payload.eid) return payload;
        return event;
      });
    },
    /**
     * Deletes an event from the list of events and sets the active event to null.
     *
     * This reducer is used when an event is deleted. It receives no payload and
     * deletes the active event from the list of events in the state and sets
     * the active event to null.
     *
     * @param {Object} state The current state of the reducer.
     */
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.eid !== state.activeEvent.eid
        );
        state.activeEvent = null;
      }
    },
    /**
     * Loads all events from the server.
     *
     * This reducer is used when all events are loaded from the server.
     * It receives the list of events as a payload and sets the state
     * with that list. It also sets isLoadingEvents to false to
     * indicate that the events have been loaded.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of events.
     */
    onLoadEvents: (state, { payload = [] }) => {
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
     * Resets the calendar state when the user logs out.
     *
     * This reducer is used when the user logs out. It resets the state
     * of the calendar module to its initial value.
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
