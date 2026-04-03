import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchLandingCounts, fetchHomeHighlights } from "../../features/home/landingSlice";
import { motion } from "framer-motion";
import AnimatedPage from "../AnimatedPage";

import hero from "../../assets/hero-1.webp";
import WhyChoose from './WhyChoose'
import Testimonials from '../home/homeComponents/Testimonials'
import HeroSection from './homeComponents/HeroSection';
import FAQSection from './homeComponents/FAQSection';
import Footer from '../footer/Footer'
function LogoAurora() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="h-12 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="grad-logo-a-home"
          x1="0"
          y1="0"
          x2="80"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="8" stroke="url(#grad-logo-a-home)" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="#a78bfa" />
      <text x="26" y="16" fontSize="12" fill="#111827" fontFamily="ui-sans-serif, system-ui">Aurora</text>
    </svg>
  );
}

function LogoNimbus() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="h-12 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="grad-logo-b-home"
          x1="0"
          y1="0"
          x2="80"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="16" height="14" rx="3" stroke="url(#grad-logo-b-home)" strokeWidth="2" />
      <path d="M8 15l8-6" stroke="#60a5fa" strokeWidth="2" />
      <text x="26" y="16" fontSize="12" fill="#111827" fontFamily="ui-sans-serif, system-ui">Nimbus</text>
    </svg>
  );
}

function LogoVertex() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="h-12 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="grad-logo-c-home"
          x1="0"
          y1="0"
          x2="80"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M12 6l6 12H6L12 6Z" stroke="url(#grad-logo-c-home)" strokeWidth="2" fill="none" />
      <text x="26" y="16" fontSize="12" fill="#111827" fontFamily="ui-sans-serif, system-ui">Vertex</text>
    </svg>
  );
}

function LogoPulse() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="h-12 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="grad-logo-d-home"
          x1="0"
          y1="0"
          x2="80"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M4 12h6l2-4 3 8 2-5h7" stroke="url(#grad-logo-d-home)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="26" y="16" fontSize="12" fill="#111827" fontFamily="ui-sans-serif, system-ui">Pulse</text>
    </svg>
  );
}

function LogoOrbit() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="h-12 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="grad-logo-e-home"
          x1="0"
          y1="0"
          x2="80"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="5" stroke="url(#grad-logo-e-home)" strokeWidth="2" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="url(#grad-logo-e-home)" strokeWidth="2" />
      <text x="26" y="16" fontSize="12" fill="#111827" fontFamily="ui-sans-serif, system-ui">Orbit</text>
    </svg>
  );
}

function LogoLyra() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="h-12 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="grad-logo-f-home"
          x1="0"
          y1="0"
          x2="80"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path d="M6 16l6-8 6 8" stroke="url(#grad-logo-f-home)" strokeWidth="2" fill="none" />
      <path d="M9 12h6" stroke="#f472b6" strokeWidth="2" />
      <text x="26" y="16" fontSize="12" fill="#111827" fontFamily="ui-sans-serif, system-ui">Lyra</text>
    </svg>
  );
}

const makeSlug = (value) =>
  typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "";

