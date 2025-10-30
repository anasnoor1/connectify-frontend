import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card shadow border-0">
            <div className="card-body p-4 text-center">
              <h1 className="display-5 fw-bold mb-2">404</h1>
              <p className="text-muted mb-4">Page not found</p>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}