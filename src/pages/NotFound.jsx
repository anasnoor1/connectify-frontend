// import React from "react";
// import { Link } from "react-router-dom";

// export default function NotFound() {
//   return (
//     <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
//       <div className="row justify-content-center w-100">
//         <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
//           <div className="card shadow border-0">
//             <div className="card-body p-4 text-center">
//               <h1 className="display-5 fw-bold mb-2">404</h1>
//               <p className="text-muted mb-4">Page not found</p>
//               <Link to="/" className="btn btn-primary">Go Home</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


/////////////////////////////////////

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-indigo-600 mb-3">404</h1>
        <p className="text-gray-600 mb-6 text-lg">Oops! Page not found.</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
