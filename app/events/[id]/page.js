import React from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import EventRegistrationForm from "../../../components/EventRegistrationForm";
import { getEventById, getEvents } from "../../../lib/db";
import { Calendar, Clock, MapPin, Phone, User, Globe, ChevronLeft } from "lucide-react";

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = await getEventById(id);
  return {
    title: event ? `${event.title} | Satsang Event` : "Event Details",
    description: event ? event.description.slice(0, 155) : "View satsang details and register."
  };
}

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-cream flex flex-col items-center justify-center p-20 text-center">
          <h2 className="font-serif text-2xl font-bold text-maroon mb-4">Satsang Event Not Found</h2>
          <p className="text-sm text-dark-brown/70 mb-6">The event you are looking for has either concluded or does not exist.</p>
          <Link href="/events" className="px-5 py-2 bg-saffron text-white rounded-full text-xs font-bold uppercase tracking-wider">
            Back to Schedule
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const breadcrumbs = [
    { name: "Events", path: "/events" },
    { name: event.title, path: "" }
  ];

  const isPast = new Date().toISOString().split("T")[0] > event.date;

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title={event.title}
          description="Satsang outlines, timings, location guidelines, and seat registration details."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Back button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:text-saffron mb-6 font-serif border-b border-transparent hover:border-saffron pb-0.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO ALL SCHEDULES</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Banner & Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Event Image Banner */}
              <div className="rounded-3xl overflow-hidden aspect-video bg-gold-light/20 border border-gold/15 relative shadow-md">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                
                {/* Floating Indicators */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <span className={`py-1.5 px-3 rounded-full text-[10px] font-bold tracking-wider shadow-sm uppercase flex items-center gap-1 ${
                    event.isOnline 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}>
                    {event.isOnline ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    <span>{event.isOnline ? "Online zoom" : "In-Person"}</span>
                  </span>
                  {isPast && (
                    <span className="bg-stone-800 text-cream py-1.5 px-3 rounded-full text-[10px] font-bold tracking-wider shadow-sm uppercase">
                      Past Satsang
                    </span>
                  )}
                </div>
              </div>

              {/* Event Timings Card */}
              <div className="bg-white/60 border border-gold/15 rounded-2xl p-5 md:p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-saffron/10 text-saffron rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">DATE</span>
                    <span className="text-xs font-bold text-dark-brown">{event.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-saffron/10 text-saffron rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">TIMINGS</span>
                    <span className="text-xs font-bold text-dark-brown">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-saffron/10 text-saffron rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">ORGANIZER</span>
                    <span className="text-xs font-bold text-dark-brown truncate max-w-[150px]" title={event.organizer}>
                      {event.organizer}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details & Outlines */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg md:text-xl font-bold text-maroon border-b border-gold/15 pb-2">
                  Satsang Description & Outline
                </h3>
                <p className="text-sm md:text-base text-dark-brown/90 leading-relaxed whitespace-pre-line font-sans">
                  {event.description}
                </p>
              </div>

              {/* Interactive Mock Google Map for offline events */}
              {!event.isOnline && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-maroon border-b border-gold/15 pb-2">
                    Venue Directions
                  </h3>
                  <div className="rounded-2xl overflow-hidden h-60 w-full bg-cream-dark border border-gold/15 relative shadow-inner flex items-center justify-center">
                    {/* Visual map placeholder */}
                    <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    <div className="relative text-center p-6 space-y-2 z-10 bg-white/95 rounded-2xl border border-gold/20 shadow-md max-w-sm mx-auto">
                      <MapPin className="w-7 h-7 text-saffron mx-auto animate-bounce" />
                      <h4 className="font-serif text-xs font-bold text-maroon">{event.location}</h4>
                      <p className="text-[10px] text-dark-brown/60 leading-normal">
                        Clicking open maps redirects to standard Google Maps coordinates.
                      </p>
                      <a
                        href={event.googleMapUrl || "https://maps.google.com"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 px-4 py-1.5 bg-saffron hover:bg-maroon text-white font-bold tracking-widest text-[9px] uppercase rounded-full transition-all"
                      >
                        Open Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Reservation form */}
            <div className="lg:col-span-4 space-y-6">
              {!isPast ? (
                <EventRegistrationForm eventId={event.id} eventTitle={event.title} />
              ) : (
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl text-center">
                  <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <h3 className="font-serif text-base font-bold text-stone-700">Gathering Concluded</h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    This weekly satsang was held on {event.date}. Seat reservations are closed. Please browse our upcoming schedules to register.
                  </p>
                </div>
              )}

              {/* Coordinator support contact */}
              <div className="bg-white/60 border border-gold/15 p-5 rounded-2xl shadow-sm text-center">
                <Phone className="w-5 h-5 text-saffron mx-auto mb-2" />
                <h4 className="font-serif text-xs font-bold text-maroon">Need Seat Assistance?</h4>
                <p className="text-[11px] text-dark-brown/60 leading-relaxed mt-1">
                  Have group registrations or need wheelchair assistance? Reach our helpline:
                </p>
                <span className="block text-xs font-bold text-saffron mt-1.5">+91 98765 43210</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
