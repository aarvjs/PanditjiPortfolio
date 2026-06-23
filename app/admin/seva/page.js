"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartHandshake, Plus, Trash2, Edit2, ArrowLeft, Upload, 
  ShieldAlert, CheckCircle, Search, Layers, TrendingUp 
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";

export default function AdminSevaPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "Food Distribution",
    location: "Vrindavan Dham",
    impactText: "",
    status: "active", // "active" | "completed"
    order: 1,
    imageUrl: "",
    imageStoragePath: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await db.getCampaigns();
      // Sort by order asc
      setCampaigns(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch campaigns from Firestore.");
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
    const parsedValue = name === "order" ? parseInt(value) || 0 : value;
    setForm(prev => ({ ...prev, [name]: parsedValue }));
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
    if (!form.title || !form.shortDescription || !form.location) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      let imageUrl = form.imageUrl;
      let imageStoragePath = form.imageStoragePath;

      // Handle Image Upload
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "sevaCampaigns");
        imageUrl = uploadResult.downloadUrl;
        imageStoragePath = uploadResult.storagePath;

        // If editing and had old image, delete the old one
        if (view === "edit" && form.imageStoragePath) {
          await deleteImage(form.imageStoragePath);
        }
      }

      const campaignPayload = {
        ...form,
        imageUrl,
        imageStoragePath
      };

      if (view === "create") {
        await db.addCampaign(campaignPayload);
        showFeedback("success", "Seva Campaign added successfully!");
      } else {
        await db.updateCampaign(editingId, campaignPayload);
        showFeedback("success", "Seva Campaign updated successfully!");
      }

      resetForm();
      await fetchCampaigns();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to save campaign.");
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  const handleEditClick = (campaign) => {
    setEditingId(campaign.id);
    setForm({
      title: campaign.title || "",
      shortDescription: campaign.shortDescription || "",
      description: campaign.description || "",
      category: campaign.category || "Food Distribution",
      location: campaign.location || "Vrindavan Dham",
      impactText: campaign.impactText || "",
      status: campaign.status || "active",
      order: campaign.order || 1,
      imageUrl: campaign.imageUrl || campaign.bannerUrl || "",
      imageStoragePath: campaign.imageStoragePath || ""
    });
    setImagePreview(campaign.imageUrl || campaign.bannerUrl || "");
    setImageFile(null);
    setView("edit");
  };

  const handleDeleteClick = async (campaign) => {
    if (!confirm(`Are you sure you want to delete campaign "${campaign.title}"?`)) return;
    setIsLoading(true);
    try {
      // 1. Delete image file from Storage
      if (campaign.imageStoragePath) {
        await deleteImage(campaign.imageStoragePath);
      }
      // 2. Delete document from Firestore
      await db.deleteCampaign(campaign.id);
      showFeedback("success", "Seva Campaign deleted successfully!");
      await fetchCampaigns();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete campaign.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      shortDescription: "",
      description: "",
      category: "Food Distribution",
      location: "Vrindavan Dham",
      impactText: "",
      status: "active",
      order: 1,
      imageUrl: "",
      imageStoragePath: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setView("list");
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Seva Campaigns" : view === "create" ? "Add Seva Campaign" : "Edit Seva Campaign"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Publish selfless service drives like Annadan, cow shelter support, and rural educational distribution."
              : "Define campaign details, category, and highlight impact goals below."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campaign</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to list</span>
          </button>
        )}
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
          feedback.type === "error" 
            ? "bg-rose-50 border-rose-200 text-rose-800" 
            : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          {feedback.type === "error" ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {isLoading && view === "list" ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : view === "list" ? (
        <>
          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search campaigns by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <HeartHandshake className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No seva campaigns found.</p>
              <p className="text-xs text-dark-brown/50 mt-1">Add your first Seva Campaign details to begin.</p>
            </div>
          ) : (
            /* Campaigns Table */
            <div className="bg-white/80 border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-dark/30 border-b border-gold/15 text-[10px] font-bold uppercase tracking-wider text-dark-brown/60">
                      <th className="p-4 font-serif">Order</th>
                      <th className="p-4 font-serif">Image & Campaign</th>
                      <th className="p-4 font-serif">Category</th>
                      <th className="p-4 font-serif">Location</th>
                      <th className="p-4 font-serif">Status</th>
                      <th className="p-4 font-serif text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredCampaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-cream/40 transition-colors">
                        <td className="p-4 font-bold text-maroon text-center max-w-[50px]">
                          {camp.order}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-gold-light/20 flex-shrink-0 border border-gold/15">
                              <img
                                src={camp.imageUrl || camp.bannerUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-maroon block text-sm">{camp.title}</span>
                              <span className="text-[10px] text-dark-brown/50 block font-serif truncate max-w-xs">{camp.shortDescription}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-dark-brown/80 font-semibold uppercase">
                            {camp.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-dark-brown/80 font-medium">
                            {camp.location}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            camp.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {camp.status || "active"}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(camp)}
                              className="p-1.5 hover:bg-gold-light/45 text-maroon rounded-lg transition-colors border border-transparent hover:border-gold/15"
                              title="Edit campaign"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(camp)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Delete campaign"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Form View */
        <div className="bg-white/80 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Form Column */}
              <div className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Campaign Title <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Daily Annadan Food Seva"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Summary / Short Description <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    required
                    value={form.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief 1-sentence tagline describing the campaign"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Long Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    rows="6"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Elaborate on the seva goals, daily schedule, sadhus/pilgrims served, and how volunteers can participate..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                  />
                </div>

              </div>

              {/* Right Form Column */}
              <div className="space-y-4">
                
                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    >
                      <option value="Food Distribution">Food Distribution (Annadan)</option>
                      <option value="Cow Shelter">Cow Shelter (Gaushala)</option>
                      <option value="Education Support">Education Support (Gyan-Daan)</option>
                      <option value="Temple Maintenance">Temple Seva & Upkeep</option>
                      <option value="Social Welfare">Social Welfare Seva</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Campaign Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    >
                      <option value="active">Active Campaign</option>
                      <option value="completed">Completed Campaign</option>
                    </select>
                  </div>
                </div>

                {/* Location & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Location <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={form.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Vrindavan Dham"
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Display Order (Ascending)
                    </label>
                    <input
                      type="number"
                      name="order"
                      min="1"
                      required
                      value={form.order}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    />
                  </div>
                </div>

                {/* Impact Statement */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Impact Goals / Statement
                  </label>
                  <input
                    type="text"
                    name="impactText"
                    value={form.impactText}
                    onChange={handleInputChange}
                    placeholder="e.g. Over 500 sadhus fed hot prasadam daily."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Campaign Banner Image
                  </label>
                  
                  <div className="mt-1 flex gap-4 items-center">
                    {/* Image Preview Box */}
                    <div className="w-24 h-16 rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex-shrink-0 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <HeartHandshake className="w-5 h-5 text-gold/40" />
                      )}
                    </div>

                    {/* File Input */}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="seva-image-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="seva-image-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-cream-dark/50 hover:bg-gold-light/45 text-maroon text-xs font-bold rounded-xl cursor-pointer border border-gold/15 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                      </label>
                      <span className="text-[10px] text-dark-brown/50 block mt-1">
                        JPEG, PNG, WebP up to 5MB.
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="px-5 py-2.5 bg-cream-dark/45 hover:bg-gold-light/30 text-dark-brown font-bold text-xs uppercase tracking-wider rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {uploading ? "Uploading Image..." : isLoading ? "Saving Campaign..." : "Save Seva Campaign"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
