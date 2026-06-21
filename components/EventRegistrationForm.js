"use client";

import React, { useState } from "react";
import { submitEventRegistration } from "../lib/db";
import { CheckCircle, AlertCircle, Users, ClipboardCopy } from "lucide-react";

export default function EventRegistrationForm({ eventId, eventTitle }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    participantsCount: 1,
    participantDetails: "",
    specialRequest: ""
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCount = (count) => {
    setFormData((prev) => ({ ...prev, participantsCount: count }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.address) {
      setErrorMsg("Please fill out all required fields.");
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");
      await submitEventRegistration({
        eventId,
        eventName: eventTitle,
        ...formData
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to process registration. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fade-in font-sans">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-emerald-950 mb-2">Registration Confirmed</h3>
        <p className="text-xs text-emerald-800 leading-relaxed mb-4">
          Jai Shri Radhey! Your seat has been successfully reserved for <strong>{eventTitle}</strong>. A confirmation code has been generated. Please keep your mobile active.
        </p>
        <div className="bg-white/80 rounded-lg p-3 max-w-xs mx-auto border border-emerald-100 flex items-center justify-between text-xs text-dark-brown/70 font-semibold mb-4">
          <span>Booking ID: NKS-{Date.now().toString().slice(-6)}</span>
          <button
            onClick={() => alert("Copied ID!")}
            className="text-saffron hover:underline text-[10px]"
          >
            Copy
          </button>
        </div>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              name: "",
              mobile: "",
              email: "",
              address: "",
              participantsCount: 1,
              participantDetails: "",
              specialRequest: ""
            });
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
        >
          New Registration
        </button>
      </div>
    );
  }

  return (
    <div id="register" className="bg-cream-dark/45 border border-gold/20 p-6 rounded-2xl shadow-sm">
      <h3 className="font-serif text-lg font-bold text-maroon mb-4 flex items-center gap-2 border-b border-gold/15 pb-2">
        <Users className="w-5 h-5 text-saffron" />
        <span>Satsang Seat Reservation</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === "error" && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1 font-serif">
            Your Name <span className="text-saffron">*</span>
          </label>
          <input
            type="text"
            id="reg-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="w-full bg-white border border-gold/25 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mobile */}
          <div>
            <label htmlFor="reg-mobile" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1 font-serif">
              Mobile Number <span className="text-saffron">*</span>
            </label>
            <input
              type="tel"
              id="reg-mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="10-digit mobile"
              className="w-full bg-white border border-gold/25 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1 font-serif">
              Email Address <span className="text-saffron">*</span>
            </label>
            <input
              type="email"
              id="reg-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. dev@example.com"
              className="w-full bg-white border border-gold/25 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="reg-address" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1 font-serif">
            Residential Address <span className="text-saffron">*</span>
          </label>
          <input
            type="text"
            id="reg-address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Locality, City, State"
            className="w-full bg-white border border-gold/25 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
        </div>

        {/* Participant Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-2 font-serif">
            Number of Participants <span className="text-saffron">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectCount(num)}
                className={`w-9 h-9 rounded-xl font-bold transition-all text-xs border flex items-center justify-center ${
                  formData.participantsCount === num
                    ? "bg-saffron text-white border-saffron shadow-sm"
                    : "bg-white text-dark-brown border-gold/25 hover:border-saffron"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSelectCount(6)}
              className={`px-3 h-9 rounded-xl font-bold transition-all text-xs border flex items-center justify-center ${
                formData.participantsCount >= 6
                  ? "bg-saffron text-white border-saffron shadow-sm"
                  : "bg-white text-dark-brown border-gold/25 hover:border-saffron"
              }`}
            >
              6+ (Group)
            </button>
          </div>
        </div>

        {/* Participant Details if > 1 */}
        {formData.participantsCount > 1 && (
          <div className="animate-fade-in">
            <label htmlFor="reg-details" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1 font-serif">
              Enter Group Member Names & Ages <span className="text-saffron">*</span>
            </label>
            <textarea
              id="reg-details"
              name="participantDetails"
              rows="3"
              value={formData.participantDetails}
              onChange={handleChange}
              required
              placeholder="e.g. Ramesh (45), Sita (40), Ravi (10)"
              className="w-full bg-white border border-gold/25 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown resize-none"
            />
          </div>
        )}

        {/* Special Request */}
        <div>
          <label htmlFor="reg-request" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1 font-serif">
            Any Special Requests / Support needed
          </label>
          <textarea
            id="reg-request"
            name="specialRequest"
            rows="3"
            value={formData.specialRequest}
            onChange={handleChange}
            placeholder="e.g. Elderly seating arrangements, wheelchair access support, ashram accommodation queries..."
            className="w-full bg-white border border-gold/25 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3 bg-saffron hover:bg-maroon text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md flex items-center justify-center disabled:opacity-50"
        >
          {status === "submitting" ? "Processing Seat..." : "Confirm Seat Reservation"}
        </button>
      </form>
    </div>
  );
}
