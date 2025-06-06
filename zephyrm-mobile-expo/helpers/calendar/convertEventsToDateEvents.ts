import { parseISO } from "date-fns";
import { MarkedDates } from "react-native-calendars/src/types";

import { EventDateString, EventInter } from "../../interfaces";

/**
 * Converts an array of events from the database to an array of events with Date
 * objects for start and end.
 *
 * @param events - The array of events from the database.
 *
 * @returns An array of events with Date objects for start and end.
 */
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

/**
 * Converts an array of events to an object where the keys are the dates in
 * ISO format and the values are objects with a dots key. The dots key is an
 * array of objects with a key and a color. The key is the eid of the event and
 * the color is either the primary color if the event belongs to the current user
 * or a gray color if not.
 *
 * @param events - The array of events to convert.
 * @param uid - The uid of the current user.
 *
 * @returns An object with the events grouped by date.
 */
export const convertEventsToMarkedDates = (
  events: EventInter[] = [],
  uid: string
): MarkedDates => {
  const result: Record<string, any> = {};

  events.forEach((event) => {
    const dateKey = event.start.toISOString().split("T")[0];
    const isCurrentUser = event.user?.uid === uid;

    if (!result[dateKey]) {
      result[dateKey] = {
        dots: [],
      };
    }

    result[dateKey].dots.push({
      key: event.eid,
      color: isCurrentUser ? "#0d6efd" : "#adb5bd",
    });
  });

  return result;
};
