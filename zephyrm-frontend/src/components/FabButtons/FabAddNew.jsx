import { useSelector } from "react-redux";
import { addHours } from "date-fns";

import { useCalendarStore } from "../../modules/calendar";
import { useUIStore } from "../../ui/hooks/useUiStore";

export const FabAddNew = () => {
  const { openDateModal } = useUIStore();
  const { setActiveEvent } = useCalendarStore();

  const { user } = useSelector((state) => state.auth);

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
