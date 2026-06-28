import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import LibraryBrowse from "../../components/LibraryBrowse";
import { getELibraryResources } from "../../lib/db";

export const metadata = {
  title: "Spiritual E-Library & Holy PDFs | Neelmani Kripalu Satsang",
  description: "Browse and download spiritual books, eBooks, magazines, bhajans, and teachings composed by Jagadguru Shri Kripalu Ji Maharaj."
};

export default async function LibraryPage() {
  const resources = await getELibraryResources();
  const breadcrumbs = [{ name: "E-Library", path: "" }];

  // Only pass published status resources to the public view
  const publishedResources = (resources || []).filter(res => res.status === "published");

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Spiritual E-Library"
          description="Access sacred eBooks, Vedic philosophy publications, daily prayers, and divine magazines to study Bhakti Yoga."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <LibraryBrowse initialResources={publishedResources} />
        </div>
      </main>

      <Footer />
    </>
  );
}
