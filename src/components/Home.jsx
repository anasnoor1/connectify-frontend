import React from "react";
import hero from "../assets/hero-1.webp";
import WhyChoose from "./WhyChoose";
import Testimonials from "./Testimonials";

const Home = () => {
  const partners = [49, 52, 50, 51, 40, 47];

  return (
    <div className="font-sans text-gray-800">
      <main>
        {/* Hero Section */}
        <section className="bg-indigo-50 py-20">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Transforming Talent into{" "}
                <span className="text-indigo-600">Influence</span>
              </h1>
              <p className="text-gray-600 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Ornare nisl aliquam ut consectetur maecenas eros.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Discover More
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-indigo-600 font-medium hover:underline"
                >
                  <span>Meet Our Talent</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={hero}
                alt="Hero"
                className="rounded-xl shadow-xl max-w-md w-full"
              />
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto text-center px-6">
            <h3 className="text-2xl font-semibold mb-10">
              Our Partners in Success — The Brands Behind{" "}
              <span className="text-indigo-600">the Stars</span>
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-10">
              {partners.map((num, i) => (
                <img
                  key={i}
                  src={`/images/logo-${num}.png`}
                  alt={`Partner ${i + 1}`}
                  className="w-28 grayscale hover:grayscale-0 transition duration-300"
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <img
              src={hero}
              alt="About Us"
              className="rounded-lg shadow-lg w-full"
            />
            <div>
              <h4 className="text-indigo-600 font-semibold">// About Us</h4>
              <h2 className="text-3xl font-bold mt-2 mb-6 leading-snug">
                Pioneering the Future of Talent and Influence Together
              </h2>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius
                magna semper primis ut auctor justo lacus dictum morbi.
              </p>
              <blockquote className="italic text-gray-700 border-l-4 border-indigo-500 pl-4 mb-6">
                “Senectus ullamcorper mollis posuere fringilla sit velit. Nisl
                velit etiam per mus cursus suscipit habitasse viverra.”
              </blockquote>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Montes class leo maecena</li>
                <li>Aenean in varius ante nibh</li>
                <li>Volutpat porta neque primis</li>
                <li>Etiam sit amet cursus arcu</li>
              </ul>

              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-bold text-indigo-600">12+</p>
                  <p className="text-gray-700">Years of Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-indigo-600">270+</p>
                  <p className="text-gray-700">Creative Talents</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-indigo-50">
          <div className="container mx-auto px-6">
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
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col"
                >
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                    {service}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    Sed velit magna, dictum sit amet ante eu, tristique tempor
                    ex. Phasellus neque enim nunc, ultrices eget bibendum id.
                  </p>
                  <a
                    href="/service_detail"
                    className="text-indigo-600 font-medium hover:underline mt-4 inline-flex items-center space-x-2"
                  >
                    <span>Learn More</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              ))}

              {/* Call-to-action Card */}
              <div className="bg-indigo-600 text-white p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">
                    Ready to elevate your brand?
                  </h3>
                  <p className="mb-6">
                    Let’s make it happen together with our expert team.
                  </p>
                </div>
                <a
                  href="/contact"
                  className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                >
                  <span>Get Started</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhyChoose />
      <Testimonials />
    </div>
  );
};

export default Home;
