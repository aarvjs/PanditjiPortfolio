"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Phone, MessageCircle, Flame } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ isScrolled: parentIsScrolled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localIsSticky, setLocalIsSticky] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Support standalone scroll tracking if not passed from Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setLocalIsSticky(true);
      } else {
        setLocalIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSticky = parentIsScrolled !== undefined ? parentIsScrolled : localIsSticky;

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("about"), path: "/about" },
    { name: t("events"), path: "/events" },
    { name: t("seva"), path: "/campaigns" },
    { name: t("gallery"), path: "/gallery" },
    { name: t("announcements"), path: "/announcements" },
    { name: t("blog"), path: "/blog" },
    { name: t("contact"), path: "/contact" }
  ];

  return (
    <nav
      className={`w-full z-40 transition-all duration-300 sticky top-0 ${
        isSticky
          ? "bg-cream/95 backdrop-blur-md shadow-md border-b border-gold/20 py-3"
          : "bg-cream border-b border-gold/10 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* ================= DESKTOP VIEW ================= */}
          {/* Desktop Brand (shows only when navbar is scrolled/sticky, otherwise top header has it) */}
          <div className={`hidden lg:flex items-center space-x-1.5 transition-all duration-300 ${isSticky ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-4 w-0 overflow-hidden"}`}>
            <Link href="/" className="flex items-center space-x-1 group flex-shrink-0">
              <Flame className="w-4 h-4 text-saffron fill-current flex-shrink-0" />
              <span className="font-serif text-xs xl:text-sm font-black tracking-tight text-maroon group-hover:text-saffron transition-colors whitespace-nowrap">
                {t("title")}
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-grow justify-center flex-nowrap overflow-hidden">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`rounded-xl font-serif font-bold uppercase tracking-wider transition-all duration-300 relative whitespace-nowrap ${
                    isSticky 
                      ? "px-2 py-1.5 text-[10px] xl:text-xs" 
                      : "px-3 py-2 text-[11px] xl:text-xs"
                  } ${
                    isActive
                      ? "text-saffron bg-gold-light/20"
                      : "text-dark-brown/85 hover:text-saffron hover:bg-cream-dark/30"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-2 right-2 h-[1.5px] bg-saffron rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side CTAs */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-2.5 flex-shrink-0">
            {/* Call CTA */}
            <a
              href="tel:+919876543210"
              className={`border border-gold/45 hover:border-saffron rounded-full font-bold font-serif uppercase tracking-widest transition-all duration-300 flex items-center gap-1 bg-white shadow-sm btn-water-outline-maroon ${
                isSticky ? "px-3 py-1.5 text-[9px] xl:text-[10px]" : "px-4 py-2 text-xs"
              }`}
            >
              <Phone className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{t("call")}</span>
            </a>

            {/* Donation CTA */}
            <Link
              href="/donation"
              className={`rounded-full font-bold font-serif uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 border border-saffron-light/10 btn-water-saffron-maroon ${
                isSticky ? "px-3 py-1.5 text-[9px] xl:text-[10px]" : "px-4 py-2 text-xs"
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current relative z-10" />
              <span className="relative z-10">{t("donation")}</span>
            </Link>
          </div>

          {/* ================= MOBILE VIEW (COMPACT HEADER BAR) ================= */}
          <div className="flex lg:hidden justify-between w-full items-center">
            {/* Mobile Brand (properly sized, not cut or broken) */}
            <Link href="/" className="flex items-center space-x-1.5 max-w-[55%] sm:max-w-[65%] group">
              <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Flame className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-serif text-xs sm:text-sm font-black tracking-wide text-maroon group-hover:text-saffron transition-colors leading-tight truncate">
                {t("title")}
              </span>
            </Link>

            {/* Mobile Important Actions (Icons: Call, WhatsApp, Menu) */}
            <div className="flex items-center space-x-3">
              {/* Call Icon */}
              <a
                href="tel:+919876543210"
                className="p-2 rounded-full bg-cream-dark/50 border border-gold/15 text-maroon hover:text-saffron transition-all"
                aria-label="Call Us"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/919876543210?text=Radhey%20Radhey!%20I%20want%20to%20know%20about%20upcoming%20satsang%20gatherings."
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 hover:text-emerald-700 transition-all"
                aria-label="WhatsApp Us"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-gold-light/20 text-maroon hover:text-saffron transition-all"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MOBILE DRAWER (Smooth Dropdown) ================= */}
      {isOpen && (
        <div className="lg:hidden w-full bg-cream border-t border-gold/15 px-4 py-5 animate-fade-in shadow-inner relative z-50">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-gold-light/35 text-maroon border-l-4 border-saffron"
                      : "text-dark-brown/85 hover:bg-cream-dark/45 hover:text-saffron"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Language Switcher and CTAs inside drawer */}
            <div className="pt-4 border-t border-gold/15 mt-3 space-y-3">
              {/* Language Switcher Row */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-cream-dark/25 rounded-xl border border-gold/10">
                <span className="text-xs font-serif font-bold text-dark-brown/60 uppercase">
                  Select Language
                </span>
                <LanguageSwitcher />
              </div>

              {/* Call Button */}
              <a
                href="tel:+919876543210"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 border border-gold/30 hover:border-saffron text-maroon hover:text-saffron rounded-xl text-xs font-bold font-serif uppercase tracking-widest bg-white shadow-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t("call")}</span>
              </a>

              {/* Donation Button */}
              <Link
                href="/donation"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 bg-saffron hover:bg-maroon text-white rounded-xl text-xs font-bold font-serif uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{t("donation")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
