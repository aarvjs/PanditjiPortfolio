"use client";

import React, { useState, useEffect } from "react";
import { Compass, Save, CheckCircle, ShieldAlert, Upload } from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";

export default function AdminAboutContentPage() {
  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    guruJiName: "",
    guruJiIntro: "",
    guruJiImageUrl: "",
    guruJiImageStoragePath: "",
    mission: "",
    vision: "",
    qualifications: "",
    philosophy: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    setIsLoading(true);
    try {
      const data = await db.getAboutContent();
      if (data) {
        setForm({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          guruJiName: data.guruJiName || "",
          guruJiIntro: data.guruJiIntro || "",
          guruJiImageUrl: data.guruJiImageUrl || "",
          guruJiImageStoragePath: data.guruJiImageStoragePath || "",
          mission: data.mission || "",
          vision: data.vision || "",
          qualifications: data.qualifications || "",
          philosophy: data.philosophy || ""
        });
        setImagePreview(data.guruJiImageUrl || "");
      }
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch about page content.");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let guruJiImageUrl = form.guruJiImageUrl;
      let guruJiImageStoragePath = form.guruJiImageStoragePath;

      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "about");
        guruJiImageUrl = uploadResult.downloadUrl;
        guruJiImageStoragePath = uploadResult.storagePath;

        if (form.guruJiImageStoragePath) {
          try {
            await deleteImage(form.guruJiImageStoragePath);
          } catch (delErr) {
            console.warn("Could not delete old image:", delErr);
          }
        }
      }

      const payload = {
        ...form,
        guruJiImageUrl,
        guruJiImageStoragePath
      };

      await db.updateAboutContent(payload);
      setForm(payload);
      showFeedback("success", "About page content updated successfully.");
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to update about content.");
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
          <h2 className="font-serif text-2xl font-black text-maroon flex items-center gap-2">
            <Compass className="w-6 h-6 text-maroon" /> About Page Content
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Manage the titles, hero banner, mission, vision, and qualifications displayed on the public About page.
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
            
            {/* Hero & Intro Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-maroon text-sm border-b border-gold/15 pb-2">Hero & Intro Section</h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Hero Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={form.heroTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Guiding Devotees Through Bhakti, Seva and Satsang"
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Hero Subtitle / Badge
                </label>
                <input
                  type="text"
                  name="heroSubtitle"
                  value={form.heroSubtitle}
                  onChange={handleInputChange}
                  placeholder="e.g. About Guru Ji"
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Guru Ji Name
                </label>
                <input
                  type="text"
                  name="guruJiName"
                  value={form.guruJiName}
                  onChange={handleInputChange}
                  placeholder="e.g. Jagadguru Shri Kripalu Ji Maharaj"
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Guru Ji Bio / Intro Text
                </label>
                <textarea
                  name="guruJiIntro"
                  rows="5"
                  value={form.guruJiIntro}
                  onChange={handleInputChange}
                  placeholder="Under the divine shade of..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Guru Ji Portrait Photo
                </label>
                <div className="mt-1 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex-shrink-0 flex items-center justify-center p-1">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Guru Ji Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-dark-brown/40 text-center leading-tight">No image</span>
                    )}
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="guruji-image-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="guruji-image-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-cream-dark/50 hover:bg-gold-light/45 text-maroon text-xs font-bold rounded-xl cursor-pointer border border-gold/15 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                    </label>
                    <span className="text-[10px] text-dark-brown/50 block mt-1">
                      Vertical aspect ratio recommended.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy & Mission Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-maroon text-sm border-b border-gold/15 pb-2">Philosophy & Mission</h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Spiritual Mission
                </label>
                <textarea
                  name="mission"
                  rows="3"
                  value={form.mission}
                  onChange={handleInputChange}
                  placeholder="e.g. To spread the divine philosophy of Raganuga Bhakti..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Spiritual Vision
                </label>
                <textarea
                  name="vision"
                  rows="3"
                  value={form.vision}
                  onChange={handleInputChange}
                  placeholder="e.g. To cultivate a global community of selfless volunteers..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Qualifications Description
                </label>
                <textarea
                  name="qualifications"
                  rows="3"
                  value={form.qualifications}
                  onChange={handleInputChange}
                  placeholder="e.g. Fifth Original Jagadguru, master of all scriptures."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Spiritual Philosophy Summary
                </label>
                <textarea
                  name="philosophy"
                  rows="4"
                  value={form.philosophy}
                  onChange={handleInputChange}
                  placeholder="e.g. At Neelmani Kripalu Satsang, we follow a simple yet deep..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
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
              <span>{isSaving ? "Saving..." : "Save About Content"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
