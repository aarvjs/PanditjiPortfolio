"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Trash2, CheckCircle, AlertTriangle, 
  Search, ToggleLeft, ToggleRight, Phone, Calendar, 
  User, Eye, UserCheck, RefreshCw, X, Edit2, ArrowLeft
} from "lucide-react";
import * as db from "../../../lib/db";

export default function AdminLostFoundPage() {
  const [activeTab, setActiveTab] = useState("lost"); // 'lost' | 'missing'
  const [lostItems, setLostItems] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'resolved' | 'unresolved'

  // Modal deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    let lostLoaded = false;
    let missingLoaded = false;

    const unsubscribeLost = db.subscribeToLostItems((data) => {
      setLostItems(data || []);
      lostLoaded = true;
      if (lostLoaded && missingLoaded) setIsLoading(false);
    });

    const unsubscribeMissing = db.subscribeToMissingPersons((data) => {
      setMissingPersons(data || []);
      missingLoaded = true;
      if (lostLoaded && missingLoaded) setIsLoading(false);
    });

    if (!db.isFirebaseConfigured) {
      setIsLoading(false);
    }

    return () => {
      unsubscribeLost && unsubscribeLost();
      unsubscribeMissing && unsubscribeMissing();
    };
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleToggleStatus = async (item, type) => {
    setIsLoading(true);
    showFeedback("info", "Updating report status...");
    try {
      const nextStatus = item.status === "resolved" ? "unresolved" : "resolved";
      
      if (type === "lost") {
        await db.updateLostItem(item.id, { status: nextStatus });
        showFeedback("success", `Lost item "${item.itemName}" status marked as ${nextStatus}.`);
      } else {
        await db.updateMissingPerson(item.id, { status: nextStatus });
        showFeedback("success", `Missing alert for "${item.missingPersonName}" status marked as ${nextStatus}.`);
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      showFeedback("error", "Failed to update report status.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsLoading(true);
    setShowDeleteModal(false);
    showFeedback("info", "Deleting report...");
    try {
      if (activeTab === "lost") {
        await db.deleteLostItem(deletingId);
      } else {
        await db.deleteMissingPerson(deletingId);
      }
      showFeedback("success", "Report deleted successfully.");
    } catch (err) {
      console.error("Error deleting report:", err);
      showFeedback("error", "Failed to delete report.");
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  // Filtering
  const getFilteredReports = () => {
    const list = activeTab === "lost" ? lostItems : missingPersons;
    return list.filter(item => {
      // 1. Status Filter
      if (statusFilter !== "all") {
        if (item.status !== statusFilter) return false;
      }
      
      // 2. Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        if (activeTab === "lost") {
          return (
            item.itemName?.toLowerCase().includes(query) ||
            item.reporterName?.toLowerCase().includes(query) ||
            item.eventName?.toLowerCase().includes(query)
          );
        } else {
          return (
            item.missingPersonName?.toLowerCase().includes(query) ||
            item.reporterName?.toLowerCase().includes(query) ||
            item.lastSeenLocation?.toLowerCase().includes(query)
          );
        }
      }
      return true;
    });
  };

  const filtered = getFilteredReports();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-saffron" />
            Lost & Found Command Center
          </h1>
          <p className="text-xs text-dark-brown/60 mt-1">
            Reunite families and resolve lost belongings announcements submitted by public.
          </p>
        </div>

        <div className="flex border border-gold/25 rounded-xl overflow-hidden bg-white shadow-sm p-0.5">
          <button
            onClick={() => { setActiveTab("lost"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold font-serif uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "lost" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => { setActiveTab("missing"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold font-serif uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "missing" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
            }`}
          >
            Missing Persons
          </button>
        </div>
      </div>

      {feedback.message && (
        <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 border ${
          feedback.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {feedback.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-xs font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* List and table card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gold/15 p-6 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
            <input
              type="text"
              placeholder={activeTab === "lost" ? "Search item, reporter, event..." : "Search missing name, reporter, location..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream/40 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-[10px] font-bold text-dark-brown/50 uppercase">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-cream border border-gold/20 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-dark-brown font-bold"
            >
              <option value="all">All Alerts</option>
              <option value="unresolved">Unresolved Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-saffron animate-spin" />
            <p className="mt-3 text-xs text-dark-brown/50 font-medium">Loading reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gold/10 rounded-2xl">
            <ShieldAlert className="w-12 h-12 text-gold/30 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-dark-brown/85">No reports matching filters</h3>
            <p className="text-xs text-dark-brown/50 mt-1">Submitted user records will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/15 text-[10px] uppercase font-bold tracking-wider text-dark-brown/65 bg-cream/35">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Reporter Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-xs">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-cream-dark/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded shadow-sm border border-gold/10 flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-maroon truncate max-w-[200px]">
                            {activeTab === "lost" ? item.itemName : item.missingPersonName}
                          </h4>
                          {activeTab === "missing" && (
                            <span className="text-[10px] text-dark-brown/60 block mt-0.5">
                              {item.age} yrs • {item.gender}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[280px]">
                      <p className="line-clamp-2 text-dark-brown/70 leading-relaxed" title={item.description}>
                        {item.description}
                      </p>
                      {activeTab === "lost" ? (
                        <div className="flex flex-wrap gap-1 mt-1 text-[9px] font-bold text-saffron">
                          <span>Date: {item.date}</span>
                          {item.eventName && <span>• Event: {item.eventName}</span>}
                        </div>
                      ) : (
                        <span className="block mt-1 text-[9px] font-bold text-saffron">
                          Last Seen: {item.lastSeenLocation}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-dark-brown/85">{item.reporterName}</p>
                        <a 
                          href={`tel:${item.reporterPhone}`}
                          className="text-saffron font-bold text-[10px] hover:text-maroon flex items-center gap-1 w-max"
                        >
                          <Phone className="w-3 h-3" /> {item.reporterPhone}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(item, activeTab)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border transition-all ${
                          item.status === "resolved" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                            : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        {item.status === "resolved" ? "Resolved" : "Unresolved"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => triggerDelete(item.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200"
                          title="Delete Report"
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
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gold/20 p-6 max-w-sm w-full text-center shadow-xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-dark-brown">Delete Report?</h3>
            <p className="text-xs text-dark-brown/65 mt-2">
              Are you sure you want to permanently delete this lost & found report? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gold/20 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
