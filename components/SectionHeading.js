import React from "react";

export default function SectionHeading({ title, subtitle, centered = true, dark = false }) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : "text-left"} animate-fade-in`}>
      {subtitle && (
        <span className="text-xs font-bold uppercase tracking-widest text-saffron mb-2 block font-serif">
          {subtitle}
        </span>
      )}
      <h2
        className={`text-2xl md:text-4xl font-bold font-serif mb-4 ${
          dark ? "text-cream" : "text-maroon"
        }`}
      >
        {title}
      </h2>
      
      {/* Spiritual Lotus & Diya inspired SVG Divider */}
      <div className={`flex items-center mt-3 ${centered ? "justify-center" : "justify-start"}`}>
        <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-gold" />
        
        {/* Lotus Icon */}
        <div className="mx-3 text-gold animate-pulse">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center petal */}
            <path d="M12 2C12 2 9 8 12 15C15 8 12 2 12 2Z" />
            {/* Left petals */}
            <path d="M12 15C10 11.5 5 11 3 13.5C2 14.8 3.5 16 6 15.5C8 15.1 10.5 15.5 12 15Z" opacity="0.8" />
            <path d="M12 15C9.5 13 6 15 5.5 17.5C5.2 19 7 19.5 8.5 18C9.7 16.8 11.2 16.5 12 15Z" opacity="0.6" />
            {/* Right petals */}
            <path d="M12 15C14 11.5 19 11 21 13.5C22 14.8 20.5 16 18 15.5C16 15.1 13.5 15.5 12 15Z" opacity="0.8" />
            <path d="M12 15C14.5 13 18 15 18.5 17.5C18.8 19 17 19.5 15.5 18C14.3 16.8 12.8 16.5 12 15Z" opacity="0.6" />
            {/* Bottom leaves */}
            <path d="M7 19C10 20 12 18.5 12 18.5C12 18.5 14 20 17 19C15 21 9 21 7 19Z" fill="#E25822" />
          </svg>
        </div>
        
        <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-gold" />
      </div>
    </div>
  );
}
