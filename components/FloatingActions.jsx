"use client";

import React from "react";
import Link from "next/link";
import { Phone, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function FloatingActions() {
  const { t } = useLanguage();

  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-40 flex flex-col gap-3.5 animate-fade-in font-serif">
      
      {/* Call Floating Action Button */}
      <a
        href="tel:+919876543210"
        className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group border border-saffron-light/10 btn-water-saffron-maroon"
        aria-label="Call Helpline"
      >
        <Phone className="w-5 h-5 relative z-10" />
        <span className="absolute right-14 bg-maroon text-white text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none whitespace-nowrap z-0 border border-gold/15">
          {t("call")}
        </span>
      </a>
      
      {/* Donation Floating Action Button */}
      <Link
        href="/donation"
        className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group border border-gold/25 btn-water-maroon-saffron"
        aria-label="Donation Seva"
      >
        <Heart className="w-5 h-5 fill-current text-white relative z-10" />
        <span className="absolute right-14 bg-saffron text-white text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none whitespace-nowrap z-0 border border-saffron-light/15">
          {t("donation")}
        </span>
      </Link>
      
    </div>
  );
}
