import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import BlogListing from "../../components/BlogListing";
import { getBlogs } from "../../lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Spiritual Teachings & Articles | Neelmani Kripalu Satsang",
  description: "Read divine discourses, scriptural teachings, explanations of Bhakti Yoga, Roopdhyana, and latest reports of our Seva campaigns."
};

export default async function BlogPage() {
  const blogs = await getBlogs();
  const breadcrumbs = [{ name: "Blog", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Spiritual Teachings & Blog"
          description="Nectar-filled wisdom and scriptural guidelines to inspire daily sadhana and cleanse the mirror of the heart."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Renders interactive filter and lists of blogs */}
          <BlogListing initialBlogs={blogs} />
        </div>
      </main>

      <Footer />
    </>
  );
}
