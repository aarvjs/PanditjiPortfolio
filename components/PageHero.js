"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Flame, Heart, Calendar, Image, Bell, BookOpen, Sparkles, Mail } from "lucide-react";

export default function PageHero({ title, description, breadcrumbs = [], icon: propIcon }) {
  // Automatic spiritual icon selection based on page title
  const getAutoIcon = () => {
    if (propIcon) return propIcon;
    const t = title.toLowerCase();
    if (t.includes("event") || t.includes("schedule") || t.includes("gathering")) {
      return <Calendar className="w-8 h-8 text-maroon animate-pulse" />;
    }
    if (t.includes("seva") || t.includes("campaign") || t.includes("charity") || t.includes("donat")) {
      return <Heart className="w-8 h-8 text-maroon fill-current animate-pulse" />;
    }
    if (t.includes("gallery") || t.includes("photo") || t.includes("glimpse")) {
      return <Image className="w-8 h-8 text-maroon" />;
    }
    if (t.includes("notice") || t.includes("announc") || t.includes("update") || t.includes("board")) {
      return <Bell className="w-8 h-8 text-maroon animate-bounce" />;
    }
    if (t.includes("blog") || t.includes("teach") || t.includes("read") || t.includes("articl")) {
      return <BookOpen className="w-8 h-8 text-maroon" />;
    }
    if (t.includes("join") || t.includes("volunteer") || t.includes("serv")) {
      return <Sparkles className="w-8 h-8 text-maroon animate-pulse" />;
    }
    if (t.includes("contact") || t.includes("reach") || t.includes("write")) {
      return <Mail className="w-8 h-8 text-maroon" />;
    }
    return <Flame className="w-8 h-8 text-maroon fill-current animate-pulse" />;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FCFAF6] via-[#FAF2DF] to-[#F0F6EB] border-b border-gold/30 pt-32 pb-16 md:pt-36 md:pb-24 shadow-inner">
      
      {/* Background Layer: Subtle Lotus Vector Arc Backing */}
      <div className="absolute right-[-10%] top-[-20%] md:right-[5%] md:top-[-30%] w-96 h-96 md:w-[480px] md:h-[480px] text-maroon/5 opacity-40 pointer-events-none select-none animate-mandala-spin">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.35"
          className="w-full h-full"
        >
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="25" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating Soft Diya Sparks Overlay */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-gold/10 blur-[60px] top-[10%] left-[5%] pointer-events-none" />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-saffron/5 blur-[80px] bottom-[5%] right-[10%] pointer-events-none" />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-up space-y-4">
        
        {/* Spiritual Icon Box */}
        <div className="inline-flex items-center justify-center p-3.5 bg-maroon/5 backdrop-blur-md rounded-full border border-maroon/10 shadow-sm mb-2">
          {getAutoIcon()}
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-maroon/80 font-serif">
            <Link href="/" className="hover:text-saffron transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                {crumb.path ? (
                  <Link
                    href={crumb.path}
                    className="hover:text-saffron transition-colors"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-dark-brown/70">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Page Title */}
        <h1 className="text-3xl md:text-5xl font-black font-serif text-maroon text-saffron-glow leading-tight tracking-wide">
          {title}
        </h1>

        {/* Page Sub-description / Subtitle */}
        {description && (
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-dark-brown/90 leading-relaxed font-sans font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Golden Diya line underline */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-95 shadow-sm" />
    </div>
  );
}
