import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import galaxyBg from "../../../assets/Galaxy-Background.webp";

const FindUsOn = () => {
  return (
    <div
      className="text-white rounded-lg shadow-lg p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${galaxyBg})` }}
    >
      <h3 className="text-lg font-semibold mb-4">Find Us On</h3>
      <div className="flex gap-4">
        {/* Facebook */}
        <Link
          to="/"
          className="bg-[#7c4dff] hover:bg-[#6a38ff] text-white w-10 h-10 flex items-center justify-center rounded-md transition-all"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </Link>

        {/* Instagram */}
        <Link
          to="/"
          className="bg-[#7c4dff] hover:bg-[#6a38ff] text-white w-10 h-10 flex items-center justify-center rounded-md transition-all"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </Link>

        {/* LinkedIn */}
        <Link
          to="/"
          className="bg-[#7c4dff] hover:bg-[#6a38ff] text-white w-10 h-10 flex items-center justify-center rounded-md transition-all"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </Link>

        {/* YouTube */}
        <Link
          to="/"
          className="bg-[#7c4dff] hover:bg-[#6a38ff] text-white w-10 h-10 flex items-center justify-center rounded-md transition-all"
        >
          <FontAwesomeIcon icon={faYoutube} />
        </Link>
      </div>
    </div>
  );
};

export default FindUsOn;