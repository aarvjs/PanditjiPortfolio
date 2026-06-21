"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import VolunteerForm from "../../components/VolunteerForm";
import { Heart, Compass, HelpCircle } from "lucide-react";

function VolunteerPageContent() {
  const searchParams = useSearchParams();
  const interest = searchParams.get("interest") || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form */}
      <div className="lg:col-span-8 bg-white/70 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm">
        <VolunteerForm prefilledInterest={interest} />
      </div>

      {/* Right Column: Values */}
      <div className="lg:col-span-4 space-y-6">
        {/* Support instructions */}
        <div className="bg-cream-dark/50 border border-gold/20 p-6 rounded-2xl shadow-inner space-y-4">
          <h3 className="font-serif text-sm font-bold text-maroon flex items-center gap-2 border-b border-gold/15 pb-2">
            <Heart className="w-4 h-4 text-saffron fill-current" />
            <span>Devotional Service Code</span>
          </h3>
          <p className="text-xs text-dark-brown/80 leading-relaxed font-sans">
            In our satsang, volunteer work is treated as spiritual sadhana. Please approach your service with:
          </p>
          <ul className="space-y-2.5 text-xs text-dark-brown/80 font-sans pl-2 list-disc list-inside">
            <li><strong>Humility</strong>: Seeing the Divine in those you serve.</li>
            <li><strong>Sincerity</strong>: Committing fully to tasks accepted.</li>
            <li><strong>Respect</strong>: Maintaining pure, loving speech.</li>
          </ul>
        </div>

        {/* Info card */}
        <div className="bg-white/60 border border-gold/15 p-5 rounded-2xl shadow-sm text-center">
          <HelpCircle className="w-5 h-5 text-saffron mx-auto mb-2" />
          <h4 className="font-serif text-xs font-bold text-maroon">Have Seva Questions?</h4>
          <p className="text-[11px] text-dark-brown/65 leading-relaxed mt-1">
            Not sure where you fit in? Write your query on our contact page or call the coordinator office.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  const breadcrumbs = [{ name: "Join Volunteer", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Become a Volunteer"
          description="Register to offer physical service (Seva) and join weekly spiritual congregations."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Suspense is required in App Router when consuming searchParams on client pages */}
          <Suspense
            fallback={
              <div className="text-center py-12">
                <span className="font-serif text-sm text-dark-brown/60 italic">Loading Volunteer Form...</span>
              </div>
            }
          >
            <VolunteerPageContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
