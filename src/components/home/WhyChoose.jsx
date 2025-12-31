import React from "react";
import { FaThumbsUp, FaHandshake, FaChartBar, FaPlay } from "react-icons/fa";
import hero from "../../assets/hero-1.webp";
import galaxyBg from "../../assets/Galaxy-Background.webp";

const WhyChoose = () => {
  return (
    <section
      style={{ backgroundImage: `url(${galaxyBg})` }}
      className="relative bg-contain bg-center text-white py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-12 items-center">
        {/* Left - Reasons List */}
        <div>
          <ul className="mt-8 space-y-6">
            <li className="flex items-start space-x-4">
              <FaThumbsUp className="text-indigo-400 text-2xl mt-1" />
              <div>
                <h5 className="text-lg font-semibold">Proven Track Record</h5>
                <p className="text-gray-300">
                  Built for real-world creator campaigns with clear steps from discovery to delivery.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <FaHandshake className="text-indigo-400 text-2xl mt-1" />
              <div>
                <h5 className="text-lg font-semibold">Industry Connections</h5>
                <p className="text-gray-300">
                  Connect brands with creators who fit their goals, niche, and audience.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <FaChartBar className="text-indigo-400 text-2xl mt-1" />
              <div>
                <h5 className="text-lg font-semibold">Personalized Growth</h5>
                <p className="text-gray-300">
                  Track performance and build credibility through reviews and completed collaborations.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Middle - Stats */}
        <div className="col-span-1 lg:col-span-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Passionate About Growth and <br /> Committed to Success
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-400 text-center p-6 rounded-xl w-full sm:w-1/2 shadow-lg">
              <p className="text-4xl font-bold">98%</p>
              <p className="text-sm mt-2 text-gray-100">Satisfaction Rate</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-blue-400 text-center p-6 rounded-xl w-full sm:w-1/2 shadow-lg">
              <p className="text-4xl font-bold">20K+</p>
              <p className="text-sm mt-2 text-gray-100">Creative Talents</p>
            </div>
          </div>

          <div className="space-y-4">
            <ProgressBar title="Campaign Success Rate" percent="97%" />
            <ProgressBar title="Social Media Growth Rate" percent="92%" />
            <ProgressBar title="Campaign Engagement Rate" percent="95%" />
          </div>
        </div>

        {/* Right - Image with play button */}
        <div className="relative flex flex-col items-center">
          <p className="text-gray-300 mb-4 text-center">
            Collaborate faster with built-in proposals, clear requirements, and transparent approvals—so every campaign
            runs smoothly for both brands and influencers.
          </p>
          <div className="relative">
            <img
              src={hero}
              alt="Our Team"
              className="rounded-2xl shadow-lg w-full max-w-sm mx-auto"
            />
            <button
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="bg-white/20 rounded-full p-6 backdrop-blur-sm group-hover:bg-white/30 group-hover:scale-110 transition-transform duration-300">
                <FaPlay className="text-white text-3xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Progress Bar Component
const ProgressBar = ({ title, percent }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{title}</span>
      <span className="text-indigo-300">{percent}</span>
    </div>
    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
      <div
        className="bg-gradient-to-r from-indigo-500 to-blue-400 h-2 rounded-full transition-all duration-700"
        style={{ width: percent }}
      ></div>
    </div>
  </div>
);

export default WhyChoose;

