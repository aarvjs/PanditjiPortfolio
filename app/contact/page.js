import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import ContactForm from "../../components/ContactForm";
import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Contact Us | Neelmani Kripalu Satsang",
  description: "Get in touch with Neelmani Kripalu Satsang. Find addresses of our Delhi and Vrindavan ashrams, phone helplines, WhatsApp links, and submit queries."
};

export default function ContactPage() {
  const breadcrumbs = [{ name: "Contact Us", path: "" }];

  const locations = [
    {
      title: "Delhi Dwarka Center",
      address: "Kripalu Dham, Sector 15, Dwarka, New Delhi - 110075",
      phone: "+91 98765 43210",
      email: "delhi@neelmanikripalusatsang.org",
      hours: "Daily: 08:00 AM - 12:00 PM & 04:00 PM - 08:00 PM"
    },
    {
      title: "Vrindavan Seva Ashram",
      address: "Neelmani Kripalu Ashram, Raman Reti, Vrindavan, Mathura, UP - 281121",
      phone: "+91 98765 43211",
      email: "vrindavan@neelmanikripalusatsang.org",
      hours: "Daily: 06:00 AM - 01:00 PM & 04:30 PM - 09:00 PM"
    }
  ];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Contact Us"
          description="Have spiritual queries, require ashram accommodation guidelines, or wish to offer raw seva supplies? Reach out below."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-lg md:text-xl font-bold text-maroon border-b border-gold/15 pb-2 mb-2">
                  Submit a Query
                </h2>
                <p className="text-xs text-dark-brown/70 leading-relaxed font-sans mb-4">
                  Please enter your details below. Our satsang coordinators will read your message and reply via email or phone.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Right Column: Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp Quick Chat */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 md:p-6 shadow-sm text-center space-y-3">
                <MessageCircle className="w-10 h-10 text-emerald-600 mx-auto fill-current" />
                <h3 className="font-serif text-sm font-bold text-emerald-950">
                  Quick WhatsApp Helpline
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-sans">
                  Need quick information about weekly satsang venues or seva addresses? Direct message our helpdesk on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Radhey%20Radhey!%20I%20want%20to%20know%20about%20upcoming%20satsang%20gatherings."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wider text-xs rounded-full transition-all shadow-sm font-sans"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Office Locations */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-maroon border-b border-gold/15 pb-2">
                  Our Ashrams & Centers
                </h3>

                {locations.map((loc, index) => (
                  <div
                    key={index}
                    className="bg-white/60 border border-gold/15 p-5 rounded-2xl shadow-sm space-y-3 hover:border-saffron/30 transition-all duration-300"
                  >
                    <h4 className="font-serif text-xs font-bold text-maroon border-b border-gold/10 pb-1.5 flex justify-between items-center">
                      <span>{loc.title}</span>
                      <span className="text-[9px] uppercase tracking-wider text-saffron bg-saffron/10 px-2 py-0.5 rounded font-sans font-bold">
                        Office
                      </span>
                    </h4>
                    
                    <div className="space-y-2 text-xs text-dark-brown/85 font-sans">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-saffron mt-0.5 flex-shrink-0" />
                        <span>{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-saffron flex-shrink-0" />
                        <span>{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-saffron flex-shrink-0" />
                        <span className="truncate">{loc.email}</span>
                      </div>
                      <div className="flex items-center gap-2 border-t border-gold/5 pt-2 text-[10px] text-dark-brown/65 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-saffron flex-shrink-0" />
                        <span>{loc.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
