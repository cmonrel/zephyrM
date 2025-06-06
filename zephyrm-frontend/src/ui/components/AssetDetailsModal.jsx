/**
 * Assets Details Modal Component
 *
 * This component displays the details of an asset inside a modal.
 *
 * @module ui/components/AssetDetailsModal
 */

import Modal from "react-modal";
import { format } from "date-fns";
import "./AssetDetailsModal.css";

import { useUIStore } from "../hooks/useUiStore";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNotificationStore } from "../../hooks";
import { useRequestsStore } from "../../modules/requests/hooks/useRequestsStore";
import { useAssetsStore } from "../../modules/assetsModule";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "90%",
    maxWidth: "500px",
    padding: "20px",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  },
};

/**
 * Displays the details of an asset in a modal.
 *
 * @param {Object} asset The asset whose details are to be displayed.
 *
 * @returns {JSX.Element} The rendered modal.
 */
export const AssetDetailsModal = ({ asset }) => {
  const { isAssetDetailsModalOpen, closeAssetsDetailsModal } = useUIStore();
  const { user } = useAuthStore();
  const { startSendingNotificationRequest } = useNotificationStore();
  const { startSavingRequest } = useRequestsStore();
  const { startRemovingNFCFromAsset } = useAssetsStore();

  const [motivation, setMotivation] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [renderAsset, setRenderAsset] = useState(asset);

  /**
   * Returns the color based on the asset state.
   *
   * This function takes an asset state as a string and returns a color string
   * based on the state. The colors are defined as follows:
   *
   * - `Free`: #4caf50
   * - `On loan`: #fbc02d
   * - `Under maintenance`: #03a9f4
   * - `Broken`: #f44336
   * - Default: #757575
   *
   * @param {string} state The asset state.
   * @returns {string} The color string based on the state.
   */
  const getStateColor = (state) => {
    switch (state) {
      case "Free":
        return "#4caf50";
      case "On loan":
        return "#fbc02d";
      case "Under maintenance":
        return "#03a9f4";
      case "Broken":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  /**
   * Closes the asset details modal.
   */
  const onCloseModal = () => {
    closeAssetsDetailsModal();
  };

  /**
   * Sends a request for the asset to the server.
   *
   * Checks if the asset is available and sets the sent state to true.
   * Then, it sends a notification to the server and creates a new request
   * with the asset's title, the current user's ID, and the asset ID.
   * If the request is successful, it does nothing. If an error occurs, it
   * displays an error message using Swal.fire and sets the sent state to
   * false.
   */
  const handleSendRequest = async () => {
    if (asset.state !== "Free") return;
    setIsSent(true);

    try {
      await startSendingNotificationRequest(asset);
      await startSavingRequest({
        title: `Request for ${asset.title} (${asset.category})`,
        motivation: motivation,
        user: user.uid,
        asset: asset.aid,
      });
    } catch (error) {
      Swal.fire("Error sending request", error.response.data.msg, "error");
      setIsSent(false);
    }
  };

  /**
   * Clears the NFC tag of the asset.
   *
   * This function is called when the user wants to clear the NFC tag of the
   * asset. It creates an updated asset with the NFC tag set to null, then
   * calls the `startSavingAsset` action to save the updated asset to the
   * server and sets the `renderAsset` state to the updated asset.
   */
  const clearNFC = async () => {
    const updatedAsset = { ...asset, nfcTag: "" };

    startRemovingNFCFromAsset(updatedAsset);
    setRenderAsset(updatedAsset);
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
      <h2>{renderAsset.title}</h2>
      <hr />
      <div className="renderAsset-detail">
        <div className="nfc-tag">
          <p>
            <strong>NFC ID </strong> {renderAsset.nfcTag}
          </p>
          {renderAsset.nfcTag && user.role === "admin" && (
            <button className="btn btn-danger" onClick={() => clearNFC()}>
              <i className="fas fa-remove"></i>
            </button>
          )}
        </div>
        <p>
          <strong>Category:</strong> {renderAsset.category}
        </p>
        <p>
          <strong>Description:</strong> {renderAsset.description}
        </p>
        <p>
          <strong>Acquisition Date:</strong>{" "}
          {format(new Date(renderAsset.acquisitionDate), "PPP")}
        </p>
        <p>
          <strong>Location:</strong> {renderAsset.location || "N/A"}
        </p>
        <p>
          <strong>State: </strong>
          <span style={{ color: getStateColor(renderAsset.state) }}>
            {renderAsset.state}
          </span>
        </p>
        <p>
          <strong>User Assigned:</strong>{" "}
          {renderAsset.user?.name || "Unassigned"}
        </p>
      </div>
      {user.role === "worker" && !isSent && renderAsset.state === "Free" && (
        <div className="container-request mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Why do you need this renderAsset?"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
          />

          <button className="btn btn-primary" onClick={handleSendRequest}>
            <i className="fas fa-envelope"></i>
            &nbsp; Send Request
          </button>
        </div>
      )}
    </Modal>
  );
};
