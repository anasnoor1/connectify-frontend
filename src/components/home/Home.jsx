import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"

import hero from "../assets/hero-1.webp";
// import WhyChoose from './whyChoose'
import Testimonials from './Testimonials'
import Footer from './Footer'
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

const Home = () => {
  const partners = [LogoAurora, LogoNimbus, LogoVertex, LogoPulse, LogoOrbit, LogoLyra];
  const [stats, setStats] = useState({ totalBrands: 0, totalInfluencers: 0 });
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/counts") // adjust URL if needed
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching counts:", err));
  }, []);
  return (
    <div className="font-sans text-gray-800">
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
        <section className="bg-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transforming Talent into{" "}
            <span className="text-indigo-600">Influence</span>
          </h1>

          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare
            nisl aliquam ut consectetur maecenas eros.
          </p>

          <div className="flex space-x-4">
            {/* ✅ Replace <a> with Link */}
            <Link
              to="#"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              Discover More
            </Link>

            <Link
              to="#"
              className="flex items-center space-x-2 text-indigo-600 font-medium hover:underline"
            >
              <span>Meet Our Talent</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={hero} alt="Hero" className="rounded-xl shadow-lg" />
        </div>
      </div>
    </section>

        {/* Partner Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto text-center px-6">
            <h3 className="text-2xl font-semibold mb-10">
              Our Partners in Success — The Brands Behind{" "}
              <span className="text-indigo-600">the Stars</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
              {partners.map((Logo, i) => (
                <Link
                  to="/brandpartnership"
                  key={i}
                  aria-label="Explore Brand Partnership"
                  className="flex items-center justify-center p-5 opacity-80 hover:opacity-100 transition-all duration-200 hover:-translate-y-1 hover:shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                >
                  <Logo />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <img src={hero} alt="About Us" className="rounded-lg shadow-md" />
            <div>
              <h4 className="text-indigo-600 font-semibold">// About Us</h4>
              <h2 className="text-3xl font-bold mt-2 mb-6">
                Pioneering the Future of Talent and Influence Together
              </h2>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Varius magna semper primis ut auctor justo lacus dictum morbi.
              </p>
              <blockquote className="italic text-gray-700 border-l-4 border-indigo-500 pl-4 mb-6">
                “Senectus ullamcorper mollis posuere fringilla sit velit.
                Nisl velit etiam per mus cursus suscipit habitasse viverra.”
              </blockquote>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Montes class leo maecena</li>
                <li>Aenean in varius ante nibh</li>
                <li>Volutpat porta neque primis</li>
                <li>Etiam sit amet cursus arcu</li>
              </ul>
              {/* <div className="flex space-x-10">
                <div>
                  <p className="text-4xl font-bold text-indigo-600">12+</p>
                  <p>Years of Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-indigo-600">270+</p>
                  <p>Creative Talents</p>
                </div>
              </div> */}
              <div className="flex space-x-10">
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
        <section className="py-20 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h4 className="text-indigo-600 font-semibold">// What We Do</h4>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Tailored Solutions for Talent and Influence
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sed ac suscipit tellus, a volutpat erat. Proin sit amet
                fermentum massa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Talent Management",
                "Influencer Marketing",
                "Brand Partnership",
                "Content Strategy",
              ].map((service, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                >
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                    {service}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sed velit magna, dictum sit amet ante eu, tristique tempor ex.
                    Phasellus neque enim nunc, ultrices eget bibendum id.
                  </p>
                  <a
                    href="/service_detail"
                    className="text-indigo-600 font-medium flex items-center gap-2 hover:underline hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
                  >
                    <span>Learn More</span>
                    <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-0.5"></i>
                  </a>
                </div>
              ))}

              <div className="bg-indigo-600 text-white p-6 rounded-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">
                    Ready to elevate your brand?
                  </h3>
                  <p className="mb-6">
                    Let’s make it happen together with our expert team.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                >
                  <span>Get Started</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WhyChoose />
      <Testimonials />
      <HeroSection />
      <FAQSection />
    </div>
  );
};

export default Home;

// import React from "react";
// const Home = () => {
//   const partners = [49, 52, 50, 51, 40, 47];

//   return (
//     <div className="font-sans text-gray-800">
//       {/* Navbar */}
//       <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
//         <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
//           <h1 className="text-xl font-bold text-indigo-600">BrandName</h1>
//           <ul className="hidden md:flex space-x-6">
//             <li><a href="/" className="hover:text-indigo-600">Home</a></li>
//             <li><a href="/about" className="hover:text-indigo-600">About</a></li>
//             <li><a href="/services" className="hover:text-indigo-600">Services</a></li>
//             <li><a href="/contact" className="hover:text-indigo-600">Contact</a></li>
//           </ul>
//         </nav>
//       </header>

