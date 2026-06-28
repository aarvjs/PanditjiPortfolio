"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BookOpen, Download, MessageSquare, 
  Share2, Eye, EyeOff, FileText, Check, AlertCircle 
} from "lucide-react";

export default function LibraryResourceDetail({ resource }) {
  const [showReader, setShowReader] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!resource) {
    return (
      <div className="text-center py-20 bg-white/40 rounded-3xl border border-gold/15 shadow-sm max-w-xl mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-serif font-bold text-lg text-dark-brown">Book Not Found</h3>
        <p className="text-xs text-dark-brown/60 mt-1">
          The requested e-library publication could not be found or has been removed.
        </p>
        <Link 
          href="/library" 
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white text-xs font-bold rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Book details container */}
      <div className="bg-white/80 border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        {/* Decorative background mandala segment */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-light/5 rounded-full pointer-events-none"></div>

        {/* Cover Photo */}
        <div className="w-48 h-68 mx-auto md:mx-0 shadow-lg border border-gold/20 rounded-2xl overflow-hidden bg-cream/15 flex-shrink-0">
          <img 
            src={resource.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"} 
            alt={resource.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Metadata */}
        <div className="flex-1 space-y-5 w-full">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-maroon/10 text-maroon text-[9px] font-extrabold uppercase rounded tracking-wider border border-maroon/5">
                {resource.category}
              </span>
              <span className="px-2.5 py-0.5 bg-saffron/10 text-saffron text-[9px] font-extrabold uppercase rounded tracking-wider border border-saffron/5">
                {resource.language === "hi" ? "Hindi (हिन्दी)" : "English (EN)"}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                resource.type === "free" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}>
                {resource.type === "free" ? "Free E-Book" : "Printed Edition"}
              </span>
            </div>
            
            <h1 className="font-serif font-black text-2xl md:text-3xl text-maroon leading-tight">
              {resource.title}
            </h1>
            <p className="text-xs md:text-sm text-dark-brown/70 font-extrabold mt-1">
              By {resource.author}
            </p>
          </div>

          <div className="border-t border-b border-gold/15 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-brown/55 mb-2 font-serif">
              Summary & Insights
            </h3>
            <p className="text-xs text-dark-brown/75 leading-relaxed font-sans whitespace-pre-line">
              {resource.description || "No description available for this resource."}
            </p>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-bold text-dark-brown/40 uppercase tracking-wider mr-1">Tags:</span>
              {resource.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] text-dark-brown/60 bg-cream-dark/20 px-2 py-0.5 rounded-md font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions panel */}
          <div className="flex flex-wrap gap-3 pt-3">
            {/* Read Online */}
            {resource.fileUrl && (
              <button
                onClick={() => setShowReader(!showReader)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                {showReader ? (
                  <>
                    <EyeOff className="w-4 h-4" /> Close Reader
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> Read Online
                  </>
                )}
              </button>
            )}

            {/* Download PDF */}
            {resource.fileUrl && resource.downloadAllowed && (
              <a
                href={resource.fileUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            )}

            {/* Order on WhatsApp */}
            {resource.whatsappOrderLink && (
              <a
                href={resource.whatsappOrderLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 fill-current" /> Order Printed Copy
              </a>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gold/25 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all ml-auto"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-saffron" /> Share Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      {showReader && resource.fileUrl && (
        <div className="bg-white/90 border border-gold/15 p-4 rounded-3xl shadow-md animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-maroon" />
              <span className="font-serif font-bold text-sm text-maroon truncate max-w-md">
                Reading: {resource.title}
              </span>
            </div>
            <button
              onClick={() => setShowReader(false)}
              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-200 transition-colors"
            >
              Close Viewer
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center">
            {/* Embedded PDF Iframe */}
            <iframe 
              src={`${resource.fileUrl}#toolbar=0&navpanes=0`} 
              className="w-full h-[650px] border-none"
              title={resource.title}
            />
          </div>
          
          <p className="text-[10px] text-center text-dark-brown/40 font-medium">
            Note: The PDF reader uses native browser capabilities. If it doesn't load, make sure your browser supports PDF previewing.
          </p>
        </div>
      )}
    </div>
  );
}
