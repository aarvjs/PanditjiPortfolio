"use client";

import React, { useState, useEffect } from "react";
import { 
  Quote, Plus, Trash2, Edit2, ArrowLeft, ShieldAlert, CheckCircle, 
  Search, BookMarked, AlignLeft 
} from "lucide-react";
import * as db from "../../../lib/db";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    quote: "",
    author: "Jagadguru Shri Kripalu Ji Maharaj",
    shloka: "",
    translation: ""
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const data = await db.getQuotes();
      setQuotes(data);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch quotes.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quote || !form.author) {
      showFeedback("error", "Quote text and author are required fields.");
      return;
    }

    setIsLoading(true);

    try {
      if (view === "create") {
        await db.addQuote(form);
        showFeedback("success", "Daily quote added successfully!");
      } else {
        await db.updateQuote(editingId, form);
        showFeedback("success", "Daily quote updated successfully!");
      }

      resetForm();
      await fetchQuotes();
    } catch (err) {
      console.error(err);
      showFeedback("error", err.message || "Failed to save quote.");
      setIsLoading(false);
    }
  };

  const handleEditClick = (quoteItem) => {
    setEditingId(quoteItem.id);
    setForm({
      quote: quoteItem.quote || quoteItem.text || "",
      author: quoteItem.author || "Jagadguru Shri Kripalu Ji Maharaj",
      shloka: quoteItem.shloka || "",
      translation: quoteItem.translation || ""
    });
    setView("edit");
  };

  const handleDeleteClick = async (quoteItem) => {
    if (!confirm(`Are you sure you want to delete this quote?`)) return;
    setIsLoading(true);
    try {
      await db.deleteQuote(quoteItem.id);
      showFeedback("success", "Quote deleted successfully!");
      await fetchQuotes();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to delete quote.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      quote: "",
      author: "Jagadguru Shri Kripalu Ji Maharaj",
      shloka: "",
      translation: ""
    });
    setEditingId(null);
    setView("list");
  };

  const filteredQuotes = quotes.filter(q => 
    (q.quote || q.text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.author || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.shloka || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            {view === "list" ? "Daily Quotes & Shlokas" : view === "create" ? "Add Daily Quote" : "Edit Daily Quote"}
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            {view === "list" 
              ? "Manage spiritual shlokas and daily quotes composed by Jagadguru Shri Kripalu Ji Maharaj."
              : "Enter the Sanskrit shloka (optional) and its Hindi/English translation below."
            }
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quote</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to list</span>
          </button>
        )}
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
          feedback.type === "error" 
            ? "bg-rose-50 border-rose-200 text-rose-800" 
            : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          {feedback.type === "error" ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {isLoading && view === "list" ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : view === "list" ? (
        <>
          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search quotes by author or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
              <Quote className="w-8 h-8 text-gold/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-brown/70">No quotes found.</p>
              <p className="text-xs text-dark-brown/50 mt-1">Publish a daily quote to inspire seekers visiting the website.</p>
            </div>
          ) : (
            /* Quotes Table */
            <div className="bg-white/80 border border-gold/15 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-dark/30 border-b border-gold/15 text-[10px] font-bold uppercase tracking-wider text-dark-brown/60">
                      <th className="p-4 font-serif">Quote Details</th>
                      <th className="p-4 font-serif">Shloka & Translation</th>
                      <th className="p-4 font-serif">Author</th>
                      <th className="p-4 font-serif text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-cream/40 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-dark-brown leading-relaxed max-w-md font-sans">
                            "{q.quote || q.text}"
                          </p>
                        </td>
                        <td className="p-4">
                          {q.shloka ? (
                            <div className="space-y-1 max-w-sm">
                              <span className="font-bold text-maroon block font-serif text-[11px] bg-gold-light/10 p-1 border border-gold/15 rounded">
                                {q.shloka}
                              </span>
                              <span className="text-[10px] text-dark-brown/60 block leading-normal italic">
                                {q.translation}
                              </span>
                            </div>
                          ) : (
                            <span className="text-dark-brown/30 italic">No shloka attached</span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-serif font-black text-maroon uppercase tracking-wider">
                            {q.author}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(q)}
                              className="p-1.5 hover:bg-gold-light/45 text-maroon rounded-lg transition-colors border border-transparent hover:border-gold/15"
                              title="Edit quote"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(q)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Delete quote"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Form View */
        <div className="bg-white/80 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Quote text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Quote Text / Explanation <span className="text-saffron">*</span>
              </label>
              <textarea
                name="quote"
                required
                rows="4"
                value={form.quote}
                onChange={handleInputChange}
                placeholder="Enter the spiritual teaching translation, description, or quote details here..."
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Author / Source <span className="text-saffron">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                value={form.author}
                onChange={handleInputChange}
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown"
              />
            </div>

            {/* Sanskrit Shloka */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Sanskrit Shloka / Couplet (Optional)
              </label>
              <input
                type="text"
                name="shloka"
                value={form.shloka}
                onChange={handleInputChange}
                placeholder="e.g. कृष्णं वन्दे जगद्गुरुम्"
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown font-serif"
              />
            </div>

            {/* Translation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown/70 mb-1.5 font-serif">
                Sanskrit Shloka Word-for-Word / Literal Translation (Optional)
              </label>
              <textarea
                name="translation"
                rows="3"
                value={form.translation}
                onChange={handleInputChange}
                placeholder="Enter the Sanskrit translation of the shloka couplet if applicable..."
                className="w-full bg-white border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-saffron text-dark-brown resize-none"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="px-5 py-2.5 bg-cream-dark/45 hover:bg-gold-light/30 text-dark-brown font-bold text-xs uppercase tracking-wider rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-saffron hover:bg-maroon text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Save Quote</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
