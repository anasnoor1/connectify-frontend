import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [openIndex, setOpenIndex] = useState(0);

  const tabs = ["General", "Talent-Specific", "Brand-Specific"];

  const faqs = [
    {
      question: "What does your agency do?",
      answer:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast.",
    },
    {
      question: "Who can join your talent roster?",
      answer:
        "Anyone passionate about creative collaboration and innovation can apply.",
    },
    {
      question: "Do I need a certain number of followers to apply?",
      answer:
        "No, we value creativity and engagement over numbers. All are welcome!",
    },
    {
      question: "What type of influencers do you work with?",
      answer:
        "We collaborate with influencers from all niches—tech, lifestyle, fitness, fashion, and more.",
    },
    {
      question: "What are your fees and commission rates?",
      answer:
        "Our rates are competitive and vary depending on project type and scope. Contact us for details.",
    },
  ];

  return (
    <section className="bg-[#f6f6fe] py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Left Tabs + Accordion */}
        <div className="md:col-span-2">
          <p className="text-purple-500 font-medium mb-2">// FAQs</p>
          <h2 className="text-4xl font-bold mb-8">
            Common Questions About
            <br /> Our Agency & Services
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === tab
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-full px-6 py-3 shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center text-left font-semibold text-gray-900"
                >
                  {faq.question}
                  <span>{openIndex === index ? "−" : "+"}</span>
                </button>
                {openIndex === index && (
                  <p className="text-gray-600 mt-2 text-sm px-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>



        <div
          className="relative bg-white rounded-2xl overflow-hidden shadow-md h-130 flex items-end text-white p-6"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-2xl font-bold">
              Need more info? <br /> Reach out now!
            </h3>
            <p className="text-sm mt-2">
              Didn’t find what you were looking for? Reach out to us — we're
              happy to help!
            </p>
            <Link
  to="/contact"
  className="mt-4 bg-purple-500 hover:bg-purple-600 px-5 py-2 rounded-full font-medium transition-all inline-block text-white text-center"
>
  Contact Us
</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;