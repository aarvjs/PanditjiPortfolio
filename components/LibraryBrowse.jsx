"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, Filter, BookOpen, Grid, List, Globe, 
  ArrowRight, Download, MessageSquare, Star, ArrowLeft
} from "lucide-react";

export default function LibraryBrowse({ initialResources = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    "All",
    "Spiritual Books",
    "E-Books",
    "PDFs",
    "Bhajans",
    "Spiritual Magazines",
    "Teachings"
  ];

  // Extract featured items
  const featuredResources = initialResources.filter(res => res.featured);

  // Filter items
  const filtered = initialResources.filter(res => {
    const matchesSearch = 
      res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.tags && res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    const matchesLanguage = selectedLanguage === "All" || res.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-12">
      {/* Featured Section */}
      {featuredResources.length > 0 && searchQuery === "" && selectedCategory === "All" && (
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <h2 className="font-serif font-black text-xl text-maroon uppercase tracking-wider">
              Featured Publications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredResources.slice(0, 2).map((res) => (
              <div 
                key={res.id} 
                className="bg-white/80 border border-gold/25 hover:border-saffron/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/10 rounded-bl-full flex items-center justify-center pointer-events-none">
                  <Star className="w-4 h-4 text-saffron fill-current -mt-6 -mr-6" />
                </div>

                <div className="w-32 h-44 flex-shrink-0 mx-auto sm:mx-0 shadow-md border border-gold/15 rounded-xl overflow-hidden bg-cream/20">
                  <img 
                    src={res.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80"} 
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-saffron tracking-wider block mb-1">
                      {res.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-maroon leading-tight hover:text-saffron transition-colors">
                      <Link href={`/library/${res.slug}`}>
                        {res.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-dark-brown/65 font-bold mt-1">
                      By {res.author}
                    </p>
                    <p className="text-[11px] text-dark-brown/60 line-clamp-3 mt-2">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gold/10">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-maroon bg-cream px-2 py-0.5 rounded border border-gold/10">
                      {res.language === "hi" ? "Hindi (हिन्दी)" : "English (EN)"}
                    </span>
                    <Link 
                      href={`/library/${res.slug}`}
                      className="text-xs text-saffron hover:text-maroon font-bold flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform"
                    >
                      Read Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter and Browse Bar */}
      <section className="space-y-6">
        <div className="bg-white/70 border border-gold/15 p-4 md:p-6 rounded-3xl shadow-sm flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Search by title, author, tag..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-cream border border-gold/25 rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
            </div>

            {/* Language filter & View Toggle */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-dark-brown/50 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-saffron" /> Lang:
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                  className="bg-cream border border-gold/20 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none text-dark-brown font-bold"
                >
                  <option value="All">All Languages</option>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center border border-gold/20 rounded-xl overflow-hidden bg-cream">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-saffron text-white" : "text-dark-brown/65 hover:bg-gold-light/20"}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-saffron text-white" : "text-dark-brown/65 hover:bg-gold-light/20"}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-t border-gold/10 pt-4">
            <span className="text-[10px] font-bold text-dark-brown/50 uppercase tracking-wider flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-saffron" /> Categories:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 font-serif border ${
                    selectedCategory === cat
                      ? "bg-maroon text-white border-maroon shadow-sm"
                      : "bg-cream text-dark-brown/70 hover:bg-gold-light/20 hover:text-maroon border-gold/15"
                  }`}
                >
                  {cat === "All" ? "Show All" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid/List View */}
        {paginatedItems.length === 0 ? (
          <div className="text-center py-20 bg-white/40 rounded-3xl border border-gold/15 shadow-sm">
            <BookOpen className="w-12 h-12 text-gold/30 mx-auto mb-3" />
            <p className="font-serif italic text-dark-brown/65 text-sm">
              No spiritual resources found matching your filters.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((res) => (
              <div 
                key={res.id}
                className="bg-white/80 border border-gold/15 rounded-3xl p-5 hover:border-saffron/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gold/10 bg-cream/10">
                    <img 
                      src={res.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                      alt={res.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-maroon/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded tracking-wider border border-gold/20">
                      {res.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-saffron/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded tracking-wider border border-gold/20">
                      {res.language === "hi" ? "Hindi" : "English"}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-maroon line-clamp-2 leading-tight group-hover:text-saffron transition-colors">
                    <Link href={`/library/${res.slug}`}>{res.title}</Link>
                  </h3>
                  <p className="text-[11px] font-bold text-dark-brown/70 mt-1">By {res.author}</p>
                  <p className="text-[11px] text-dark-brown/60 line-clamp-3 mt-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gold/10 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    res.type === "free" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {res.type === "free" ? "Free" : "Order Book"}
                  </span>
                  
                  <Link
                    href={`/library/${res.slug}`}
                    className="text-xs text-saffron hover:text-maroon font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Read Book
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedItems.map((res) => (
              <div 
                key={res.id}
                className="bg-white/80 border border-gold/15 rounded-2xl p-4 hover:border-saffron/40 hover:shadow-sm transition-all duration-300 flex flex-col sm:flex-row gap-4 items-center sm:items-start group"
              >
                <div className="w-20 h-28 flex-shrink-0 shadow-sm border border-gold/10 rounded-lg overflow-hidden bg-cream/15">
                  <img 
                    src={res.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80"}
                    alt={res.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow flex flex-col justify-between h-auto sm:h-28 text-center sm:text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="px-1.5 py-0.5 bg-maroon/10 text-maroon text-[9px] font-bold uppercase rounded">
                        {res.category}
                      </span>
                      <span className="px-1.5 py-0.5 bg-saffron/10 text-saffron text-[9px] font-bold uppercase rounded">
                        {res.language === "hi" ? "Hindi" : "English"}
                      </span>
                    </div>
                    
                    <h3 className="font-serif font-bold text-sm text-maroon leading-tight hover:text-saffron transition-colors">
                      <Link href={`/library/${res.slug}`}>{res.title}</Link>
                    </h3>
                    <p className="text-[10px] text-dark-brown/60 font-bold">By {res.author}</p>
                    <p className="text-[11px] text-dark-brown/55 line-clamp-2 mt-1.5 leading-relaxed hidden sm:block">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 sm:mt-0 pt-2 sm:pt-0 border-t border-gold/10 sm:border-none">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      res.type === "free" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {res.type === "free" ? "Free" : "Order Book"}
                    </span>
                    
                    <Link
                      href={`/library/${res.slug}`}
                      className="text-xs text-saffron hover:text-maroon font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Read Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gold/15 rounded-xl bg-white hover:bg-gold-light/10 text-dark-brown/65 disabled:opacity-40 disabled:hover:bg-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-dark-brown/70">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gold/15 rounded-xl bg-white hover:bg-gold-light/10 text-dark-brown/65 disabled:opacity-40 disabled:hover:bg-white transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
