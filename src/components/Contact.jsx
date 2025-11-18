import React, { useState } from "react";
import axios from "../utills/privateIntercept";

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-mail" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="url(#grad-mail)" strokeWidth="1.7"/>
      <path d="M4 7l8 6 8-6" stroke="url(#grad-mail)" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-phone" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path d="M8.5 3.5l2 3.8-1.8 1.8a11.5 11.5 0 005.2 5.2l1.8-1.8 3.8 2c.6.3.8 1 .4 1.6-.7 1.1-2 1.9-3.2 1.9-7.4 0-13.4-6-13.4-13.4 0-1.3.8-2.6 1.9-3.2.6-.4 1.3-.2 1.6.1Z" stroke="url(#grad-phone)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconLocation() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-loc" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M12 21s6-6 6-10a6 6 0 10-12 0c0 4 6 10 6 10Z" stroke="url(#grad-loc)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="11" r="2.5" stroke="url(#grad-loc)" strokeWidth="1.7"/>
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-send" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path d="M4 11l15-7-7 15-1-6-7-2Z" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email || '').trim());
    if (!form.name || !form.email || !form.message || !emailOk) {
      setError("Please provide a valid Name, Email, and Message.");
      return;
    }
    try {
      const res = await axios.post("/api/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (res?.data?.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 2500);
      } else {
        setError(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <section className="relative overflow-hidden rounded-2xl border shadow-sm mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-fuchsia-50 to-blue-50" />
        <div className="relative p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Let’s talk about your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-blue-500">collaboration</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            Have a question, brief, or idea? Send us a message and we’ll respond within one business day.
          </p>
          <div className="mt-5 flex gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border">
              <IconMail />
              <span className="text-gray-700">Human support. No bots.</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border">
              <IconPhone />
              <span className="text-gray-700">Response in 24h</span>
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 active:scale-[0.98]"
            >
              <IconSend />
              <span>Send Message</span>
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {sent && (
              <p className="text-green-600 text-sm">Thanks! We will reach out soon.</p>
            )}
          </form>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Reach us</h3>
            <ul className="mt-3 space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"><IconMail /></span>
                <a href="mailto:support@connectify.com" className="hover:underline hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded">support@connectify.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-fuchsia-50 text-fuchsia-600"><IconPhone /></span>
                <a href="tel:03035926784" className="hover:underline hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded">03035926784</a>
              </li>
              <li className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600"><IconLocation /></span> Remote-first</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Office hours</h3>
            <p className="mt-2 text-gray-600 text-sm">Mon–Fri: 9:00 AM – 6:00 PM PKT</p>
            <p className="text-gray-600 text-sm">Sat–Sun: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
