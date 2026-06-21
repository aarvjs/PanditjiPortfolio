"use client";

import React, { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Video } from "lucide-react";

export default function GalleryGrid({ items }) {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ["All", "Satsang Events", "Charity Activities", "Festivals", "Campaign Work"];

  const filteredItems = activeTab === "All"
    ? items
    : items.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setLightboxIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold font-serif tracking-wider uppercase transition-all duration-300 ${
              activeTab === tab
                ? "bg-saffron text-white shadow-md"
                : "bg-cream-dark/60 text-dark-brown/70 hover:bg-cream-dark/100 hover:text-maroon"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Masonry/Flexible Grid Layout */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white/40 rounded-2xl border border-gold/15">
          <p className="text-sm text-dark-brown/60 italic font-serif">No media items found in this category.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredItems.map((item, index) => {
            const isVideo = item.type === "video";
            return (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group border border-gold/15 shadow-sm bg-gold-light/10"
              >
                {/* Media Thumbnail */}
                {isVideo ? (
                  <div className="relative aspect-video sm:aspect-square flex items-center justify-center bg-stone-900 overflow-hidden">
                    {/* YouTube thumbnail lookup or generic placeholder */}
                    <img
                      src={`https://img.youtube.com/vi/${item.url.split("/").pop()}/0.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    {/* Floating Play Button */}
                    <div className="w-12 h-12 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 relative z-10 animate-pulse">
                      <Play className="w-6 h-6 fill-current pl-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden aspect-auto">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Hover overlay text info */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold font-serif">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold leading-snug line-clamp-1 mt-0.5">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-white/70">
                    {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    <span>{isVideo ? "Watch Video" : "Zoom Photo"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {currentMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseLightbox}
        >
          {/* Top Bar controls */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
            <span className="text-stone-400 text-xs font-serif tracking-wider font-semibold">
              {lightboxIndex + 1} / {filteredItems.length}
            </span>
            <button
              onClick={handleCloseLightbox}
              className="text-stone-300 hover:text-white p-2 rounded-full hover:bg-white/10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white p-3 rounded-full hover:bg-white/10 z-50"
            aria-label="Previous media"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Media Holder */}
          <div
            className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center z-10 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.type === "video" ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gold/15 bg-black">
                <iframe
                  src={`${currentMedia.url}?autoplay=1`}
                  title={currentMedia.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-gold/15"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            )}
          </div>

          {/* Bottom Title */}
          <div
            className="absolute bottom-6 text-center text-white max-w-xl px-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold font-serif">
              {currentMedia.category}
            </span>
            <h3 className="text-base md:text-lg font-serif font-bold mt-1">
              {currentMedia.title}
            </h3>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white p-3 rounded-full hover:bg-white/10 z-50"
            aria-label="Next media"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
