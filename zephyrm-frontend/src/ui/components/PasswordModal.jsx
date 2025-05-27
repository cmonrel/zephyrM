/**
 * Password Change Modal Component
 *
 * This component displays a modal for changing a user's password.
 *
 * @module ui/components/PasswordModal
 */

import { useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";

import { useUIStore } from "../hooks/useUiStore";
import { useUsersStore } from "../../modules/users/hooks/useUsersStore";
import { useForm } from "../../hooks/useForm";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const initialForm = {
  password: "",
  password2: "",
};

/**
 * Displays a modal for changing a user's password.
 *
 * The component displays a form with two input fields for the user to enter the new password and confirm it.
 * When the form is submitted, it calls the `startSavingPassword` function from the `useUsersStore` hook
 * with the active user and the new password as arguments. If the two passwords do not match, it displays an error
 * message.
 *
 * @returns {ReactElement} The JSX element for the modal.
 */
export const PasswordModal = () => {
  const { isPasswordModalOpen, closePasswordModal } = useUIStore();
  const { activeUser, setActiveUser, startSavingPassword } = useUsersStore();

  const { formState, onInputChange, setFormState } = useForm(initialForm);

  /**
   * Closes the password modal and resets the active user.
   */

  const onCloseModal = () => {
    closePasswordModal();
    setActiveUser(null);
  };

  /**
   * Submits the password change form and closes the password modal.
   *
   * First, it prevents the default event behavior, then checks if the two
   * input fields have the same value. If they don't, it displays an error
   * message. If they do, it calls the `startSavingPassword` action to
   * save the new password to the server, and then calls the
   * `onCloseModal` function to close the password modal.
   *
   * @param {Event} event The form submission event.
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    if (formState.password !== formState.password2) {
      return Swal.fire("Error", "Passwords don't match", "error");
    }
    startSavingPassword(activeUser, formState.password);
    onCloseModal();
  };

  /**
   * Updates the form state when the initial form changes.
   */
  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  return (
    <Modal
      isOpen={isPasswordModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={500}
    >
      <h1>{activeUser.name}</h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Password</label>
          <input
            type="text"
            className={"form-control"}
            placeholder="Password"
            name="password"
            autoComplete="off"
            value={formState.password}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2">
          <label>Repeat password</label>
          <input
            type="text"
            className={"form-control"}
            placeholder="Repeat password"
            name="password2"
            autoComplete="off"
            value={formState.password2}
            onChange={onInputChange}
          />
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Save</span>
        </button>
      </form>
    </Modal>
  );
};
