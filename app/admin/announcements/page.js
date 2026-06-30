"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, Plus, Trash2, Edit2, ArrowLeft, ShieldAlert, CheckCircle, 
  Search, ToggleLeft, ToggleRight, Calendar, AlertTriangle 
} from "lucide-react";
import * as db from "../../../lib/db";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    publishDate: new Date().toISOString().split("T")[0],
    priority: "normal", // "high" | "normal"
    active: true
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.subscribeToAnnouncements((data) => {
      setAnnouncements((data || []).sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)));
      setIsLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
  };

  const toggleActiveStatus = async (announcement) => {
    setIsLoading(true);
    showFeedback("info", "Updating status...");
    try {
      const updatedStatus = !announcement.active;
      await db.updateAnnouncement(announcement.id, { active: updatedStatus });
      showFeedback("success", `Notice marked as ${updatedStatus ? "active" : "inactive"}.`);
    } catch (err) {
      console.error("Error updating announcement status:", err);
      showFeedback("error", "Failed to update notice status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message || !form.publishDate) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      if (view === "create") {
        await db.addAnnouncement(form);
        showFeedback("success", "Notice published successfully!");
      } else {
        await db.updateAnnouncement(editingId, form);
        showFeedback("success", "Notice updated successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving announcement:", err);
      showFeedback("error", err.message || "Failed to save notice.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (announcement) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title || "",
      message: announcement.message || "",
      publishDate: announcement.publishDate || new Date().toISOString().split("T")[0],
      priority: announcement.priority || "normal",
      active: announcement.active !== undefined ? announcement.active : true
    });
    setView("edit");
  };

  const handleDeleteClick = async (announcement) => {
    if (!confirm(`Are you sure you want to delete notice "${announcement.title}"?`)) return;
    setIsLoading(true);
    showFeedback("info", "Deleting notice...");
    try {
      await db.deleteAnnouncement(announcement.id);
      showFeedback("success", "Notice deleted successfully!");
    } catch (err) {
      console.error("Error deleting announcement:", err);
      showFeedback("error", "Failed to delete notice.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      publishDate: new Date().toISOString().split("T")[0],
      priority: "normal",
      active: true
    });
    setEditingId(null);
    setView("list");
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Notice Board" : view === "create" ? "Create New Notice" : "Edit Notice"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Manage news bulletin updates, retreat schedule changes, and priority alerts."
              : "Define notice heading, full alert text, priority tier, and start date below."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Notice</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to notices</span>
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
              placeholder="Search notices by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
          </div>

          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <Bell className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No announcements found.</p>
              <p className="text-xs text-dark-brown/50 mt-1">Publish a notice to display it on the public notice board.</p>
            </div>
          ) : (
            /* Announcements Table */
            <div className="bg-white/80 border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-dark/30 border-b border-gold/15 text-[10px] font-bold uppercase tracking-wider text-dark-brown/60">
                      <th className="p-4 font-serif">Date</th>
                      <th className="p-4 font-serif">Notice Information</th>
                      <th className="p-4 font-serif">Priority</th>
                      <th className="p-4 font-serif">Visible</th>
                      <th className="p-4 font-serif text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredAnnouncements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-cream/40 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-semibold text-dark-brown flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-saffron" />
                            {ann.publishDate}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-bold text-maroon block text-sm">{ann.title}</span>
                            <p className="text-[10px] text-dark-brown/60 mt-0.5 line-clamp-2 max-w-lg">{ann.message}</p>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            ann.priority === "high"
                              ? "bg-rose-50 border-rose-200 text-rose-700 font-extrabold"
                              : "bg-cream-dark border-gold/25 text-dark-brown/70"
                          }`}>
                            {ann.priority === "high" && <AlertTriangle className="w-3 h-3" />}
                            {ann.priority || "normal"}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleActiveStatus(ann)}
                            className="text-dark-brown/70 hover:text-maroon transition-colors"
                            title="Toggle notice visibility"
                          >
                            {ann.active ? (
                              <ToggleRight className="w-8 h-8 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-dark-brown/30" />
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(ann)}
                              className="p-1.5 hover:bg-gold-light/45 text-maroon rounded-lg transition-colors border border-transparent hover:border-gold/15"
                              title="Edit notice"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(ann)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Delete notice"
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
        <div className="bg-white/80 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Notice Headline <span className="text-saffron">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g. Schedule Update: Evening Satsang Timings Changed"
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Alert Message / Announcement Body <span className="text-saffron">*</span>
              </label>
              <textarea
                name="message"
                required
                rows="6"
                value={form.message}
                onChange={handleInputChange}
                placeholder="Write the full notice content. Keep it clear and concise..."
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
              />
            </div>

            {/* Publish Date & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                  Publish Date <span className="text-saffron">*</span>
                </label>
                <input
                  type="date"
                  name="publishDate"
                  required
                  value={form.publishDate}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                  Priority Tier
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority (Alert Badge)</option>
                </select>
              </div>
            </div>

            {/* Visibility checkbox */}
            <div className="flex items-center gap-2 pl-1">
              <input
                type="checkbox"
                name="active"
                id="ann-active"
                checked={form.active}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-saffron focus:ring-saffron border-gold/30"
              />
              <label htmlFor="ann-active" className="text-xs font-semibold text-dark-brown/80 font-sans cursor-pointer">
                Publish immediately (make notice visible on the website)
              </label>
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
                <span>{isLoading ? "Saving..." : (view === "create" ? "Publish Notice" : "Save Changes")}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
