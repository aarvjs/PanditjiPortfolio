"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: "bg-emerald-900/90 border-emerald-500/30 text-emerald-100 shadow-emerald-950/20 backdrop-blur-md",
    error: "bg-rose-900/90 border-rose-500/30 text-rose-100 shadow-rose-950/20 backdrop-blur-md",
    info: "bg-blue-900/90 border-blue-500/30 text-blue-100 shadow-blue-950/20 backdrop-blur-md",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] transition-all duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-md ${bgColors[type] || bgColors.success} animate-[fadeIn_0.3s_ease-out]`}>
        {icons[type]}
        <p className="text-sm font-medium pr-2 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-auto cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
