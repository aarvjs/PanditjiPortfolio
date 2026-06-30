import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import AshramMap from "../../components/AshramMap";
import { getAshrams } from "../../lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Temples & Ashram Locator | Neelmani Kripalu Satsang",
  description: "Find temples, ashrams, and weekly satsang centers of Neelmani Kripalu Satsang on our interactive map. Get timings, contact info, and directions."
};

export default async function AshramsPage() {
  const ashrams = await getAshrams();
  const breadcrumbs = [{ name: "Ashrams & Centers", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Temples & Ashrams Locator"
          description="Find a local satsang branch, community center, or serene ashram near you. Connect with local devotees and join congregational chanting."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <AshramMap initialAshrams={ashrams} />
        </div>
      </main>

      <Footer />
    </>
  );
}
