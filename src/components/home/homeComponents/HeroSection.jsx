import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative h-[100vh] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          Let’s create something amazing together.
          <br /> Reach out now!
        </h1>

        <p className="text-base sm:text-lg mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Condimentum
          nunc praesent bibendum class fringilla mollis consectetur pharetra.
          Ex lacus justo fames sodales, neque magna finibus arcu iaculis.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition-all">
            Join Our Team
          </button>
          <button className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-semibold transition-all">
            Collaborate with Us →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;