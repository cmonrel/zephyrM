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

  useEffect(() => {
    if (activeAsset !== null) setFormState({ ...activeAsset });
  }, []);

  const onCloseModal = () => {
    closeAssetModal();
    setActiveAsset(null);
  };

  const onSelect = (state) => {
    setFormState({
      ...formState,
      state,
    });
    closeStateSelectionModal();
  };

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
