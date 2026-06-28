import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import FestivalRegister from "../../../components/FestivalRegister";
import { getFestivalBySlug } from "../../../lib/db";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const festival = await getFestivalBySlug(resolvedParams.slug);
  return {
    title: festival ? `${festival.name} - Registration Pass | NKS` : "Festival Details",
    description: festival ? festival.description : "Festival registration details."
  };
}

export default async function FestivalDetailRoute({ params }) {
  const resolvedParams = await params;
  const festival = await getFestivalBySlug(resolvedParams.slug);

  const breadcrumbs = [
    { name: "Festivals & Events", path: "/festivals" },
    { name: festival ? festival.name : "Festival Detail", path: "" }
  ];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title={festival ? festival.name : "Festival Registration"}
          description={festival ? `Holy discourse event at ${festival.venue}` : "Register for dynamic entry passes"}
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 font-sans">
          <FestivalRegister festival={festival} />
        </div>
      </main>

      <Footer />
    </>
  );
}
