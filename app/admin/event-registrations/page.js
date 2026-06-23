"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, CheckCircle, ShieldAlert, RefreshCw, Search, Calendar, ChevronDown } from "lucide-react";
import * as db from "../../../lib/db";

export default function AdminEventRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEvent, setFilterEvent] = useState("all");

  useEffect(() => {
    fetchRegistrationsAndEvents();
  }, []);

  const fetchRegistrationsAndEvents = async () => {
    setIsLoading(true);
    try {
      const [regsData, eventsData] = await Promise.all([
        db.getEventRegistrations(),
        db.getEvents()
      ]);
      setRegistrations(regsData);
      setEvents(eventsData);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch event bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = (r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           r.mobile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           r.eventName?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterEvent === "all") return matchesSearch;
    return matchesSearch && r.eventId === filterEvent;
  });

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-maroon" /> Event Registration Seats
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Track and coordinate devotees booking seats for upcoming satsangs and festivals.
          </p>
        </div>
        <button
          onClick={fetchRegistrationsAndEvents}
          className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {feedback.type === "error" ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5">
            Filter by Satsang Event
          </label>
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="bg-white border border-gold/25 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-saffron text-dark-brown"
          >
            <option value="all">All Gatherings</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
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
            placeholder="Search by devotee name, phone, email..."
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
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
          <UserCheck className="w-8 h-8 text-gold/50 mx-auto mb-3" />
          <p className="text-sm font-semibold text-dark-brown/70">No seat reservations found.</p>
          <p className="text-xs text-dark-brown/50 mt-1">
            {searchQuery || filterEvent !== "all" ? "Try adjusting your filters." : "Devotees will appear here when they register for an event."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((reg) => (
            <div 
              key={reg.id} 
              className="bg-white/80 border border-gold/15 p-5 md:p-6 rounded-2xl shadow-sm hover:border-gold/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-maroon text-sm">{reg.name}</h3>
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2.5 py-0.5 rounded border border-emerald-200">
                      Seats: {reg.participantsCount || 1}
                    </span>
                    <span className="bg-maroon/5 text-maroon text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-maroon/10 flex items-center gap-1 font-serif">
                      <Calendar className="w-3 h-3 text-saffron" />
                      {reg.eventName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-dark-brown/70">
                    <a href={`mailto:${reg.email}`} className="hover:text-maroon hover:underline">{reg.email}</a>
                    {reg.mobile && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <a href={`tel:${reg.mobile}`} className="hover:text-maroon hover:underline">{reg.mobile}</a>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-dark-brown/50 font-semibold tracking-wide">
                    Booked: {formatDate(reg.createdAt)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-cream/40 p-4 rounded-xl border border-gold/10 text-xs">
                <div>
                  <span className="text-dark-brown/50 font-bold block mb-0.5">Postal Address:</span>
                  <span className="text-dark-brown">{reg.address}</span>
                </div>
                {reg.participantsCount > 1 && reg.participantDetails && (
                  <div className="pt-2.5 border-t border-gold/10">
                    <span className="text-dark-brown/50 font-bold block mb-1">Group Details:</span>
                    <span className="text-dark-brown">{reg.participantDetails}</span>
                  </div>
                )}
                {reg.specialRequest && (
                  <div className="pt-2.5 border-t border-gold/10">
                    <span className="text-dark-brown/50 font-bold block mb-1">Special Assistance Request:</span>
                    <p className="text-dark-brown whitespace-pre-wrap leading-relaxed pr-6">
                      {reg.specialRequest}
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
