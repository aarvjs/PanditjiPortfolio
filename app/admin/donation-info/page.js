"use client";

import React, { useState, useEffect } from "react";
import { Landmark, Save, CheckCircle, ShieldAlert, Upload } from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";

export default function DonationInfoPage() {
  const [form, setForm] = useState({
    upiId: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    donationMessage: "",
    impactWorks: "",
    qrImageUrl: "",
    qrImageStoragePath: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.subscribeToDonationInfo((data) => {
      if (data) {
        setForm({
          upiId: data.upiId || "",
          accountName: data.accountName || "",
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          ifscCode: data.ifscCode || "",
          donationMessage: data.donationMessage || "",
          impactWorks: data.impactWorks || "",
          qrImageUrl: data.qrImageUrl || "",
          qrImageStoragePath: data.qrImageStoragePath || ""
        });
        setImagePreview(data.qrImageUrl || "");
      }
      setIsLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

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
      let qrImageUrl = form.qrImageUrl;
      let qrImageStoragePath = form.qrImageStoragePath;

      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "donations");
        qrImageUrl = uploadResult.downloadUrl;
        qrImageStoragePath = uploadResult.storagePath;

        if (form.qrImageStoragePath) {
          await deleteImage(form.qrImageStoragePath);
        }
      }

      const payload = {
        ...form,
        qrImageUrl,
        qrImageStoragePath
      };

      await db.updateDonationInfo(payload);
      setForm(payload);
      showFeedback("success", "Donation info updated successfully.");
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to update donation info.");
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
          <h2 className="font-serif text-2xl font-black text-maroon">Donation Information</h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Manage bank details, UPI information, and donation messaging.
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
            
            {/* Bank & UPI Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-maroon text-sm border-b border-gold/15 pb-2 flex items-center gap-2">
                <Landmark className="w-4 h-4" /> Bank & UPI Details
              </h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleInputChange}
                  placeholder="e.g. nks@okicici"
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={form.accountName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  QR Code Image
                </label>
                <div className="mt-1 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex-shrink-0 flex items-center justify-center p-1">
                    {imagePreview ? (
                      <img src={imagePreview} alt="QR Code Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-dark-brown/40 text-center leading-tight">No QR uploaded</span>
                    )}
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="qr-image-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="qr-image-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-cream-dark/50 hover:bg-gold-light/45 text-maroon text-xs font-bold rounded-xl cursor-pointer border border-gold/15 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload QR Code</span>
                    </label>
                    <span className="text-[10px] text-dark-brown/50 block mt-1">
                      Clear PNG or JPG recommended.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messaging */}
            <div className="space-y-4">
              <h3 className="font-bold text-maroon text-sm border-b border-gold/15 pb-2">Donation Messaging</h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Main Donation Message
                </label>
                <textarea
                  name="donationMessage"
                  rows="4"
                  value={form.donationMessage}
                  onChange={handleInputChange}
                  placeholder="Offer your loving support..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5">
                  Impact & Works Supported
                </label>
                <textarea
                  name="impactWorks"
                  rows="4"
                  value={form.impactWorks}
                  onChange={handleInputChange}
                  placeholder="e.g. Annadan food distribution, child values education..."
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
              <span>{isSaving ? "Saving..." : "Save Donation Info"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
