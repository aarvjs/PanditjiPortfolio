import React from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import { getBlogById } from "../../../lib/db";
import { User, Calendar, BookOpen, ChevronLeft, Share2 } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlogById(id);
  return {
    title: blog ? `${blog.title} | Spiritual Discourses` : "Spiritual Article",
    description: blog ? blog.summary.slice(0, 155) : "Read spiritual articles and teachings."
  };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-cream flex flex-col items-center justify-center p-20 text-center">
          <h2 className="font-serif text-2xl font-bold text-maroon mb-4">Article Not Found</h2>
          <p className="text-sm text-dark-brown/70 mb-6 font-sans">The spiritual discourse you are searching for is unavailable.</p>
          <Link href="/blog" className="px-5 py-2 bg-saffron text-white rounded-full text-xs font-bold uppercase tracking-wider">
            Back to Blog List
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const breadcrumbs = [
    { name: "Blog", path: "/blog" },
    { name: blog.title, path: "" }
  ];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title={blog.title}
          description={`Expounded by ${blog.author} | Category: ${blog.category}`}
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:text-saffron mb-6 font-serif border-b border-transparent hover:border-saffron pb-0.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO ALL DISCOURSES</span>
          </Link>

          <article className="bg-white/70 border border-gold/15 p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
            {/* Banner Image */}
            <div className="rounded-2xl overflow-hidden aspect-video max-h-[380px] bg-gold-light/20 border border-gold/10">
              <img
                src={blog.bannerUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>

            {/* Author / Date Meta Bar */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-t border-b border-gold/10 text-xs font-semibold text-dark-brown/65">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-saffron" />
                <span>By {blog.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-saffron" />
                <span>Published: {blog.createdAt}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-saffron" />
                <span className="uppercase">{blog.category}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="text-sm md:text-base text-dark-brown/95 leading-relaxed whitespace-pre-line font-sans pt-2">
              {blog.content}
            </div>

            {/* Article Footer details */}
            <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {blog.seoKeywords && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-bold text-dark-brown/40 font-serif mr-1">KEYWORDS:</span>
                  {blog.seoKeywords.split(",").map((kw, i) => (
                    <span
                      key={i}
                      className="bg-cream-dark/50 text-dark-brown/70 border border-gold/15 text-[10px] px-2.5 py-0.5 rounded-full font-sans font-semibold"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard! Share the teachings.");
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-saffron hover:text-maroon transition-colors uppercase font-serif self-end sm:self-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Share teaching</span>
              </button>
            </div>

          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
