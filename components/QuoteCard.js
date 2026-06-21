import React from "react";
import { Quote, Sparkles } from "lucide-react";

export default function QuoteCard({ quote }) {
  const { text, author, shloka, translation } = quote;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-cream-dark/45 via-white/80 to-cream-dark/25 p-6 md:p-10 shadow-md max-w-3xl mx-auto animate-fade-in group">
      
      {/* Decorative Rotating Background Mandala Center */}
      <div className="absolute right-[-10%] bottom-[-15%] w-48 h-48 text-gold/5 pointer-events-none select-none animate-mandala-spin">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}
              y2={50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}
            />
          ))}
        </svg>
      </div>

      {/* Floating Quote Icon */}
      <div className="absolute top-6 left-6 text-gold/15 group-hover:text-gold/25 transition-colors">
        <Quote className="w-12 h-12 rotate-180 fill-current" />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Tiny Devotional Sparkle */}
        <Sparkles className="w-5 h-5 text-saffron mb-4 animate-pulse" />

        {/* Shloka section if exists */}
        {shloka && (
          <div className="mb-6 max-w-xl">
            <p className="font-serif text-sm md:text-base text-maroon font-bold leading-relaxed tracking-wider bg-gold-light/20 py-2.5 px-4 rounded-xl border border-gold/10 italic text-gold-glow">
              {shloka}
            </p>
            {translation && (
              <p className="text-xs text-dark-brown/70 leading-normal mt-2 italic font-sans">
                {translation}
              </p>
            )}
          </div>
        )}

        {/* Main spiritual quote text */}
        <blockquote className="font-serif text-lg md:text-xl font-bold text-dark-brown leading-relaxed mb-6 px-4 md:px-8 text-saffron-glow">
          "{text}"
        </blockquote>

        {/* Author / Guru name */}
        <div className="flex flex-col items-center justify-center">
          <span className="h-[2px] w-8 bg-saffron mb-2 rounded-full" />
          <cite className="font-serif text-xs md:text-sm font-bold uppercase tracking-widest text-maroon not-italic">
            — {author}
          </cite>
          <span className="text-[9px] uppercase tracking-widest text-gold font-sans font-extrabold mt-1">
            Divine Teachings
          </span>
        </div>
      </div>

      {/* Bottom glowing border decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-saffron to-transparent" />
    </div>
  );
}
