import React, { useEffect } from "react";
import Swal from "sweetalert2";

import "./LoginPage.css";
import { useForm } from "../../hooks";
import { useAuthStore } from "../hooks/useAuthStore";

const loginFormField = {
  loginEmail: "",
  loginPassword: "",
};

export const LoginPage = () => {
  const { errorMessage, startLogin } = useAuthStore();
  const {
    loginEmail,
    loginPassword,
    onInputChange: onLoginInputChange,
  } = useForm(loginFormField);

  const loginSubmit = (e) => {
    e.preventDefault();

    startLogin({ email: loginEmail, password: loginPassword });
  };

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire("Authentication Error", errorMessage, "error");
    }
  }, [errorMessage]);

  return (
    <div className="container login-container">
      <div className="login-form-1">
        <h3>Ingreso</h3>
        <form onSubmit={loginSubmit}>
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Correo"
              name="loginEmail"
              value={loginEmail}
              onChange={onLoginInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
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
