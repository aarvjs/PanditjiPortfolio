"use client";

import React, { useState } from "react";
import { submitContactForm } from "../lib/db";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg("Please fill out all fields.");
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");
      await submitContactForm(formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong. Please try again later.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fade-in">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-emerald-950 mb-2">Message Sent Successfully</h3>
        <p className="text-sm text-emerald-800 leading-relaxed mb-4">
          Jai Shri Radhey! Thank you for reaching out to us. Our satsang volunteer coordinators will review your query and reply soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
        >
          Send Another Message
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

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Your Full Name
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Ramesh Kumar"
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Email Address
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="e.g. ramesh@example.com"
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Subject / Reason
        </label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="e.g. Inquiry about upcoming retreat"
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
          Your Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Write your spiritual query, feedback, or message here..."
          className="w-full bg-white border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron text-dark-brown resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3 px-6 bg-saffron hover:bg-maroon text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>{status === "submitting" ? "Sending Message..." : "Send Message"}</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
