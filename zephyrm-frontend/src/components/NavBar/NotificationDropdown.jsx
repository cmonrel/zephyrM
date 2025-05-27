/**
 * NotificationDropdown Component
 *
 * This component represents a dropdown for displaying notifications.
 *
 * @module components/NavBar/NotificationDropdown
 */

import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useNotificationStore } from "../../hooks";

/**
 * NotificationDropdown
 *
 * This component represents a dropdown for displaying notifications. It
 * shows a list of all notifications, and allows the user to mark them as
 * read or delete them.
 *
 * @param {function} markAsRead - A function for marking a notification as
 *   read.
 * @param {function} markAllAsRead - A function for marking all notifications
 *   as read.
 * @returns {ReactElement} - A React element representing the
 *   NotificationDropdown component.
 */
export const NotificationDropdown = ({ markAsRead, markAllAsRead }) => {
  const { notifications } = useAuthStore();
  const { startDeletingNotification } = useNotificationStore();

  /**
   * Handles the button click event to delete a notification.
   *
   * This function triggers the deletion of a notification by its ID.
   *
   * @param {string} nid - The ID of the notification to be deleted.
   */

  const handleButtonClick = (nid) => {
    startDeletingNotification(nid);
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h6>Notifications</h6>
        <button className="btn btn-sm btn-link" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.nid}
              className={`notification-item ${
                !notification.read ? "unread" : ""
              }`}
              onClick={() => markAsRead(notification)}
            >
              <div className="notification-message">{notification.title}</div>
              <div className="notification-description">
                {notification.description}
              </div>
              <div className="notification-date">
                {notification.eventDate
                  ? new Date(notification.eventDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )
                  : "Not specified"}
                <button
                  onClick={() => handleButtonClick(notification.nid)}
                  className="btn btn-outline-danger"
                >
                  <i className="far fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="notification-empty">No notifications</div>
        )}
      </div>
    </div>
  );
};
