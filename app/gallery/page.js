import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import GalleryGrid from "../../components/GalleryGrid";
import { getGalleryItems } from "../../lib/db";

export const metadata = {
  title: "Divine Gallery | Neelmani Kripalu Satsang",
  description: "Browse high-definition photos and videos of our guru satsangs, devotional kirtans, Janmashtami celebrations, and active charity seva work."
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const breadcrumbs = [{ name: "Divine Gallery", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Divine Gallery"
          description="Glimpses of spiritual bliss, congregational sankirtans, sacred ashram festivals, and charitable distributions."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Interactive tabs, masonry grid and lightbox preview */}
          <GalleryGrid items={items} />
        </div>
      </main>

      <Footer />
    </>
  );
}
