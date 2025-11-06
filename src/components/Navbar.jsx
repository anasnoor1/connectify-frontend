import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../assets/connectifylogo.png";
import { getToken, logout as logoutUser } from "../utills/checkToken";
import Footer from './Footer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

    const token = getToken();

    const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/verify");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - hidden on auth pages */}
      {!isAuthPage && (
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="w-20" />
            </Link>

            {/* Mobile Toggle Button */}
            <button
              className="text-gray-700 text-2xl md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            {/* Nav Links */}
            <ul
              className={`flex flex-col md:flex-row md:items-center absolute md:static left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ease-in-out ${
                menuOpen
                  ? "top-16 opacity-100"
                  : "top-[-400px] opacity-0 md:opacity-100"
              }`}
            >
              <li>
                <Link
                  to="/"
                  className="block px-6 py-2 text-black hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
               <li>
                <Link
                  to="/brandpartnership"
                  className="block px-6 py-2 hover:text-indigo-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Brand Partnership
                </Link>
              </li>


              <li>
                <Link
                  to="/about"
                  className="block px-6 py-2 hover:text-indigo-600"
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="block px-6 py-2 hover:text-indigo-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </li>

              {/* Show logout button only if logged in */}

            </ul>

            {/* Get Started / Login Button */}
            <div className="hidden md:block">
              {!token ? (
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer"

                >
                  Get Started
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main
        className={`flex-grow ${
          isAuthPage ? "auth-bg" : "py-5"
        } transition-all duration-300`}
      >
        <div className={isAuthPage ? "container-fluid" : "max-w-7xl mx-auto"}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <Footer/>
      )}
    </div>
  );
}
