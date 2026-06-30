"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";
import PageHero from "./PageHero";
import SectionHeading from "./SectionHeading";
import { getDonationInfo, subscribeToDonationInfo } from "../lib/db";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { 
  Heart, 
  Building2, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  MessageCircle, 
  QrCode, 
  Utensils, 
  Sparkles, 
  BookOpen, 
  Info,
  ShieldCheck,
  Flame,
  Globe
} from "lucide-react";

export default function DonationPage({ campaigns = [] }) {
  const [copiedField, setCopiedField] = useState("");
  const [qrError, setQrError] = useState(false);
  const [donationInfo, setDonationInfo] = useState(null);
  const { settings: siteSettings } = useSiteSettings();

  const bankDetails = {
    accountName: "Neelmani Kripalu Satsang Trust",
    bankName: "State Bank of India",
    accountNumber: "38920184758",
    ifscCode: "SBIN0001256",
    upiId: "neelmanisatsang@sbi",
    branch: "Dwarka Sector 12, New Delhi"
  };

  useEffect(() => {
    const unsubscribe = subscribeToDonationInfo((info) => {
      if (info && Object.keys(info).length > 0) {
        setDonationInfo(info);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const activeBankDetails = {
    accountName: donationInfo?.accountName || bankDetails.accountName,
    bankName: donationInfo?.bankName || bankDetails.bankName,
    accountNumber: donationInfo?.accountNumber || bankDetails.accountNumber,
    ifscCode: donationInfo?.ifscCode || bankDetails.ifscCode,
    upiId: donationInfo?.upiId || bankDetails.upiId,
    branch: bankDetails.branch
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const breadcrumbs = [{ name: "Donation Seva", path: "" }];

  // Fallback / default core seva works
  const defaultSevaWorks = [
    {
      title: "Food Distribution (Annadan Seva)",
      desc: "Providing pure, nutritious, sanctified meals (Prasadam) daily to sadhus, pilgrims, and underprivileged families in Vrindavan and Delhi-NCR.",
      icon: <Utensils className="w-6 h-6 text-saffron" />,
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Satsang Arrangements & Propagation",
      desc: "Funding public spiritual gatherings, renting sound systems, tents (shamianas), printing devotional booklets, and sharing sacred chants.",
      icon: <Sparkles className="w-6 h-6 text-saffron" />,
      imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Spiritual & Child Education (Gyan-Daan)",
      desc: "Providing books, uniforms, educational kits, and hosting weekend moral value and scriptures classes for underprivileged rural children.",
      icon: <BookOpen className="w-6 h-6 text-saffron" />,
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Temple Seva & Ashram Upkeep",
      desc: "Supporting cleaning drives, daily flower decorations, maintenance, and upkeep of local shrines and Vrindavan Ashram premises.",
      icon: <Flame className="w-6 h-6 text-saffron" />,
      imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Social Welfare & Disaster Relief",
      desc: "Distributing warm blankets and sweaters to sadhus during winters, organizing medical check-up camps, and arranging flood relief packages.",
      icon: <Heart className="w-6 h-6 text-saffron" />,
      imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Merge firebase campaigns if available, prioritizing them
  const displaySevaWorks = campaigns && campaigns.length > 0 
    ? campaigns.map((c, idx) => ({
        title: c.title,
        desc: c.description || c.purpose || "Support this divine seva campaign.",
        icon: idx % 3 === 0 ? <Utensils className="w-6 h-6 text-saffron" /> : idx % 3 === 1 ? <BookOpen className="w-6 h-6 text-saffron" /> : <Heart className="w-6 h-6 text-saffron" />,
        imageUrl: c.bannerUrl || defaultSevaWorks[idx % defaultSevaWorks.length].imageUrl
      }))
    : defaultSevaWorks;

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        
        {/* ================= HERO SECTION ================= */}
        <PageHero
          title="Support Seva & Spiritual Mission"
          description="Your contributions enable our daily food distribution, child education support, and satsang arrangements. We accept offline bank details and direct UPI transfers."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
          
          {/* Integrity Note / Warning */}
          <div className="bg-maroon/5 border-2 border-gold/25 p-5 sm:p-6 rounded-3xl max-w-4xl mx-auto flex items-start gap-4 shadow-sm animate-fade-in">
            <Info className="w-6 h-6 text-maroon flex-shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <h4 className="font-serif text-sm font-bold text-maroon">Important Note on Donation Seva</h4>
              <p className="text-xs text-dark-brown/85 leading-relaxed">
                Neelmani Kripalu Satsang operates on pure principles of devotion. We do NOT process payment gateway links or ask for card numbers on this website. All contributions are made via direct offline bank transfer or UPI. If you make a transfer, please contact us with the transaction screenshot so we can acknowledge it.
              </p>
            </div>
          </div>

          {/* ================= QR & BANK DETAILS SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Bank Details card */}
            <div className="lg:col-span-7 bg-white/80 border-2 border-gold/20 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between relative group">
              <div className="absolute inset-3 border border-gold/10 rounded-2xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 border-b border-gold/15 pb-4">
                  <Building2 className="w-6 h-6 text-maroon" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-maroon">
                    Direct Bank Transfer Details
                  </h3>
                </div>

                <p className="text-xs text-dark-brown/70 leading-relaxed font-sans">
                  You can transfer funds directly into our organization account using NEFT / IMPS / RTGS. Click the copy icon to quickly copy details.
                </p>

                {/* Bank Fields */}
                <div className="space-y-3 font-sans">
                  {/* Account Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-cream-dark/25 rounded-xl border border-gold/10 gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-bold">Account Name</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-dark-brown font-serif">{activeBankDetails.accountName}</span>
                      <button 
                        onClick={() => copyToClipboard(activeBankDetails.accountName, "name")}
                        className="p-1 hover:bg-gold-light/40 rounded transition-colors text-maroon"
                        aria-label="Copy account name"
                      >
                        {copiedField === "name" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Bank Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-cream-dark/25 rounded-xl border border-gold/10 gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-bold">Bank Name</span>
                    <span className="text-xs sm:text-sm font-semibold text-dark-brown">{activeBankDetails.bankName}</span>
                  </div>

                  {/* Account Number */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-cream-dark/25 rounded-xl border border-gold/10 gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-bold">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-maroon tracking-wider font-mono">{activeBankDetails.accountNumber}</span>
                      <button 
                        onClick={() => copyToClipboard(activeBankDetails.accountNumber, "number")}
                        className="p-1 hover:bg-gold-light/40 rounded transition-colors text-maroon"
                        aria-label="Copy account number"
                      >
                        {copiedField === "number" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* IFSC Code */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-cream-dark/25 rounded-xl border border-gold/10 gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-bold">IFSC Code</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-maroon tracking-wider font-mono">{activeBankDetails.ifscCode}</span>
                      <button 
                        onClick={() => copyToClipboard(activeBankDetails.ifscCode, "ifsc")}
                        className="p-1 hover:bg-gold-light/40 rounded transition-colors text-maroon"
                        aria-label="Copy IFSC code"
                      >
                        {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-cream-dark/25 rounded-xl border border-gold/10 gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-bold">UPI ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-emerald-700 tracking-wider font-mono">{activeBankDetails.upiId}</span>
                      <button 
                        onClick={() => copyToClipboard(activeBankDetails.upiId, "upi")}
                        className="p-1 hover:bg-gold-light/40 rounded transition-colors text-maroon"
                        aria-label="Copy UPI ID"
                      >
                        {copiedField === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure note */}
              <div className="mt-6 flex items-center gap-1.5 justify-center text-[10px] font-bold text-emerald-700 uppercase font-sans border-t border-gold/5 pt-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Official Organization Account</span>
              </div>
            </div>

            {/* Right side: QR Code section */}
            <div className="lg:col-span-5 bg-white/80 border-2 border-gold/20 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center relative group">
              <div className="absolute inset-3 border border-gold/10 rounded-2xl pointer-events-none" />
              
              <div className="relative z-10 space-y-5 w-full flex flex-col items-center">
                <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center shadow-inner">
                  <QrCode className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-maroon">
                    Scan & Donate Seva
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold block mt-0.5">
                    UPI Instant Payment
                  </span>
                </div>

                {/* QR Code image with Error Fallback Card */}
                <div className="w-48 h-48 relative border-2 border-gold/30 rounded-2xl p-2 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  {!qrError ? (
                    <Image
                      src={donationInfo?.qrImageUrl || "/images/qr.png"}
                      alt="UPI QR Code"
                      width={180}
                      height={180}
                      className="w-full h-full object-contain"
                      onError={() => setQrError(true)}
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-cream-dark/15 border border-dashed border-gold/40 flex flex-col items-center justify-center p-4">
                      <QrCode className="w-10 h-10 text-gold/40 mb-2" />
                      <span className="text-[10px] font-serif font-black text-maroon tracking-wider uppercase text-center">
                        QR Code Coming Soon
                      </span>
                      <p className="text-[8px] text-dark-brown/55 mt-1 leading-normal font-sans">
                        Please use direct bank details or UPI ID.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1 font-sans">
                  <span className="text-xs font-semibold text-dark-brown">Scan using any UPI App</span>
                  <p className="text-[10px] text-dark-brown/65 max-w-[200px] leading-relaxed mx-auto">
                    Supports Google Pay, PhonePe, Paytm, BHIM, or any banking app.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ================= DONATION IMPACT / SEVA WORK ================= */}
          <div className="space-y-8">
            <SectionHeading 
              title="Divine Seva Impact Work" 
              subtitle="WHERE YOUR DONATIONS GO" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displaySevaWorks.map((work, idx) => (
                <div
                  key={idx}
                  className="bg-white/70 border border-gold/15 rounded-3xl overflow-hidden shadow-sm hover:border-saffron/30 hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Image banner */}
                  <div className="relative aspect-[16/10] overflow-hidden w-full bg-cream-dark flex-shrink-0">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-black/25 z-0" />
                    
                    {/* Floating Icon badge */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white text-saffron rounded-full flex items-center justify-center shadow-md z-10 border border-gold/15">
                      {work.icon}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-maroon group-hover:text-saffron transition-colors duration-300">
                        {work.title}
                      </h4>
                      <p className="text-xs text-dark-brown/75 leading-relaxed font-sans">
                        {work.desc}
                      </p>
                    </div>

                    <div className="border-t border-gold/10 pt-3 text-[10px] font-bold text-gold uppercase tracking-wider font-serif">
                      Active Holy Seva Campaign
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CONTACT SECTION ================= */}
          <div id="contact-section" className="bg-gradient-to-br from-maroon-dark via-maroon to-maroon text-cream rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg border border-gold/30">
            <div className="absolute right-[-10px] top-[-10px] w-48 h-48 text-gold/5 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor"><circle cx="50" cy="50" r="45"/></svg>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto shadow-inner border border-gold/15">
                <Phone className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-glow">
                  For donation confirmation, please contact us.
                </h3>
                <p className="text-xs sm:text-sm text-cream-dark/80 leading-relaxed font-sans max-w-xl mx-auto">
                  To ensure accountability, we request you to share the transfer reference or screenshot with our team. We will immediately issue a digital receipt.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans text-xs">
                {/* Phone */}
                <a
                  href={`tel:${siteSettings?.phone || "+919876543210"}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/15"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  <span>Call: {siteSettings?.phone || "+91 98765 43210"}</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${siteSettings?.whatsapp || "919876543210"}?text=Radhey%20Radhey!%20I%20have%20made%20a%20donation%20towards%20seva%20and%20wanted%20to%20confirm.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white" />
                  <span>Confirm on WhatsApp</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteSettings?.email || "donation@neelmanikripalusatsang.org"}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/15"
                >
                  <Mail className="w-4 h-4 text-gold" />
                  <span>Email: {siteSettings?.email || "donation@neelmanikripalusatsang.org"}</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
