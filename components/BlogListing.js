"use client";

import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { Search, Filter, BookOpen } from "lucide-react";
import { subscribeToBlogs } from "../lib/db";

export default function BlogListing({ initialBlogs = [] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all' | 'teachings' | 'sadhana' | 'seva'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToBlogs((data) => {
      setBlogs(data);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Extract unique categories in title case, sort
  const categories = ["all", ...new Set(blogs.map(b => b.category.toLowerCase()))];

  const filteredBlogs = blogs.filter((blog) => {
    // 1. Category Filter
    if (selectedCategory !== "all") {
      if (blog.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    // 2. Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = blog.title.toLowerCase().includes(query);
      const matchSummary = blog.summary.toLowerCase().includes(query);
      const matchContent = blog.content.toLowerCase().includes(query);
      const matchAuthor = blog.author.toLowerCase().includes(query);
      return matchTitle || matchSummary || matchContent || matchAuthor;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Filters & Search Control bar */}
      <div className="bg-white/70 border border-gold/15 p-4 md:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search teachings, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-gold/25 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-dark-brown/40" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-brown/50 font-serif flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-saffron" />
            Category:
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-serif ${
                  selectedCategory === cat
                    ? "bg-saffron text-white shadow-sm"
                    : "bg-cream text-dark-brown/70 hover:bg-gold-light/25 hover:text-maroon border border-gold/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid List */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 bg-white/40 rounded-3xl border border-gold/15 shadow-sm">
          <p className="font-serif italic text-dark-brown/65">
            No spiritual teachings found matching the criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
