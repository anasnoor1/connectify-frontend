import React from "react";
import { FaPlay, FaStar } from "react-icons/fa";
<<<<<<< HEAD
import hero from "../assets/hero-1.webp"; // replace with your testimonial video/image background
=======
import hero from "../assets/hero-1.webp"; 
>>>>>>> 3c97fcc33e0a1c3bf8be97104ca75da42a2cdd1e
import olivia from "../assets/olivia.webp";
import sophia from "../assets/sophie.webp";
import ethan from "../assets/ethan.webp";
import jackie from "../assets/jackie.webp";
import galaxyBg from "../assets/Galaxy-Background.webp";

const Testimonials = () => {
  return (
    <section className="bg-[#f5f6ff] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h4 className="text-indigo-500 font-semibold">// Testimonial</h4>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Words From Those Who've <br /> Worked With Us
            </h2>
          </div>
          <p className="text-gray-500 mt-4 md:mt-0 max-w-sm">
            Sed ac suscipit tellus, a volutpat erat. Proin sit amet fermentum massa. 
            Cras tincidunt cursus auctor.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {/* Testimonial Card 1 */}
          <TestimonialCard
            image={olivia}
            name="Olivia Carter"
            title="Brand Manager at Shine Glow"
            text="In venenatis elementum quam, et tempor nunc. Curabitur enim dolor, convallis at porta sed quis rutrum eget nibh."
            rating={5}
          />

          {/* Testimonial Card 2 */}
          <TestimonialCard
            image={sophia}
            name="Sophia Clarke"
            title="Social Media Influencer"
            text="Suspendisse rhoncus metus tortor, quis augue fringilla eros tristique a. Vestibulum in mollis et neque eget."
            rating={4}
          />

          {/* Testimonial Video */}
          <div className="relative bg-black rounded-2xl overflow-hidden group shadow-md">
            <img
              src={hero}
              alt="Richard Torres"
              className="opacity-80 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-semibold text-lg">Richard Torres</h4>
              <p className="text-indigo-300 text-sm">CEO of Bright Corp</p>
            </div>
            <button
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white/20 rounded-full p-6 backdrop-blur-sm hover:bg-white/30 transition">
                <FaPlay className="text-white text-3xl" />
              </div>
            </button>
          </div>

          {/* Rating Summary */}
<<<<<<< HEAD
          <div style={{ backgroundImage: `url(${galaxyBg})` }}
          className="bg-cover bg-center text-white p-10 rounded-2xl flex flex-col justify-center shadow-lg">
=======
          <div 
            className="bg-cover bg-center bg-no-repeat text-white p-10 rounded-2xl flex flex-col justify-center shadow-lg"
            style={{ backgroundImage: `url(${galaxyBg})` }}
          >
>>>>>>> 3c97fcc33e0a1c3bf8be97104ca75da42a2cdd1e
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-indigo-400" />
              ))}
            </div>
            <h3 className="text-5xl font-bold">4.75/5</h3>
            <p className="text-white-300 mt-2">Ratings</p>
            <p className="text-white-400 mt-4 text-sm">
              Based on 2,730 reviews from our partners
            </p>
          </div>

          {/* Testimonial Card 3 */}
          <TestimonialCard
            image={ethan}
            name="Ethan Williams"
            title="Head of Marketing at AETHR"
            text="Donec dictum diam tellus, ut dictum dolor sit facilisis eu. Pellentesque aliquet tellus a mauris pellentesque laoreet."
            rating={5}
          />

          {/* Testimonial Card 4 */}
          <TestimonialCard
            image={jackie}
            name="Jackie Stevens"
            title="Lifestyle Influencer"
            text="Aliquam turpis nisl, gravida laoreet lorem faucibus, malesuada auctor quam. Suspendisse dolor erat."
            rating={5}
          />
        </div>
      </div>
    </section>
  );
};

// Reusable Testimonial Card Component
const TestimonialCard = ({ image, name, title, text, rating }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="flex items-center space-x-4 mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-indigo-500 text-sm">{title}</p>
      </div>
    </div>
    <p className="text-gray-600 italic mb-4">“{text}”</p>
    <div className="flex space-x-1">
      {[...Array(rating)].map((_, i) => (
        <FaStar key={i} className="text-indigo-400" />
      ))}
    </div>
  </div>
);

<<<<<<< HEAD
export default Testimonials;
=======
export default Testimonials;
>>>>>>> 3c97fcc33e0a1c3bf8be97104ca75da42a2cdd1e
