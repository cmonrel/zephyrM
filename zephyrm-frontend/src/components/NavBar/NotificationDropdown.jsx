import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useNotificationStore } from "../../hooks";

export const NotificationDropdown = ({ markAsRead, markAllAsRead }) => {
  const { notifications } = useAuthStore();
  const { startDeletingNotification } = useNotificationStore();

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
                {notification.event.start
                  ? new Date(notification.event.start).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
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
