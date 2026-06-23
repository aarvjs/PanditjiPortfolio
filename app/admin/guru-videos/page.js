"use client";

import React, { useState, useEffect } from "react";
import { Play, Plus, Edit2, Trash2, ShieldAlert, CheckCircle, Search, ArrowLeft, Save } from "lucide-react";
import * as db from "../../../lib/db";

export default function AdminGuruVideosPage() {
  const [videos, setVideos] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    order: 1,
    status: "published" // "published" | "draft"
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const data = await db.getGuruJiVideos();
      // Sort by order asc
      const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setVideos(sorted);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch videos from Firestore.");
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

  // Helper to extract YouTube video ID
  const getYouTubeId = (url) => {
    let videoId = "";
    if (!url) return "";
    try {
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1].split("?")[0];
      }
    } catch (e) {
      console.error("Error parsing YouTube ID:", e);
    }
    return videoId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.youtubeUrl) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    const youtubeId = getYouTubeId(form.youtubeUrl);
    if (!youtubeId) {
      showFeedback("error", "Could not extract video ID from YouTube URL. Please check the link.");
      return;
    }

    setIsLoading(true);
    try {
      const videoPayload = {
        ...form,
        order: Number(form.order) || 1,
        youtubeId: youtubeId,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
      };

      if (view === "create") {
        await db.addGuruJiVideo(videoPayload);
        showFeedback("success", "Video added successfully!");
      } else {
        await db.updateGuruJiVideo(editingId, videoPayload);
        showFeedback("success", "Video updated successfully!");
      }

      resetForm();
      await fetchVideos();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to save video.");
      setIsLoading(false);
    }
  };

  const handleEditClick = (video) => {
    setEditingId(video.id);
    setForm({
      title: video.title || "",
      description: video.description || video.desc || "",
      youtubeUrl: video.youtubeUrl || video.url || "",
      order: video.order || 1,
      status: video.status || "published"
    });
    setView("edit");
  };

  const handleDeleteClick = async (video) => {
    if (!confirm(`Are you sure you want to delete video "${video.title}"?`)) return;
    setIsLoading(true);
    try {
      await db.deleteGuruJiVideo(video.id);
      showFeedback("success", "Video deleted successfully!");
      await fetchVideos();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete video.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      youtubeUrl: "",
      order: 1,
      status: "published"
    });
    setEditingId(null);
    setView("list");
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.description || v.desc || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon flex items-center gap-2">
            <Play className="w-6 h-6 text-maroon" /> YouTube Videos
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Manage YouTube pravachans and sankirtans that play on the homepage video grid.
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
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
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search videos by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
          </div>

          {filteredVideos.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <Play className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No videos found.</p>
              <p className="text-xs text-dark-brown/50 mt-1">Add a new YouTube video link to display it on the homepage.</p>
            </div>
          ) : (
            <div className="bg-white/80 border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-dark/30 border-b border-gold/15 text-[10px] font-bold uppercase tracking-wider text-dark-brown/60">
                      <th className="p-4 font-serif">Thumbnail & Title</th>
                      <th className="p-4 font-serif">YouTube URL</th>
                      <th className="p-4 font-serif">Sort Order</th>
                      <th className="p-4 font-serif">Status</th>
                      <th className="p-4 font-serif text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredVideos.map((video) => (
                      <tr key={video.id} className="hover:bg-cream/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-gold-light/20 flex-shrink-0 border border-gold/15 relative">
                              <img
                                src={video.thumbnailUrl || video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId || "dQw4w9WgXcQ"}/mqdefault.jpg`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-3.5 h-3.5 text-white fill-current" />
                              </div>
                            </div>
                            <div>
                              <span className="font-bold text-maroon block text-sm">{video.title}</span>
                              <span className="text-[10px] text-dark-brown/50 block font-serif truncate max-w-xs">{video.description || video.desc}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap font-mono text-[10px] text-dark-brown/80">
                          <a href={video.youtubeUrl || video.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-saffron">
                            {video.youtubeUrl || video.url}
                          </a>
                        </td>
                        <td className="p-4 font-semibold text-dark-brown">
                          {video.order || 1}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            video.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {video.status || "published"}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(video)}
                              className="p-1.5 hover:bg-gold-light/45 text-maroon rounded-lg transition-colors border border-transparent hover:border-gold/15"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(video)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
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
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Video Title <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Roopdhyana Meditation Discourse"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    YouTube URL <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    required
                    value={form.youtubeUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the pravachan content..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    min="1"
                    value={form.order}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                  <span className="text-[10px] text-dark-brown/50 block mt-1">
                    Lower numbers will appear first in the list.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <span className="text-[10px] text-dark-brown/50 block mt-1">
                    Draft videos will not be shown on the home page.
                  </span>
                </div>
              </div>

            </div>

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
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Video"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
