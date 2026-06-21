"use client";
 
import React, { useState } from "react";
import { Play, Sparkles, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SectionHeading from "./SectionHeading";

export default function VideoSection({ videos: propVideos }) {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const { t } = useLanguage();

  // 4 Default Sample Videos
  const defaultVideos = [
    {
      id: "v1",
      title: "Chanting the Sweet Names of Shyama-Shyam",
      desc: "Immerse in the melodious sankirtan of divine names, filled with deep spiritual longing and peace.",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "45 Mins",
      thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "v2",
      title: "Roopdhyana Meditation: The Essence of Sadhana",
      desc: "A step-by-step guide to active visual contemplation of the divine form of Radha Krishna.",
      url: "https://www.youtube.com/watch?v=24_2l1R_P3g",
      duration: "30 Mins",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "v3",
      title: "Reconciliation of Shastras: Shri Kripalu Pravachan",
      desc: "Deep scriptural discourse reconciling the Vedic philosophies under the path of Prema Bhakti.",
      url: "https://www.youtube.com/watch?v=V7Osz80mC8w",
      duration: "50 Mins",
      thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "v4",
      title: "Melodious Divine Kirtan: Radhe Govinda Gopi Gopal",
      desc: "An uplifting and joyous congregational chant composed by Jagadguru Shri Kripalu Ji Maharaj.",
      url: "https://www.youtube.com/watch?v=kF0n7G4b1i0",
      duration: "40 Mins",
      thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const videos = propVideos || defaultVideos;

  const getVideoEmbedUrl = (url) => {
    let videoId = "dQw4w9WgXcQ"; // Default fallback
    if (!url) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    try {
      if (url.includes("youtube.com/embed/")) {
        return `${url}${url.includes("?") ? "&" : "?"}autoplay=1&rel=0`;
      }
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        videoId = url.split("v=")[1].split("&")[0];
      }
    } catch (e) {
      console.error("Error parsing youtube URL", e);
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const handlePlayClick = (id) => {
    setPlayingVideoId(id);
    setIsVideoLoading(true);
  };

  return (
    <section className="py-20 bg-saffron-warm-gradient border-t border-b border-gold/15 relative overflow-hidden">
      
      {/* Background Vector Highlights */}
      <div className="absolute left-[-5%] top-[-10%] w-72 h-72 text-gold/5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <SectionHeading 
          title="Divine Satsang Videos" 
          subtitle="GURU VANI & SANKIRTAN DISCOURSES" 
        />
        
        {/* Short spiritual paragraph */}
        <p className="text-center text-sm md:text-base text-dark-brown/75 leading-relaxed font-sans max-w-2xl mx-auto mb-12">
          Immerse your mind in the nectar of divine love. Listen to weekly discourses, scriptural summaries, and melodious sankirtan led by Jagadguru Shri Kripalu Ji Maharaj and senior devotees.
        </p>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((vid) => {
            const isPlaying = playingVideoId === vid.id;
            return (
              <div
                key={vid.id}
                className="spiritual-card rounded-2xl overflow-hidden flex flex-col h-full bg-white/80 border border-gold/20 shadow-sm hover:shadow-[0_12px_24px_rgba(122,28,28,0.06)] transition-all duration-300 group"
              >
                {/* Thumbnail / Video Container */}
                <div className="aspect-video w-full relative bg-gold-light/20 overflow-hidden">
                  {isPlaying ? (
                    <div className="absolute inset-0 w-full h-full z-10 bg-black">
                      
                      {/* Video Loading Spinner Overlay */}
                      {isVideoLoading && (
                        <div className="absolute inset-0 bg-[#4A0E0E]/95 flex flex-col items-center justify-center z-20 animate-fade-in font-serif">
                          <div className="w-7 h-7 rounded-full border-2 border-gold border-t-transparent animate-spin mb-2" />
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-gold font-bold animate-pulse">
                            Loading Divine Vani...
                          </span>
                        </div>
                      )}

                      <iframe
                        src={getVideoEmbedUrl(vid.url)}
                        title={vid.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => setIsVideoLoading(false)}
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => handlePlayClick(vid.id)}
                      className="w-full h-full relative cursor-pointer"
                    >
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Overlay shadow */}
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-gold-light text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-serif">
                        <Clock className="w-2.5 h-2.5 text-gold" />
                        <span>{vid.duration}</span>
                      </div>

                      {/* Glowing Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg group-hover:bg-maroon group-hover:scale-110 transition-all duration-300">
                          <Play className="w-5 h-5 fill-current text-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Text Content */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1 text-left">
                    <h4 className="font-serif text-sm font-bold text-maroon group-hover:text-saffron transition-colors duration-300 line-clamp-1">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-dark-brown/70 leading-relaxed line-clamp-2">
                      {vid.desc}
                    </p>
                  </div>
                  
                  {/* Watch Link */}
                  <div className="mt-3.5 pt-2.5 border-t border-gold/10 flex items-center gap-1 text-[10px] font-extrabold text-saffron uppercase tracking-widest font-serif">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span>{isPlaying ? (isVideoLoading ? "Connecting..." : "Now Playing Inline") : "Click to play"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
