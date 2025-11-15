import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import logo from "../../assets/connectifylogo.png"
import { getToken, logout as logoutUser } from "../../utills/checkToken";
import axios from "../../utills/privateIntercept";
import Footer from "../footer/Footer"

function IconProfile() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-prof" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="8" r="3.2" stroke="url(#grad-prof)" strokeWidth="1.7"/>
      <path d="M5 19.5c1.6-3.5 5-4.8 7-4.8s5.4 1.3 7 4.8" stroke="url(#grad-prof)" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-logout" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path d="M14 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h5a2 2 0 002-2v-2" stroke="url(#grad-logout)" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M10 12h9" stroke="url(#grad-logout)" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M16 9l3 3-3 3" stroke="url(#grad-logout)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconUserCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-user" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#grad-user)" strokeWidth="1.6" />
      <circle cx="12" cy="9" r="2.8" stroke="url(#grad-user)" strokeWidth="1.6" />
      <path d="M6.5 17.5c1.5-3 4.2-4 5.5-4s4 1 5.5 4" stroke="url(#grad-user)" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", avatar: "", role: "" });
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = getToken();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // Close dropdown on outside click / Escape
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Load minimal user for avatar/name when authenticated
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!token) return setUser({ name: "", email: "", avatar: "", role: "" });
      try {
        const res = await axios.get("/api/user/me");
        const u = res.data?.user || res.data || {};
        const profile = res.data?.profile || {};
        const avatarUrl = profile.avatar_url || u.avatar || "";
        if (!ignore) setUser({
          name: u.name || "",
          email: u.email || "",
          avatar: avatarUrl,
          role: u.role || ""
        });
      } catch {
        // swallow
      }
    };
    load();
    return () => { ignore = true; };
  }, [token]);

  // React to avatar updates from Profile without reload
  useEffect(() => {
    const onAvatar = (e) => {
      const url = e?.detail?.url;
      setUser((prev) => ({ ...prev, avatar: url || '' }));
    };
    window.addEventListener('avatar-updated', onAvatar);
    return () => window.removeEventListener('avatar-updated', onAvatar);
  }, []);

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
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `block px-6 py-2 transition-colors ${
                      isActive
                        ? "text-indigo-600 font-semibold md:border-b-2 md:border-indigo-600"
                        : "text-gray-700 hover:text-indigo-600"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>

              {/* Dashboard and Campaigns - Only for authenticated users */}
              {token && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `block px-6 py-2 transition-colors ${
                          isActive
                            ? "text-indigo-600 font-semibold md:border-b-2 md:border-indigo-600"
                            : "text-gray-700 hover:text-indigo-600"
                        }`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/campaigns"
                      className={({ isActive }) =>
                        `block px-6 py-2 transition-colors ${
                          isActive
                            ? "text-indigo-600 font-semibold md:border-b-2 md:border-indigo-600"
                            : "text-gray-700 hover:text-indigo-600"
                        }`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      Campaigns
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/brandpartnership"
                  className={({ isActive }) =>
                    `block px-6 py-2 transition-colors ${
                      isActive
                        ? "text-indigo-600 font-semibold md:border-b-2 md:border-indigo-600"
                        : "text-gray-700 hover:text-indigo-600"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Brand Partnership
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block px-6 py-2 transition-colors ${
                      isActive
                        ? "text-indigo-600 font-semibold md:border-b-2 md:border-indigo-600"
                        : "text-gray-700 hover:text-indigo-600"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block px-6 py-2 transition-colors ${
                      isActive
                        ? "text-indigo-600 font-semibold md:border-b-2 md:border-indigo-600"
                        : "text-gray-700 hover:text-indigo-600"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {/* Get Started / Login Button */}
            <div className="hidden md:block" ref={dropdownRef}>
              {!token ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="inline-flex items-center bg-gray-100 text-gray-800 p-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="inline-flex h-9 w-9 rounded-full items-center justify-center bg-white shadow-sm">
                      <IconUserCircle />
                    </span>
                  </button>
                  <div className={`${dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} origin-top-right transition transform absolute right-0 mt-2 w-72 bg-white shadow-2xl ring-1 ring-black/5 rounded-xl py-3 z-50`}
                    role="menu">
                    <div className="px-4 pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 rounded-full items-center justify-center bg-indigo-50">
                          <IconUserCircle />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Welcome</p>
                          <p className="text-xs text-gray-500">Sign in to continue</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 pt-2 space-y-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/login");
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        role="menuitem"
                      >
                        <i className="fa-solid fa-right-to-bracket"></i>
                        <span>Login</span>
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/signup");
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        role="menuitem"
                      >
                        <i className="fa-regular fa-id-card"></i>
                        <span>Create Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="inline-flex items-center bg-gray-100 text-gray-800 p-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="inline-flex h-9 w-9 rounded-full overflow-hidden bg-indigo-600 text-white items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                      ) : (
                        <span className="text-sm font-semibold">
                          {(user.name || user.email || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                  </button>
                  <div
                    className={`${dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} origin-top-right transition transform absolute right-0 mt-2 w-64 bg-white shadow-2xl ring-1 ring-black/5 rounded-xl py-2 z-50`}
                    role="menu"
                  >
                    <div className="px-4 pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 rounded-full overflow-hidden bg-indigo-600 text-white items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                          ) : (
                            <span className="text-sm font-semibold">
                              {(user.name || user.email || "U").charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name || "Profile"}</p>
                          {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
                          {user.role && (
                            <p className="text-xs text-indigo-600 font-medium capitalize">{user.role}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition rounded-lg"
                      role="menuitem"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                        <IconProfile />
                      </span>
                      <span className="text-gray-800">Profile</span>
                    </button>
                    <div className="my-2 border-t" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition rounded-lg"
                      role="menuitem"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600">
                        <IconLogout />
                      </span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
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
       <Footer />
      )}
    </div>
  );
}