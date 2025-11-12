
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utills/checkToken";

export default function RequireAuth() {

  const location = useLocation();
  const loggedIn = isLoggedIn();
  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}