import React from "react";
import { BellRing, Calendar, AlertTriangle } from "lucide-react";

export default function AnnouncementCard({ announcement }) {
  const { title, message, date, priority } = announcement;
  const isHigh = priority === "high";

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 transition-all duration-300 border ${
        isHigh
          ? "bg-gradient-to-br from-saffron/5 via-white to-saffron/5 border-saffron shadow-sm animate-diya-glow"
          : "bg-white/80 border-gold/15 shadow-sm hover:border-saffron/30 hover:bg-cream-dark/10"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Priority Icon */}
        <div className={`p-3 rounded-xl flex-shrink-0 flex items-center justify-center ${
          isHigh
            ? "bg-saffron text-white"
            : "bg-gold-light/40 text-maroon"
        }`}>
          {isHigh ? <AlertTriangle className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h3 className="font-serif text-base md:text-lg font-bold text-maroon leading-snug">
              {title}
            </h3>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isHigh && (
                <span className="bg-saffron/10 text-saffron text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-full border border-saffron/20 uppercase font-serif">
                  URGENT
                </span>
              )}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-dark-brown/50">
                <Calendar className="w-3.5 h-3.5" />
                <span>{date}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-dark-brown/85 leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
