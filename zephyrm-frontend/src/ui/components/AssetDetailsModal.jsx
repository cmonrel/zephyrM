import Modal from "react-modal";
import { format } from "date-fns";
import "./AssetDetailsModal.css";

import { useUIStore } from "../hooks/useUiStore";

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

export const AssetDetailsModal = ({ asset }) => {
  const { isAssetDetailsModalOpen, closeAssetsDetailsModal } = useUIStore();
  const onCloseModal = () => {
    closeAssetsDetailsModal();
  };

  return (
    <Modal
      isOpen={isAssetDetailsModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={500}
    >
      <h2>{asset.title}</h2>
      <hr />
      <div className="asset-detail">
        <p>
          <strong>Category:</strong> {asset.category}
        </p>
        <p>
          <strong>Description:</strong> {asset.description}
        </p>
        <p>
          <strong>Acquisition Date:</strong>{" "}
          {format(new Date(asset.acquisitionDate), "PPP")}
        </p>
        <p>
          <strong>Location:</strong> {asset.location || "N/A"}
        </p>
        <p>
          <strong>State:</strong> {asset.state}
        </p>
        <p>
          <strong>User Assigned:</strong> {asset.user?.name || "Unassigned"}
        </p>

        <div>
          <strong>Documents:</strong>
          {asset?.documents && asset?.documents.length > 0 ? (
            <ul>
              {asset?.documents.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          ) : (
            <p>No documents attached.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
