// import React from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { getToken , logout } from "../utills/check token";


// export default function Layout() {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const token = typeof window !== "undefined" ? getToken() : null;
  
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/verify");

//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <header className="bg-body border-bottom border-secondary">
//         <div className="container">
//           <div className="d-flex justify-content-between align-items-center py-3">
//             <div className="fw-bold fs-4 text-primary">Connectify</div>
//             {token ? (
//               <button 
//                 className="btn btn-outline-primary btn-sm" 
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             ) : null}
//           </div>
//         </div>
//       </header>
      
//       {/* Remove py-5 from main element for auth pages */}
//       <main className={(isAuthPage ? "auth-bg" : "py-5") + " flex-grow-1"}>
//         <div className={isAuthPage ? "container-fluid" : "container"}>
//           <Outlet />
//         </div>
//       </main>
      
//       <footer className="border-top border-secondary py-3 bg-body">
//         <div className="container">
//           <div className="text-center text-muted small">
//             © {new Date().getFullYear()} Connectify. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }