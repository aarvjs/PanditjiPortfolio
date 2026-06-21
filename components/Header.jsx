"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, Flame } from "lucide-react";
import Navbar from "./Navbar";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();

  return (
    <>
      {/* ================= LEVEL 1: TOP HEADER ================= */}
      {/* Hidden on mobile, shown on desktop. Static flow (no height collapse to prevent layout shifts/jitter) */}
      <div className="hidden lg:block bg-cream-dark/45 border-b border-gold/15 px-4 sm:px-6 lg:px-8 overflow-visible relative z-50 bg-cream">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3.5">
          
          {/* Left Brand and Tagline aligned in a single row */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white shadow-sm animate-pulse">
                <Flame className="w-4.5 h-4.5 fill-current" />
              </div>
              <span className="font-serif text-sm sm:text-base md:text-lg font-black tracking-wide text-maroon group-hover:text-saffron transition-colors duration-300 whitespace-nowrap">
                {t("title")}
              </span>
            </Link>
            
            {/* Soft tagline */}
            <span className="inline-flex text-[9px] md:text-xs font-serif font-bold text-saffron tracking-wider bg-saffron/10 px-2.5 py-0.5 rounded-full border border-saffron/15 animate-tagline-blink whitespace-nowrap">
              {t("tagline")}
            </span>
          </div>

          {/* Right Contacts + Language Switcher */}
          <div className="flex items-center gap-5 text-xs font-semibold text-dark-brown/85">
            {/* Phone */}
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 hover:text-saffron transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-saffron" />
              <span>+91 98765 43210</span>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@neelmanikripalusatsang.org"
              className="flex items-center gap-1.5 hover:text-saffron transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-saffron" />
              <span className="truncate max-w-[200px] xl:max-w-none">contact@neelmanikripalusatsang.org</span>
            </a>

            {/* Language Switcher */}
            <div className="border-l border-gold/25 pl-4">
              <LanguageSwitcher />
            </div>
          </div>

        </div>
      </div>

      {/* ================= LEVEL 2: MAIN NAVBAR ================= */}
      <Navbar />
    </>
  );
}
