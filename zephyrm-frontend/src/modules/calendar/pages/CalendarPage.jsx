/**
 * Calendar Page Component
 *
 * This component represents the main page for see events and manage them if admins.
 *
 * @module modules/calendar/pages/CalendarPage
 */

import { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarPage.css";

import { useAuthStore } from "../../../auth/hooks/useAuthStore";
import { CalendarEvent, getMessages, localizer, useCalendarStore } from "..";
import { CalendarModal } from "../../../ui";
import { useUIStore } from "../../../ui/hooks/useUiStore";
import { FabAddNew, FabDelete } from "../../../components";

/**
 * Calendar page component.
 *
 * This component renders a React Big Calendar component with a list of events, and with the
 * ability to select a single event and open a modal to edit it. If you are an admin, It also renders
 * a FabDelete button to delete an event and a FabAddNew button to create a new event. Finally,
 * it renders the calendar component where you can see the events .
 *
 * @returns {JSX.Element} The calendar page component.
 */
export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { isDateModalOpen, openDateModal } = useUIStore();
  const { events, hasEventSelected, setActiveEvent, startLoadingEvents } =
    useCalendarStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );
  /**
   * Returns the style of an event based on if it is the current user's event.
   *
   * @param {Object} event The event object.
   * @returns {Object} An object with the style property.
   */
  const eventStyleGetter = (event) => {
    const isMyEvent =
      user.uid === event.user._id || user.uid === event.user.uid;

    const style = {
      backgroundColor: isMyEvent ? "#347CF7" : "#465660",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    };

    return {
      style,
    };
  };

  const displayedEvents =
    lastView === "agenda"
      ? events.filter((event) => event.user.uid === user.uid)
      : events;

  /**
   * Handles double click on an event.
   *
   * When an event is double clicked, this function opens the date modal
   * to select a date for the event.
   */
  const onDoubleClick = () => {
    openDateModal();
  };

  /**
   * Handles selecting an event.
   *
   * When an event is selected, this function sets the active event to the
   * selected event.
   *
   * @param {Object} event The selected event.
   */
  const onSelect = (event) => {
    setActiveEvent(event);
  };

  /**
   * Handles selecting an empty space on the calendar.
   *
   * When an empty space on the calendar is selected, this function sets the
   * active event to null.
   */
  const onSelectEmpty = () => {
    setActiveEvent(null);
  };

  /**
   * Handles a change in the calendar view.
   *
   * When the calendar view is changed, this function updates the last
   * viewed date in local storage and sets the active event to null.
   * @param {string} event The new calendar view.
   */
  const onViewChange = (event) => {
    setLastView(event);
    localStorage.setItem("lastView", event);
    setActiveEvent(null);
  };

  /**
   * Loads the events when the component mounts.
   */
  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={displayedEvents}
          defaultView={lastView}
          startAccessor="start"
          endAccessor="end"
          className="calendar"
          messages={getMessages()}
          eventPropGetter={eventStyleGetter}
          components={{ event: CalendarEvent }}
          selectable
          onSelectSlot={onSelectEmpty}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelect}
          onView={onViewChange}
        />
      </div>

      {hasEventSelected && !isDateModalOpen && user.role === "admin" && (
        <FabDelete />
      )}
      {user.role === "admin" && <FabAddNew />}
      <CalendarModal role={user.role} />
    </>
  );
};
