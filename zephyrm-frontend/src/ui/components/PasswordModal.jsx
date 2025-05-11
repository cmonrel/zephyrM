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

export const PasswordModal = () => {
  const { isPasswordModalOpen, closePasswordModal } = useUIStore();
  const { activeUser, setActiveUser, startSavingPassword } = useUsersStore();

  const { formState, onInputChange, setFormState } = useForm(initialForm);

  const onCloseModal = () => {
    closePasswordModal();
    setActiveUser(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (formState.password !== formState.password2) {
      return Swal.fire("Error", "Passwords don't match", "error");
    }
    startSavingPassword(activeUser, formState.password);
    onCloseModal();
  };

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
