"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, translations } from "../context/LanguageContext";
import { ChevronDown, Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languageOptions = [
    { code: "hi", name: "हिन्दी" },
    { code: "en", name: "English" },
    { code: "bho", name: "भोजपुरी" },
    { code: "sa", name: "संस्कृतम्" }
  ];

  const currentLangName = languageOptions.find((o) => o.code === language)?.name || "हिन्दी";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-cream border border-gold/30 hover:border-saffron rounded-full text-xs font-semibold text-dark-brown shadow-sm transition-all duration-300 focus:outline-none"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Globe className="w-3.5 h-3.5 text-saffron" />
          <span>{currentLangName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1.5 w-32 origin-top-right rounded-xl bg-white border border-gold/25 shadow-lg ring-1 ring-black/5 focus:outline-none py-1 animate-fade-in"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          {languageOptions.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                changeLanguage(opt.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-serif font-bold transition-colors ${
                language === opt.code
                  ? "bg-saffron text-white"
                  : "text-dark-brown/80 hover:bg-cream-dark/50 hover:text-saffron"
              }`}
              role="menuitem"
              tabIndex="-1"
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
