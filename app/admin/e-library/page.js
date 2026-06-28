"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Plus, Trash2, Edit2, ArrowLeft, Search, Upload, 
  Download, CheckCircle, AlertTriangle, MessageSquare, Globe, 
  FileText, Star, Tag, RefreshCw
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, uploadDocument } from "../../../lib/upload";

export default function AdminELibraryPage() {
  const [resources, setResources] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    author: "",
    category: "Spiritual Books",
    description: "",
    language: "en",
    tags: "",
    status: "published",
    featured: false,
    downloadAllowed: true,
    whatsappOrderLink: "",
    type: "free",
    coverUrl: "",
    fileUrl: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const categories = [
    "Spiritual Books",
    "E-Books",
    "PDFs",
    "Bhajans",
    "Spiritual Magazines",
    "Teachings"
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await db.getELibraryResources();
      setResources(data || []);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch resources.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    
    // Auto-generate slug from title
    if (name === "title" && view === "create") {
      const slugValue = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setForm(prev => ({ ...prev, title: value, slug: slugValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: finalValue }));
    }
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

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfName(file.name);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      author: "",
      category: "Spiritual Books",
      description: "",
      language: "en",
      tags: "",
      status: "published",
      featured: false,
      downloadAllowed: true,
      whatsappOrderLink: "",
      type: "free",
      coverUrl: "",
      fileUrl: ""
    });
    setImageFile(null);
    setPdfFile(null);
    setImagePreview("");
    setPdfName("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.author) {
      showFeedback("error", "Title, Slug, and Author are required fields.");
      return;
    }

    setIsUploading(true);
    try {
      let coverUrl = form.coverUrl;
      let fileUrl = form.fileUrl;

      // 1. Upload Cover Image if present
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "eLibrary/covers");
        coverUrl = uploadResult.downloadUrl;
      }

      // 2. Upload PDF File if present
      if (pdfFile) {
        const uploadResult = await uploadDocument(pdfFile, "eLibrary/files");
        fileUrl = uploadResult.downloadUrl;
      }

      // Format tags as array of trimmed strings
      const tagsArray = typeof form.tags === "string" 
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : form.tags;

      const payload = {
        ...form,
        tags: tagsArray,
        coverUrl,
        fileUrl
      };

      if (view === "create") {
        await db.createELibraryResource(payload);
        showFeedback("success", "Resource added successfully!");
      } else {
        await db.updateELibraryResource(editingId, payload);
        showFeedback("success", "Resource updated successfully!");
      }

      resetForm();
      setView("list");
      await fetchResources();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to save resource.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (res) => {
    setEditingId(res.id);
    setForm({
      title: res.title || "",
      slug: res.slug || "",
      author: res.author || "",
      category: res.category || "Spiritual Books",
      description: res.description || "",
      language: res.language || "en",
      tags: Array.isArray(res.tags) ? res.tags.join(", ") : res.tags || "",
      status: res.status || "published",
      featured: res.featured || false,
      downloadAllowed: res.downloadAllowed !== false,
      whatsappOrderLink: res.whatsappOrderLink || "",
      type: res.type || "free",
      coverUrl: res.coverUrl || "",
      fileUrl: res.fileUrl || ""
    });
    setImagePreview(res.coverUrl || "");
    setPdfName(res.fileUrl ? "Current PDF Book" : "");
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
      await db.deleteELibraryResource(deletingId);
      showFeedback("success", "Resource deleted successfully.");
      await fetchResources();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete resource.");
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  // Filtered resources list
  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || res.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-saffron" />
            E-Library Management
          </h1>
          <p className="text-xs text-dark-brown/60 mt-1">
            Publish eBooks, holy PDFs, teachings, magazines, and bhajan books.
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => { resetForm(); setView("create"); }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Resource
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

      {/* Notifications Alert */}
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

      {/* List View */}
      {view === "list" && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gold/15 p-6 shadow-sm">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cream/40 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === "All" 
                    ? "bg-maroon text-white" 
                    : "bg-cream-dark/25 text-dark-brown hover:bg-gold-light/10"
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    categoryFilter === cat 
                      ? "bg-maroon text-white" 
                      : "bg-cream-dark/25 text-dark-brown hover:bg-gold-light/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-saffron animate-spin" />
              <p className="mt-3 text-xs text-dark-brown/50 font-medium">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gold/10 rounded-2xl">
              <BookOpen className="w-12 h-12 text-gold/30 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-dark-brown/85">No resources found</h3>
              <p className="text-xs text-dark-brown/50 mt-1">Try tweaking filters or add your first digital resource.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gold/15 text-[10px] uppercase font-bold tracking-wider text-dark-brown/65 bg-cream/35">
                    <th className="py-3 px-4">Book Info</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Access Type</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10 text-xs">
                  {filteredResources.map((res) => (
                    <tr key={res.id} className="hover:bg-cream-dark/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={res.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=80&q=80"}
                            alt={res.title}
                            className="w-10 h-14 object-cover rounded shadow-sm border border-gold/10 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-maroon truncate max-w-[200px]" title={res.title}>{res.title}</h4>
                            <span className="text-[10px] text-dark-brown/55 block mt-0.5">By {res.author}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-dark-brown/80">{res.category}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-saffron">{res.language}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block w-max ${
                            res.type === "free" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {res.type === "free" ? "Free" : "Paid"}
                          </span>
                          {res.downloadAllowed && (
                            <span className="text-[9px] text-emerald-600 font-medium flex items-center gap-0.5">
                              <Download className="w-2.5 h-2.5" /> PDF Download
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {res.featured ? (
                          <span className="text-amber-500 flex items-center gap-0.5 text-[10px] font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" /> Yes
                          </span>
                        ) : (
                          <span className="text-dark-brown/40">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {res.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(res)}
                            className="p-1.5 bg-cream hover:bg-gold-light/20 text-maroon rounded-lg transition-colors border border-gold/10"
                            title="Edit Resource"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => triggerDelete(res.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200"
                            title="Delete Resource"
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
          )}
        </div>
      )}

      {/* Form View (Create & Edit) */}
      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSubmit} className="bg-white/85 backdrop-blur-md border border-gold/15 p-6 rounded-2xl shadow-sm">
          <h3 className="font-serif font-bold text-lg text-maroon border-b border-gold/15 pb-3 mb-6">
            {view === "create" ? "Add New Digital Resource" : `Edit Resource: ${form.title}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side: upload files */}
            <div className="flex flex-col gap-5">
              {/* Cover Image Upload */}
              <div className="border border-gold/15 rounded-xl p-4 bg-cream/15 text-center">
                <label className="block text-[11px] uppercase font-bold text-dark-brown/70 tracking-wider mb-2 text-left">
                  Cover Image
                </label>
                
                {imagePreview ? (
                  <div className="relative w-36 h-48 mx-auto mb-3 rounded-lg overflow-hidden border border-gold/25 shadow">
                    <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(""); }}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors flex items-center justify-center"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-36 h-48 mx-auto mb-3 rounded-lg border-2 border-dashed border-gold/20 flex flex-col items-center justify-center bg-white/50">
                    <Upload className="w-6 h-6 text-gold/45 mb-2" />
                    <span className="text-[10px] text-dark-brown/55 px-3">Upload Jpeg/Png cover photo (max 5MB)</span>
                  </div>
                )}
                
                <input
                  type="file"
                  id="coverImageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("coverImageInput").click()}
                  className="px-3 py-1.5 bg-cream border border-gold/25 hover:bg-gold-light/20 text-maroon text-[10px] font-bold rounded-lg transition-all"
                >
                  Choose Cover Image
                </button>
              </div>

              {/* PDF Book Upload */}
              <div className="border border-gold/15 rounded-xl p-4 bg-cream/15">
                <label className="block text-[11px] uppercase font-bold text-dark-brown/70 tracking-wider mb-2">
                  eBook PDF File
                </label>
                
                {pdfName ? (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs mb-3 font-semibold">
                    <FileText className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span className="truncate flex-1 text-left">{pdfName}</span>
                    <button
                      type="button"
                      onClick={() => { setPdfFile(null); setPdfName(""); }}
                      className="p-0.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 flex items-center justify-center"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gold/20 rounded-lg p-4 flex flex-col items-center justify-center bg-white/50 text-center mb-3">
                    <Upload className="w-5 h-5 text-gold/45 mb-1.5" />
                    <span className="text-[9px] text-dark-brown/50">Select PDF (max 25MB)</span>
                  </div>
                )}
                
                <input
                  type="file"
                  id="pdfFileInput"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => document.getElementById("pdfFileInput").click()}
                    className="px-3 py-1.5 bg-cream border border-gold/25 hover:bg-gold-light/20 text-maroon text-[10px] font-bold rounded-lg transition-all"
                  >
                    Select PDF Document
                  </button>
                </div>
              </div>
            </div>

            {/* Middle and Right: metadata form */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Resource Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Prem Ras Siddhant"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">URL Slug (Auto-generated) *</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  placeholder="e.g. prem-ras-siddhant"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleInputChange}
                  placeholder="e.g. Jagadguru Shri Kripalu Ji Maharaj"
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Language</label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white"
                >
                  <option value="en">English (EN)</option>
                  <option value="hi">Hindi (HI)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Free/Paid Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white"
                >
                  <option value="free">Free Resource</option>
                  <option value="paid">Paid Book / Magazine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">WhatsApp Order Link (Optional)</label>
                <input
                  type="text"
                  name="whatsappOrderLink"
                  value={form.whatsappOrderLink}
                  onChange={handleInputChange}
                  placeholder="e.g. https://wa.me/919876543210?text=..."
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Tags (Comma-separated)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-dark-brown/40" />
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. Philosophy, Devotion, Bhakti, Kripalu Ji"
                    className="w-full pl-10 pr-4 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Description / Summary</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter a brief summary of the book contents or teachings..."
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron font-sans"
                />
              </div>

              <div className="sm:col-span-2 bg-cream/15 p-4 rounded-xl border border-gold/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-saffron focus:ring-saffron border-gold/25"
                  />
                  <div>
                    <span className="text-xs font-bold block text-dark-brown/80">Featured Toggle</span>
                    <span className="text-[9px] text-dark-brown/50">Highlight at the top</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="downloadAllowed"
                    checked={form.downloadAllowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-saffron focus:ring-saffron border-gold/25"
                  />
                  <div>
                    <span className="text-xs font-bold block text-dark-brown/80">Allow PDF Download</span>
                    <span className="text-[9px] text-dark-brown/50">Enable download button</span>
                  </div>
                </label>

                <div className="flex items-center gap-2.5">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="px-2 py-1 bg-white border border-gold/15 rounded text-xs focus:outline-none font-bold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <div>
                    <span className="text-xs font-bold block text-dark-brown/80">Publish Status</span>
                    <span className="text-[9px] text-dark-brown/50">Draft hides from library</span>
                  </div>
                </div>
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
                  className="px-5 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Uploading & Saving...
                    </>
                  ) : (
                    "Save & Publish"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gold/20 p-6 max-w-sm w-full text-center shadow-xl animate-fade-in">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-dark-brown">Delete Resource?</h3>
            <p className="text-xs text-dark-brown/65 mt-2">
              Are you sure you want to permanently delete this digital resource? This action cannot be undone.
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

// Simple X icon helper
function XIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
