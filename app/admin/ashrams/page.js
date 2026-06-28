"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, Plus, Trash2, Edit2, ArrowLeft, Search, Upload, 
  CheckCircle, AlertTriangle, Phone, Mail, Clock, ShieldAlert, RefreshCw
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage } from "../../../lib/upload";

export default function AdminAshramsPage() {
  const [ashrams, setAshrams] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    email: "",
    timings: "",
    description: "",
    centerType: "Ashram",
    imageUrl: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAshrams();
  }, []);

  const fetchAshrams = async () => {
    setIsLoading(true);
    try {
      const data = await db.getAshrams();
      setAshrams(data || []);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch ashrams.");
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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
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

  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      phone: "",
      email: "",
      timings: "",
      description: "",
      centerType: "Ashram",
      imageUrl: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.latitude || !form.longitude) {
      showFeedback("error", "Name, Address, Latitude, and Longitude are required.");
      return;
    }

    setIsUploading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "ashrams");
        imageUrl = uploadResult.downloadUrl;
      }

      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        imageUrl
      };

      if (view === "create") {
        await db.createAshram(payload);
        showFeedback("success", "Center added successfully!");
      } else {
        await db.updateAshram(editingId, payload);
        showFeedback("success", "Center updated successfully!");
      }

      resetForm();
      setView("list");
      await fetchAshrams();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to save center details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (ash) => {
    setEditingId(ash.id);
    setForm({
      name: ash.name || "",
      address: ash.address || "",
      latitude: ash.latitude || "",
      longitude: ash.longitude || "",
      phone: ash.phone || "",
      email: ash.email || "",
      timings: ash.timings || "",
      description: ash.description || "",
      centerType: ash.centerType || "Ashram",
      imageUrl: ash.imageUrl || ""
    });
    setImagePreview(ash.imageUrl || "");
    setView("edit");
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsLoading(true);
    setShowDeleteModal(false);
    try {
      await db.deleteAshram(deletingId);
      showFeedback("success", "Center deleted successfully.");
      await fetchAshrams();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete center.");
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  const filteredAshrams = ashrams.filter(ash => 
    ash.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ash.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ash.centerType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon flex items-center gap-2">
            <MapPin className="w-6 h-6 text-saffron" />
            Ashrams & Temples
          </h1>
          <p className="text-xs text-dark-brown/60 mt-1">
            Manage your physical spiritual sanctuaries, temples, and satsang locations.
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => { resetForm(); setView("create"); }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Center
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gold/20 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
        )}
      </div>

      {feedback.message && (
        <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 border ${
          feedback.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {feedback.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-xs font-semibold">{feedback.message}</span>
        </div>
      )}

      {view === "list" && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gold/15 p-6 shadow-sm">
          <div className="flex gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
              <input
                type="text"
                placeholder="Search centers by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cream/40 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-saffron animate-spin" />
              <p className="mt-3 text-xs text-dark-brown/50 font-medium">Loading centers...</p>
            </div>
          ) : filteredAshrams.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gold/10 rounded-2xl">
              <MapPin className="w-12 h-12 text-gold/30 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-dark-brown/85">No centers registered</h3>
              <p className="text-xs text-dark-brown/50 mt-1">Publish your ashrams, temples, or satsang venues.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAshrams.map(ash => (
                <div 
                  key={ash.id} 
                  className="border border-gold/15 rounded-2xl p-5 bg-white flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
                >
                  <div>
                    {ash.imageUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-gold/10">
                        <img src={ash.imageUrl} alt={ash.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 bg-maroon/10 text-maroon text-[9px] font-extrabold uppercase rounded border border-maroon/5">
                        {ash.centerType}
                      </span>
                      <span className="text-[10px] text-dark-brown/50 font-bold">
                        Lat/Lng: {ash.latitude}, {ash.longitude}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-sm text-maroon leading-tight mb-2 truncate" title={ash.name}>
                      {ash.name}
                    </h3>
                    
                    <p className="text-[11px] text-dark-brown/65 leading-relaxed font-sans mb-3 line-clamp-2">
                      {ash.address}
                    </p>

                    <div className="space-y-1 text-[10px] text-dark-brown/50 border-t border-gold/10 pt-3">
                      <p className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-saffron" /> {ash.timings}</p>
                      {ash.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-saffron" /> {ash.phone}</p>}
                      {ash.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-saffron" /> {ash.email}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gold/10">
                    <button
                      onClick={() => handleEditClick(ash)}
                      className="p-1.5 bg-cream hover:bg-gold-light/20 text-maroon rounded-lg transition-colors border border-gold/10"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDelete(ash.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSubmit} className="bg-white/85 backdrop-blur-md border border-gold/15 p-6 rounded-2xl shadow-sm">
          <h3 className="font-serif font-bold text-lg text-maroon border-b border-gold/15 pb-3 mb-6">
            {view === "create" ? "Add Spiritual Center" : `Edit Center: ${form.name}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Center Image Upload */}
            <div>
              <div className="border border-gold/15 rounded-xl p-4 bg-cream/15 text-center">
                <label className="block text-[11px] uppercase font-bold text-dark-brown/70 tracking-wider mb-2 text-left">
                  Center Image
                </label>
                
                {imagePreview ? (
                  <div className="relative w-full h-44 rounded-lg overflow-hidden border border-gold/25 shadow mb-3">
                    <img src={imagePreview} alt="Center Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(""); }}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-44 rounded-lg border-2 border-dashed border-gold/20 flex flex-col items-center justify-center bg-white/50 mb-3">
                    <Upload className="w-6 h-6 text-gold/45 mb-2" />
                    <span className="text-[10px] text-dark-brown/55 px-3">Upload Center Photo (max 5MB)</span>
                  </div>
                )}
                
                <input
                  type="file"
                  id="centerImageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("centerImageInput").click()}
                  className="px-3 py-1.5 bg-cream border border-gold/25 hover:bg-gold-light/20 text-maroon text-[10px] font-bold rounded-lg transition-all"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Center Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Neelmani Kripalu Ashram Vrindavan"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Full Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Raman Reti Road, Vrindavan, UP - 281121"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Latitude (Decimal) *</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g. 27.5726"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Longitude (Decimal) *</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g. 77.6836"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 565 2442000"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="e.g. vrindavan@satsang.org"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Timings</label>
                <input
                  type="text"
                  name="timings"
                  value={form.timings}
                  onChange={handleInputChange}
                  placeholder="e.g. 05:00 AM - 12:00 PM, 04:00 PM - 09:00 PM"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Center Type</label>
                <select
                  name="centerType"
                  value={form.centerType}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white font-bold"
                >
                  <option value="Temple">Temple</option>
                  <option value="Ashram">Ashram</option>
                  <option value="Satsang Center">Satsang Center</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Description / History</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter dynamic details regarding this center..."
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron font-sans"
                />
              </div>

              <div className="sm:col-span-2 border-t border-gold/15 pt-5 mt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-white border border-gold/15 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all"
                >
                  Clear Fields
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Uploading & Saving...
                    </>
                  ) : (
                    "Save Center"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gold/20 p-6 max-w-sm w-full text-center shadow-xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-dark-brown">Delete Center?</h3>
            <p className="text-xs text-dark-brown/65 mt-2">
              Are you sure you want to permanently delete this spiritual center? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gold/20 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
