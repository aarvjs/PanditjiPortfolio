"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Timer } from "lucide-react";

export default function EventHighlight({ events = [] }) {
  const [closestEvent, setClosestEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true
  });

  // Find the closest upcoming event
  useEffect(() => {
    if (!events.length) return;
    const now = new Date();
    
    // Sort events by date
    const upcoming = events
      .filter((e) => new Date(e.date + "T" + (e.time.split(" - ")[0].includes("AM") ? "09:00" : "18:00")) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcoming.length > 0) {
      setClosestEvent(upcoming[0]);
    }
  }, [events]);

  // Live countdown hook
  useEffect(() => {
    if (!closestEvent) return;

    const eventDateStr = closestEvent.date;
    // Set target date (default to 9 AM of the event date)
    const targetDate = new Date(`${eventDateStr}T09:00:00`);

    const interval = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, expired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [closestEvent]);

  if (!closestEvent) {
    return (
      <div className="text-center p-8 bg-cream border border-gold/15 rounded-2xl max-w-xl mx-auto shadow-sm">
        <p className="font-serif italic text-dark-brown/70">
          No upcoming satsang scheduled at the moment. Please check back soon or view our notices page.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-cream-dark via-white to-cream p-6 md:p-10 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Event Details */}
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-saffron/10 text-saffron text-xs font-bold font-serif tracking-widest uppercase rounded-full border border-saffron/15">
            <Timer className="w-3.5 h-3.5" />
            <span>NEAREST SATSANG</span>
          </span>

          <h3 className="font-serif text-2xl md:text-3xl font-bold text-maroon text-saffron-glow">
            {closestEvent.title}
          </h3>

          <p className="text-sm text-dark-brown/85 leading-relaxed line-clamp-3">
            {closestEvent.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-dark-brown/75">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-saffron" />
              <span>Date: {closestEvent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-saffron" />
              <span>Time: {closestEvent.time}</span>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin className="w-4 h-4 text-saffron mt-0.5" />
              <span>Venue: {closestEvent.location}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-4 items-center">
            <Link
              href={`/events/${closestEvent.id}`}
              className="px-6 py-3 bg-maroon hover:bg-saffron text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md flex items-center justify-center"
            >
              REGISTER FOR SATSANG
            </Link>
            <Link
              href={`/events/${closestEvent.id}`}
              className="text-xs font-bold tracking-wider text-maroon hover:text-saffron transition-colors border-b border-maroon hover:border-saffron font-serif"
            >
              Read Full Outline
            </Link>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white/60 border border-gold/15 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-dark-brown/50 mb-4 font-serif">
            COUNTDOWN TO DEVOTION
          </span>

          {timeLeft.expired ? (
            <span className="text-sm font-bold text-saffron uppercase font-serif">Satsang has started!</span>
          ) : (
            <div className="grid grid-cols-4 gap-3 text-center">
              {/* Days */}
              <div className="flex flex-col">
                <span className="w-12 h-12 md:w-16 md:h-16 bg-saffron text-white rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black font-serif shadow-sm animate-diya-glow">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-dark-brown/60 font-bold mt-1.5">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col">
                <span className="w-12 h-12 md:w-16 md:h-16 bg-maroon text-cream-dark rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black font-serif shadow-sm">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-dark-brown/60 font-bold mt-1.5">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col">
                <span className="w-12 h-12 md:w-16 md:h-16 bg-maroon text-cream-dark rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black font-serif shadow-sm">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-dark-brown/60 font-bold mt-1.5">
                  Mins
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col">
                <span className="w-12 h-12 md:w-16 md:h-16 bg-saffron text-white rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black font-serif shadow-sm animate-pulse">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-dark-brown/60 font-bold mt-1.5">
                  Secs
                </span>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-dark-brown/40 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Updates dynamically in real time</span>
          </div>
        </div>

      </div>
    </div>
  );
}
