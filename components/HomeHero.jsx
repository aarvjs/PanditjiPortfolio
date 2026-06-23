"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Calendar, Heart, HeartHandshake } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function HomeHero() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-gradient-to-b from-cream via-[#FFFDF9] to-cream-dark/20 overflow-hidden pt-28 pb-16 border-b border-gold/15">
      
      {/* Background Subtle Lotus Vector Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Soft Saffron and Gold drifting background light glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-saffron/5 blur-[120px] top-[10%] left-[-5%] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] bottom-[10%] right-[-5%] pointer-events-none" />
 
      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: DETAILS ================= */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start animate-fade-up">
            
            {/* Saffron Welcome Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-saffron/10 border border-saffron/20 rounded-full text-[10px] sm:text-xs font-bold font-serif uppercase tracking-widest text-saffron">
              <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
              <span>{settings.tagline || t("divine_guidance")}</span>
            </div>
 
            {/* Main Spiritual Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif text-maroon text-saffron-glow leading-[1.15] tracking-wide max-w-2xl">
              {settings.organizationName || t("hero_title")}
            </h1>

            {/* Guru Ji Name & Designation in Portfolio Style */}
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold block">Spiritual Lineage & Guidance</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-brown">
                Jagadguru Shri Kripalu Ji Maharaj
              </h2>
              <p className="text-xs uppercase tracking-widest text-saffron font-semibold font-sans">
                {t("designation")}
              </p>
            </div>
 
            {/* Spiritual Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-dark-brown/80 font-medium leading-relaxed max-w-xl">
              {t("hero_desc")}
            </p>
 
            {/* CTA Actions (Join Satsang, Upcoming Events) */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 pt-4">
              {/* Join Satsang */}
              <Link
                href="/join"
                className="w-full sm:w-auto px-7 py-3.5 text-white rounded-full text-xs font-bold font-serif tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center flex items-center justify-center gap-1.5 border border-saffron-light/10 btn-water-saffron-maroon"
              >
                <Heart className="w-4 h-4 fill-current relative z-10" />
                <span className="relative z-10">{t("join_satsang")}</span>
              </Link>

              {/* Upcoming Events */}
              <a
                href="#upcoming-satsang"
                className="w-full sm:w-auto px-7 py-3.5 text-maroon border border-gold/30 rounded-full text-xs font-bold font-serif tracking-widest uppercase transition-all duration-300 shadow-sm hover:-translate-y-0.5 text-center flex items-center justify-center gap-1.5 btn-water-outline-maroon"
              >
                <Calendar className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{t("upcoming_events")}</span>
              </a>
            </div>
 
            {/* Small Trust Line */}
            <div className="pt-6 border-t border-gold/15 w-full max-w-md flex items-center justify-center lg:justify-start gap-2 text-[10px] sm:text-xs font-bold text-dark-brown/50 uppercase font-serif">
              <Sparkles className="w-4 h-4 text-saffron flex-shrink-0" />
              <span>{t("trust_line")}</span>
            </div>
 
          </div>
 
          {/* ================= RIGHT COLUMN: GURU JI PORTRAIT FRAME ================= */}
          <div className="lg:col-span-5 flex justify-center items-center relative animate-fade-up delay-200">
            
            {/* Static Partial SVG Arc backing behind card */}
            <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] text-gold/15 pointer-events-none select-none z-0">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75" className="w-full h-full">
                {/* Arc path instead of full spinning circle */}
                <path d="M 10 50 A 40 40 0 1 1 90 50" strokeDasharray="3 3" />
                <path d="M 20 50 A 30 30 0 1 1 80 50" strokeWidth="0.5" />
                <circle cx="50" cy="10" r="1.5" fill="currentColor" />
                <circle cx="90" cy="50" r="1.5" fill="currentColor" />
                <circle cx="10" cy="50" r="1.5" fill="currentColor" />
              </svg>
            </div>
 
            {/* Soft Saffron & Golden glow backing light overlay */}
            <div className="absolute w-72 h-80 rounded-full bg-saffron/15 blur-[60px] pointer-events-none z-0" />
            
            {/* Static Mandala Pattern Behind Image */}
            <div className="absolute w-80 h-80 opacity-5 pointer-events-none select-none z-0 text-maroon">
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
            <div className="relative z-10 w-72 sm:w-80 bg-gradient-to-br from-white/95 to-cream-dark/65 backdrop-blur-md shadow-2xl hover:shadow-[0_20px_50px_rgba(122,28,28,0.15)] border-2 border-gold/30 rounded-3xl p-4 transition-all duration-500 hover:-translate-y-1.5">
              
              {/* Inner Double Gold Border Frame Container */}
              <div className="rounded-2xl overflow-hidden aspect-[4/5] relative bg-cream-dark/40 border border-gold/15 flex items-center justify-center p-1">
                <div className="absolute inset-2 border border-gold/20 rounded-xl pointer-events-none z-10" />
                <Image
                  src="/images/gurujihero.jpeg"
                  alt="Guru Ji - Jagadguru Shri Kripalu Ji Maharaj"
                  width={350}
                  height={437}
                  className="w-full h-full object-cover object-top rounded-xl hover:scale-[1.03] transition-transform duration-700"
                  priority
                />
              </div>
 
              {/* Bottom Card Title Banner */}
              <div className="pt-4 pb-1 text-center font-serif">
                <h3 className="text-sm sm:text-base font-extrabold tracking-wider text-maroon">
                  Jagadguru Shri Kripalu Ji Maharaj
                </h3>
                <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-saffron block mt-0.5">
                  第五代正统哲人导师 • Fifth Jagadguru
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
 
        </div>
      </div>
      
    </section>
  );
}
