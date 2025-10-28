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
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  return (
    <>
      <header className="bg-body">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-semibold" style={{ fontSize: 20 }}>Connectify</div>
            {token ? (
              <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </header>
      <main className={isAuthPage ? "py-5 bg-body-secondary" : "py-5"}>
        <div className={isAuthPage ? "container d-flex align-items-center justify-content-center" : "container"} style={isAuthPage ? { minHeight: "75vh" } : undefined}>
          <Outlet />
        </div>
      </main>
      <footer className="border-top py-3 bg-body">
        <div className="container text-center small text-muted">
          © {new Date().getFullYear()} Connectify
        </div>
      </footer>
    </>
  );
}

