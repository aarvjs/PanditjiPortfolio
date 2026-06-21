"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Globe } from "lucide-react";

export default function EventCard({ event }) {
  const { id, title, description, date, time, location, isOnline, bannerUrl } = event;
  
  // Format Date (e.g., "July 28" and "2026")
  const parsedDate = new Date(date);
  const day = parsedDate.getDate() || date.split("-")[2] || "";
  const month = parsedDate.toLocaleString("default", { month: "short" }) || "";
  const year = parsedDate.getFullYear() || "";

  // Check if event is in the past
  const isPast = new Date().toISOString().split("T")[0] > date;

  return (
    <div className="spiritual-card rounded-2xl overflow-hidden flex flex-col h-full border border-gold/15 bg-white/70 shadow-sm relative group">
      {/* Date Floating Badge */}
      <div className="absolute top-4 left-4 z-10 bg-maroon text-cream-dark py-2 px-3.5 rounded-xl shadow-md border border-gold/25 text-center flex flex-col items-center justify-center min-w-[55px]">
        <span className="text-xl font-bold font-serif leading-none tracking-tight">{day}</span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-gold mt-1 leading-none">{month}</span>
      </div>

      {/* Online / Offline Floating Indicator */}
      <div className={`absolute top-4 right-4 z-10 py-1.5 px-3 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 shadow-sm ${
        isOnline 
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
          : "bg-amber-50 text-amber-800 border border-amber-200"
      }`}>
        {isOnline ? (
          <>
            <Globe className="w-3.5 h-3.5" />
            <span>ONLINE</span>
          </>
        ) : (
          <>
            <MapPin className="w-3.5 h-3.5" />
            <span>OFFLINE</span>
          </>
        )}
      </div>

      {/* Event Banner */}
      <div className="h-48 md:h-52 w-full overflow-hidden relative bg-gold-light/20">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-maroon/20 via-gold/15 to-saffron/10 flex items-center justify-center">
            <span className="font-serif text-maroon/50 text-xl font-bold">Neelmani Satsang</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Time & Calendar details */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-dark-brown/70 font-semibold mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-saffron" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-saffron" />
              <span>{time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-maroon mb-2 group-hover:text-saffron transition-colors duration-300 line-clamp-1">
            {title}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-dark-brown/80 leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-gold/10 flex items-center justify-between gap-3">
          <Link
            href={`/events/${id}`}
            className="text-xs font-bold tracking-wider text-maroon hover:text-saffron transition-colors font-serif border-b border-maroon hover:border-saffron pb-0.5"
          >
            VIEW DETAILS
          </Link>

          {!isPast ? (
            <Link
              href={`/events/${id}#register`}
              className="px-4 py-2 bg-saffron hover:bg-maroon text-white font-bold tracking-wider text-xs rounded-full transition-all duration-300 shadow-sm"
            >
              REGISTER
            </Link>
          ) : (
            <span className="text-xs font-bold tracking-wider text-dark-brown/40 uppercase">
              PAST EVENT
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
