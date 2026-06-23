"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Plus, Trash2, Edit2, ArrowLeft, Upload, 
  ShieldAlert, CheckCircle, Search, User, Tag 
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "", // summary
    coverImageUrl: "",
    coverImageStoragePath: "",
    author: "Shri Kripalu Satsang Committee",
    category: "Teachings", // "Teachings" | "Seva Reports" | "Events Info"
    seoKeywords: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await db.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch blog posts.");
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
    if (!form.title || !form.content || !form.excerpt) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      let coverImageUrl = form.coverImageUrl;
      let coverImageStoragePath = form.coverImageStoragePath;

      // Handle Cover Upload
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "blogs");
        coverImageUrl = uploadResult.downloadUrl;
        coverImageStoragePath = uploadResult.storagePath;

        // If editing and had old image, delete the old one
        if (view === "edit" && form.coverImageStoragePath) {
          await deleteImage(form.coverImageStoragePath);
        }
      }

      const blogPayload = {
        ...form,
        coverImageUrl,
        coverImageStoragePath
      };

      if (view === "create") {
        await db.addBlog(blogPayload);
        showFeedback("success", "Spiritual blog post published!");
      } else {
        await db.updateBlog(editingId, blogPayload);
        showFeedback("success", "Blog post updated successfully!");
      }

      resetForm();
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to save blog post.");
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  const handleEditClick = (blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || blog.summary || "",
      coverImageUrl: blog.coverImageUrl || blog.bannerUrl || "",
      coverImageStoragePath: blog.coverImageStoragePath || blog.bannerImageStoragePath || "",
      author: blog.author || "Shri Kripalu Satsang Committee",
      category: blog.category || "Teachings",
      seoKeywords: blog.seoKeywords || ""
    });
    setImagePreview(blog.coverImageUrl || blog.bannerUrl || "");
    setImageFile(null);
    setView("edit");
  };

  const handleDeleteClick = async (blog) => {
    if (!confirm(`Are you sure you want to delete blog "${blog.title}"?`)) return;
    setIsLoading(true);
    try {
      // 1. Delete image file from Storage
      const storagePath = blog.coverImageStoragePath || blog.bannerImageStoragePath;
      if (storagePath) {
        await deleteImage(storagePath);
      }
      // 2. Delete document from Firestore
      await db.deleteBlog(blog.id);
      showFeedback("success", "Blog deleted successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete blog post.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      excerpt: "",
      coverImageUrl: "",
      coverImageStoragePath: "",
      author: "Shri Kripalu Satsang Committee",
      category: "Teachings",
      seoKeywords: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setView("list");
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Blogs & Teachings" : view === "create" ? "Write Blog Post" : "Edit Blog Post"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Publish scriptural transcripts, spiritual articles, and satsang retreats info."
              : "Formulate your spiritual teachings, assign tags, and set keywords for SEO optimization."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
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
              placeholder="Search articles by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <BookOpen className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No articles found.</p>
              <p className="text-xs text-dark-brown/50 mt-1">Write a blog article to get started.</p>
            </div>
          ) : (
            /* Blogs Table */
            <div className="bg-white/80 border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-dark/30 border-b border-gold/15 text-[10px] font-bold uppercase tracking-wider text-dark-brown/60">
                      <th className="p-4 font-serif">Article Banner</th>
                      <th className="p-4 font-serif">Author</th>
                      <th className="p-4 font-serif">Category</th>
                      <th className="p-4 font-serif">Seo Keywords</th>
                      <th className="p-4 font-serif text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-cream/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-gold-light/20 flex-shrink-0 border border-gold/15">
                              <img
                                src={blog.coverImageUrl || blog.bannerUrl || "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-maroon block text-sm">{blog.title}</span>
                              <span className="text-[10px] text-dark-brown/50 block font-serif truncate max-w-xs">{blog.excerpt || blog.summary}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-medium text-dark-brown flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-saffron" />
                            {blog.author}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border bg-gold-light/20 border-gold/25 text-maroon">
                            <Tag className="w-3 h-3" />
                            {blog.category}
                          </span>
                        </td>
                        <td className="p-4 max-w-[150px] truncate">
                          <span className="text-dark-brown/60 italic font-mono text-[10px]">
                            {blog.seoKeywords || "No keywords"}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(blog)}
                              className="p-1.5 hover:bg-gold-light/45 text-maroon rounded-lg transition-colors border border-transparent hover:border-gold/15"
                              title="Edit article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(blog)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Delete article"
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Form Info */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Article Title <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Reconciliation of Dvaita and Advaita Philosophy"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Excerpt / Summary */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Excerpt / Brief Summary <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="excerpt"
                    required
                    value={form.excerpt}
                    onChange={handleInputChange}
                    placeholder="A brief 1-2 sentence overview of the discourse to display on listing pages..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Rich Content Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Spiritual Content / Discourse Text <span className="text-saffron">*</span>
                  </label>
                  <textarea
                    name="content"
                    required
                    rows="12"
                    value={form.content}
                    onChange={handleInputChange}
                    placeholder="Write the full teachings or discourse. Separate paragraphs with a blank line..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-y font-sans leading-relaxed"
                  />
                </div>

              </div>

              {/* Right Column: Metadata and Cover */}
              <div className="md:col-span-4 space-y-4">
                
                {/* Author */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Category */}
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
                    <option value="Teachings">Teachings / Philosophy</option>
                    <option value="Seva Reports">Seva Campaign Reports</option>
                    <option value="Events Info">Retreat & Event Info</option>
                    <option value="Guru Ji Bio">Guru Ji Biography</option>
                  </select>
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    SEO Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={form.seoKeywords}
                    onChange={handleInputChange}
                    placeholder="satsang, bhakti, kripalu, radhe krishna"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Cover Banner Image
                  </label>
                  
                  <div className="mt-1 flex flex-col gap-3">
                    {/* Image Preview Box */}
                    <div className="w-full aspect-video rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-gold/40" />
                      )}
                    </div>

                    {/* File Input */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="blog-image-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="blog-image-upload"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-cream-dark/50 hover:bg-gold-light/45 text-maroon text-xs font-bold rounded-xl cursor-pointer border border-gold/15 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Cover Image</span>
                      </label>
                      <span className="text-[10px] text-dark-brown/50 block mt-1 text-center">
                        JPEG, PNG, WebP up to 5MB.
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

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
                {uploading ? "Uploading cover..." : isLoading ? "Saving article..." : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
