"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, Flame, Heart } from "lucide-react";
import Navbar from "./Navbar";
import { useLanguage } from "../context/LanguageContext";
import { useSiteSettings } from "../context/SiteSettingsContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  return (
    <>
      {/* ================= LEVEL 1: TOP HEADER ================= */}
      {/* Hidden on mobile, shown on desktop. Static flow (no height collapse to prevent layout shifts/jitter) */}
      <div className="hidden lg:block bg-cream-dark/45 border-b border-gold/15 px-4 sm:px-6 lg:px-4 xl:px-8 overflow-visible relative z-50 bg-cream">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center py-3.5">
          
          {/* Left Brand and Tagline aligned in a single row */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-2 group">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white shadow-sm animate-pulse">
                  <Flame className="w-4.5 h-4.5 fill-current" />
                </div>
              )}
              <span className="font-serif text-sm sm:text-base md:text-lg font-black tracking-wide text-maroon group-hover:text-saffron transition-colors duration-300 whitespace-nowrap">
                {settings.organizationName || t("title")}
              </span>
            </Link>
            
            {/* Soft tagline */}
            <span className="inline-flex text-[9px] md:text-xs font-serif font-bold text-saffron tracking-wider bg-saffron/10 px-2.5 py-0.5 rounded-full border border-saffron/15 animate-tagline-blink whitespace-nowrap">
              {settings.tagline || t("tagline")}
            </span>
          </div>

          {/* Right Contacts + Language Switcher */}
          <div className="flex items-center gap-5 text-xs font-semibold text-dark-brown/85">
            {/* Phone */}
            <a
              href={`tel:${settings.phone || "+919876543210"}`}
              className="flex items-center gap-1.5 hover:text-saffron transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-saffron" />
              <span>{settings.phone || "+91 98765 43210"}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email || "contact@neelmanikripalusatsang.org"}`}
              className="flex items-center gap-1.5 hover:text-saffron transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-saffron" />
              <span className="truncate max-w-[200px] xl:max-w-none">{settings.email || "contact@neelmanikripalusatsang.org"}</span>
            </a>

            {/* Donation CTA */}
            <Link
              href="/donation"
              className="px-3 py-1.5 bg-saffron hover:bg-maroon text-white rounded-full font-bold font-serif uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1.5 border border-saffron-light/10"
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>{t("donation")}</span>
            </Link>

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
