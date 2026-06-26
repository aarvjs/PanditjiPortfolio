"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import * as db from "../../../lib/db";
import Toast from "../../../components/Toast";

export default function SiteSettingsPage() {
  const [form, setForm] = useState({
    organizationName: "",
    tagline: "",
    heroTitle: "",
    heroDescription: "",
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
  const [toast, setToast] = useState({ message: "", type: "success" });

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
          heroTitle: data.heroTitle || "",
          heroDescription: data.heroDescription || "",
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
      showToast("Failed to fetch site settings.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
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
      showToast("Site settings updated successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update site settings.", "error");
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
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "success" })} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">Site Settings</h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Manage public details, contact info, home hero content, and social media links.
          </p>
        </div>
      </div>

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
                  Hero Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={form.heroTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Spiritual Haven for Love, Devotion..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Hero Description
                </label>
                <textarea
                  name="heroDescription"
                  rows="3"
                  value={form.heroDescription}
                  onChange={handleInputChange}
                  placeholder="e.g. Under the supreme spiritual lineage..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
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

          <div className="pt-4 border-t border-gold/15 flex justify-end font-sans">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
