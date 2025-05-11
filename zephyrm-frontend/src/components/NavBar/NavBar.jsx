import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../auth/hooks/useAuthStore";

export const NavBar = () => {
  const { user, startLogout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <div className="d-flex align-items-center">
          <span
            className="navbar-brand cursor-pointer"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-house"></i>
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
        <div className="d-flex">
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
