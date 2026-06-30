import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, UserCheck } from "lucide-react";
import { getFestivals } from "../../lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Spiritual Festivals & Mahotsav | Neelmani Kripalu Satsang",
  description: "Join our grand spiritual celebrations including Janmashtami, Guru Purnima, Holi, and Diwali. Register online and get your entry passes."
};

export default async function FestivalsListPage() {
  const festivals = await getFestivals();
  const breadcrumbs = [{ name: "Festivals & Events", path: "" }];

  // Only show published festivals
  const publishedFestivals = (festivals || []).filter(f => f.status === "published");

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Spiritual Festivals & Mahotsavs"
          description="Register for upcoming grand devotional celebrations, cultural mahotsavs, and divine retreats hosted at our ashrams."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {publishedFestivals.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-3xl border border-gold/15 shadow-sm max-w-xl mx-auto">
              <Calendar className="w-12 h-12 text-gold/30 mx-auto mb-3" />
              <p className="font-serif italic text-dark-brown/65 text-sm">
                No upcoming festivals scheduled at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedFestivals.map((fest) => {
                const isDeadlinePassed = new Date(fest.registrationLastDate) < new Date().setHours(0,0,0,0);
                
                return (
                  <div 
                    key={fest.id}
                    className="bg-white/80 border border-gold/15 rounded-3xl p-5 hover:border-saffron/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {fest.bannerUrl && (
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gold/10 bg-cream/10">
                          <img 
                            src={fest.bannerUrl}
                            alt={fest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {isDeadlinePassed ? (
                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-rose-600/90 text-white text-[9px] font-bold uppercase rounded tracking-wider border border-rose-700">
                              Closed
                            </span>
                          ) : (
                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-bold uppercase rounded tracking-wider border border-emerald-700">
                              Open
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="font-serif font-black text-base text-maroon line-clamp-2 leading-tight group-hover:text-saffron transition-colors">
                        <Link href={`/festivals/${fest.slug}`}>{fest.name}</Link>
                      </h3>
                      
                      <p className="text-[11px] text-dark-brown/60 line-clamp-3 mt-3 leading-relaxed">
                        {fest.description}
                      </p>

                      <div className="space-y-1.5 text-[10px] text-dark-brown/50 border-t border-gold/10 pt-3 mt-4">
                        <p className="flex items-center gap-1.5 font-semibold text-dark-brown/70">
                          <Calendar className="w-3.5 h-3.5 text-saffron" />
                          Date: {fest.date}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-saffron" />
                          Venue: {fest.venue}
                        </p>
                        <p className="text-[9px] text-rose-700 font-bold block pt-1">
                          Deadline: {fest.registrationLastDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gold/10 flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-dark-brown/40">
                        {fest.passRequired ? "Pass Required" : "Free Entry"}
                      </span>
                      
                      <Link
                        href={`/festivals/${fest.slug}`}
                        className="text-xs text-saffron hover:text-maroon font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        {isDeadlinePassed ? "View Details" : "Register Now"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
