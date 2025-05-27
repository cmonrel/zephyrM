/**
 * Requests Workers Page Component
 *
 * This component represents the main page for workers to see their requests.
 *
 * @module modules/requests/pages/RequestsWorkerPage
 */

import { useEffect } from "react";
import "./RequestsWorkerPage.css";

import { useAuthStore } from "../../../auth";
import { useRequestsStore } from "../hooks/useRequestsStore";

/**
 * It lists all the requests that the worker has made, along with the status of each request.
 * If the worker has no requests yet, it displays a message to that effect.
 * If the worker has requests, it displays a list of the requests, along with a delete button to
 * delete the request. If the request is deleted, the request is removed from the list.
 *
 * @returns {JSX.Element} The component as a JSX element.
 */
export const RequestsWorkerPage = () => {
  const { user } = useAuthStore();
  const {
    requests,
    startLoadingRequests,
    isLoadingRequests,
    startDeletingRequest,
  } = useRequestsStore();

  const userRequests = requests.filter((request) => request.user === user.uid);

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
   * Deletes a request by its request ID.
   *
   * This function calls the `startDeletingRequest` method, which makes a
   * DELETE request to remove the request with the specified ID from the server.
   * It updates the application's state accordingly and handles any potential errors.
   *
   * @param {string} rid - The ID of the request to be deleted.
   */

  const handleDelete = (rid) => {
    startDeletingRequest(rid);
  };

  /**
   * Loads the requests when the component mounts.
   */
  useEffect(() => {
    if (requests.length !== 0) startLoadingRequests();
  }, [requests]);

  return (
    <div className="user-requests-container">
      {isLoadingRequests ? (
        <div className="loading">Loading...</div>
      ) : userRequests.length === 0 ? (
        <div className="no-requests">You have no requests yet.</div>
      ) : (
        userRequests.map((item) => (
          <div className="request-card" key={item.rid}>
            <h3 className="request-title">{item.title}</h3>
            <div
              className="request-status"
              style={{ color: getStatusColor(item.status) }}
            >
              {item.status}
            </div>
            <div className="request-date">
              Requested on: {new Date(item.creationDate).toLocaleDateString()}
            </div>
            {item.motivation && (
              <div className="request-reason">Reason: {item.motivation}</div>
            )}
            <button
              className="request-delete-btn"
              onClick={() => handleDelete(item.rid)}
              title="Delete"
            >
              <i className="fas fa-trash"></i>
              <span>&nbsp; Delete</span>
            </button>
          </div>
        ))
      )}
    </div>
  );
};
