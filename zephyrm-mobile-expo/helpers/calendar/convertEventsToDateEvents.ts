import { parseISO } from "date-fns";
import { EventDateString, EventInter } from "../../interfaces";

export const convertEventsToDateEvents = (
  events: EventDateString[] = []
): EventInter[] => {
  return events.map((event) => {
    return {
      ...event,
      start: parseISO(event.start),
      end: parseISO(event.end),
    };
  });
};
