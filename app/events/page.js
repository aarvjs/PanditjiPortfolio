import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import EventsListing from "../../components/EventsListing";
import { getEvents } from "../../lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Satsang Events Schedule | Neelmani Kripalu Satsang",
  description: "View upcoming satsang schedules, devotional kirtan sessions, youth morality classes, and online sadhana retreats. Secure your in-person registration."
};

export default async function EventsPage() {
  const events = await getEvents();
  const breadcrumbs = [{ name: "Events", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Satsang Schedule & Events"
          description="Join us in-person or online for sacred devotional singing, roopdhyana, and scriptural discussions. Pre-register below."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Main client interactive event filters and lists */}
          <EventsListing initialEvents={events} />
        </div>
      </main>

      <Footer />
    </>
  );
}
