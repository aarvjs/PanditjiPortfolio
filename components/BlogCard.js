"use client";

import React from "react";
import Link from "next/link";
import { User, Calendar, BookOpen } from "lucide-react";

export default function BlogCard({ blog }) {
  const { id, title, summary, bannerUrl, author, category, createdAt } = blog;

  return (
    <article className="spiritual-card rounded-2xl overflow-hidden flex flex-col h-full border border-gold/15 bg-white/70 shadow-sm group">
      {/* Blog Banner */}
      <div className="h-44 md:h-48 w-full overflow-hidden relative bg-gold-light/20">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-maroon/20 via-gold/15 to-saffron/10 flex items-center justify-center">
            <span className="font-serif text-maroon/50 text-xl font-bold">Spiritual Teaching</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 text-saffron text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-full border border-gold/20 shadow-sm uppercase font-serif">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-dark-brown/60 font-semibold mb-2.5">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-saffron" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-saffron" />
              <span>{createdAt}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-maroon mb-2 group-hover:text-saffron transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-dark-brown/80 leading-relaxed mb-4 line-clamp-3">
            {summary}
          </p>
        </div>

        {/* Read Article CTA */}
        <div className="pt-4 border-t border-gold/10">
          <Link
            href={`/blog/${id}`}
            className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-saffron hover:text-maroon transition-colors font-serif"
          >
            <BookOpen className="w-4 h-4" />
            <span>READ TEACHING</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
