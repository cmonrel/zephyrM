/**
 * User Management Page Component
 *
 * This component represents the main page for admins to manage users.
 *
 * @module modules/users/pages/UserManagementPage
 */

import { useEffect, useState } from "react";
import "./UserManagementPage.css";

import { UserModal, PasswordModal, useUIStore } from "../../../ui";
import { useUsersStore } from "../hooks/useUsersStore";
import { FabAddNewUser } from "../../../components/FabButtons/FabAddNewUser";
import { useCalendarStore } from "../../calendar";
import { SearchBar } from "../../../components";

/**
 * This component displays a list of all users, with the ability to search, edit, delete,
 * and recover passwords. It also displays the user modal for editing and creating users,
 * and the password modal for changing passwords. The component is connected to the users
 * store and the calendar store.
 *
 * @returns {JSX.Element} The component.
 */
export const UserManagementPage = () => {
  const {
    isUserModalOpen,
    isPasswordModalOpen,
    openUserModal,
    openPasswordModal,
  } = useUIStore();
  const { users, startLoadingUsers, startDeletingUser, setActiveUser } =
    useUsersStore();
  const { startLoadingEvents } = useCalendarStore();

  const [filteredUsers, setFilteredUsers] = useState(users);

  /**
   * Handles the search for users by name, email, or role.
   *
   * This function takes a search term as a string and filters the list of users
   * based on the search term. It does a case insensitive search on the following
   * properties of the user object:
   *
   * - `name`
   * - `email`
   * - `role`
   *
   * If the search term is found in any of these properties, the user is
   * included in the filtered list. The filtered list is then set as the
   * new state of the component.
   *
   * @param {string} searchTerm The search term to filter the users by.
   */
  const handleUserSearch = (searchTerm) => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(result);
  };

  /**
   * Handles the edit event for a user.
   *
   * This function takes a user object as an argument and sets the
   * active user to the given user. It then opens the user modal
   * for editing the user.
   *
   * @param {Object} user The user object to edit.
   */
  const handleEdit = (user) => {
    setActiveUser(user);
    openUserModal();
  };

  /**
   * Deletes a user by its ID.
   *
   * Calls the `startDeletingUser` method to delete the user from the server.
   *
   * @param {Object} user The user object to delete.
   */
  const handleDelete = (user) => {
    startDeletingUser(user);
  };

  /**
   * Handles the recover password event for a user.
   *
   * This function takes a user object as an argument and sets the
   * active user to the given user. It then opens the password modal
   * for the user to recover their password.
   *
   * @param {Object} user The user object to recover the password for.
   */
  const handleRecoverPassword = (user) => {
    setActiveUser(user);
    openPasswordModal();
  };

  /**
   * Starts loading users and events when the component mounts.
   */
  useEffect(() => {
    startLoadingUsers();
    startLoadingEvents();
  }, []);

  /**
   * Updates the filtered users when the list of users changes.
   */
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <div className="user-management-container">
      <h2 className="page-title">Users Management</h2>

      <SearchBar onSearch={handleUserSearch} placeholder="Search Users..." />

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.uid}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="actions">
                  <button
                    className="btn edit-btn"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn new-password-btn"
                    onClick={() => handleRecoverPassword(user)}
                  >
                    Password
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {isUserModalOpen && <UserModal />}

      {/* New Password Modal */}
      {isPasswordModalOpen && <PasswordModal />}

      <FabAddNewUser />
    </div>
  );
};
