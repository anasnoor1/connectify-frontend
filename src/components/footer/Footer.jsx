import { Link } from "react-router-dom";
import logo from "../../assets/G Logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col space-y-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Logo */}
          <img src={logo} alt="Logo" className="w-36" />

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="#" className="hover:text-white">
              Home
            </Link>
            <Link to="/#" className="hover:text-white">
              About Us
            </Link>
            <Link to="#" className="hover:text-white">
              Our Services
            </Link>
            <Link to="#" className="hover:text-white">
              Our Talents
            </Link>
            <Link to="#" className="hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700"></div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Us */}
          <div>
            <h3 className="text-white font-semibold mb-3">About Us</h3>
            <p className="text-sm mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            {/* <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-white">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" className="hover:text-white">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" className="hover:text-white">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://youtube.com" className="hover:text-white">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div> */}
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-3">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white">
                  Talent Management
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Influencer Marketing
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Content Creation & Strategy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Brand Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <i className="fa-solid fa-phone text-indigo-500"></i>
                <span>+92 345 0000000</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fa-solid fa-envelope text-indigo-500"></i>
                <span>info@Connectify.net</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="fa-solid fa-location-dot text-indigo-500 mt-1"></i>
                <span>High-Q Tower Jail Road, Lahore, 54000</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-3">Newsletter</h3>
            <p className="text-sm mb-4">
              Sed vitae felis sit amet libero tempor ornare eros aliquam nibh
              tincidunt.
            </p>
            <form className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700"></div>
      </div>
    </footer>
  );
};

export default Footer;