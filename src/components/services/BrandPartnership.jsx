// import React from "react";
// import galaxyBg from "../../assets/Galaxy-Background.webp";

// const BrandPartnership = () => {
//   return (
//     <div className="bg-white text-gray-800">
//       {/* ====== Banner Section ====== */}
//       <section className="relative py-16 text-center bg-gradient-to-b from-[#e3d5f7] to-[#f8f5ff]">
//         <h1 className="text-5xl font-bold">
//           Brand <span className="text-purple-600">Partnership</span>
//         </h1>
//         <p className="mt-2 text-sm text-gray-600">
//           Home / Services /{" "}
//           <span className="text-purple-500">Brand Partnership</span>
//         </p>
//       </section>

//       {/* ====== Content Section ====== */}
//       <section className="max-w-7xl mx-auto py-16 px-6 grid lg:grid-cols-3 gap-10">
//         {/* ===== Left Side (Overview + Benefits) ===== */}
//         <div className="lg:col-span-2 space-y-10">
//           {/* Overview */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Overview</h2>
//             <div className="grid md:grid-cols-2 gap-6 items-start">
//               <img
//                 src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=80"
//                 alt="Team meeting"
//                 className="rounded-lg shadow-md"
//               />
//               <p className="text-gray-700 leading-relaxed text-sm">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
//                 imperdiet turpis vitae quas ornare dignissim consequat. Sed
//                 venenatis turpis vel sapien suscipit facilisis. Integer enim
//                 justo, venenatis at tempor sed, facilisis ut orci. Cras laoreet
//                 nisi nec eros facilisis, eu facilisis orci congue. Vestibulum
//                 blandit nisl et nisl feugiat finibus. Phasellus vitae urna
//                 augue.
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
//                 imperdiet turpis vitae quas ornare dignissim consequat. Sed
//                 venenatis turpis vel sapien suscipit facilisis. Integer enim
//                 justo, venenatis at tempor sed, facilisis ut orci. Cras laoreet
//                 nisi nec eros facilisis, eu facilisis orci congue. Vestibulum
//                 blandit nisl et nisl feugiat finibus. Phasellus vitae urna
//                 augue.
//               </p>
//             </div>

//             <p className="mt-6 text-gray-700 leading-relaxed text-sm">
//               Fusce luctus sollicitudin est eget eleifend. Donec risus ante,
//               eleifend non tortor nec, porttitor cursus risus. Vestibulum
//               blandit nisi et nisl feugiat finibus. Phasellus vitae urna augue.
//               Cras fringilla facilisis orci, non rhoncus lorem sodales non.
//               Fusce varius vitae magna eget magna.
//             </p>

//             <p className="mt-4 text-gray-700 leading-relaxed text-sm">
//               Morbi volutpat lacus a elementum vestibulum. Nam euismod augue
//               diam, id laoreet nulla imperdiet at. Cras vel lorem in metus
//               fringilla aliquet.
//             </p>
//           </div>

//           {/* Key Benefits */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
//             <p className="text-gray-700 mb-4 text-sm">
//               Proin bibendum auctor augue vestibulum pretium. Sed eleifend
//               tellus rhoncus, lacinia nibh eget, egestas ex. Nulla facilisi.
//               Vestibulum augue convallis massa, hendrerit efficitur erat.
//             </p>

//             <ul className="space-y-3 text-gray-700 text-sm">
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-500 text-lg">•</span> Sed id augue
//                 lobortis, blandit mi laoreet, faucibus leo.
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-500 text-lg">•</span> Praesent
//                 porta urna vitae bibendum molestie.
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-500 text-lg">•</span> Ut facilisis
//                 diam hendrerit sem posuere tempor.
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-500 text-lg">•</span> Vestibulum
//                 blandit metus sed pellentesque feugiat.
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-500 text-lg">•</span> Quisque
//                 vehicula eros a tristique faucibus.
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* ===== Right Sidebar ===== */}
//         <div className="space-y-6">
//           {/* Sidebar Card 1 */}
//            <div
//             className="text-white rounded-md p-5 shadow-md bg-cover bg-center"
//             style={{ backgroundImage: `url(${galaxyBg})` }}
//           >
//             <h3 className="text-lg font-semibold mb-4">Our Services</h3>
//             <ul className="space-y-3">
//               <li className="border-b border-gray-600 pb-2">
//                 Talent Management
//               </li>
//               <li className="border-b border-gray-600 pb-2">
//                 Influencer Marketing
//               </li>
//               <li>Content Strategy</li>
//             </ul>
//           </div>

