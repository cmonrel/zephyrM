import { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useAuthStore } from "../../../auth/hooks/useAuthStore";
import { CalendarEvent, getMessages, localizer, useCalendarStore } from "..";
import { CalendarModal } from "../../../ui";
import { useUIStore } from "../../../ui/hooks/useUiStore";
import { FabAddNew, FabDelete } from "../../../components";

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { isDateModalOpen, openDateModal } = useUIStore();
  const { events, hasEventSelected, setActiveEvent, startLoadingEvents } =
    useCalendarStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );
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

  const onDoubleClick = () => {
    openDateModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onSelectEmpty = () => {
    setActiveEvent(null);
  };

  const onViewChange = (event) => {
    setLastView(event);
    localStorage.setItem("lastView", event);
    setActiveEvent(null);
  };

  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <Calendar
        localizer={localizer}
        events={displayedEvents}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessages()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        selectable
        onSelectSlot={onSelectEmpty}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
      />

      {hasEventSelected && !isDateModalOpen && <FabDelete />}
      <FabAddNew />
      <CalendarModal />
    </>
  );
};
