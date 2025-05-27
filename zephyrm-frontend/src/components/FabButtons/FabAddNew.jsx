/**
 * FabAddNew Component
 *
 * This component represents a floating action button (FAB) for adding new events.
 *
 * @module components/FabButtons/FabAddNew
 */

import { useSelector } from "react-redux";
import { addHours } from "date-fns";

import { useCalendarStore } from "../../modules/calendar";
import { useUIStore } from "../../ui/hooks/useUiStore";

/**
 * Floating action button (FAB) for adding new events.
 *
 * @function FabAddNew
 * @returns {JSX.Element} The FAB component.
 */
export const FabAddNew = () => {
  const { openDateModal } = useUIStore();
  const { setActiveEvent } = useCalendarStore();

  const { user } = useSelector((state) => state.auth);

  /**
   * Handles the click event on the add new event FAB.
   * Resets the active event and opens the date modal.
   */
  const handleClickNew = () => {
    setActiveEvent({
      title: "",
      description: "",
      start: new Date(),
      end: addHours(new Date(), 1),
      bgColor: "#fafafa",
      user,
    });

    openDateModal();
  };
  return (
    <button className="btn btn-primary fab" onClick={() => handleClickNew()}>
      <i className="fas fa-plus"></i>
    </button>
  );
};
