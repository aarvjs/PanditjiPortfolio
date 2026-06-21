"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Flame, Send } from "lucide-react";

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What is Neelmani Kripalu Satsang?",
      a: "It is a spiritual congregation dedicated to spreading the divine teachings of Jagadguru Shri Kripalu Ji Maharaj, focusing on selfless devotion (Ragatmika Bhakti) and social welfare campaigns (Seva)."
    },
    {
      q: "How can I participate in Seva activities?",
      a: "You can visit our Seva Campaigns page, select an active campaign (such as Annadan or Temple maintenance), and register as a volunteer. No financial donations are accepted online."
    },
    {
      q: "Is there any entry fee for the Satsang gatherings?",
      a: "No, all satsang gatherings, events, and retreats are completely free and open to everyone seeking spiritual growth, regardless of background."
    }
  ];

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <footer className="bg-cream-dark border-t border-gold/25 pt-16 pb-8 text-dark-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Info and Brand */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="font-serif text-lg font-bold text-maroon tracking-wide">
                NEELMANI KRIPALU SATSANG
              </span>
            </Link>
            <p className="text-sm text-dark-brown/75 leading-relaxed font-sans">
              Dedicated to promoting spiritual elevation through devotion, group chanting (Sankirtan), and helping humanity through regular community Seva campaigns.
            </p>
            <div className="space-y-2 pt-2 text-sm text-dark-brown/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-saffron mt-1 flex-shrink-0" />
                <span>Kripalu Dham, Sec-15, Dwarka, New Delhi & Vrindavan Ashram, UP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-saffron flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-saffron flex-shrink-0" />
                <span>contact@neelmanikripalusatsang.org</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4 md:pl-4">
            <h3 className="font-serif font-bold text-base text-maroon tracking-wider border-b border-gold/15 pb-2">
              QUICK PATHS
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm font-medium text-dark-brown/80">
              <li>
                <Link href="/" className="hover:text-saffron transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-saffron transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-saffron transition-colors">Satsangs</Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-saffron transition-colors">Seva Campaigns</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-saffron transition-colors">Divine Gallery</Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-saffron transition-colors">Notices</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-saffron transition-colors">Spiritual Blog</Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-saffron transition-colors">Join Volunteer</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: FAQs */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-serif font-bold text-base text-maroon tracking-wider border-b border-gold/15 pb-2">
              FREQUENTLY ASKED
            </h3>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gold/10 pb-2">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex justify-between items-center w-full text-left text-xs font-semibold hover:text-saffron transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-dark-brown/75 mt-1.5 leading-relaxed animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Devotional Blessing & Newsletter */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-serif font-bold text-base text-maroon tracking-wider border-b border-gold/15 pb-2">
              STAY IN TOUCH
            </h3>
            <p className="text-xs text-dark-brown/70 leading-relaxed">
              Subscribe to receive weekly spiritual quotes, event schedules, and critical volunteer alerts.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }} className="flex">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="bg-cream border border-gold/30 rounded-l-full px-3 py-2 text-xs w-full focus:outline-none focus:border-saffron text-dark-brown"
              />
              <button
                type="submit"
                className="bg-saffron text-white rounded-r-full px-4 py-2 hover:bg-maroon transition-colors flex items-center justify-center"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="pt-2">
              <p className="italic text-xs text-saffron/90 font-serif border-l-2 border-saffron pl-2 leading-relaxed">
                \"Through selfless devotion and humble service, the mirror of the heart is cleansed.\"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/15 flex flex-col md:flex-row items-center justify-between text-xs text-dark-brown/65">
          <p>© {new Date().getFullYear()} Neelmani Kripalu Satsang. All spiritual rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-serif">
            <Link href="/about" className="hover:text-saffron">Mission History</Link>
            <span>•</span>
            <Link href="/join" className="hover:text-saffron">Volunteer Guidelines</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-saffron">Dashboard Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
