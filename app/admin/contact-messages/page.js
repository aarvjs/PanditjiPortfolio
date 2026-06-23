"use client";

import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, ShieldAlert, RefreshCw, Search, Check, Info } from "lucide-react";
import * as db from "../../../lib/db";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'new' | 'read'

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await db.getContactSubmissions();
      setMessages(data);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to fetch contact messages.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const markAsRead = async (id) => {
    try {
      await db.updateContactMessageStatus(id, "read");
      setMessages(prev => 
        prev.map(m => m.id === id ? { ...m, status: "read" } : m)
      );
      showFeedback("success", "Message marked as read.");
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to update message status.");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = (m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.message?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && m.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon flex items-center gap-2">
            Contact Enquiries
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            View and manage messages sent from the public website contact form.
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-cream-dark/50 hover:bg-gold-light/40 text-maroon text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {feedback.type === "error" ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex bg-white/60 border border-gold/25 rounded-xl p-1 overflow-hidden">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === "all" ? "bg-saffron text-white shadow-sm" : "text-dark-brown/70 hover:bg-gold/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("new")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === "new" ? "bg-saffron text-white shadow-sm" : "text-dark-brown/70 hover:bg-gold/10"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilterStatus("read")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === "read" ? "bg-saffron text-white shadow-sm" : "text-dark-brown/70 hover:bg-gold/10"
            }`}
          >
            Read
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-saffron text-dark-brown"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-dark-brown/40" />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white/50 border border-gold/15 p-12 rounded-3xl text-center">
          <Mail className="w-8 h-8 text-gold/50 mx-auto mb-3" />
          <p className="text-sm font-semibold text-dark-brown/70">No messages found.</p>
          <p className="text-xs text-dark-brown/50 mt-1">
            {searchQuery ? "Try adjusting your search criteria." : "You have no contact enquiries yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-white/80 border p-5 md:p-6 rounded-2xl shadow-sm transition-colors ${
                msg.status === "new" ? "border-saffron border-l-4" : "border-gold/15"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-maroon text-sm">{msg.name}</h3>
                    {msg.status === "new" && (
                      <span className="bg-rose-100 text-rose-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-dark-brown/70">
                    <a href={`mailto:${msg.email}`} className="hover:text-maroon hover:underline">{msg.email}</a>
                    {msg.mobile && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <a href={`tel:${msg.mobile}`} className="hover:text-maroon hover:underline">{msg.mobile}</a>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center md:items-end flex-row md:flex-col justify-between md:justify-start gap-2">
                  <span className="text-[10px] text-dark-brown/50 font-semibold tracking-wide">
                    {formatDate(msg.createdAt)}
                  </span>
                  {msg.status === "new" && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg border border-emerald-200 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Mark Read
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-cream/40 p-4 rounded-xl border border-gold/10 relative">
                <Info className="w-4 h-4 text-gold/40 absolute top-4 right-4" />
                <p className="text-xs text-dark-brown whitespace-pre-wrap leading-relaxed pr-6">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
