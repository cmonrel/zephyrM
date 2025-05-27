/**
 * Date FNS Localizer for React Big Calendar
 *
 * This module exports a configured dateFnsLocalizer instance for use with React Big Calendar.
 *
 * @module modules/calendar/helpers/calendarLocalizer
 */

import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
