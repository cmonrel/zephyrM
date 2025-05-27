/**
 * Calendar Modal Component
 *
 * This component displays a modal for adding, editing, and seeing events to the calendar.
 *
 * @module ui/components/CalendarModal
 */

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
    transform: "translate(-50%, -49%)",
  },
};

Modal.setAppElement("#root");

/**
 * Displays a modal for adding, editing, and seeing events to the calendar.
 *
 * Depending on the role of the user, it will display a different modal.
 *
 * @param {string} role The role of the user.
 * @returns {ReactElement}
 */
export const CalendarModal = ({ role }) => {
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
  const { startLoadingUsers } = useUsersStore();
  const { startLoadingAssets } = useAssetsStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: addHours(new Date(), 2),
    asset: null,
    user: null,
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSubmitted]);

  /**
   * Updates the form values when the active event changes. Also loads users and assets.
   */
  useEffect(() => {
    startLoadingUsers();
    startLoadingAssets();
    if (activeEvent !== null) setFormValues({ ...activeEvent });
  }, [activeEvent]);

  /**
   * Updates the form values when an input element changes.
   *
   * Gets the target element from the event object and updates the form values
   * with the value of the input element that changed, using the name of the
   * element as the key.
   *
   * @param {Object} event - The event object associated with the input element change.
   * @param {Object} event.target - The input element that changed.
   * @param {string} event.target.name - The name of the input element that changed.
   * @param {string} event.target.value - The new value of the input element that changed.
   */
  const onChangeInput = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  /**
   * Closes the date modal and resets the active event.
   */
  const onCloseModal = () => {
    setActiveEvent(null);
    closeDateModal();
  };

  /**
   * Updates the form values when a date picker changes.
   *
   * Updates the form values with the value of the date picker that changed, using the name of the
   * element as the key.
   *
   * @param {Object} event - The event object associated with the date picker change.
   * @param {string} changing - The name of the date picker that changed.
   */
  const onDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  /**
   * Updates the form values when an asset is selected and closes the asset selection modal.
   *
   * @param {Object} asset - The selected asset.
   */
  const handleAssetSelect = (asset) => {
    setFormValues({ ...formValues, asset });
    closeAssetSelectionModal();
  };

  /**
   * Updates the form values when a user is selected and closes the user selection modal.
   *
   * @param {Object} user - The selected user.
   */
  const handleUserSelect = (user) => {
    setFormValues({ ...formValues, user });
    closeUserSelectionModal();
  };

  /**
   * Submits the event form and closes the date modal.
   *
   * First, it prevents the default event behavior, then sets the form
   * submitted state to true. It checks if the end date is greater than the
   * start date and that the title, asset, and user fields are not empty. If any
   * of these conditions are not met, it displays an error message and returns.
   * If all conditions are met, it calls the `startSavingEvent` action to save
   * the event to the server, and then calls the `onCloseModal` function to
   * close the date modal, and sets the form submitted state to false.
   *
   * @param {Event} event The form submission event.
   */
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
      {role === "admin" ? (
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
          <form className="container-modal" onSubmit={onSubmit}>
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
                rows="3"
                name="description"
                value={formValues.description}
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
      ) : (
        <Modal
          isOpen={isDateModalOpen}
          onRequestClose={onCloseModal}
          style={customStyles}
          className="modal"
          overlayClassName="modal-fondo"
          closeTimeoutMS={500}
        >
          <h2>{activeEvent?.title}</h2>
          <hr />

          <div className="form-group mb-2">
            <label>Start date and hour &nbsp;</label>
            <p>{activeEvent?.start.toLocaleDateString()}</p>
          </div>

          <div className="form-group mb-2">
            <label>End date and hour &nbsp;</label>
            <p>{activeEvent?.end.toLocaleDateString()}</p>
          </div>

          <hr />
          <div className="form-group mb-2">
            <small id="emailHelp" className="form-text text-muted">
              {activeEvent?.title}
            </small>
          </div>

          <div className="form-group mb-2">
            <p>{activeEvent?.description}</p>
          </div>

          <div className="form-group mb-2">
            <label>Asset</label>
            <p>{activeEvent?.asset?.title}</p>
          </div>

          <div className="form-group mb-2">
            <label>User</label>
            <p>{activeEvent?.user?.name}</p>
          </div>
        </Modal>
      )}

      {/* Asset Selection Modal */}
      {isAssetSelectionModalOpen && role === "admin" && (
        <AssetSelectionModal onSelect={handleAssetSelect} />
      )}

      {/* User Selection Modal */}
      {isUserSelectionModalOPen && role === "admin" && (
        <UserSelectionModal onSelect={handleUserSelect} />
      )}
    </>
  );
};
