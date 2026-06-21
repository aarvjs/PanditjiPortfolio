import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import AnnouncementCard from "../../components/AnnouncementCard";
import { getAnnouncements } from "../../lib/db";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Notice Board & Announcements | Neelmani Kripalu Satsang",
  description: "Read critical updates, change of satsang timings, upcoming festival guidelines, and disaster relief volunteer alerts from Neelmani Kripalu Satsang."
};

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  const breadcrumbs = [{ name: "Notice Board", path: "" }];

  // Sort: High priority first, then normal priority
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (a.priority !== "high" && b.priority === "high") return 1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Notice Board"
          description="Stay informed with scheduled changes, urgent seva calls, and festival guidelines."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          
          <div className="flex items-center gap-2 mb-8 border-b border-gold/15 pb-4">
            <Bell className="w-5 h-5 text-saffron animate-bounce" />
            <h2 className="font-serif text-lg font-bold text-maroon">
              Active Updates & Announcements
            </h2>
          </div>

          {sortedAnnouncements.length === 0 ? (
            <div className="text-center py-16 bg-white/40 border border-gold/15 rounded-3xl">
              <p className="font-serif italic text-dark-brown/65">
                No active announcements on the notice board at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedAnnouncements.map((ann) => (
                <AnnouncementCard key={ann.id} announcement={ann} />
              ))}
            </div>
          )}

          {/* Contact note */}
          <div className="mt-12 text-center bg-white/50 border border-gold/10 p-5 rounded-2xl max-w-md mx-auto text-xs text-dark-brown/70 leading-relaxed font-sans">
            Have questions regarding these updates? Get in touch with our local satsang coordinators on our <Link href="/contact" className="text-saffron hover:underline font-semibold font-serif">Contact Page</Link>.
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
