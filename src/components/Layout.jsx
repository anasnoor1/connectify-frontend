import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
<<<<<<< HEAD
  const isAuthPage = pathname === "/login" || pathname === "/signup";
=======

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/verify");

>>>>>>> origin/auth-naeem
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-body border-bottom border-secondary">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="fw-bold fs-4 text-primary">Connectify</div>
            {token ? (
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </header>
<<<<<<< HEAD
      <main className={isAuthPage ? "py-5 bg-body-secondary" : "py-5"}>
        <div className={isAuthPage ? "container d-flex align-items-center justify-content-center" : "container"} style={isAuthPage ? { minHeight: "75vh" } : undefined}>
          <Outlet />
        </div>
      </main>
      <footer className="border-top py-3 bg-body">
        <div className="container text-center small text-muted">
          © {new Date().getFullYear()} Connectify
=======
      
      {/* Remove py-5 from main element for auth pages */}
      <main className={(isAuthPage ? "auth-bg" : "py-5") + " flex-grow-1"}>
        <div className={isAuthPage ? "container-fluid" : "container"}>
          <Outlet />
        </div>
      </main>
      
      <footer className="border-top border-secondary py-3 bg-body">
        <div className="container">
          <div className="text-center text-muted small">
            © {new Date().getFullYear()} Connectify. All rights reserved.
          </div>
>>>>>>> origin/auth-naeem
        </div>
      </footer>
    </div>
  );
}

