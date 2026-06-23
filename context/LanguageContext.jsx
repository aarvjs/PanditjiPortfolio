"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
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
  sa: {
    title: "नीलमणि कृपालु सत्सङ्गः",
    tagline: "राधे राधे • दिव्य सत्सङ्गः • सेवा • भक्तिः",
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
  },
  or: {
    title: "ନୀଳମଣି କୃପାଳୁ ସତ୍ସଙ୍ଗ",
    tagline: "ରାଧେ ରାଧେ • ଦିବ୍ୟ ସତ୍ସଙ୍ଗ • ସେବା • ଭକ୍ତି",
    welcome: "ନୀଳମଣି କୃପାଳୁ ସତ୍ସଙ୍ଗକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ",
    hero_title: "ନୀଳମଣି କୃପାଳୁ ସତ୍ସଙ୍ଗ",
    hero_desc: "ଜଗଦ୍ଗୁରୁ ଶ୍ରୀ କୃପାଳୁ ଜୀ ମହାରାଜଙ୍କ ପବିତ୍ର ଆଶ୍ରୟରେ ଆପଣଙ୍କ ମନକୁ ଶ୍ରୀ ରାଧା କୃଷ୍ଣଙ୍କ ଚରଣରେ ସମର୍ପଣ କରନ୍ତୁ, ମଧୁର ସଂକୀର୍ତ୍ତନ ଓ ନିଷ୍କାମ ସେବା ମାଧ୍ୟମରେ ଆଧ୍ୟାତ୍ମିକ ଶାନ୍ତି ଲାଭ କରନ୍ତୁ।",
    join_satsang: "ସତ୍ସଙ୍ଗରେ ଯୋଗ ଦିଅନ୍ତୁ",
    upcoming_events: "ଆଗାମୀ କାର୍ଯ୍ୟକ୍ରମ",
    trust_line: "ଦୈନିକ ସତ୍ସଙ୍ଗ • ଆଧ୍ୟାତ୍మିକ ମାର୍ଗଦର୍ଶନ • ସେବା କାର୍ଯ୍ୟକଳାପ",
    home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
    about: "ଆମ ବିଷୟରେ",
    events: "ସତ୍ସଙ୍ଗ କାର୍ଯ୍ୟକ୍ରମ",
    seva: "ସେବା ଅଭିଯାନ",
    gallery: "ଦିବ୍ୟ ଗ୍ୟାଲେରୀ",
    announcements: "ସୂଚନା ଫଳକ",
    blog: "ଆଧ୍ୟାତ୍ମିକ ବ୍ଲଗ୍",
    contact: "ଯୋଗାଯୋଗ କରନ୍ତୁ",
    volunteer: "ସ୍ୱେଚ୍ଛାସେବୀ ହୁଅନ୍ତୁ",
    phone: "ଫୋନ୍",
    email: "ଇମେଲ୍",
    whatsapp: "ହ୍ୱାଟ୍ସଆପ୍",
    lang_name: "ଓଡ଼ିଆ",
    donation: "ଦାନ ସେବା",
    call: "କଲ୍ କରନ୍ତୁ",
    divine_guidance: "ଦିବ୍ୟ ମାର୍ଗଦର୍ଶନ ଏବଂ ସତ୍ସଙ୍ଗ",
    designation: "ପଞ୍ଚମ ମୂଳ ଜଗଦ୍ଗୁରୁ"
  },
  bn: {
    title: "নীলমণি কৃপালু সৎসঙ্গ",
    tagline: "রাধে রাধে • দিব্য সৎসঙ্গ • সেবা • ভক্তি",
    welcome: "নীলমণি কৃপালু সৎসঙ্গে আপনাকে স্বাগত",
    hero_title: "নীলমণি কৃপালু সৎসঙ্গ",
    hero_desc: "জগদ্গুরু শ্রী কৃপালু জী মহারাজের পবিত্র আশ্রয়ে আপনার মনকে শ্রী রাধা কৃষ্ণের চরণে সমর্পণ করুন, মধুর সংকীর্তন ও নিষ্কাম সেবার মাধ্যমে আধ্যাত্মিক শান্তি লাভ করুন।",
    join_satsang: "সৎসঙ্গে যোগ দিন",
    upcoming_events: "আগামী অনুষ্ঠানসমূহ",
    trust_line: "দৈনিক সৎসঙ্গ • আধ্যাত্মিক পথনির্দেশ • সেবা কার্যক্রম",
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    events: "সৎসঙ্গ অনুষ্ঠান",
    seva: "সেবা অভিযান",
    gallery: "দিব্য গ্যালারি",
    announcements: "বিজ্ঞপ্তি বোর্ড",
    blog: "আধ্যাত্মিক ব্লগ",
    contact: "যোগাযোগ করুন",
    volunteer: "স্বেচ্ছাসেবক হন",
    phone: "ফোন",
    email: "ইমেল",
    whatsapp: "হোয়াটসঅ্যাপ",
    lang_name: "বাংলা",
    donation: "দান সেবা",
    call: "কল করুন",
    divine_guidance: "দিব্য পথনির্দেশ ও সৎসঙ্গ",
    designation: "পঞ্চম মূল জগদ্গুরু"
  },
  mr: {
    title: "नीलमणी कृपालू सत्संग",
    tagline: "राधे राधे • दिव्य सत्संग • सेवा • भक्ती",
    welcome: "नीलमणी कृपालू सत्संगमध्ये आपले स्वागत आहे",
    hero_title: "नीलमणी कृपालू सत्संग",
    hero_desc: "जगद्गुरु श्री कृपालू जी महाराज यांच्या पावन छत्राखाली आपले मन श्री राधा कृष्णाच्या चरणी समर्पित करा, मधुर संकीर्तन आणि नि:स्वार्थ सेवेद्वारे आंतरिक शांती मिळवा.",
    join_satsang: "सत्संगात सामील व्हा",
    upcoming_events: "आगामी कार्यक्रम",
    trust_line: "दैनिक सत्संग • आध्यात्मिक मार्गदर्शन • सेवा उपक्रम",
    home: "मुख्यपृष्ठ",
    about: "आमच्याबद्दल",
    events: "सत्संग कार्यक्रम",
    seva: "सेवा मोहीम",
    gallery: "दिव्य गॅलरी",
    announcements: "सूचना फलक",
    blog: "आध्यात्मिक ब्लॉग",
    contact: "संपर्क करा",
    volunteer: "स्वयंसेवक व्हा",
    phone: "फोन",
    email: "ईमेल",
    whatsapp: "व्हॉट्सॲप",
    lang_name: "मराठी",
    donation: "दान सेवा",
    call: "संपर्क साधा",
    divine_guidance: "दिव्य मार्गदर्शन आणि सत्संग",
    designation: "पंचम मूळ जगद्गुरु"
  },
  gu: {
    title: "નીલમણિ કૃપાલુ સત્સંગ",
    tagline: "રાધે રાધે • દિવ્ય સત્સંગ • સેવા • ભક્તિ",
    welcome: "નીલમણિ કૃપાલુ સત્સંગમાં આપનું સ્વાગત છે",
    hero_title: "નીલમણિ કૃપાલુ સત્સંગ",
    hero_desc: "જગદ્ગુરુ શ્રી કૃપાલુ જી મહારાજના પવિત્ર આશ્રય હેઠળ આપનું મન શ્રી રાધા કૃષ્ણના ચરણોમાં સમર્પિત કરો, મધુર સંકીર્તન અને નિઃસ્વાર્થ સેવા દ્વારા આંતરિક શાંતિ મેળવો.",
    join_satsang: "સત્સંગમાં જોડાઓ",
    upcoming_events: "આગામી કાર્યક્રમો",
    trust_line: "દૈનિક સત્સંગ • આધ્યાત્મિક માર્ગદર્શન • સેવા પ્રવૃત્તિઓ",
    home: "હોમ",
    about: "અમારા વિશે",
    events: "સત્સંગ કાર્યક્રમો",
    seva: "સેવા અભિયાન",
    gallery: "દિવ્ય ગેલેરી",
    announcements: "નોટિસ બોર્ડ",
    blog: "આધ્યાત્મिक બ્લોગ",
    contact: "સંપર્ક કરો",
    volunteer: "સ્વયંસેવક બનો",
    phone: "ફોન",
    email: "ઇમેઇલ",
    whatsapp: "વોટ્સએપ",
    lang_name: "ગુજરાતી",
    donation: "દાન સેવા",
    call: "કોલ કરો",
    divine_guidance: "દિવ્ય માર્ગદર્શન અને સત્સંગ",
    designation: "પંચમ મૂળ જગદ્ગુરુ"
  },
  te: {
    title: "నీలమణి కృపాలు సత్సంగం",
    tagline: "రాధే రాధే • దివ్య సత్సంగం • సేవ • భక్తి",
    welcome: "నీలమణి కృపాలు సత్సంగంనకు స్వాగతం",
    hero_title: "నీలమణి కృపాలు సత్సంగం",
    hero_desc: "జగద్గురు శ్రీ కృపాలు జీ మహారాజ్ పవిత్ర నీడలో మీ మనస్సును శ్రీ రాధాకృష్ణుల పాద పద్మాలకు అర్పించండి, మధుర సంకీర్తన మరియు నిస్వార్థ సేవ ద్వారా అంతఃశాంతిని పొందండి.",
    join_satsang: "సత్సంగంలో చేరండి",
    upcoming_events: "రాబోయే కార్యక్రమాలు",
    trust_line: "రోజువారీ సత్సంగం • ఆధ్యాత్మిక మార్గదర్శకత్వం • సేవా కార్యక్రమాలు",
    home: "హోమ్",
    about: "మా గురించి",
    events: "సత్సంగ కార్యక్రమాలు",
    seva: "సేవా కార్యక్రమాలు",
    gallery: "దివ్య గ్యాలరీ",
    announcements: "సమాచార బోర్డు",
    blog: "ఆధ్యాత్మిక బ్లాగ్",
    contact: "సంప్రదించండి",
    volunteer: "స్వచ్ఛంద సేవకుడిగా మారండి",
    phone: "ఫోన్",
    email: "ఈమెయిల్",
    whatsapp: "వాట్సాప్",
    lang_name: "తెలుగు",
    donation: "విరాళం",
    call: "కాల్ చేయండి",
    divine_guidance: "దివ్య మార్గదర్శకత్వం & సత్సంగం",
    designation: "ఐదవ మూల జగద్గురు"
  },
  ta: {
    title: "நீலமணி கிருபாலு சத்சங்கம்",
    tagline: "ராதே ராதே • திவ்ய சத்சங்கம் • சேவை • பக்தி",
    welcome: "நீலமணி கிருபாலு சத்சங்கத்திற்கு உங்களை வரவேற்கிறோம்",
    hero_title: "நீலமணி கிருபாலு சத்சங்கம்",
    hero_desc: "ஜகத்குரு ஸ்ரீ கிருபாலு ஜி மகாராஜின் புனித நிழலில் உங்கள் மனதை ஸ்ரீ ராதா கிருஷ்ணரின் திருவடிகளில் சமர்ப்பியுங்கள், இனிய சங்கீர்த்தனம் மற்றும் சுயநலமற்ற சேவையின் மூலம் மன அமைதியைப் பெறுங்கள்.",
    join_satsang: "சத்சங்கத்தில் இணையுங்கள்",
    upcoming_events: "வரவிருக்கும் நிகழ்வுகள்",
    trust_line: "தினசரி சத்சங்கம் • ஆன்மீக வழிகாட்டுதல் • சேவை நடவடிக்கைகள்",
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    events: "சத்சங்க நிகழ்வுகள்",
    seva: "சேவை பிரச்சாரங்கள்",
    gallery: "திவ்யா கேலரி",
    announcements: "அறிவிப்பு பலகை",
    blog: "ஆன்மீக வலைப்பதிவு",
    contact: "தொடர்பு கொள்ளவும்",
    volunteer: "தன்னார்வலராகுங்கள்",
    phone: "தொலைபேசி",
    email: "மின்னஞ்சல்",
    whatsapp: "வாட்ஸ்அப்",
    lang_name: "தமிழ்",
    donation: "நன்கொடை சேவை",
    call: "அழைக்கவும்",
    divine_guidance: "திவ்ய வழிகாட்டுதல் & சத்சங்கம்",
    designation: "ஐந்தாம் மூல ஜெகத்குரு"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && ["en", "hi", "sa", "or", "bn", "mr", "gu", "te", "ta"].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
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
    return {
      language: "en",
      changeLanguage: () => {},
      t: (key) => translations["en"]?.[key] || key
    };
  }
  return context;
}
