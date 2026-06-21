"use client";

import React from "react";
import Link from "next/link";
import { HeartHandshake, MapPin, CheckCircle, ArrowRight } from "lucide-react";

export default function CampaignCard({ campaign }) {
  const { id, title, description, location, status, bannerUrl } = campaign;

  const isActive = status === "active";

  return (
    <div className="spiritual-card rounded-2xl overflow-hidden flex flex-col h-full border border-gold/15 bg-white/70 shadow-sm group">
      {/* Campaign Banner */}
      <div className="h-48 md:h-52 w-full overflow-hidden relative bg-gold-light/20">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-maroon/20 via-gold/15 to-saffron/10 flex items-center justify-center">
            <span className="font-serif text-maroon/50 text-xl font-bold">Divine Seva</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {/* Floating Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`py-1.5 px-3 rounded-full text-xs font-bold tracking-wider shadow-sm flex items-center gap-1 ${
            isActive
              ? "bg-saffron text-white border border-saffron-light/25 animate-pulse"
              : "bg-stone-100 text-stone-600 border border-stone-200"
          }`}>
            {isActive ? <HeartHandshake className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
            <span className="uppercase">{isActive ? "Active Seva" : "Completed"}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Badge */}
          <div className="flex items-center gap-1.5 text-xs text-saffron font-bold uppercase tracking-wider mb-2 font-serif">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-maroon mb-2 group-hover:text-saffron transition-colors duration-300 line-clamp-1">
            {title}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-dark-brown/80 leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gold/10 flex items-center justify-between gap-3">
          <Link
            href={`/campaigns/${id}`}
            className="text-xs font-bold tracking-wider text-maroon hover:text-saffron transition-colors font-serif border-b border-maroon hover:border-saffron pb-0.5"
          >
            VIEW CAMPAIGN
          </Link>

          {isActive ? (
            <Link
              href={`/campaigns/${id}#join-seva`}
              className="px-4 py-2 bg-saffron hover:bg-maroon text-white font-bold tracking-wider text-xs rounded-full transition-all duration-300 shadow-sm flex items-center gap-1"
            >
              <span>Join Seva</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <span className="text-xs font-bold tracking-wider text-dark-brown/40 uppercase">
              COMPLETED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
