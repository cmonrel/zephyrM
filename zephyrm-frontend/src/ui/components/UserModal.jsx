/**
 * User Modal Component
 *
 * This component displays a modal for creating or editing users.
 *
 * @module ui/components/UserModal
 */

import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";

import { useUIStore } from "../hooks/useUiStore";
import { useUsersStore } from "../../modules/users/hooks/useUsersStore";
import { useForm } from "../../hooks/useForm";
import { RoleSelectionModal } from "../";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -49%)",
  },
};

/**
 * This component displays a modal for creating or editing users.
 *
 * @returns {ReactElement}
 */
export const UserModal = () => {
  const {
    isUserModalOpen,
    closeUserModal,
    isRoleSelectionModalOpen,
    openRoleSelectionModal,
    closeRoleSelectionModal,
  } = useUIStore();
  const { activeUser, setActiveUser, startSavingUser } = useUsersStore();

  const { formState, onInputChange, setFormState } = useForm(activeUser);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const nameClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.name.length > 0 ? "" : "is-invalid";
  }, [formState.name, formSubmitted]);

  /**
   * Closes the user modal and resets the active user.
   */
  const onCloseModal = () => {
    closeUserModal();
    setActiveUser(null);
  };

  /**
   * Updates the form state with the selected role and closes the role selection modal.
   *
   * @param {string} role The role selected by the user.
   */
  const onSelect = (role) => {
    setFormState({
      ...formState,
      role,
    });
    closeRoleSelectionModal();
  };

  /**
   * Submits the user form and closes the user modal.
   *
   * First, it prevents the default event behavior, then sets the form
   * submitted state to true. It checks for empty fields and returns if
   * any are empty. If all fields are filled, it calls the
   * `startSavingUser` action to save the user to the server. After
   * saving the user, it calls the `onCloseModal` function to close the
   * user modal, and sets the form submitted state to false.
   *
   * @param {Event} event The form submission event.
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (
      formState.name.length <= 0 ||
      formState.role.length <= 0 ||
      formState.email.length <= 0
    )
      return;

    await startSavingUser(formState);
    onCloseModal();
    setFormSubmitted(false);
  };

  /**
   * Updates the form state when the active user changes.
   */
  useEffect(() => {
    if (activeUser !== null) setFormState({ ...activeUser });
  }, [activeUser]);

  return (
    <>
      <Modal
        isOpen={isUserModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={500}
      >
        {activeUser?.name === "" || activeUser === null ? (
          <h1> New User </h1>
        ) : (
          <h1>{activeUser.name}</h1>
        )}
        <hr />
        <form className="container-modal" onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Name</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="Full name"
              name="name"
              autoComplete="off"
              value={formState.name}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="text"
              className={`form-control ${nameClass}`}
              placeholder="Email"
              name="email"
              autoComplete="off"
              value={formState.email}
              onChange={onInputChange}
            />
          </div>

          {activeUser?.name === "" && (
            <div className="form-group mb-2">
              <label>Password</label>
              <input
                type="text"
                className={`form-control ${nameClass}`}
                placeholder="Password"
                name="password"
                autoComplete="off"
                value={formState.password}
                onChange={onInputChange}
              />
            </div>
          )}

          <div className="form-group mb-2">
            <label>Role</label>
            <div
              className="selection-field"
              onClick={() => openRoleSelectionModal()}
            >
              {formState.role || "Select role"}
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          <button type="submit" className="btn btn-outline-primary btn-block">
            <i className="far fa-save"></i>
            <span> Save</span>
          </button>
        </form>
      </Modal>

      {/* Role Selection Modal */}
      {isRoleSelectionModalOpen && <RoleSelectionModal onSelect={onSelect} />}
    </>
  );
};
