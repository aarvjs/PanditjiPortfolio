"use client";

import React, { useState, useEffect } from "react";
import { 
  ImageIcon, Video, Plus, Trash2, ArrowLeft, Upload, 
  ShieldAlert, CheckCircle, Play, Layers, ExternalLink 
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [filterType, setFilterType] = useState("all"); // 'all' | 'image' | 'video'
  const [form, setForm] = useState({
    title: "",
    category: "Satsang Events",
    type: "image", // "image" | "video"
    imageUrl: "",
    imageStoragePath: "",
    videoUrl: "",
    order: 1
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const data = await db.getGalleryItems();
      // Sort by order asc
      setItems(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch gallery items.");
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

  // Helper to get Youtube video thumbnail from its video link
  const getYoutubeThumbnail = (url) => {
    if (!url) return "";
    let videoId = "";
    // Matches youtube links
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || (form.type === "video" && !form.videoUrl) || (form.type === "image" && !imageFile && !form.imageUrl)) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      let imageUrl = form.imageUrl;
      let imageStoragePath = form.imageStoragePath;
      let videoUrl = form.videoUrl;

      // Handle Image Upload
      if (form.type === "image" && imageFile) {
        const uploadResult = await uploadImage(imageFile, "gallery");
        imageUrl = uploadResult.downloadUrl;
        imageStoragePath = uploadResult.storagePath;
      }

      // If it is a video, let's also auto-set image/thumbnail URL so it displays beautifully on front-end
      if (form.type === "video" && videoUrl) {
        imageUrl = getYoutubeThumbnail(videoUrl);
      }

      const galleryPayload = {
        ...form,
        imageUrl,
        imageStoragePath,
        videoUrl: form.type === "video" ? videoUrl : ""
      };

      await db.addGalleryItem(galleryPayload);
      showFeedback("success", "Gallery item uploaded successfully!");

      resetForm();
      await fetchGallery();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to add item.");
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  const handleDeleteClick = async (item) => {
    if (!confirm(`Are you sure you want to delete this gallery item "${item.title}"?`)) return;
    setIsLoading(true);
    try {
      // 1. Delete image file from Storage if applicable
      if (item.type === "image" && item.imageStoragePath) {
        await deleteImage(item.imageStoragePath);
      }
      // 2. Delete document from Firestore
      await db.deleteGalleryItem(item.id);
      showFeedback("success", "Gallery item deleted successfully!");
      await fetchGallery();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete item.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "Satsang Events",
      type: "image",
      imageUrl: "",
      imageStoragePath: "",
      videoUrl: "",
      order: 1
    });
    setImageFile(null);
    setImagePreview("");
    setView("list");
  };

  const filteredItems = items.filter(item => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Guru Ji Gallery" : "Upload Gallery Item"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Manage spiritual photos of Shri Maharaj Ji and embed YouTube satsang video clips."
              : "Upload a new photo or link a YouTube discourse video below."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to gallery</span>
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
          {/* Filters Bar */}
          <div className="flex gap-2 border-b border-gold/10 pb-1">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                filterType === "all"
                  ? "bg-maroon text-white border-maroon shadow-sm"
                  : "bg-white text-dark-brown/70 border-gold/20 hover:border-gold/50"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType("image")}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1 ${
                filterType === "image"
                  ? "bg-maroon text-white border-maroon shadow-sm"
                  : "bg-white text-dark-brown/70 border-gold/20 hover:border-gold/50"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1 ${
                filterType === "video"
                  ? "bg-maroon text-white border-maroon shadow-sm"
                  : "bg-white text-dark-brown/70 border-gold/20 hover:border-gold/50"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <ImageIcon className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No items match your filter.</p>
            </div>
          ) : (
            /* Gallery Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/80 border border-gold/15 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group relative hover:border-saffron/30 hover:shadow-md transition-all duration-300"
                >
                  {/* Visual Content Box */}
                  <div className="aspect-video w-full bg-gold-light/10 relative overflow-hidden">
                    <img
                      src={item.type === "video" ? getYoutubeThumbnail(item.videoUrl) || item.imageUrl : item.imageUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />

                    {/* Display Icon Type */}
                    <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg text-maroon border border-gold/15 shadow-sm">
                      {item.type === "video" ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    </div>

                    {/* Display YouTube Play Badge */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-saffron/90 text-white flex items-center justify-center shadow-lg border border-white/20">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details and Actions */}
                  <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[9px] uppercase font-bold text-saffron tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[8px] font-black text-dark-brown/40">ORDER: {item.order}</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-maroon mt-1 leading-tight">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
                      {item.type === "video" ? (
                        <a 
                          href={item.videoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[9px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                        >
                          <span>YouTube</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">Image File</span>
                      )}
                      
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded border border-transparent hover:border-rose-200 transition-colors"
                        title="Delete item"
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
            
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Media Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: "image", videoUrl: "" }))}
                  className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                    form.type === "image"
                      ? "bg-maroon text-white border-maroon shadow-md"
                      : "bg-white text-dark-brown/70 border-gold/25 hover:border-maroon"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Photo Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: "video", imageUrl: "", imageStoragePath: "" }))}
                  className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                    form.type === "video"
                      ? "bg-maroon text-white border-maroon shadow-md"
                      : "bg-white text-dark-brown/70 border-gold/25 hover:border-maroon"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>YouTube Video</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Item Title / Caption <span className="text-saffron">*</span>
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
                  <option value="Satsang Events">Satsang Events</option>
                  <option value="Vrindavan Dham">Vrindavan Dham</option>
                  <option value="Guru Ji Darshan">Guru Ji Darshan</option>
                  <option value="Charity Seva">Charity Seva</option>
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

            {/* Conditional Input based on Type */}
            {form.type === "image" ? (
              /* Image Upload Input */
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                  Choose Photo <span className="text-saffron">*</span>
                </label>
                <div className="mt-1 flex gap-4 items-center">
                  <div className="w-24 h-16 rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex-shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gold/40" />
                    )}
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      id="gallery-photo-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="gallery-photo-upload"
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
            ) : (
              /* YouTube Video URL Input */
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                  YouTube Video Link <span className="text-saffron">*</span>
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  required
                  value={form.videoUrl}
                  onChange={handleInputChange}
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
                <span className="text-[10px] text-dark-brown/50 block mt-1.5">
                  Paste the full Youtube watch link. The thumbnail will be fetched automatically.
                </span>
              </div>
            )}

            {/* Submit & Cancel Buttons */}
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
                {uploading ? "Uploading Content..." : "Add to Gallery"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
