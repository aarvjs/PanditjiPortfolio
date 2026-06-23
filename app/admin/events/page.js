"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, MapPin, Clock, Plus, Trash2, Edit2, ArrowLeft, 
  Upload, ShieldAlert, CheckCircle, Search, Video, Map 
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage, deleteImage } from "../../../lib/upload";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    mapLink: "",
    eventType: "offline", // "online" | "offline"
    status: "active", // "active" | "past"
    bannerImageUrl: "",
    bannerImageStoragePath: "",
    organizer: "Neelmani Kripalu Satsang Committee"
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await db.getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch events from Firestore.");
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
    if (!form.title || !form.date || !form.time || !form.location) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      let bannerImageUrl = form.bannerImageUrl;
      let bannerImageStoragePath = form.bannerImageStoragePath;

      // Handle Image Upload
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "events");
        bannerImageUrl = uploadResult.downloadUrl;
        bannerImageStoragePath = uploadResult.storagePath;

        // If editing and had old image, delete the old one
        if (view === "edit" && form.bannerImageStoragePath) {
          await deleteImage(form.bannerImageStoragePath);
        }
      }

      const eventPayload = {
        ...form,
        bannerImageUrl,
        bannerImageStoragePath,
        isOnline: form.eventType === "online"
      };

      if (view === "create") {
        await db.addEvent(eventPayload);
        showFeedback("success", "Event created successfully!");
      } else {
        await db.updateEvent(editingId, eventPayload);
        showFeedback("success", "Event updated successfully!");
      }

      resetForm();
      await fetchEvents();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to save event.");
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  const handleEditClick = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      mapLink: event.mapLink || "",
      eventType: event.eventType || (event.isOnline ? "online" : "offline"),
      status: event.status || "active",
      bannerImageUrl: event.bannerImageUrl || event.bannerUrl || "",
      bannerImageStoragePath: event.bannerImageStoragePath || "",
      organizer: event.organizer || "Neelmani Kripalu Satsang Committee"
    });
    setImagePreview(event.bannerImageUrl || event.bannerUrl || "");
    setImageFile(null);
    setView("edit");
  };

  const handleDeleteClick = async (event) => {
    if (!confirm(`Are you sure you want to delete event "${event.title}"?`)) return;
    setIsLoading(true);
    try {
      // 1. Delete image file from Storage
      if (event.bannerImageStoragePath) {
        await deleteImage(event.bannerImageStoragePath);
      }
      // 2. Delete document from Firestore
      await db.deleteEvent(event.id);
      showFeedback("success", "Event deleted successfully!");
      await fetchEvents();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete event.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      mapLink: "",
      eventType: "offline",
      status: "active",
      bannerImageUrl: "",
      bannerImageStoragePath: "",
      organizer: "Neelmani Kripalu Satsang Committee"
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setView("list");
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Events Management" : view === "create" ? "Create New Event" : "Edit Event"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Publish satsang gatherings, temple celebrations, and kirtan dates."
              : "Fill out the fields below. Upload a clear banner image."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
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
              placeholder="Search events by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <Calendar className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No events found.</p>
              <p className="text-xs text-dark-brown/50 mt-1">Create a new event to get started.</p>
            </div>
          ) : (
            /* Events Table */
            <div className="bg-white/80 border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-dark/30 border-b border-gold/15 text-[10px] font-bold uppercase tracking-wider text-dark-brown/60">
                      <th className="p-4 font-serif">Banner & Event</th>
                      <th className="p-4 font-serif">Date / Time</th>
                      <th className="p-4 font-serif">Location</th>
                      <th className="p-4 font-serif">Type</th>
                      <th className="p-4 font-serif">Status</th>
                      <th className="p-4 font-serif text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-cream/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-gold-light/20 flex-shrink-0 border border-gold/15">
                              <img
                                src={event.bannerImageUrl || event.bannerUrl || "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-maroon block text-sm">{event.title}</span>
                              <span className="text-[10px] text-dark-brown/50 block font-serif truncate max-w-xs">{event.description?.slice(0, 70)}...</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-dark-brown flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-saffron" />
                              {event.date}
                            </span>
                            <span className="text-dark-brown/60 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-saffron" />
                              {event.time}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-dark-brown/80 font-medium flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-saffron flex-shrink-0" />
                            {event.location}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            event.eventType === "online" || event.isOnline
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}>
                            {event.eventType === "online" || event.isOnline ? (
                              <Video className="w-3 h-3" />
                            ) : (
                              <Map className="w-3 h-3" />
                            )}
                            {event.eventType || (event.isOnline ? "online" : "offline")}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            event.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {event.status || "active"}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(event)}
                              className="p-1.5 hover:bg-gold-light/45 text-maroon rounded-lg transition-colors border border-transparent hover:border-gold/15"
                              title="Edit event"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(event)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Delete event"
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
                
                {/* Event Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Event Title <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Weekly Roopdhyana Kirtan"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Provide event details, schedule summary, or special instructions..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
                  />
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={form.organizer}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Date <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={form.date}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Time / Duration <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      name="time"
                      required
                      value={form.time}
                      onChange={handleInputChange}
                      placeholder="e.g. 5:00 PM – 7:00 PM"
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    />
                  </div>
                </div>

              </div>

              {/* Right Form Column */}
              <div className="space-y-4">
                
                {/* Event Type & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={form.eventType}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    >
                      <option value="offline">Offline (Temple/Hall)</option>
                      <option value="online">Online (Zoom/YouTube)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                      Visibility Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                    >
                      <option value="active">Active / Upcoming</option>
                      <option value="past">Completed / Past</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Location Address <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Vrindavan Ashram Hall"
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Map Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Google Maps Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="mapLink"
                    value={form.mapLink}
                    onChange={handleInputChange}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
                  />
                </div>

                {/* Banner Image upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                    Event Banner Image
                  </label>
                  
                  <div className="mt-1 flex gap-4 items-center">
                    {/* Image Preview Box */}
                    <div className="w-24 h-16 rounded-xl border border-gold/25 overflow-hidden bg-gold-light/20 flex-shrink-0 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Calendar className="w-5 h-5 text-gold/40" />
                      )}
                    </div>

                    {/* File Input */}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="event-image-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="event-image-upload"
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
                {uploading ? "Uploading Banner..." : isLoading ? "Saving Event..." : "Save Event Details"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
