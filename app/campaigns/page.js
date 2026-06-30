import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import CampaignCard from "../../components/CampaignCard";
import { getCampaigns } from "../../lib/db";
import { HeartHandshake } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Holy Seva Campaigns | Neelmani Kripalu Satsang",
  description: "Explore our active Seva campaigns: Annadan food distribution, temple maintenance, rural children education support. Find how to participate as a volunteer."
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  
  const activeCampaigns = campaigns.filter(c => c.status === "active");
  const completedCampaigns = campaigns.filter(c => c.status !== "active");
  
  const breadcrumbs = [{ name: "Seva Campaigns", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Seva Campaigns"
          description="Participate in active selfless service projects in Vrindavan and Delhi-NCR. Cleanse the mind through hands-on volunteer action."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
          
          {/* Active Seva Campaigns */}
          <div className="space-y-6">
            <SectionHeading title="Active Seva Work" subtitle="PARTICIPATE NOW" centered={false} />
            {activeCampaigns.length === 0 ? (
              <div className="text-center py-12 bg-white/40 border border-gold/15 rounded-2xl">
                <p className="font-serif text-sm text-dark-brown/60 italic">
                  No active campaigns at the moment. Please register as a general volunteer to be alerted.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeCampaigns.map((camp) => (
                  <CampaignCard key={camp.id} campaign={camp} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Seva Campaigns */}
          <div className="space-y-6 pt-8 border-t border-gold/15">
            <SectionHeading title="Completed Seva Projects" subtitle="PAST IMPACTS" centered={false} />
            {completedCampaigns.length === 0 ? (
              <div className="text-center py-12 bg-white/40 border border-gold/15 rounded-2xl">
                <p className="font-serif text-sm text-dark-brown/60 italic">No past campaigns to show.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedCampaigns.map((camp) => (
                  <CampaignCard key={camp.id} campaign={camp} />
                ))}
              </div>
            )}
          </div>

          {/* Integrity alert box */}
          <div className="bg-gradient-to-r from-saffron/10 via-gold/5 to-saffron/10 border border-gold/25 p-6 rounded-3xl text-center flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-left space-y-1">
              <h4 className="font-serif text-sm font-bold text-maroon uppercase flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-saffron" />
                <span>Our Pure Seva Code</span>
              </h4>
              <p className="text-xs text-dark-brown/75 leading-relaxed font-sans max-w-2xl">
                Neelmani Kripalu Satsang never accepts online donations, cash, or credit transactions. If you wish to support these campaigns, you can register to contribute raw grains, cooking oil, text books, blankets, or physical labor at our ashrams.
              </p>
            </div>
            <a
              href="/join"
              className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold tracking-wider text-xs rounded-full transition-all duration-300 shadow-sm flex-shrink-0"
            >
              Sign Up to Serve
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
