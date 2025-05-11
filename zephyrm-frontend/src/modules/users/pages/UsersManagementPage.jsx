import React, { useEffect } from "react";
import "./UserManagementPage.css";

import { UserModal, PasswordModal, useUIStore } from "../../../ui";
import { useUsersStore } from "../hooks/useUsersStore";
import { FabAddNewUser } from "../../../components/FabButtons/FabAddNewUser";

export const UserManagementPage = () => {
  const {
    isUserModalOpen,
    isPasswordModalOpen,
    openUserModal,
    openPasswordModal,
  } = useUIStore();
  const { users, startLoadingUsers, startDeletingUser, setActiveUser } =
    useUsersStore();

  // Open modal and set selected user
  const handleEdit = (user) => {
    setActiveUser(user);
    openUserModal();
  };

  // Delete user
  const handleDelete = (user) => {
    startDeletingUser(user);
  };

  const handleRecoverPassword = (user) => {
    setActiveUser(user);
    openPasswordModal();
  };

  useEffect(() => {
    startLoadingUsers();
  }, [users]);

  return (
    <div className="user-management-container">
      <h2 className="page-title">Users Management</h2>

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
            {users.map((user, index) => (
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
                    className="btn delete-btn"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn new-password-btn"
                    onClick={() => handleRecoverPassword(user)}
                  >
                    New Password
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
