import { useNavigate } from "react-router-dom";
import "./NavBar.css";

import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationStore } from "../../hooks";

export const NavBar = () => {
  const navigate = useNavigate();
  const { user, notifications, startLogout } = useAuthStore();
  const { markNotificationRead, markAllAsRead: markAllAsReadStore } =
    useNotificationStore();

  // Replace with backend
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (noti) => {
    markNotificationRead(noti);
  };

  const markAllAsRead = () => {
    markAllAsReadStore(notifications);
    setShowNotifications(false);
  };

  return (
    <>
      <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <div className="d-flex align-items-center">
          <span
            className="navbar-brand cursor-pointer"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="./src/assets/zephyrLogo.png"
              alt="Logo"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
            &nbsp; {user.name}
          </span>

          <button
            onClick={() => navigate("/assets")}
            className="btn btn-outline-primary me-2"
          >
            <i className="fas fa-box "></i>
            &nbsp; Assets
          </button>

          <button
            onClick={() => navigate("/calendar")}
            className="btn btn-outline-primary me-2"
          >
            <i className="fas fa-calendar-day"></i>
            &nbsp; Calendar
          </button>
        </div>

        <div className="d-flex align-items-center">
          <div className="notification-container me-3 position-relative">
            <button
              className="btn btn-outline-light notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 &&
                (unreadCount > 99 ? (
                  <span className="notification-badge">99+</span>
                ) : (
                  <span className="notification-badge">{unreadCount}</span>
                ))}
            </button>

            {showNotifications && (
              <NotificationDropdown
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                notifications={notifications}
              />
            )}
          </div>
          <button onClick={startLogout} className="btn btn-outline-danger">
            <i className="fas fa-sign-out-alt"></i>
            &nbsp;
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};
