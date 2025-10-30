import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Connectify Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <er className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="#" className="flex items-center">
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
              to="#"
              className="block px-6 py-2 hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="#"
              className="block px-6 py-2 hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
          </li>

          {/* Dropdown - Services */}
          <li className="group relative">
            <button className="flex items-center px-6 py-2 hover:text-indigo-600">
              Our Services{" "}
              <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-1">
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Service Detail
                </Link>
              </li>
            </ul>
          </li>

          {/* Dropdown - Blog */}
          <li className="group relative">
            <button className="flex items-center px-6 py-2 hover:text-indigo-600">
              Blog <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-1">
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Blog Archive
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Single Post
                </Link>
              </li>
            </ul>
          </li>

          {/* Dropdown - Pages */}
          <li className="group relative">
            <button className="flex items-center px-6 py-2 hover:text-indigo-600">
              Pages <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-1">
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Our Talents
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Talent Detail
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setMenuOpen(false)}
                >
                  404 Page
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="#"
              className="block px-6 py-2 hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Get Started Button */}
        <div className="hidden md:block">
          <Link
            to="#"
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
