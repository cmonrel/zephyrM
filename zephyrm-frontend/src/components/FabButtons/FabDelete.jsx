import { useCalendarStore } from "../../modules/calendar/hooks/useCalendarStore";

export const FabDelete = () => {
  const { startDeletingEvent } = useCalendarStore();

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
