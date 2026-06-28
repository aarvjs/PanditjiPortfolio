"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Phone, MessageCircle, Flame } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteSettings } from "../context/SiteSettingsContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ isScrolled: parentIsScrolled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localIsSticky, setLocalIsSticky] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

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

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isSticky = parentIsScrolled !== undefined ? parentIsScrolled : localIsSticky;

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("about"), path: "/about" },
    { name: t("events"), path: "/events" },
    { name: t("seva"), path: "/campaigns" },
    { name: t("gallery"), path: "/gallery" },
    { name: t("announcements"), path: "/announcements" },
    { name: t("blog"), path: "/blog" },
    { name: t("library"), path: "/library" },
    { name: t("lost_found"), path: "/lost-found" },
    { name: t("festivals"), path: "/festivals" },
    { name: t("contact"), path: "/contact" }
  ];

  return (
    <>
      {/* ================= MOBILE VIEW TOP HEADER (Static, scrolls away) ================= */}
      <div className="lg:hidden w-full bg-cream border-b border-gold/10 px-4 py-2.5 flex justify-between items-center z-30">
        <Link href="/" className="flex items-center space-x-1.5 max-w-[65%] group">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-7 h-7 object-contain rounded-full flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Flame className="w-3.5 h-3.5 fill-current" />
            </div>
          )}
          <span className="font-serif text-xs sm:text-sm font-black tracking-wide text-maroon group-hover:text-saffron transition-colors leading-tight truncate">
            {settings.organizationName || t("title")}
          </span>
        </Link>

        {/* Language Selector stays in Header */}
        <div className="flex-shrink-0">
          <LanguageSwitcher />
        </div>
      </div>

      {/* ================= MAIN NAVBAR (Sticky at the top for desktop & mobile navbar) ================= */}
      <nav
        className={`w-full z-40 transition-all duration-300 sticky top-0 ${isSticky
            ? "bg-cream/95 backdrop-blur-md shadow-md border-b border-gold/20 py-2 sm:py-3"
            : "bg-cream border-b border-gold/10 py-2 sm:py-3"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
          <div className="flex items-center justify-between">

            {/* ================= DESKTOP VIEW ================= */}
            {/* Desktop Brand (shows only when navbar is scrolled/sticky, otherwise top header has it) */}
            {isSticky && (
              <div className="hidden lg:flex items-center space-x-1.5 transition-all duration-300">
                <Link href="/" className="flex items-center space-x-1 group flex-shrink-0">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 object-contain rounded-full flex-shrink-0" />
                  ) : (
                    <Flame className="w-4 h-4 text-saffron fill-current flex-shrink-0" />
                  )}
                  <span className="font-serif text-xs xl:text-sm font-black tracking-tight text-maroon group-hover:text-saffron transition-colors whitespace-nowrap">
                    {settings.organizationName || t("title")}
                  </span>
                </Link>
              </div>
            )}

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-x-1 xl:gap-x-2 flex-grow justify-center flex-nowrap">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`rounded-xl font-serif font-bold uppercase tracking-wider transition-all duration-300 relative whitespace-nowrap ${isSticky
                        ? "px-1.5 py-1 text-[9.5px] lg:text-[10px] xl:px-2.5 xl:py-1.5 xl:text-xs"
                        : "px-2 py-1.5 text-[10px] lg:text-[11px] xl:px-3 xl:py-2 xl:text-xs"
                      } ${isActive
                        ? "text-saffron bg-saffron/10"
                        : "text-dark-brown/85 hover:text-saffron hover:bg-saffron/5"
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-1 left-1.5 right-1.5 h-[1.5px] bg-saffron rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Side CTAs */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-2.5 flex-shrink-0">
              {/* Call CTA */}
              <a
                href={`tel:${settings.phone || "+919876543210"}`}
                className={`border border-gold/45 hover:border-saffron rounded-full font-bold font-serif uppercase tracking-widest transition-all duration-300 flex items-center gap-1 bg-white shadow-sm btn-water-outline-maroon ${isSticky ? "px-3 py-1.5 text-[9px] xl:text-[10px]" : "px-4 py-2 text-xs"
                  }`}
              >
                <Phone className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{t("call")}</span>
              </a>
            </div>

            {/* ================= MOBILE NAVBAR VIEW (Only the navbar row remains in the sticky context) ================= */}
            <div className="lg:hidden flex justify-between w-full items-center">
              {/* Menu Trigger Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-light/20 text-maroon hover:text-saffron transition-all font-serif font-bold text-xs uppercase tracking-wider"
                aria-label="Open Menu"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </button>

              {/* Contact Actions */}
              <div className="flex items-center space-x-3">
                {/* Phone Call (tel: Link) */}
                <a
                  href={`tel:${settings.phone || "+919876543210"}`}
                  className="p-2 rounded-full bg-cream-dark/50 border border-gold/15 text-maroon hover:text-saffron transition-all"
                  aria-label="Call Us"
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* WhatsApp Chat Link */}
                <a
                  href={`https://wa.me/${settings.whatsapp || "919876543210"}?text=Radhey%20Radhey!%20I%20want%20to%20know%20about%20upcoming%20satsang%20gatherings.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 hover:text-emerald-700 transition-all"
                  aria-label="WhatsApp Us"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ================= MOBILE DRAWER (Right Slide-out Drawer) ================= */}
        {/* Background Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Slide-out Panel */}
        <div
          className={`lg:hidden fixed inset-y-0 right-0 w-72 max-w-full bg-cream border-l border-gold/25 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-gold/15 flex items-center justify-between bg-cream-dark/25">
            <span className="font-serif text-xs font-black uppercase tracking-wider text-maroon">
              Menu Navigation
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-gold-light/20 text-maroon hover:text-saffron transition-all"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all ${isActive
                      ? "bg-gold-light/35 text-maroon border-l-4 border-saffron"
                      : "text-dark-brown/85 hover:bg-cream-dark/45 hover:text-saffron"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-gold/15 bg-cream-dark/25 space-y-3">
            {/* Call CTA */}
            <a
              href={`tel:${settings.phone || "+919876543210"}`}
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 border border-gold/30 hover:border-saffron text-maroon hover:text-saffron rounded-xl text-xs font-bold font-serif uppercase tracking-widest bg-white shadow-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t("call")}</span>
            </a>

            {/* Donation CTA */}
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
      </nav>
    </>
  );
}
