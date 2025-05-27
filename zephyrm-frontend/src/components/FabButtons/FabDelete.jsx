/**
 * FabDelete Component
 *
 * This component represents a floating action button (FAB) for deleting events.
 *
 * @module components/FabButtons/FabDelete
 */

import { useCalendarStore } from "../../modules/calendar/hooks/useCalendarStore";

/**
 * Floating action button (FAB) for deleting events.
 *
 * @function FabDelete
 * @returns {JSX.Element} The FAB component.
 */
export const FabDelete = () => {
  const { startDeletingEvent } = useCalendarStore();

  /**
   * Handles the click event on the delete button.
   * Initiates the deletion of the currently active event.
   */

  const handleClickDelete = () => {
    startDeletingEvent();
  };

  return (
    <button
      className="btn btn-danger fab-danger"
      onClick={() => handleClickDelete()}
    >
      <i className="fas fa-trash-alt"></i>
    </button>
  );
};
