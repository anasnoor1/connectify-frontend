import { Link } from "react-router-dom";
import logo from "../../assets/G Logo.png";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative bg-[#0f172a] text-slate-300 py-16 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col space-y-12 relative z-10">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0"
        >
          {/* Logo */}
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
            <img src={logo} alt="Connectify Logo" className="w-36 brightness-200 grayscale" />
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            {["Home", "About Us", "Contact Us"].map((item, idx) => (
              <Link
                key={idx}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "")}`}
                className="hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-400 after:transition-all hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="border-t border-slate-800"></div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">About Us</h3>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              Connectify brings brands and creators together in one place. Discover campaigns, send proposals, collaborate smoothly, and track results.
            </p>
            <div className="flex space-x-4">
              {["facebook-f", "instagram", "linkedin-in", "twitter"].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1">
                  <i className={`fa-brands fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Our Services</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {["Talent Management", "Influencer Marketing", "Content Creation", "Brand Partnership"].map((service, i) => (
                <li key={i}>
                  <Link to="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <i className="fa-solid fa-chevron-right text-[10px] text-slate-600 group-hover:text-indigo-400 transition-colors"></i>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <i className="fa-solid fa-phone text-indigo-400 group-hover:text-white transition-colors"></i>
                </div>
                <span>+92 312 4212906</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <i className="fa-solid fa-envelope text-indigo-400 group-hover:text-white transition-colors"></i>
                </div>
                <span>anasnoor099@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors shrink-0">
                  <i className="fa-solid fa-location-dot text-indigo-400 group-hover:text-white transition-colors"></i>
                </div>
                <span className="mt-1.5">Lahore, Pakistan</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get the latest insights and news from Connectify.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        <div className="border-t border-slate-800 text-center pt-8">
          <p className="text-sm text-slate-500">
            Connectify &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;