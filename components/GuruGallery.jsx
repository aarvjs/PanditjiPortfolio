"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

export default function GuruGallery({ initialImages }) {
  const staticImages = [
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.25.jpeg",
      alt: "Guru Ji - Devotional Discourse",
      width: 400,
      height: 520,
      caption: "Divine Discourses"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.25 (1).jpeg",
      alt: "Guru Ji - Holy Blessings",
      width: 400,
      height: 400,
      caption: "Spiritual Shelter"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.26.jpeg",
      alt: "Guru Ji - Blissful Chanting",
      width: 400,
      height: 580,
      caption: "Sankirtan Ras"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.26 (1).jpeg",
      alt: "Guru Ji - Deep Roopdhyana Meditation",
      width: 400,
      height: 460,
      caption: "Inner Contemplation"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.27.jpeg",
      alt: "Guru Ji - Lotus Feet Seva",
      width: 400,
      height: 400,
      caption: "Radha Krishna Bhakti"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.27 (1).jpeg",
      alt: "Guru Ji - Sacred Teachings",
      width: 400,
      height: 540,
      caption: "Divine Philosophy"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.28.jpeg",
      alt: "Guru Ji - Graceful Glances",
      width: 400,
      height: 600,
      caption: "Compassion Glance"
    },
    {
      src: "/images/WhatsApp Image 2026-06-18 at 11.36.28 (1).jpeg",
      alt: "Guru Ji - Devotional Gathering",
      width: 400,
      height: 400,
      caption: "Satsang Union"
    }
  ];

  const galleryImages = initialImages && initialImages.length > 0 ? initialImages : staticImages;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <SectionHeading 
          title="Divine Glance Gallery" 
          subtitle="DARSHAN & SATSANG GLIMPSES" 
        />
        
        {/* Artistic Uneven Grid / Masonry Layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="break-inside-avoid relative overflow-hidden rounded-2xl border-2 border-gold/15 bg-gradient-to-br from-white to-cream-dark/30 p-2 shadow-sm hover:shadow-xl hover:border-saffron/30 hover:-translate-y-1 transition-all duration-500 group"
            >
              {/* Inner Decorative Border */}
              <div className="absolute inset-3 border border-gold/10 rounded-xl pointer-events-none z-10" />

              {/* Image Wrapper */}
              <div className="rounded-xl overflow-hidden relative aspect-auto">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                
                {/* Elegant Overlay Caption on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white z-20">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold font-serif">
                    Divine Glance
                  </span>
                  <h4 className="text-xs font-bold leading-snug mt-0.5 font-serif text-gold-glow">
                    {img.caption}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
