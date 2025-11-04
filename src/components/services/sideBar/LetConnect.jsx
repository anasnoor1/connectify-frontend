import React from "react";
import teamBg from "../../../assets/letconnect.webp"; // replace with your actual image path

const ImpactSection = () => {
  return (
    <div
      className="relative w-[385px] h-[220px] rounded-2xl overflow-hidden bg-cover bg-center p-10 flex items-center justify-center text-center"
      style={{ backgroundImage: `url(${teamBg})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 px-4">
        <h2 className="text-white text-lg font-semibold mb-2">
          Let&apos;s Create Impact Together!
        </h2>
        <p className="text-gray-200 text-sm mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default ImpactSection;
