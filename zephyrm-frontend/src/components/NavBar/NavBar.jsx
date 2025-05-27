/**
 * NavBar Component
 *
 * This component represents the navigation bar for the application.
 *
 * @module components/NavBar/NavBar
 */

import { useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationStore } from "../../hooks";

/**
 * The navigation bar component.
 *
 * This component renders the navigation bar for the application. It
 * includes a logo, links to the different pages, a notifications dropdown
 * and a logout button.
 *
 * @returns {ReactElement} A React element representing the navigation bar.
 */
export const NavBar = () => {
  const navigate = useNavigate();
  const { user, notifications, startLogout } = useAuthStore();
  const { markNotificationRead, markAllAsRead: markAllAsReadStore } =
    useNotificationStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Marks a notification as read.
   *
   * @param {object} noti - The notification to be marked as read.
   */
  const markAsRead = (noti) => {
    markNotificationRead(noti);
  };

  /**
   * Marks all notifications as read.
   *
   * This function marks all the user's notifications as read, and then
   * hides the notification dropdown.
   */
  const markAllAsRead = () => {
    markAllAsReadStore(notifications);
    setShowNotifications(false);
  };

  return (
    <>
      <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <div className="d-flex align-items-center">
          <span className="navbar-brand cursor-pointer">
            <img
              src="./src/assets/zephyrLogo.png"
              alt="Logo"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
            &nbsp; {user.name}
          </span>

          {user.role === "admin" && (
            <>
              <button
                onClick={() => navigate("/")}
                className={
                  currentPath === "/"
                    ? "btn btn-primary me-2"
                    : `btn btn-outline-primary me-2`
                }
              >
                <i className="fas fa-users "></i>
                &nbsp; Users
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/assets")}
            className={
              currentPath === "/assets"
                ? "btn btn-primary me-2"
                : `btn btn-outline-primary me-2`
            }
          >
            <i className="fas fa-box "></i>
            &nbsp; Assets
          </button>

          <button
            onClick={() => navigate("/requests")}
            className={
              currentPath === "/requests"
                ? `btn btn-primary me-2`
                : `btn btn-outline-primary me-2`
            }
          >
            <i className="fas fa-box "></i>
            &nbsp; Requests
          </button>

          <button
            onClick={() => navigate("/calendar")}
            className={
              currentPath === "/calendar"
                ? `btn btn-primary me-2`
                : `btn btn-outline-primary me-2`
            }
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
