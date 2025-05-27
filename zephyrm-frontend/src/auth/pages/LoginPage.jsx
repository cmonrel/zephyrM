/**
 * Login Page Component
 *
 * This component handles user authentication and login functionality.
 *
 * @module auth/pages/LoginPage
 */

import { useEffect } from "react";
import Swal from "sweetalert2";

import "./LoginPage.css";
import { useForm } from "../../hooks";
import { useAuthStore } from "../hooks/useAuthStore";

const loginFormField = {
  loginEmail: "",
  loginPassword: "",
};

/**
 * Component for the login page.
 *
 * @function LoginPage
 * @returns {ReactElement} The JSX element for the login page.
 */
export const LoginPage = () => {
  const { errorMessage, startLogin } = useAuthStore();
  const {
    loginEmail,
    loginPassword,
    onInputChange: onLoginInputChange,
  } = useForm(loginFormField);

  /**
   * Prevents the default form submission behavior and initiates the login
   * process using the provided email and password from the form state.
   *
   * @param {Event} e - The event object associated with the form submission.
   */

  const loginSubmit = (e) => {
    e.preventDefault();

    startLogin({ email: loginEmail, password: loginPassword });
  };

  /**
   * Displays an error message using SweetAlert2 if the errorMessage prop is provided.
   *
   * @param {string} errorMessage - The error message to be displayed.
   */
  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire("Authentication Error", errorMessage, "error");
    }
  }, [errorMessage]);

  return (
    <div className="container login-container">
      <div className="login-form-1">
        <h3>Welcome!</h3>
        <form onSubmit={loginSubmit}>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              name="loginEmail"
              value={loginEmail}
              onChange={onLoginInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="loginPassword"
              value={loginPassword}
              onChange={onLoginInputChange}
            />
          </div>
          <div className="form-group mb-2 btnDiv">
            <input type="submit" className="btnSubmit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};
