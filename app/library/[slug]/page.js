import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import LibraryResourceDetail from "../../../components/LibraryResourceDetail";
import { getELibraryResourceBySlug } from "../../../lib/db";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const resource = await getELibraryResourceBySlug(resolvedParams.slug);
  return {
    title: resource ? `${resource.title} - Free Spiritual Book | NKS` : "Resource Not Found",
    description: resource ? resource.description : "Spiritual literature detail page."
  };
}

export default async function LibraryDetailRoute({ params }) {
  const resolvedParams = await params;
  const resource = await getELibraryResourceBySlug(resolvedParams.slug);

  const breadcrumbs = [
    { name: "E-Library", path: "/library" },
    { name: resource ? resource.title : "Resource Detail", path: "" }
  ];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title={resource ? resource.title : "Resource Detail"}
          description={resource ? `Published by ${resource.author}` : "Book details page"}
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <LibraryResourceDetail resource={resource} />
        </div>
      </main>

      <Footer />
    </>
  );
}
