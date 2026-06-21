import React from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import { getCampaignById } from "../../../lib/db";
import { HeartHandshake, MapPin, ChevronLeft, CalendarCheck2, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  return {
    title: campaign ? `${campaign.title} | Seva Campaign` : "Campaign Details",
    description: campaign ? campaign.description.slice(0, 155) : "Read about our seva efforts."
  };
}

export default async function CampaignDetailPage({ params }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-cream flex flex-col items-center justify-center p-20 text-center">
          <h2 className="font-serif text-2xl font-bold text-maroon mb-4">Seva Campaign Not Found</h2>
          <p className="text-sm text-dark-brown/70 mb-6 font-sans">The campaign project does not exist.</p>
          <Link href="/campaigns" className="px-5 py-2 bg-saffron text-white rounded-full text-xs font-bold uppercase tracking-wider">
            Back to Campaigns
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const breadcrumbs = [
    { name: "Seva Campaigns", path: "/campaigns" },
    { name: campaign.title, path: "" }
  ];

  const isActive = campaign.status === "active";

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title={campaign.title}
          description="Detailed purpose, impact records, and volunteer participation guidelines."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Back button */}
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:text-saffron mb-6 font-serif border-b border-transparent hover:border-saffron pb-0.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO CAMPAIGNS LIST</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Campaign Image */}
              <div className="rounded-3xl overflow-hidden aspect-video bg-gold-light/20 border border-gold/15 relative shadow-md">
                <img
                  src={campaign.bannerUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                
                {/* Floating Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`py-1.5 px-3 rounded-full text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-1 uppercase ${
                    isActive
                      ? "bg-saffron text-white border border-saffron-light/25 animate-pulse"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}>
                    {isActive ? <HeartHandshake className="w-3.5 h-3.5" /> : <CalendarCheck2 className="w-3.5 h-3.5" />}
                    <span>{isActive ? "Active Campaign" : "Completed Project"}</span>
                  </span>
                </div>
              </div>

              {/* Meta details */}
              <div className="bg-white/60 border border-gold/15 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-saffron/10 text-saffron rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">SEVA REGION</span>
                    <span className="text-xs font-bold text-dark-brown">{campaign.location}</span>
                  </div>
                </div>

                {isActive ? (
                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">PARTICIPATION STATUS</span>
                    <span className="text-xs font-extrabold text-saffron uppercase">Volunteers Welcomed</span>
                  </div>
                ) : (
                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">COMPLETION DATE</span>
                    <span className="text-xs font-bold text-stone-500 uppercase">Archived Project</span>
                  </div>
                )}
              </div>

              {/* Detailed Texts */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-maroon border-b border-gold/15 pb-2 mb-3">
                    Project Purpose & Core Goals
                  </h3>
                  <p className="text-sm md:text-base text-dark-brown/85 leading-relaxed font-sans">
                    {campaign.description}
                  </p>
                  {campaign.purpose && (
                    <p className="text-sm md:text-base text-dark-brown/85 leading-relaxed font-sans mt-3 border-l-2 border-saffron pl-4 italic">
                      {campaign.purpose}
                    </p>
                  )}
                </div>

                {campaign.impact && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-maroon border-b border-gold/15 pb-2 mb-3">
                      Recorded Seva Impact
                    </h3>
                    <p className="text-sm md:text-base text-dark-brown/85 leading-relaxed font-sans bg-gold-light/20 p-4 rounded-2xl border border-gold/15">
                      {campaign.impact}
                    </p>
                  </div>
                )}

                {campaign.howToParticipate && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-maroon border-b border-gold/15 pb-2 mb-3">
                      How to Participate
                    </h3>
                    <p className="text-sm md:text-base text-dark-brown/85 leading-relaxed font-sans">
                      {campaign.howToParticipate}
                    </p>
                  </div>
                )}
              </div>

              {/* Photos Gallery Section */}
              {campaign.photos && campaign.photos.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-lg font-bold text-maroon border-b border-gold/15 pb-2">
                    Recent Seva Activities Photos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {campaign.photos.map((url, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden aspect-square border border-gold/15 bg-white shadow-sm">
                        <img
                          src={url}
                          alt="Seva snapshot"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: CTA Cards */}
            <div className="lg:col-span-4 space-y-6">
              
              {isActive ? (
                <div id="join-seva" className="bg-cream-dark/45 border border-gold/20 p-6 rounded-2xl shadow-sm text-center space-y-4">
                  <HeartHandshake className="w-10 h-10 text-saffron mx-auto animate-pulse" />
                  
                  <h3 className="font-serif text-lg font-bold text-maroon">
                    Participate in this Seva
                  </h3>
                  
                  <p className="text-xs text-dark-brown/75 leading-relaxed font-sans">
                    Would you like to volunteer? Register with our satsang group. You can choose to serve on weekends or contribute physical support in cooking, sorting, or logistics.
                  </p>
                  
                  <Link
                    href={`/join?interest=${encodeURIComponent(campaign.title)}`}
                    className="w-full py-3 bg-saffron hover:bg-maroon text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Sign up as Volunteer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl text-center">
                  <CalendarCheck2 className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <h3 className="font-serif text-base font-bold text-stone-700">Project Concluded</h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed font-sans">
                    This charitable work is concluded. We express deep gratitude to all devotees who volunteered. Browse active campaigns to support current works.
                  </p>
                </div>
              )}

              {/* Ashram coordinate block */}
              <div className="bg-white/60 border border-gold/15 p-5 rounded-2xl shadow-sm text-center space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-dark-brown/40 font-serif">SEVA COORDINATOR</span>
                <h4 className="font-serif text-xs font-bold text-maroon">Mathura-Vrindavan Office</h4>
                <p className="text-[11px] text-dark-brown/65 leading-relaxed font-sans">
                  For delivering raw grain contributions, medicine distributions, or book packages:
                </p>
                <span className="block text-xs font-bold text-saffron">+91 98765 43210</span>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
