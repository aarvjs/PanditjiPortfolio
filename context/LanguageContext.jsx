"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  hi: {
    title: "नीलमणि कृपालु सत्संग",
    tagline: "राधे राधे • दिव्य सत्संग • सेवा • भक्ति",
    welcome: "नीलमणि कृपालु सत्संग में आपका स्वागत है",
    hero_title: "नीलमणि कृपालु सत्संग",
    hero_desc: "जगद्गुरु श्री कृपालु जी महाराज के पावन संरक्षण में अपने मन को श्री राधा कृष्ण के चरणों में समर्पित करें, मधुर संकीर्तन और नि:स्वार्थ सेवा के माध्यम से आंतरिक शांति प्राप्त करें।",
    join_satsang: "सत्संग से जुड़ें",
    upcoming_events: "आगामी कार्यक्रम",
    trust_line: "दैनिक सत्संग • आध्यात्मिक मार्गदर्शन • सेवा गतिविधियां",
    home: "गृह",
    about: "हमारे बारे में",
    events: "सत्संग कार्यक्रम",
    seva: "सेवा अभियान",
    gallery: "दिव्य गैलरी",
    announcements: "सूचना पट्ट",
    blog: "आध्यात्मिक ब्लॉग",
    contact: "संपर्क करें",
    volunteer: "स्वयंसेवक बनें",
    phone: "फोन",
    email: "ईमेल",
    whatsapp: "व्हाट्सएप",
    lang_name: "हिन्दी",
    donation: "दान सेवा",
    call: "संपर्क करें",
    divine_guidance: "दिव्य मार्गदर्शन एवं सत्संग",
    designation: "पंचम मूल जगद्गुरु"
  },
  en: {
    title: "Neelmani Kripalu Satsang",
    tagline: "Radhe Radhe • Divine Satsang • Seva • Bhakti",
    welcome: "Welcome to Neelmani Kripalu Satsang",
    hero_title: "Neelmani Kripalu Satsang",
    hero_desc: "Under the holy shelter of Jagadguru Shri Kripalu Ji Maharaj, surrender your mind to the Lotus feet of Radha Krishna, and find inner peace through melodious sankirtan and selfless seva.",
    join_satsang: "Join Satsang",
    upcoming_events: "Upcoming Events",
    trust_line: "Daily Satsang • Spiritual Guidance • Seva Activities",
    home: "Home",
    about: "About",
    events: "Events",
    seva: "Seva Campaigns",
    gallery: "Gallery",
    announcements: "Announcements",
    blog: "Blog",
    contact: "Contact",
    volunteer: "Become a Volunteer",
    phone: "Phone",
    email: "Email",
    whatsapp: "WhatsApp",
    lang_name: "English",
    donation: "Donation",
    call: "Call Us",
    divine_guidance: "Divine Guidance & Satsang",
    designation: "Fifth Original Jagadguru"
  },
  bho: {
    title: "नीलमणि कृपालु सत्संग",
    tagline: "राधे राधे • दिव्य सत्संग • सेवा • भक्ति",
    welcome: "नीलमणि कृपालु सत्संग में राउर स्वागत बा",
    hero_title: "नीलमणि कृपालु सत्संग",
    hero_desc: "जगद्गुरु श्री कृपालु जी महाराज के पावन छत्रछाया में आपन मन के श्री राधा कृष्ण के चरनन में सौंप दीं, मधुर संकीर्तन अउर नि:स्वार्थ सेवा से मन के शांति पाईं।",
    join_satsang: "सत्संग से जुड़ीं",
    upcoming_events: "आगामी कार्यक्रम",
    trust_line: "दैनिक सत्संग • आध्यात्मिक मार्गदर्शन • सेवा के काम",
    home: "घर",
    about: "हमरे बारे में",
    events: "सत्संग कार्यक्रम",
    seva: "सेवा अभियान",
    gallery: "गैलरी",
    announcements: "सूचना पट्ट",
    blog: "ब्लॉग",
    contact: "संपर्क करीं",
    volunteer: "स्वयंसेवक बनीं",
    phone: "फोन",
    email: "ईमेल",
    whatsapp: "व्हाट्सएप",
    lang_name: "भोजपुरी",
    donation: "दान सेवा",
    call: "संपर्क करीं",
    divine_guidance: "दिव्य मार्गदर्शन अउर सत्संग",
    designation: "पंचम मूल जगद्गुरु"
  },
  sa: {
    title: "नीलमणि कृपालु सत्सङ्गः",
    tagline: "राधे राधे • दिव्य सत्संगः • सेवा • भक्तिः",
    welcome: "नीलमणि कृपालु सत्सङ्गे स्वागतमस्ति",
    hero_title: "नीलमणि कृपालु सत्सङ्गः",
    hero_desc: "जगद्गुरु श्रीकृपालुजी महाराजस्य पावनसंरक्षणे स्वमनः श्रीराधाकृष्णयोः चरणकमलयोः समर्पयन्तु, मधुरसंकीर्तनेन निष्कामसेवया च आन्तरिकशान्तिं प्राप्नुवन्तु।",
    join_satsang: "सत्सङ्गं प्रविशन्तु",
    upcoming_events: "आगामी कार्यक्रमाः",
    trust_line: "नित्यसत्सङ्गः • आध्यात्मिकमार्गदर्शनम् • सेवाकार्याणि",
    home: "मुख्यपृष्ठम्",
    about: "अस्मद्विषये",
    events: "सत्सङ्ग-कार्यक्रमाः",
    seva: "सेवा-अभियानानि",
    gallery: "दिव्यचित्रशाला",
    announcements: "सूचनापट्टम्",
    blog: "आध्यात्मिकलेखसमूहः",
    contact: "सम्पर्कः",
    volunteer: "स्वयंसेवकः भवतु",
    phone: "दूरभाषः",
    email: "विद्युत्पत्रम्",
    whatsapp: "व्हाट्सएप्प",
    lang_name: "संस्कृतम्",
    donation: "दानम्",
    call: "दूरभाषः",
    divine_guidance: "दिव्यमार्गदर्शनम् सत्सङ्गः च",
    designation: "पञ्चम मूल जगद्गुरुः"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("nks_lang");
    if (saved && ["hi", "en", "bho", "sa"].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("nks_lang", lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["hi"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
