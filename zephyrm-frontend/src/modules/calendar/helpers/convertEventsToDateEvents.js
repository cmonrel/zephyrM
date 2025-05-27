import { parseISO } from "date-fns";

/**
 * Converts an array of events with start and end as strings to
 * an array of events with start and end as Date objects
 * @param {Array} events - An array of events with start and end strings
 * @returns {Array} An array of events with start and end as Date objects
 */
export const convertEventsToDateEvents = (events = []) => {
  return events.map((event) => {
    (event.start = parseISO(event.start)), (event.end = parseISO(event.end));

    return event;
  });
};