const Home = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => ({
    totalBrands: state.landing.totalBrands,
    totalInfluencers: state.landing.totalInfluencers,
    topInfluencers: state.landing.topInfluencers,
    topBrands: state.landing.topBrands,
  }));
  useEffect(() => {
    dispatch(fetchLandingCounts());
    dispatch(fetchHomeHighlights());
  }, [dispatch]);
  
  const partners = [
    LogoAurora,
    LogoNimbus,
    LogoVertex,
    LogoPulse,
    LogoOrbit,
    LogoLyra,
  ];

  return (
    <AnimatedPage className="font-sans text-gray-800">
      <main>
        {/* Hero Section */}
        {/* <section className="bg-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transforming Talent into{" "}
                <span className="text-indigo-600">Influence</span>
              </h1>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Ornare nisl aliquam ut consectetur maecenas eros.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg transition-colors shadow-sm hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 active:scale-[0.98]"
                >
                  Discover More
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-indigo-600 font-medium hover:underline hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
                >
                  <span>Meet Our Talent</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <img src={hero} alt="Hero" className="rounded-xl shadow-lg" />
            </div>
          </div>
        </section> */}
            <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-20 sm:py-32">
          {/* Animated Background Elements */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900">
                Transforming Talent into{" "}
                <span className="text-gradient">Influence</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Connectify brings brands and creators together in one place. Discover campaigns, send proposals, collaborate smoothly, and track results with a modern, dynamic workflow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="#"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-center font-medium shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-[0.98]"
                >
                  Discover More
                </Link>

                <Link
                  to="#"
                  className="flex items-center justify-center sm:justify-start px-8 py-3 space-x-2 text-indigo-600 font-medium transition hover:text-indigo-400 group"
                >
                  <span>Meet Our Talent</span>
                  <i className="fa-solid fa-arrow-right transform transition-transform group-hover:translate-x-2"></i>
                </Link>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
               animate={{ opacity: 1, scale: 1, rotate: 0 }}
               transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
               className="flex justify-center relative"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
               <img src={hero} alt="Hero" className="rounded-2xl shadow-2xl w-full max-w-xl h-auto relative z-10 border border-white/50" />
            </motion.div>
          </div>
        </section>

        {/* Partner Section */}
        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto text-center px-6">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl font-semibold mb-10"
            >
              Our Partners in Success — The Brands Behind{" "}
              <span className="text-gradient">the Stars</span>
            </motion.h3>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center"
            >
              {partners.map((Logo, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Link
                    to="/brandpartnership"
                    aria-label="Explore Brand Partnership"
                    className="flex items-center justify-center p-5 opacity-70 hover:opacity-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl bg-gray-50/50 border border-transparent hover:border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                  >
                    <Logo />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Top performers */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-bold mt-2">Most hired talent & brands</h2>
              </div>
              <div className="text-sm text-gray-600">
                Data updates live from completed collaborations.
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-indigo-700">Top Influencers</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200">
                    Most hired
                  </span>
                </div>
                {stats.topInfluencers.length === 0 ? (
                  <p className="text-gray-500">No hires yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topInfluencers.slice(0, 3).map((inf) => {
                      const slug = makeSlug(inf.name);
                      const target = slug ? `/profile/i/${slug}` : `/profile/influencer/id/${inf._id}`;
                      return (
                        <Link
                          key={inf._id}
                          to={target}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white hover:-translate-y-0.5 transition shadow-sm hover:shadow"
                        >
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden text-indigo-700 font-semibold">
                            {inf.avatar_url ? (
                              <img
                                src={inf.avatar_url}
                                alt={inf.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              inf.name?.charAt(0)?.toUpperCase() || "I"
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{inf.name}</div>
                            <div className="text-sm text-gray-600">
                              {inf.category || "Influencer"} • {inf.hires} hires
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-pink-50 rounded-2xl p-6 shadow-sm border border-pink-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-pink-700">Top Brands</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-white text-pink-700 border border-pink-200">
                    Most collaborations
                  </span>
                </div>
                {stats.topBrands.length === 0 ? (
                  <p className="text-gray-500">No brand hires yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topBrands.slice(0, 3).map((brand) => {
                      const slug = makeSlug(brand.name);
                      const target = slug ? `/profile/brand/${slug}` : `/profile/brand/id/${brand._id}`;
                      return (
                        <Link
                          key={brand._id}
                          to={target}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white hover:-translate-y-0.5 transition shadow-sm hover:shadow"
                        >
                          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden text-pink-700 font-semibold">
                            {brand.avatar_url ? (
                              <img
                                src={brand.avatar_url}
                                alt={brand.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              brand.name?.charAt(0)?.toUpperCase() || "B"
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{brand.name}</div>
                            <div className="text-sm text-gray-600">
                              {brand.industry || "Brand"} • {brand.hires} hires
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-14 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <img src={hero} alt="About Us" className="rounded-lg shadow-md w-full h-auto" />
            <div>
              <h2 className="text-3xl font-bold mt-2 mb-6">
                Pioneering the Future of Talent and Influence Together
              </h2>
              <p className="text-gray-600 mb-6">
                Connectify is built for real collaborations. Brands can launch campaigns in minutes, review proposals,
                and manage deliverables. Influencers can find opportunities that match their niche and get paid with
                confidence once work is approved.
              </p>
              <blockquote className="italic text-gray-700 border-l-4 border-indigo-500 pl-4 mb-6">
                “Clear expectations, transparent approvals, and a better experience for both brands and influencers.”
              </blockquote>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Create campaigns with budgets, timelines, and requirements</li>
                <li>Send and manage proposals with clear terms</li>
                <li>Track collaboration progress from start to completion</li>
                <li>Build credibility with reviews and public profiles</li>
              </ul>
              {/* <div className="flex space-x-10">
                <div>
                  <p className="text-4xl font-bold text-indigo-600">
                    {stats.totalBrands}+
                  </p>
                  <p>Total Brands</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-indigo-600">
                    {stats.totalInfluencers}+
                  </p>
                  <p>Creative Influencers</p>
                </div>
              </div> */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <div>
                  <p className="text-4xl font-bold text-indigo-600">
                    {stats.totalBrands}+
                  </p>
                  <p>Total Brands</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-indigo-600">
                    {stats.totalInfluencers}+
                  </p>
                  <p>Creative Influencers</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-14 sm:py-20 bg-gradient-to-b from-indigo-50 to-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Tailored Solutions for Talent and Influence
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to run creator campaigns end-to-end—discovery, proposals, communication, approvals,
                and performance tracking.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                "Talent Management",
                "Influencer Marketing",
                "Brand Partnership",
                "Content Strategy",
              ].map((service, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="glass-card p-6 group transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-200/50 hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-3 group-hover:text-purple-700 transition-colors">
                      {service}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Built-in tools to plan, collaborate, and execute campaigns with clarity—so both brands and creators
                      can focus on results.
                    </p>
                    <a
                      href="/service_detail"
                      className="group/link text-indigo-600 font-medium flex items-center gap-2 transition hover:text-purple-600 focus:outline-none rounded"
                    >
                      <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 after:transition-all after:duration-300 group-hover/link:after:w-full">Learn More</span>
                      <i className="fa-solid fa-arrow-right transition-transform group-hover/link:translate-x-1"></i>
                    </a>
                  </div>
                </motion.div>
              ))}

              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">
                    Ready to elevate your brand?
                  </h3>
                  <p className="mb-8 text-indigo-100">
                    Start your next creator campaign today and collaborate with influencers who match your audience.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition transform hover:scale-105 shadow-lg relative z-10 w-max"
                >
                  <span>Get Started</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <WhyChoose />
      <Testimonials />
      <HeroSection />
      <FAQSection />
    </AnimatedPage>
  );
};

export default Home;
