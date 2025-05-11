import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";

import { addHours, differenceInSeconds } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import DatePicker, { registerLocale } from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/dist/sweetalert2.min.css";

import { UserSelectionModal, AssetSelectionModal, useUIStore } from "..";
import { useCalendarStore } from "../../modules/calendar";
import { useUsersStore } from "../../modules/users/hooks/useUsersStore";
import { useAssetsStore } from "../../modules/assetsModule";

registerLocale("en", enUS);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
  const {
    isDateModalOpen,
    closeDateModal,
    isAssetSelectionModalOpen,
    isUserSelectionModalOPen,
    closeAssetSelectionModal,
    closeUserSelectionModal,
    openAssetSelectionModal,
    openUserSelectionModal,
  } = useUIStore();
  const { activeEvent, startSavingEvent, setActiveEvent } = useCalendarStore();
  const { startLoadingUsers, setActiveUser } = useUsersStore();
  const { startLoadingAssets, setActiveAsset } = useAssetsStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 2),
    asset: null,
    user: null,
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    startLoadingUsers();
    startLoadingAssets();
    if (activeEvent !== null) setFormValues({ ...activeEvent });
  }, [activeEvent]);

  const onChangeInput = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onCloseModal = () => {
    setActiveEvent(null);
    closeDateModal();
  };

  const onDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const handleAssetSelect = (asset) => {
    setActiveAsset(asset);
    setFormValues({ ...formValues, asset });
    closeAssetSelectionModal();
  };

  const handleUserSelect = (user) => {
    setActiveUser(user);
    setFormValues({ ...formValues, user });
    closeUserSelectionModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (difference <= 0 || isNaN(difference)) {
      Swal.fire("Error", "End date must be greater than start date", "error");
      return;
    }

    if (formValues.title.length <= 0) return;
    if (formValues.asset === null) return;
    if (formValues.user === null) return;

    await startSavingEvent(formValues);
    onCloseModal();
    setFormSubmitted(false);
  };

  return (
    <>
      <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={500}
      >
        {activeEvent?.title === "" || activeEvent === null ? (
          <h2> New Event </h2>
        ) : (
          <h2>{activeEvent.title}</h2>
        )}
        <hr />
        <form className="container" onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Start date and hour &nbsp;</label>
            <DatePicker
              selected={formValues.start}
              onChange={(event) => onDateChange(event, "start")}
              className="form-control"
              dateFormat="Pp"
              locale="en"
              timeCaption="Hour"
              showTimeSelect
            />
          </div>

          <div className="form-group mb-2">
            <label>End date and hour &nbsp;</label>
            <DatePicker
              minDate={formValues.start}
              selected={formValues.end}
              onChange={(event) => onDateChange(event, "end")}
              className="form-control"
              dateFormat="Pp"
              locale="en"
              timeCaption="Hour"
              showTimeSelect
            />
          </div>

          <hr />
          <div className="form-group mb-2">
            <label>Title and description</label>
            <input
              type="text"
              className={`form-control ${titleClass}`}
              placeholder="Title of event"
              name="title"
              autoComplete="off"
              value={formValues.title}
              onChange={onChangeInput}
            />
            <small id="emailHelp" className="form-text text-muted">
              Short description
            </small>
          </div>

          <div className="form-group mb-2">
            <textarea
              type="text"
              className="form-control"
              placeholder="Description"
              rows="5"
              name="notes"
              value={formValues.notes}
              onChange={onChangeInput}
            ></textarea>
          </div>

          <div className="form-group mb-2">
            <label>Asset</label>
            <div
              className="selection-field"
              onClick={() => openAssetSelectionModal()}
            >
              {formValues.asset?.title || "Select an asset"}
              <i className="fas fa-chevron-down float-right"></i>
            </div>
          </div>

          <div className="form-group mb-2">
            <label>User</label>
            <div
              className="selection-field"
              onClick={() => openUserSelectionModal()}
            >
              {formValues.user?.name || "Select a user"}
              <i className="fas fa-chevron-down float-right"></i>
            </div>
          </div>

          <button type="submit" className="btn btn-outline-primary btn-block">
            <i className="far fa-save"></i>
            <span> Save </span>
          </button>
        </form>
      </Modal>

      {/* Asset Selection Modal */}
      {isAssetSelectionModalOpen && (
        <AssetSelectionModal onSelect={handleAssetSelect} />
      )}

      {/* User Selection Modal */}
      {isUserSelectionModalOPen && (
        <UserSelectionModal onSelect={handleUserSelect} />
      )}
    </>
  );
};
