"use client";

import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Search, CalendarDays, Filter } from "lucide-react";
import { subscribeToEvents } from "../lib/db";

export default function EventsListing({ initialEvents = [] }) {
  const [events, setEvents] = useState(initialEvents);
  const [timeFilter, setTimeFilter] = useState("upcoming"); // 'all' | 'upcoming' | 'past'
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'online' | 'offline'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const nowStr = new Date().toISOString().split("T")[0];

  const filteredEvents = events.filter((event) => {
    // 1. Time Filter
    if (timeFilter === "upcoming") {
      if (event.date < nowStr) return false;
    } else if (timeFilter === "past") {
      if (event.date >= nowStr) return false;
    }

    // 2. Type Filter (online/offline)
    if (typeFilter === "online") {
      if (!event.isOnline) return false;
    } else if (typeFilter === "offline") {
      if (event.isOnline) return false;
    }

    // 3. Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = event.title.toLowerCase().includes(query);
      const matchDesc = event.description.toLowerCase().includes(query);
      const matchLoc = event.location.toLowerCase().includes(query);
      return matchTitle || matchDesc || matchLoc;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Search & Filter Bar */}
      <div className="bg-white/70 border border-gold/15 p-4 md:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search events/locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-gold/25 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-dark-brown/40" />
        </div>

        {/* Filters Wrapper */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
          {/* Time Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-brown/50 font-serif flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-saffron" />
              Time:
            </span>
            <div className="bg-cream p-1 rounded-full border border-gold/20 flex">
              <button
                onClick={() => setTimeFilter("upcoming")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  timeFilter === "upcoming"
                    ? "bg-saffron text-white shadow-sm"
                    : "text-dark-brown/70 hover:text-maroon"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setTimeFilter("past")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  timeFilter === "past"
                    ? "bg-saffron text-white shadow-sm"
                    : "text-dark-brown/70 hover:text-maroon"
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  timeFilter === "all"
                    ? "bg-saffron text-white shadow-sm"
                    : "text-dark-brown/70 hover:text-maroon"
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-brown/50 font-serif flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-saffron" />
              Venue:
            </span>
            <div className="bg-cream p-1 rounded-full border border-gold/20 flex">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  typeFilter === "all"
                    ? "bg-saffron text-white shadow-sm"
                    : "text-dark-brown/70 hover:text-maroon"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("offline")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  typeFilter === "offline"
                    ? "bg-saffron text-white shadow-sm"
                    : "text-dark-brown/70 hover:text-maroon"
                }`}
              >
                In-Person
              </button>
              <button
                onClick={() => setTypeFilter("online")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  typeFilter === "online"
                    ? "bg-saffron text-white shadow-sm"
                    : "text-dark-brown/70 hover:text-maroon"
                }`}
              >
                Online
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Grid List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white/40 rounded-3xl border border-gold/15 shadow-sm">
          <p className="font-serif italic text-dark-brown/65">
            No satsang events found matching the selected criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
