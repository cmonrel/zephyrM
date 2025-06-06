/**
 * Component that renders a single calendar event
 *
 * @param {Object} event The event to be rendered
 * @prop {string} event.title The title of the event
 * @prop {Object} event.user The user who created the event
 * @prop {string} event.user.name The name of the user who created the event
 *
 * @returns {JSX.Element} The rendered event component
 */
export const CalendarEvent = ({ event }) => {
  const { title, user } = event;

  return (
    <>
      <strong>{title}</strong>
      <span> - {user.name}</span>
    </>
  );
};
