"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, ShieldAlert } from "lucide-react";
import * as db from "../../../lib/db";

export default function SiteSettingsPage() {
  const [form, setForm] = useState({
    organizationName: "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    googleMapLink: "",
    facebook: "",
    instagram: "",
    youtube: "",
    logoUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await db.getSiteSettings();
      if (data) {
        setForm({
          organizationName: data.organizationName || "",
          tagline: data.tagline || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          address: data.address || "",
          googleMapLink: data.googleMapLink || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
          logoUrl: data.logoUrl || ""
        });
      }
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch site settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await db.updateSiteSettings(form);
      showFeedback("success", "Site settings updated successfully.");
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to update site settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">Site Settings</h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Manage public details, contact info, and social media links.
          </p>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {feedback.type === "error" ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="bg-white/80 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-maroon text-sm border-b border-gold/15 pb-2">General Information</h3>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={form.tagline}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Google Map Link
                </label>
                <input
                  type="url"
                  name="googleMapLink"
                  value={form.googleMapLink}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h3 className="font-bold text-maroon text-sm border-b border-gold/15 pb-2">Contact & Social</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={form.facebook}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  YouTube URL
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={form.youtube}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gold/15 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
