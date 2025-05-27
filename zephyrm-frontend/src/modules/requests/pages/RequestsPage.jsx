/**
 * Requests Admin Page Component
 *
 * This component represents the main page for admins to see their requests.
 *
 * @module modules/requests/pages/RequestsPage
 */

import { useEffect } from "react";
import "./RequestsPage.css";

import { useNotificationStore } from "../../../hooks";
import { useRequestsStore } from "../hooks/useRequestsStore";
import { useUsersStore } from "../../users/hooks/useUsersStore";

/**
 * Component to display all the requests made by users to the admins.
 *
 * Retrieves all the requests from the server and displays them in a list
 * with the details of the request and the user who made the request.
 * The status of the request is also displayed in a color-coded way.
 * The component also provides buttons to accept or deny the request
 * and updates the request status accordingly.
 *
 * @returns {JSX.Element} The component as a JSX element.
 */
export const RequestsAdminPage = () => {
  const {
    requests,
    isLoadingRequests,
    startMarkStatusRequest,
    startLoadingRequests,
  } = useRequestsStore();
  const { users } = useUsersStore();
  const { startSendingRequestResponseNotification } = useNotificationStore();

  const adminRequests = requests.filter(
    (request) => request.status === "Pending"
  );

  /**
   * Returns the color based on the request status.
   *
   * This function takes a request status as a string and returns a color string
   * based on the status. The colors are defined as follows:
   *
   * - `Approved`: #4caf50
   * - `Denied`: #f44336
   * - `Pending`: #fbc02d
   * - Default: #9e9e9e
   *
   * @param {string} status The request status.
   * @returns {string} The color string based on the status.
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#4caf50";
      case "Denied":
        return "#f44336";
      case "Pending":
        return "#fbc02d";
      default:
        return "#9e9e9e";
    }
  };

  /**
   * Handles the accept button click event.
   *
   * Updates the request status to `Approved` and sends a notification
   * to the user who made the request to let them know that it was approved.
   *
   * @param {Object} request - The request object to be updated.
   */
  const handleAccept = async (request) => {
    await startMarkStatusRequest(
      request.rid,
      "Approved",
      request.asset,
      request.user
    );
    startSendingRequestResponseNotification("Approved", request);
  };

  /**
   * Handles the deny button click event.
   *
   * Updates the request status to `Denied` and sends a notification
   * to the user who made the request to let them know that it was denied.
   *
   * @param {Object} request - The request object to be updated.
   */
  const handleDeny = (request) => {
    startMarkStatusRequest(request.rid, "Denied", request.asset);
    startSendingRequestResponseNotification("Denied", request);
  };

  /**
   * useEffect hook to load the requests when the component mounts.
   */
  useEffect(() => {
    startLoadingRequests();
  }, [requests]);

  return (
    <div className="requests-container">
      {isLoadingRequests ? (
        <div className="loading">Loading...</div>
      ) : adminRequests.length === 0 ? (
        <div className="no-requests">You have no requests yet.</div>
      ) : (
        adminRequests.map((item) => {
          const user = users.find((u) => u.uid === item.user);
          const statusColor = getStatusColor(item.status);

          return (
            <div key={item.rid} className="request-card">
              <h3 className="request-title">
                {item.title} - <span>{user?.name}</span>
              </h3>
              <div className="request-status" style={{ color: statusColor }}>
                {item.status}
              </div>
              <div className="request-date">
                Requested on: {new Date(item.creationDate).toLocaleDateString()}
              </div>
              {item.motivation && (
                <div className="request-reason">Reason: {item.motivation}</div>
              )}

              <div className="request-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(item)}
                >
                  <i className="fas fa-check"></i>
                  <span>&nbsp; Accept</span>
                </button>
                <button className="deny-btn" onClick={() => handleDeny(item)}>
                  <i className="fas fa-times"></i>
                  <span>&nbsp; Deny</span>
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
