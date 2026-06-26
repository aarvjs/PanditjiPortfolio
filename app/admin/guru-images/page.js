"use client";

import React, { useState, useEffect } from "react";
import { 
  ImageIcon, Plus, Trash2, Edit3, ArrowLeft, Upload, 
  ShieldAlert, CheckCircle, Eye, EyeOff
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";
import Toast from "../../../components/Toast";

export default function AdminGuruImagesPage() {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });
  
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({
    title: "",
    category: "Divine Discourses",
    imageUrl: "",
    imageStoragePath: "",
    order: 1,
    status: "published"
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const data = await db.getGuruJiImages();
      setItems(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch Guru Ji photos.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
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

  const handleEditClick = (item) => {
    setForm({
      title: item.title || "",
      category: item.category || "Divine Discourses",
      imageUrl: item.imageUrl || item.src || "",
      imageStoragePath: item.imageStoragePath || "",
      order: item.order || 1,
      status: item.status || "published"
    });
    setEditingId(item.id);
    setImagePreview(item.imageUrl || item.src || "");
    setImageFile(null);
    setView("edit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || (!imageFile && !form.imageUrl)) {
      showToast("Please fill in all required fields and select an image.", "error");
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      let imageUrl = form.imageUrl;
      let imageStoragePath = form.imageStoragePath;

      // Handle Image Upload
      if (imageFile) {
        // If editing and previous image exists in storage, delete it first
        if (view === "edit" && form.imageStoragePath) {
          await deleteImage(form.imageStoragePath);
        }
        const uploadResult = await uploadImage(imageFile, "guruJiImages");
        imageUrl = uploadResult.downloadUrl;
        imageStoragePath = uploadResult.storagePath;
      }

      const payload = {
        title: form.title,
        category: form.category,
        imageUrl,
        imageStoragePath,
        order: form.order,
        status: form.status
      };

      if (view === "edit") {
        await db.updateGuruJiImage(editingId, payload);
        showToast("Guru Ji photo updated successfully!", "success");
      } else {
        await db.addGuruJiImage(payload);
        showToast("Guru Ji photo added successfully!", "success");
      }

      resetForm();
      await fetchImages();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to save photo.", "error");
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  const handleDeleteClick = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    setIsLoading(true);
    try {
      if (item.imageStoragePath) {
        await deleteImage(item.imageStoragePath);
      }
      await db.deleteGuruJiImage(item.id);
      showToast("Guru Ji photo deleted successfully!", "success");
      await fetchImages();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete photo.", "error");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "Divine Discourses",
      imageUrl: "",
      imageStoragePath: "",
      order: 1,
      status: "published"
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setView("list");
  };

  const categories = [
    "Divine Discourses",
    "Spiritual Shelter",
    "Sankirtan Ras",
    "Inner Contemplation",
    "Radha Krishna Bhakti",
    "Divine Philosophy",
    "Compassion Glance",
    "Satsang Union"
  ];

  const filteredItems = items.filter(item => {
    if (filterCategory === "all") return true;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "success" })} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Guru Ji Photos" : view === "create" ? "Add Guru Ji Photo" : "Edit Guru Ji Photo"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Manage portrait and spiritual photos of Maharaj Ji displayed in the public gallery section."
              : "Upload a beautiful photo of Maharaj Ji and assign order and categories."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to list</span>
          </button>
        )}
      </div>

      {isLoading && view === "list" ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : view === "list" ? (
        <>
          {/* Filters Bar */}
          <div className="flex gap-2 border-b border-gold/10 pb-1 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                filterCategory === "all"
                  ? "bg-maroon text-white border-maroon shadow-sm"
                  : "bg-white text-dark-brown/70 border-gold/20 hover:border-gold/50"
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  filterCategory === cat
                    ? "bg-maroon text-white border-maroon shadow-sm"
                    : "bg-white text-dark-brown/70 border-gold/20 hover:border-gold/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <ImageIcon className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No photos found under this category.</p>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/80 border border-gold/15 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group relative hover:border-saffron/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[4/5] w-full bg-gold-light/10 relative overflow-hidden">
                    <img
                      src={item.imageUrl || item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    {/* Status badge */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-0.5 ${
                        item.status === "draft" 
                          ? "bg-amber-100 text-amber-800 border border-amber-200" 
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {item.status === "draft" ? (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Draft</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            <span>Published</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Order badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/95 rounded text-[8px] font-bold text-dark-brown border border-gold/15 shadow-sm">
                      ORDER: {item.order}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-saffron tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-maroon mt-1 leading-tight line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-gold/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1 hover:bg-gold-light/20 text-maroon rounded border border-transparent hover:border-gold/15 transition-colors cursor-pointer"
                        title="Edit Photo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Form View */
        <div className="bg-white/80 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Photo Caption / Title <span className="text-saffron">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g. Guru Ji at Vrindavan Ashram"
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
              />
            </div>

            {/* Category & Order */}
            <div className="grid grid-cols-2 gap-4">
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
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                  Display Order
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

            {/* Status (Published / Draft) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Publish Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={form.status === "published"}
                    onChange={handleInputChange}
                    className="accent-maroon"
                  />
                  <span>Published (Show on Public Site)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={form.status === "draft"}
                    onChange={handleInputChange}
                    className="accent-maroon"
                  />
                  <span>Draft (Hide)</span>
                </label>
              </div>
            </div>

            {/* Image File Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Select Photo <span className="text-saffron">*</span>
              </label>
              <div className="mt-1 flex gap-4 items-center">
                <div className="w-24 h-24 rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex-shrink-0 flex items-center justify-center relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gold/40" />
                  )}
                </div>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="guru-photo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="guru-photo-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-cream-dark/50 hover:bg-gold-light/45 text-maroon text-xs font-bold rounded-xl cursor-pointer border border-gold/15 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                  </label>
                  <span className="text-[10px] text-dark-brown/50 block mt-1 leading-relaxed">
                    Select a high-quality photo (JPEG, PNG, WebP up to 5MB).
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-gold/15 flex justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="px-5 py-2.5 bg-cream-dark/45 hover:bg-gold-light/30 text-dark-brown font-bold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {uploading ? "Saving Photo..." : view === "edit" ? "Update Photo" : "Add Photo"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
