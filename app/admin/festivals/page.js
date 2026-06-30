"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Plus, Trash2, Edit2, ArrowLeft, Search, Upload, 
  CheckCircle, AlertTriangle, Users, MapPin, Download, RefreshCw, X, ShieldCheck
} from "lucide-react";
import * as db from "../../../lib/db";
import { uploadImage } from "../../../lib/upload";

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("festivals"); // 'festivals' | 'registrations'
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    venue: "",
    registrationLastDate: new Date().toISOString().split("T")[0],
    passRequired: true,
    status: "published",
    bannerUrl: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [selectedFestivalFilter, setSelectedFestivalFilter] = useState("All");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteType, setDeleteType] = useState("festival"); // 'festival' | 'registration'

  useEffect(() => {
    setIsLoading(true);
    let festsLoaded = false;
    let regsLoaded = false;

    const unsubscribeFests = db.subscribeToFestivals((fests) => {
      setFestivals(fests || []);
      festsLoaded = true;
      if (festsLoaded && regsLoaded) setIsLoading(false);
    });

    const unsubscribeRegs = db.subscribeToFestivalRegistrations((regs) => {
      setRegistrations(regs || []);
      regsLoaded = true;
      if (festsLoaded && regsLoaded) setIsLoading(false);
    });

    if (!db.isFirebaseConfigured) {
      setIsLoading(false);
    }

    return () => {
      unsubscribeFests && unsubscribeFests();
      unsubscribeRegs && unsubscribeRegs();
    };
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    
    if (name === "name" && view === "create") {
      const slugValue = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setForm(prev => ({ ...prev, name: value, slug: slugValue }));
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

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      venue: "",
      registrationLastDate: new Date().toISOString().split("T")[0],
      passRequired: true,
      status: "published",
      bannerUrl: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.venue || !form.date) {
      showFeedback("error", "Festival Name, Slug, Venue, and Date are required.");
      return;
    }

    setIsUploading(true);
    try {
      let bannerUrl = form.bannerUrl;
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "festivals");
        bannerUrl = uploadResult.downloadUrl;
      }

      const payload = {
        ...form,
        bannerUrl
      };

      if (view === "create") {
        await db.createFestival(payload);
        showFeedback("success", "Festival published successfully!");
      } else {
        await db.updateFestival(editingId, payload);
        showFeedback("success", "Festival details updated successfully!");
      }

      resetForm();
      setView("list");
    } catch (err) {
      console.error("Error saving festival:", err);
      showFeedback("error", "Failed to save festival details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (fest) => {
    setEditingId(fest.id);
    setForm({
      name: fest.name || "",
      slug: fest.slug || "",
      description: fest.description || "",
      date: fest.date || "",
      venue: fest.venue || "",
      registrationLastDate: fest.registrationLastDate || "",
      passRequired: fest.passRequired !== false,
      status: fest.status || "published",
      bannerUrl: fest.bannerUrl || ""
    });
    setImagePreview(fest.bannerUrl || "");
    setView("edit");
  };

  const triggerDelete = (id, type) => {
    setDeletingId(id);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsLoading(true);
    setShowDeleteModal(false);
    try {
      if (deleteType === "festival") {
        await db.deleteFestival(deletingId);
        showFeedback("success", "Festival removed successfully.");
      } else {
        await db.deleteFestivalRegistration(deletingId);
        showFeedback("success", "Registration record removed.");
      }
    } catch (err) {
      console.error("Error deleting festival record:", err);
      showFeedback("error", "Failed to delete record.");
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  const exportToCsv = () => {
    if (registrations.length === 0) {
      showFeedback("error", "No registration records to export.");
      return;
    }

    const headers = ["Registration ID", "Festival Name", "Participant Name", "Mobile", "Email", "Participants Count", "City/Address", "Special Notes", "Date Registered"];
    
    const rows = registrations
      .filter(reg => selectedFestivalFilter === "All" || reg.festivalId === selectedFestivalFilter)
      .map(reg => [
        reg.registrationId,
        reg.festivalName,
        reg.name,
        reg.mobile,
        reg.email,
        reg.participantsCount,
        `"${(reg.address || "").replace(/"/g, '""')}"`,
        `"${(reg.notes || "").replace(/"/g, '""')}"`,
        reg.createdAt
      ]);
      
    if (rows.length === 0) {
      showFeedback("error", "No matching registrations found for current filter.");
      return;
    }

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Festival_Registrations_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showFeedback("success", "CSV export download triggered successfully!");
  };

  // Filter lists
  const filteredFestivals = festivals.filter(fest => 
    fest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fest.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.name?.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      reg.registrationId?.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      reg.mobile?.includes(regSearchQuery);
    
    const matchesFestival = selectedFestivalFilter === "All" || reg.festivalId === selectedFestivalFilter;
    
    return matchesSearch && matchesFestival;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon flex items-center gap-2">
            <Calendar className="w-6 h-6 text-saffron" />
            Festival Registrations Portal
          </h1>
          <p className="text-xs text-dark-brown/60 mt-1">
            Create festivals, manage entry passes, and audit participant submissions.
          </p>
        </div>

        {/* Sub-tab Controller */}
        <div className="flex border border-gold/25 rounded-xl overflow-hidden bg-white shadow-sm p-0.5">
          <button
            onClick={() => { setActiveSubTab("festivals"); setView("list"); }}
            className={`px-4 py-2 text-xs font-bold font-serif uppercase tracking-wider rounded-lg transition-all ${
              activeSubTab === "festivals" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
            }`}
          >
            Festivals
          </button>
          <button
            onClick={() => { setActiveSubTab("registrations"); setView("list"); }}
            className={`px-4 py-2 text-xs font-bold font-serif uppercase tracking-wider rounded-lg transition-all ${
              activeSubTab === "registrations" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
            }`}
          >
            Audience Passes ({registrations.length})
          </button>
        </div>
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

      {/* FESTIVALS CRUD SUB-TAB */}
      {activeSubTab === "festivals" && (
        <>
          {view === "list" && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gold/15 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
                  <input
                    type="text"
                    placeholder="Search festivals by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-cream/40 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                  />
                </div>

                <button
                  onClick={() => { resetForm(); setView("create"); }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" /> Add Festival
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-saffron animate-spin" />
                  <p className="mt-3 text-xs text-dark-brown/50 font-medium">Loading festivals...</p>
                </div>
              ) : filteredFestivals.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gold/10 rounded-2xl">
                  <Calendar className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-dark-brown/85">No festivals registered</h3>
                  <p className="text-xs text-dark-brown/50 mt-1">Publish Janmashtami, Holi, Guru Purnima Mahotsav.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFestivals.map(fest => (
                    <div 
                      key={fest.id} 
                      className="border border-gold/15 rounded-2xl p-5 bg-white flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
                    >
                      <div>
                        {fest.bannerUrl && (
                          <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-gold/10">
                            <img src={fest.bannerUrl} alt={fest.name} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            fest.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"
                          }`}>
                            {fest.status === "published" ? "Published" : "Draft"}
                          </span>
                          <span className="text-[9px] text-dark-brown/50 font-extrabold uppercase">
                            {fest.passRequired ? "Pass Required" : "Open Event"}
                          </span>
                        </div>

                        <h3 className="font-serif font-black text-sm text-maroon leading-tight mb-2 truncate" title={fest.name}>
                          {fest.name}
                        </h3>

                        <div className="space-y-1 text-[10px] text-dark-brown/50 border-t border-gold/10 pt-3">
                          <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-saffron" /> Date: {fest.date}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron" /> Venue: {fest.venue}</p>
                          <p className="text-rose-700 font-bold block pt-1">Reg Last Date: {fest.registrationLastDate}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gold/10">
                        <button
                          onClick={() => handleEditClick(fest)}
                          className="p-1.5 bg-cream hover:bg-gold-light/20 text-maroon rounded-lg transition-colors border border-gold/10"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => triggerDelete(fest.id, "festival")}
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
                {view === "create" ? "Schedule Devotional Festival" : `Edit Festival: ${form.name}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Banner Upload */}
                <div>
                  <div className="border border-gold/15 rounded-xl p-4 bg-cream/15 text-center">
                    <label className="block text-[11px] uppercase font-bold text-dark-brown/70 tracking-wider mb-2 text-left">
                      Festival Banner
                    </label>
                    
                    {imagePreview ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gold/25 shadow mb-3">
                        <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(""); }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors flex items-center justify-center"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-40 rounded-lg border-2 border-dashed border-gold/20 flex flex-col items-center justify-center bg-white/50 mb-3">
                        <Upload className="w-6 h-6 text-gold/45 mb-2" />
                        <span className="text-[10px] text-dark-brown/55 px-3">Upload Banner Photo (max 5MB)</span>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      id="bannerImageInput"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("bannerImageInput").click()}
                      className="px-3 py-1.5 bg-cream border border-gold/25 hover:bg-gold-light/20 text-maroon text-[10px] font-bold rounded-lg transition-all"
                    >
                      Choose Photo
                    </button>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Festival Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Janmashtami Mahotsav 2026"
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
                      placeholder="e.g. janmashtami-2026"
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Festival Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Holy Venue / Temple Location *</label>
                    <input
                      type="text"
                      name="venue"
                      value={form.venue}
                      onChange={handleInputChange}
                      placeholder="e.g. Neelmani Kripalu Ashram Vrindavan"
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Registration Closing Date *</label>
                    <input
                      type="date"
                      name="registrationLastDate"
                      value={form.registrationLastDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Pass Required</label>
                    <select
                      name="passRequired"
                      value={form.passRequired}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white font-bold"
                    >
                      <option value="true">Yes, pass generated online</option>
                      <option value="false">No, free entry / public</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Mahotsav Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="discourse schedules, paduka worship details..."
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Publish Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gold/15 rounded-xl text-xs bg-white font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
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
                        "Save Festival"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {/* REGISTRATIONS AUDIT SUB-TAB */}
      {activeSubTab === "registrations" && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gold/15 p-6 shadow-sm">
          {/* Filtering toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
                <input
                  type="text"
                  placeholder="Search name, phone, Pass ID..."
                  value={regSearchQuery}
                  onChange={(e) => setRegSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-cream/40 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-dark-brown/40 uppercase whitespace-nowrap">Filter Festival:</span>
                <select
                  value={selectedFestivalFilter}
                  onChange={(e) => setSelectedFestivalFilter(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-dark-brown font-bold max-w-[200px]"
                >
                  <option value="All">All Festivals</option>
                  {festivals.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={exportToCsv}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-saffron animate-spin" />
              <p className="mt-3 text-xs text-dark-brown/50 font-medium">Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gold/10 rounded-2xl">
              <Users className="w-12 h-12 text-gold/30 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-dark-brown/85">No registrations found</h3>
              <p className="text-xs text-dark-brown/50 mt-1">Attendees passes records will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gold/15 text-[10px] uppercase font-bold tracking-wider text-dark-brown/65 bg-cream/35">
                    <th className="py-3 px-4">Pass Details</th>
                    <th className="py-3 px-4">Festival</th>
                    <th className="py-3 px-4">Participants</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Special Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10 text-xs">
                  {filteredRegistrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-cream-dark/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-maroon">{reg.name}</p>
                            <span className="text-[10px] font-black text-amber-600 block mt-0.5">{reg.registrationId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-dark-brown/80">{reg.festivalName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-cream text-maroon rounded border border-gold/10 font-bold">
                          {reg.participantsCount} Seats
                        </span>
                      </td>
                      <td className="py-3 px-4 space-y-0.5">
                        <p className="font-medium text-dark-brown">{reg.mobile}</p>
                        <p className="text-[10px] text-dark-brown/50">{reg.email}</p>
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate text-dark-brown/65" title={reg.notes || "None"}>
                        {reg.notes || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => triggerDelete(reg.id, "registration")}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gold/20 p-6 max-w-sm w-full text-center shadow-xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-dark-brown">
              {deleteType === "festival" ? "Delete Festival?" : "Remove Registration?"}
            </h3>
            <p className="text-xs text-dark-brown/65 mt-2">
              {deleteType === "festival" 
                ? "Are you sure you want to permanently delete this festival? This action cannot be undone." 
                : "Remove this participant's ticket entry pass record? This action cannot be undone."}
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
