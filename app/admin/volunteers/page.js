"use client";

import React, { useState, useEffect } from "react";
import { Users, RefreshCw, Search, Trash2 } from "lucide-react";
import * as db from "../../../lib/db";
import Toast from "../../../components/Toast";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInterest, setFilterInterest] = useState("all");

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.subscribeToVolunteerRegistrations((data) => {
      setVolunteers(data);
      setIsLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const fetchVolunteers = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleDeleteClick = async (vol) => {
    if (!confirm(`Are you sure you want to delete the volunteer application of "${vol.name}"?`)) return;
    setIsLoading(true);
    showToast("Deleting application...", "info");
    try {
      await db.deleteVolunteerRegistration(vol.id);
      showToast("Volunteer application deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting volunteer registration:", err);
      showToast("Failed to delete volunteer application.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const interestOptions = [
    "Food Distribution (Annadan)",
    "Spiritual & Basic Education (Gyan-Daan)",
    "Temple maintenance & Cleaning",
    "Sankirtan Choir / Chanting",
    "Event Management & Seating",
    "Social Media & Tech Seva"
  ];

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = ((v.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (v.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (v.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (v.message || "").toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterInterest === "all") return matchesSearch;
    return matchesSearch && v.interestArea === filterInterest;
  });

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "success" })} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon flex items-center gap-2">
            <Users className="w-6 h-6 text-maroon" /> Volunteers Management
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Review and coordinate volunteer applications submitted from the join page.
          </p>
        </div>
        <button
          onClick={fetchVolunteers}
          className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5">
            Filter by Seva Area
          </label>
          <select
            value={filterInterest}
            onChange={(e) => setFilterInterest(e.target.value)}
            className="bg-white border border-gold/25 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-saffron text-dark-brown"
          >
            <option value="all">All Seva Areas</option>
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-sm">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5 md:hidden">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-saffron text-dark-brown"
          />
          <Search className="absolute left-3.5 top-[29px] md:top-2.5 w-4 h-4 text-dark-brown/40" />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
          <Users className="w-8 h-8 text-gold/50 mx-auto mb-3" />
          <p className="text-sm font-semibold text-dark-brown/70">No volunteers found.</p>
          <p className="text-xs text-dark-brown/50 mt-1">
            {searchQuery || filterInterest !== "all" ? "Try adjusting your filter settings." : "No volunteer requests have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVolunteers.map((vol) => (
            <div 
              key={vol.id} 
              className="bg-white/80 border border-gold/15 p-5 md:p-6 rounded-2xl shadow-sm hover:border-gold/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-maroon text-sm">{vol.name}</h3>
                    <span className="bg-saffron/10 text-saffron text-[9px] font-black uppercase px-2.5 py-0.5 rounded border border-saffron/25">
                      {vol.interestArea}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-dark-brown/70">
                    <a href={`mailto:${vol.email}`} className="hover:text-maroon hover:underline">{vol.email}</a>
                    {vol.mobile && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <a href={`tel:${vol.mobile}`} className="hover:text-maroon hover:underline">{vol.mobile}</a>
                      </>
                    )}
                    {vol.city && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>City: <strong>{vol.city}</strong></span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
                  <span className="text-[10px] text-dark-brown/50 font-semibold tracking-wide">
                    Submitted: {formatDate(vol.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDeleteClick(vol)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg transition-colors cursor-pointer"
                    title="Delete Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 bg-cream/40 p-4 rounded-xl border border-gold/10 text-xs">
                <div>
                  <span className="text-dark-brown/50 font-bold block mb-0.5">Postal Address:</span>
                  <span className="text-dark-brown">{vol.address}</span>
                </div>
                {vol.message && (
                  <div className="pt-2.5 border-t border-gold/10">
                    <span className="text-dark-brown/50 font-bold block mb-1">Introduction & Notes:</span>
                    <p className="text-dark-brown whitespace-pre-wrap leading-relaxed pr-6">
                      {vol.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
