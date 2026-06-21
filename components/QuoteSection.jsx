"use client";

import React from "react";
import Image from "next/image";
import { Quote, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function QuoteSection({ quote }) {
  // Fallback quote if Firebase or prop is empty
  const fallbackQuote = {
    text: "Surrender your mind to the Lotus feet of Radha Krishna. Selfless devotion and service are the pathways to supreme bliss.",
    author: "Jagadguru Shri Kripalu Ji Maharaj",
    shloka: "तस्मादसर्वेषु कालेषु मामनुस्मर युध्य च। मय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयम्॥",
    translation: "Therefore, at all times, remember Me and surrender your intellect. With your mind surrendered, you will surely reach Me."
  };

  const activeQuote = quote && quote.text ? quote : fallbackQuote;
  const { text, author, shloka, translation } = activeQuote;

  return (
    <section className="py-20 bg-cream border-t border-b border-gold/10 relative overflow-hidden">
      
      {/* Decorative Static Background Circle */}
      <div className="absolute left-[-5%] bottom-[-5%] w-80 h-80 opacity-[0.02] pointer-events-none select-none text-gold">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading 
          title="Daily Spiritual Quote" 
          subtitle="GURU VANI & DIVINE TEACHINGS" 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-12">
          
          {/* ================= LEFT SIDE: GURU JI / SPIRITUAL IMAGE ================= */}
          <div className="lg:col-span-5 flex justify-center items-center relative animate-fade-up">
            
            {/* Static Partial SVG Arc backing behind card */}
            <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] text-gold/15 pointer-events-none select-none z-0">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75" className="w-full h-full">
                <path d="M 10 50 A 40 40 0 1 1 90 50" strokeDasharray="3 3" />
                <path d="M 20 50 A 30 30 0 1 1 80 50" strokeWidth="0.5" />
                <circle cx="50" cy="10" r="1.5" fill="currentColor" />
                <circle cx="90" cy="50" r="1.5" fill="currentColor" />
                <circle cx="10" cy="50" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* Soft Saffron & Golden glow backing light overlay */}
            <div className="absolute w-64 h-72 rounded-full bg-saffron/15 blur-[60px] pointer-events-none z-0" />
            
            {/* Static Mandala Pattern Behind Image */}
            <div className="absolute w-72 h-72 opacity-5 pointer-events-none select-none z-0 text-maroon">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="45" />
                <circle cx="50" cy="50" r="35" />
                {Array.from({ length: 16 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 45 * Math.cos((i * 22.5 * Math.PI) / 180)}
                    y2={50 + 45 * Math.sin((i * 22.5 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Guru Ji Spiritual Card Premium Frame */}
            <div className="relative z-10 w-72 bg-gradient-to-br from-white/95 to-cream-dark/65 backdrop-blur-md shadow-2xl hover:shadow-[0_20px_50px_rgba(122,28,28,0.15)] border-2 border-gold/30 rounded-3xl p-4 transition-all duration-500 hover:-translate-y-1.5">
              
              {/* Inner Double Gold Border Frame Container */}
              <div className="rounded-2xl overflow-hidden aspect-[4/5] relative bg-cream-dark/40 border border-gold/15 flex items-center justify-center p-1">
                <div className="absolute inset-2 border border-gold/20 rounded-xl pointer-events-none z-10" />
                <Image
                  src="/images/WhatsApp Image 2026-06-18 at 11.36.27.jpeg"
                  alt="Guru Ji Jagadguru Shri Kripalu Ji Maharaj"
                  width={300}
                  height={375}
                  className="w-full h-full object-cover object-top rounded-xl hover:scale-[1.03] transition-transform duration-700"
                />
              </div>

              {/* Bottom Card Title Banner */}
              <div className="pt-4 pb-1 text-center font-serif">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-maroon">
                  Jagadguru Shri Kripalu Ji Maharaj
                </h3>
                <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-saffron block mt-0.5">
                  Fifth Original Jagadguru
                </span>
              </div>

              {/* Diya anchors in corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border border-gold/40 rounded-full flex items-center justify-center bg-cream">
                <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
              </div>
              <div className="absolute top-2 right-2 w-3 h-3 border border-gold/40 rounded-full flex items-center justify-center bg-cream">
                <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
              </div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border border-gold/40 rounded-full flex items-center justify-center bg-cream">
                <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
              </div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border border-gold/40 rounded-full flex items-center justify-center bg-cream">
                <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
              </div>

            </div>
          </div>

          {/* ================= RIGHT SIDE: QUOTE CARD ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center animate-fade-up delay-100">
            <div className="relative overflow-hidden rounded-3xl border-2 border-gold/25 bg-gradient-to-br from-white/95 via-[#FFFDF9] to-cream-dark/35 p-6 sm:p-10 shadow-xl group">
              
              {/* Inner Decorative Grid Backing */}
              <div className="absolute inset-5 border border-gold/15 rounded-2xl pointer-events-none z-0" />
              
              {/* Floating Quote Mark decoration */}
              <div className="absolute top-8 left-8 text-gold/10 group-hover:text-gold/20 transition-colors z-0">
                <Quote className="w-16 h-16 rotate-180 fill-current" />
              </div>

              <div className="relative z-10 space-y-6 text-center flex flex-col items-center">
                {/* Tiny Devotional Sparkle */}
                <Sparkles className="w-5 h-5 text-saffron animate-pulse" />

                {/* Shloka section if exists */}
                {shloka && (
                  <div className="max-w-xl w-full z-10">
                    <p className="font-serif text-xs sm:text-sm md:text-base text-maroon font-bold leading-relaxed tracking-wide bg-gold-light/20 py-2.5 px-4 rounded-xl border border-gold/15 italic text-gold-glow">
                      {shloka}
                    </p>
                    {translation && (
                      <p className="text-[10px] sm:text-xs text-dark-brown/65 leading-normal mt-2 italic font-sans">
                        {translation}
                      </p>
                    )}
                  </div>
                )}

                {/* Main spiritual quote text */}
                <blockquote className="font-serif text-base sm:text-lg md:text-xl font-bold text-dark-brown leading-relaxed px-2 sm:px-6 text-saffron-glow">
                  "{text}"
                </blockquote>

                {/* Author / Guru name */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <span className="h-[2px] w-12 bg-saffron mb-2.5 rounded-full" />
                  <cite className="font-serif text-xs sm:text-sm font-bold uppercase tracking-widest text-maroon not-italic">
                    — {author}
                  </cite>
                  <span className="text-[9px] uppercase tracking-widest text-gold font-sans font-extrabold mt-1">
                    Spiritual Legacy
                  </span>
                </div>
              </div>

              {/* Bottom glowing border decoration */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-saffron to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