//           {/* Sidebar Card 2 */}
//           <div
//             className="relative rounded-lg overflow-hidden text-white p-6 shadow-lg"
//             style={{
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1590080875830-b3d06b96d2c4?auto=format&fit=crop&w=600&q=80')",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }}
//           >
//             <div className="absolute inset-0 bg-black/60"></div>
//             <div className="relative z-10">
//               <h3 className="text-lg font-bold mb-2">
//                 Let’s Create Impact Together!
//               </h3>
//               <p className="text-sm mb-4">
//                 Lorem ipsum dolor sit amet consectetur adipiscing elit. Etiam
//                 bibendum lacus ullamcorper cursus dapibus leo.
//               </p>
//               <button className="bg-purple-500 hover:bg-purple-600 px-5 py-2 rounded-md font-medium">
//                 Contact Us
//               </button>
//             </div>
//           </div>

//           {/* Sidebar Card 3 */}
//           <div className="bg-[#0b1120] text-white rounded-lg shadow-lg p-6">
//             <h3 className="text-lg font-semibold mb-4">Find Us On</h3>
//             <div className="flex gap-4 text-xl">
//               <a href="#" className="hover:text-purple-400">
//                 <i className="fab fa-facebook-f"></i>
//               </a>
//               <a href="#" className="hover:text-purple-400">
//                 <i className="fab fa-twitter"></i>
//               </a>
//               <a href="#" className="hover:text-purple-400">
//                 <i className="fab fa-linkedin-in"></i>
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default BrandPartnership;

import React from "react";
import galaxyBg from "../../assets/Galaxy-Background.webp";
import serviceImg from "../../assets/service1.webp";
import Icons from "./sideBar/icons";
import LetConnect from "./sideBar/LetConnect";

const BrandPartnership = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* ====== Banner Section ====== */}
      <section className="relative py-16 text-center bg-gradient-to-b from-[#e3d5f7] to-[#f8f5ff]">
        <h1 className="text-5xl font-bold">
          Brand <span className="text-purple-600">Partnership</span>
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Home / Services /{" "}
          <span className="text-purple-500">Brand Partnership</span>
        </p>
      </section>

      {/* ====== Content Section ====== */}
      <section className="max-w-7xl mx-auto py-16 px-6 grid lg:grid-cols-3 gap-10">
        {/* ===== Left Side (Overview + Benefits) ===== */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <img
                src={serviceImg}
                alt="Service"
                className="rounded-lg shadow-md w-full h-[280px] object-cover"
              />
              <p className="text-gray-700 leading-relaxed text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                imperdiet turpis vitae quas ornare dignissim consequat. Sed
                venenatis turpis vel sapien suscipit facilisis. Integer enim
                justo, venenatis at tempor sed, facilisis ut orci. Cras laoreet
                nisi nec eros facilisis, eu facilisis orci congue. Vestibulum
                blandit nisl et nisl feugiat finibus. Phasellus vitae urna
                augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                In imperdiet turpis vitae quas ornare dignissim consequat.
              </p>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed text-sm">
              Fusce luctus sollicitudin est eget eleifend. Donec risus ante,
              eleifend non tortor nec, porttitor cursus risus. Vestibulum
              blandit nisi et nisl feugiat finibus. Phasellus vitae urna augue.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              Morbi volutpat lacus a elementum vestibulum. Nam euismod augue
              diam, id laoreet nulla imperdiet at. Cras vel lorem in metus
              fringilla aliquet.
            </p>
          </div>

          {/* Key Benefits */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
            <p className="text-gray-700 mb-4 text-sm">
              Proin bibendum auctor augue vestibulum pretium. Sed eleifend
              tellus rhoncus, lacinia nibh eget, egestas ex. Nulla facilisi.
              Vestibulum augue convallis massa, hendrerit efficitur erat.
            </p>

            <ul className="space-y-3 text-gray-700 text-sm">
              {[
                "Sed id augue lobortis, blandit mi laoreet, faucibus leo.",
                "Praesent porta urna vitae bibendum molestie.",
                "Ut facilisis diam hendrerit sem posuere tempor.",
                "Vestibulum blandit metus sed pellentesque feugiat.",
                "Quisque vehicula eros a tristique faucibus.",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-500 text-lg">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== Right Sidebar ===== */}
        <div className="space-y-6">
          {/* Sidebar Card 1 */}
          <div
            className="text-white rounded-md p-5 shadow-md bg-cover bg-center"
            style={{ backgroundImage: `url(${galaxyBg})` }}
          >
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-3">
              <li className="border-b border-gray-600 pb-2">
                Talent Management
              </li>
              <li className="border-b border-gray-600 pb-2">
                Influencer Marketing
              </li>
              <li>Content Strategy</li>
            </ul>
          </div>

          {/* Sidebar Card 2 */}
          <LetConnect />

          {/* Sidebar Card 3 */}
          <Icons />
        </div>
      </section>
    </div>
  );
};

export default BrandPartnership;
