"use client";

import React, { useState } from "react";
import { submitVolunteerForm } from "../lib/db";
import { HeartHandshake, CheckCircle2, AlertCircle } from "lucide-react";

export default function VolunteerForm({ prefilledInterest = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    address: "",
    interestArea: "Food Distribution (Annadan)",
    message: ""
  });

  React.useEffect(() => {
    if (prefilledInterest) {
      // Find closest match or assign directly
      setFormData(prev => ({ ...prev, interestArea: prefilledInterest }));
    }
  }, [prefilledInterest]);

  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const interestOptions = [
    "Food Distribution (Annadan)",
    "Spiritual & Basic Education (Gyan-Daan)",
    "Temple maintenance & Cleaning",
    "Sankirtan Choir / Chanting",
    "Event Management & Seating",
    "Social Media & Tech Seva"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.city || !formData.address) {
      setErrorMsg("Please fill out all required fields.");
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");
      await submitVolunteerForm(formData);
      setStatus("success");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        city: "",
        address: "",
        interestArea: "Food Distribution (Annadan)",
        message: ""
      });
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to register. Please check connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-gold-light/20 to-cream rounded-2xl p-6 md:p-8 text-center border border-gold/30 animate-fade-in">
        <div className="w-14 h-14 bg-saffron text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-maroon mb-2">Volunteer Registration Successful!</h3>
        <p className="text-sm text-dark-brown/85 leading-relaxed mb-6">
          Radhey Radhey! Thank you for offering your time and devotion to service. Your registration is saved in our system. One of our Seva coordinators will contact you shortly on your mobile or email.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold tracking-wider text-xs rounded-full transition-all uppercase"
        >
          Register Another Volunteer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="vol-name" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
            Full Name <span className="text-saffron">*</span>
          </label>
          <input
            type="text"
            id="vol-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Anand Sharma"
            className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="vol-mobile" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
            Mobile Number <span className="text-saffron">*</span>
          </label>
          <input
            type="tel"
            id="vol-mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            placeholder="e.g. +91 9876543210"
            className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="vol-email" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
            Email Address <span className="text-saffron">*</span>
          </label>
          <input
            type="email"
            id="vol-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="e.g. anand@example.com"
            className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="vol-city" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
            City <span className="text-saffron">*</span>
          </label>
          <input
            type="text"
            id="vol-city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="e.g. Vrindavan"
            className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="vol-address" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Full Postal Address <span className="text-saffron">*</span>
        </label>
        <input
          type="text"
          id="vol-address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="e.g. Flat 302, Radha Kunj, Raman Reti, Vrindavan, UP"
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
        />
      </div>

      {/* Interest Area */}
      <div>
        <label htmlFor="vol-interest" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Interest Seva Area <span className="text-saffron">*</span>
        </label>
        <select
          id="vol-interest"
          name="interestArea"
          value={formData.interestArea}
          onChange={handleChange}
          required
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
        >
          {interestOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="vol-message" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Any Special Notes / Skills (Optional)
        </label>
        <textarea
          id="vol-message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about yourself or any special skills you wish to offer (e.g. musical training, medical experience, cooking skills)..."
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3.5 px-6 bg-saffron hover:bg-maroon text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>{status === "submitting" ? "Registering..." : "Become a Volunteer"}</span>
        <HeartHandshake className="w-4 h-4" />
      </button>
    </form>
  );
}