//       <main className="pt-20">
//         {/* Hero Section */}
//         <section className="bg-indigo-50 py-20">
//           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
//             <div>
//               <h1 className="text-4xl md:text-5xl font-bold mb-6">
//                 Transforming Talent into{" "}
//                 <span className="text-indigo-600">Influence</span>
//               </h1>
//               <p className="text-gray-600 mb-6">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 Ornare nisl aliquam ut consectetur maecenas eros.
//               </p>
//               <div className="flex space-x-4">
//                 <a
//                   href="/about"
//                   className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
//                 >
//                   Discover More
//                 </a>
//                 <a
//                   href="/talent"
//                   className="flex items-center space-x-2 text-indigo-600 font-medium hover:underline"
//                 >
//                   <span>Meet Our Talent</span>
//                   <i className="fa-solid fa-arrow-right"></i>
//                 </a>
//               </div>
//             </div>

//             <div className="flex justify-center">
//               <img
//                 src="/images/dummy-img-600x400.jpg"
//                 alt="Hero"
//                 className="rounded-xl shadow-lg"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Partner Section */}
//         <section className="py-16 bg-white">
//           <div className="max-w-6xl mx-auto text-center px-6">
//             <h3 className="text-2xl font-semibold mb-10">
//               Our Partners in Success — The Brands Behind{" "}
//               <span className="text-indigo-600">the Stars</span>
//             </h3>
//             <div className="flex flex-wrap justify-center items-center gap-8">
//               {partners.map((num, i) => (
//                 <img
//                   key={i}
//                   src={`/images/logo-${num}.png`}
//                   alt={`Partner ${i + 1}`}
//                   className="w-28 grayscale hover:grayscale-0 transition"
//                 />
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* About Section */}
//         <section className="py-20 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
//             <img
//               src="/images/dummy-img-600x400.jpg"
//               alt="About Us"
//               className="rounded-lg shadow-md"
//             />
//             <div>
//               <h4 className="text-indigo-600 font-semibold">// About Us</h4>
//               <h2 className="text-3xl font-bold mt-2 mb-6">
//                 Pioneering the Future of Talent and Influence Together
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 Varius magna semper primis ut auctor justo lacus dictum morbi.
//               </p>
//               <blockquote className="italic text-gray-700 border-l-4 border-indigo-500 pl-4 mb-6">
//                 “Senectus ullamcorper mollis posuere fringilla sit velit.
//                 Nisl velit etiam per mus cursus suscipit habitasse viverra.”
//               </blockquote>
//               <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
//                 <li>Montes class leo maecena</li>
//                 <li>Aenean in varius ante nibh</li>
//                 <li>Volutpat porta neque primis</li>
//                 <li>Etiam sit amet cursus arcu</li>
//               </ul>
//               <div className="flex space-x-10">
//                 <div>
//                   <p className="text-4xl font-bold text-indigo-600">12+</p>
//                   <p>Years of Experience</p>
//                 </div>
//                 <div>
//                   <p className="text-4xl font-bold text-indigo-600">270+</p>
//                   <p>Creative Talents</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Services Section */}
//         <section className="py-20 bg-indigo-50">
//           <div className="max-w-7xl mx-auto px-6">
//             <div className="text-center mb-12">
//               <h4 className="text-indigo-600 font-semibold">// What We Do</h4>
//               <h2 className="text-3xl font-bold mt-2 mb-4">
//                 Tailored Solutions for Talent and Influence
//               </h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Sed ac suscipit tellus, a volutpat erat. Proin sit amet fermentum massa.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 "Talent Management",
//                 "Influencer Marketing",
//                 "Brand Partnership",
//                 "Content Strategy",
//               ].map((service, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
//                 >
//                   <h3 className="text-xl font-semibold text-indigo-600 mb-3">
//                     {service}
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     Sed velit magna, dictum sit amet ante eu, tristique tempor ex.
//                     Phasellus neque enim nunc, ultrices eget bibendum id.
//                   </p>
//                   <a
//                     href="/service_detail"
//                     className="text-indigo-600 font-medium hover:underline flex items-center space-x-2"
//                   >
//                     <span>Learn More</span>
//                     <i className="fa-solid fa-arrow-right"></i>
//                   </a>
//                 </div>
//               ))}

//               <div className="bg-indigo-600 text-white p-6 rounded-lg flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-2xl font-semibold mb-3">
//                     Ready to elevate your brand?
//                   </h3>
//                   <p className="mb-6">
//                     Let’s make it happen together with our expert team.
//                   </p>
//                 </div>
//                 <a
//                   href="/contact"
//                   className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
//                 >
//                   <span>Get Started</span>
//                   <i className="fa-solid fa-arrow-right"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Home;
