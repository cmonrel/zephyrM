/**
 * Asset Modal Component
 *
 * This component displays a modal for creating or editing assets.
 *
 * @module ui/components/AssetModal
 */

import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";

import { useUIStore } from "../hooks/useUiStore";
import { useForm } from "../../hooks/useForm";
import { useAssetsStore } from "../../modules/assetsModule/hooks/useAssetsStore";
import { StateSelectionModal } from "../";

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

/**
 * Asset Modal Component
 *
 * This component renders a modal for creating or editing assets. It provides
 * a form to input asset details such as title, NFC ID, category, location,
 * description, acquisition date, and state. The modal can be closed or submitted,
 * and it integrates a state selection modal for updating the asset's state.
 *
 * @returns {ReactElement} The rendered modal component.
 */
export const AssetModal = () => {
  const {
    isAssetModalOpen,
    isStateSelectionModalOpen,
    closeAssetModal,
    closeStateSelectionModal,
    openStateSelectionModal,
  } = useUIStore();
  const { activeAsset, setActiveAsset, startSavingAsset } = useAssetsStore();

  const { formState, onInputChange, setFormState } = useForm(activeAsset);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const acquisitionDate = formState.acquisitionDate
    ? new Date(formState.acquisitionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

  const nameClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.title.length > 0 ? "" : "is-invalid";
  }, [formState.title, formSubmitted]);

  /**
   * Updates the form state when the component mounts.
   */
  useEffect(() => {
    if (activeAsset !== null) setFormState({ ...activeAsset });
  }, []);

  /**
   * Closes the asset modal and resets the active asset.
   */
  const onCloseModal = () => {
    closeAssetModal();
    setActiveAsset(null);
  };

  /**
   * Updates the form state with the selected state and closes the state selection modal.
   *
   * @param {string} state The selected state.
   */
  const onSelect = (state) => {
    setFormState({
      ...formState,
      state,
    });
    closeStateSelectionModal();
  };

  /**
   * Submits the asset form and closes the asset modal.
   *
   * Prevents the default event behavior, then sets the form submitted state to true.
   * It calls the `startSavingAsset` action to save the asset to the server, and then
   * calls the `onCloseModal` function to close the asset modal, and sets the form
   * submitted state to false.
   *
   * @param {Event} event The form submission event.
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    startSavingAsset(formState);
    onCloseModal();
    setFormSubmitted(false);
  };

  return (
    <>
      <Modal
        isOpen={isAssetModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={500}
      >
        {activeAsset?.title === "" || !activeAsset ? (
          <h2 className="selection-modal-title"> New Asset </h2>
        ) : (
          <h2 className="selection-modal-title">{activeAsset.title}</h2>
        )}
        <hr />
        <form className="container-modal" onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Title</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="Title"
              name="title"
              autoComplete="off"
              value={formState.title}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>NFC ID</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="NFC ID"
              name="NFCTag"
              autoComplete="off"
              value={formState.NFCTag}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Category</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="Category"
              name="category"
              autoComplete="off"
              value={formState.category}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Location</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="Location"
              name="location"
              autoComplete="off"
              value={formState.location}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Description</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="Description"
              name="description"
              autoComplete="off"
              value={formState.description}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Acquisition Date</label>
            <p>{acquisitionDate}</p>
          </div>

          <div className="form-group mb-2">
            <label>State</label>
            <div
              className="selection-field"
              onClick={() => openStateSelectionModal()}
            >
              {formState.state || "Select state"}
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          <div className="form-group mb-2">
            <button type="submit" className="btn btn-outline-primary">
              <i className="far fa-save"></i>
              <span> Save</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* State Selection Modal */}
      {isStateSelectionModalOpen && <StateSelectionModal onSelect={onSelect} />}
    </>
  );
};
