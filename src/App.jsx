import React from 'react'
import Home from './components/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Login from './components/Login'

function App() {
  

  return (
    <>
      {/* <Login /> */}
      <Navbar />
      <Home />
      <Footer />
    </>
  )
}

export default App


// import React from 'react';
// import { FiUser, FiLock } from 'react-icons/fi'; // Icons for the input fields

// // const LoginPage = () => {
// const App = () => {
//   return (
//     // Outer Container: Flexbox to center the card on the screen
//     <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-200 to-purple-300">
      
//       {/* Login Card/Wrapper: Holds both sections */}
//       <div className="flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden">
        
//         {/* --- 🎨 Left Section: Welcome and Decoration --- */}
//         <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
          
//           {/* Main Content */}
//           <div className="relative z-10">
//             <h1 className="text-4xl font-bold mb-4">Welcome to Connectify</h1>
//             <p className="text-md font-light">
//               Log in to join your community. Connect with peers, share insights, and build professional relationships that power your success.
//             </p>
//           </div>
          
//           {/* Decorative Shapes (Simulated with absolute positioned divs) */}
//           <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
//           <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
//           <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>

//         </div>

//         {/* --- 📝 Right Section: User Login Form --- */}
//         <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
//           <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">USER LOGIN</h2>
          
//           {/* Input Field: Username/Email */}
//           <div className="mb-4 relative">
//             <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input 
//               type="text" 
//               placeholder="Username or Email" 
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
//             />
//           </div>

//           {/* Input Field: Password */}
//           <div className="mb-6 relative">
//             <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input 
//               type="password" 
//               placeholder="Password" 
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
//             />
//           </div>
          
//           {/* Remember Me and Forgot Password */}
//           <div className="flex justify-between items-center text-sm mb-6">
//             <label className="flex items-center text-gray-600 cursor-pointer">
//               <input 
//                 type="checkbox" 
//                 className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
//               />
//               Remember
//             </label>
//             <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition duration-150">
//               Forgot password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button 
//             type="submit" 
//             className="w-full py-3 text-white font-semibold rounded-lg 
//                        bg-gradient-to-r from-purple-500 to-indigo-600 
//                        hover:from-purple-600 hover:to-indigo-700 
//                        transition duration-150 ease-in-out"
//           >
//             LOGIN
//           </button>
          
//         </div>
        
//       </div>
      
//     </div>
//   );
// };

// // export default LoginPage;
// export default App