"use client";

import React from "react";
import Link from "next/link";
import { Compass, Calendar, Home, Sparkles } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-grow min-h-[70vh] bg-mandala-pattern flex flex-col items-center justify-center font-sans bg-cream relative py-12 px-6">
        
        {/* Decorative Mandala Graphic */}
        <div className="absolute w-80 h-80 opacity-[0.03] text-maroon pointer-events-none select-none z-0">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="35" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 45 * Math.cos((i * 45 * Math.PI) / 180)}
                y2={50 + 45 * Math.sin((i * 45 * Math.PI) / 180)}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-md w-full text-center space-y-6 relative z-10 bg-white/60 border border-gold/15 p-8 rounded-3xl backdrop-blur-md shadow-lg">
          <div className="mx-auto w-16 h-16 bg-cream-dark/50 text-maroon rounded-full border border-gold/30 flex items-center justify-center">
            <Compass className="w-8 h-8 text-maroon animate-spin" style={{ animationDuration: "12s" }} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-saffron tracking-widest block font-sans">
              Error 404
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-maroon">
              Page Not Found
            </h2>
            <p className="text-xs text-dark-brown/70 max-w-sm mx-auto leading-relaxed">
              Radhey Radhey! The path you are seeking does not exist or has been moved. Let us guide you back to the main congregation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/"
              className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/events"
              className="px-6 py-2.5 border border-maroon hover:border-gold hover:text-gold text-maroon font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>View Satsang Events</span>
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
