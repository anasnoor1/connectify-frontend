// import React from "react";

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg p-8 w-[400px] max-w-[90%] relative shadow-lg"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
//           onClick={onClose}
//         >
//           ✖
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;


// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-[400px] max-w-[90%] relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
