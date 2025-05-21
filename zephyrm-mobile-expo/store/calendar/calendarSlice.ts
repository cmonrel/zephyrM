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

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    onSetActiveEvent: (state, { payload }: PayloadAction<EventInter>) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: (state, { payload }: PayloadAction<EventInter>) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, { payload }: PayloadAction<EventInter>) => {
      state.events = state.events.map((event) => {
        if (event.eid === payload.eid) return payload;
        return event;
      });
    },
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.eid !== state.activeEvent.eid
        );
        state.activeEvent = null;
      }
    },
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
