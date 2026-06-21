"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isFirebaseConfigured, auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import * as db from "../../lib/db";
import { 
  LogOut, Calendar, HeartHandshake, Image as ImageIcon, Bell, 
  Quote, BookOpen, Users, Plus, Trash2, Edit2, AlertCircle, 
  Check, Save, Send, Database 
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'campaigns' | 'gallery' | 'announcements' | 'quotes' | 'blogs' | 'registrations'
  const router = useRouter();

  // Database lists in state
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  
  // Registrations sub-lists
  const [eventRegs, setEventRegs] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Form states
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [editingId, setEditingId] = useState(null); // ID of item being edited

  // Individual Form Field States
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", time: "", location: "", isOnline: false, bannerUrl: "", organizer: "", googleMapUrl: "" });
  const [campaignForm, setCampaignForm] = useState({ title: "", description: "", location: "", status: "active", bannerUrl: "", purpose: "", impact: "", howToParticipate: "" });
  const [galleryForm, setGalleryForm] = useState({ title: "", category: "Satsang Events", type: "image", url: "" });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "", date: new Date().toISOString().split("T")[0], priority: "normal" });
  const [quoteForm, setQuoteForm] = useState({ text: "", author: "", shloka: "", translation: "" });
  const [blogForm, setBlogForm] = useState({ title: "", content: "", summary: "", bannerUrl: "", author: "", category: "Teachings", seoKeywords: "" });

  // 1. Auth Guard and Initial Fetch
  useEffect(() => {
    const checkAuth = async () => {
      const isMockAuth = localStorage.getItem("nks_admin_auth") === "true";
      
      if (isFirebaseConfigured && auth) {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            setIsAdmin(true);
            await fetchData();
          } else if (isMockAuth) {
            setIsAdmin(true);
            await fetchData();
          } else {
            router.push("/admin/login");
          }
        });
      } else if (isMockAuth) {
        setIsAdmin(true);
        await fetchData();
      } else {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const evs = await db.getEvents();
      const camps = await db.getCampaigns();
      const gal = await db.getGalleryItems();
      const anns = await db.getAnnouncements();
      const qts = await db.getQuotes();
      const blgs = await db.getBlogs();
      
      const eRegs = await db.getEventRegistrations();
      const vols = await db.getVolunteerRegistrations();
      const cons = await db.getContactSubmissions();

      setEvents(evs);
      setCampaigns(camps);
      setGallery(gal);
      setAnnouncements(anns);
      setQuotes(qts);
      setBlogs(blgs);
      
      setEventRegs(eRegs);
      setVolunteers(vols);
      setContacts(cons);
    } catch (e) {
      console.error(e);
      showFeedback("error", "Failed to load database values.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleSignOut = async () => {
    localStorage.removeItem("nks_admin_auth");
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    router.push("/admin/login");
  };

  // Seeder trigger
  const handleSeedDatabase = async () => {
    if (!isFirebaseConfigured) {
      showFeedback("error", "Firebase is not configured yet. Set env variables first.");
      return;
    }
    setIsLoading(true);
    try {
      await db.seedMockDataToFirebase();
      showFeedback("success", "Prepopulated Firestore successfully! Refreshing database...");
      await fetchData();
    } catch (err) {
      showFeedback("error", err.message || "Failed to seed collections.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // EVENTS CRUD
  // ----------------------------------------------------
  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await db.updateEvent(editingId, eventForm);
        showFeedback("success", "Event updated successfully!");
      } else {
        await db.addEvent(eventForm);
        showFeedback("success", "Event created successfully!");
      }
      resetEventForm();
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to save event details.");
    }
  };

  const editEvent = (event) => {
    setEditingId(event.id);
    setEventForm({ ...event });
  };

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await db.deleteEvent(id);
      showFeedback("success", "Event deleted successfully!");
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to delete event.");
    }
  };

  const resetEventForm = () => {
    setEditingId(null);
    setEventForm({ title: "", description: "", date: "", time: "", location: "", isOnline: false, bannerUrl: "", organizer: "", googleMapUrl: "" });
  };

  // ----------------------------------------------------
  // CAMPAIGNS CRUD
  // ----------------------------------------------------
  const saveCampaign = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await db.updateCampaign(editingId, campaignForm);
        showFeedback("success", "Seva campaign updated!");
      } else {
        await db.addCampaign(campaignForm);
        showFeedback("success", "New Seva campaign added!");
      }
      resetCampaignForm();
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to save campaign.");
    }
  };

  const editCampaign = (camp) => {
    setEditingId(camp.id);
    setCampaignForm({ ...camp });
  };

  const deleteCampaign = async (id) => {
    if (!confirm("Are you sure? This deletes the campaign page.")) return;
    try {
      await db.deleteCampaign(id);
      showFeedback("success", "Seva campaign removed.");
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to delete campaign.");
    }
  };

  const resetCampaignForm = () => {
    setEditingId(null);
    setCampaignForm({ title: "", description: "", location: "", status: "active", bannerUrl: "", purpose: "", impact: "", howToParticipate: "" });
  };

  // ----------------------------------------------------
  // GALLERY CRUD
  // ----------------------------------------------------
  const saveGalleryItem = async (e) => {
    e.preventDefault();
    try {
      await db.addGalleryItem(galleryForm);
      showFeedback("success", "Gallery item added successfully!");
      setGalleryForm({ title: "", category: "Satsang Events", type: "image", url: "" });
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to save gallery item.");
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await db.deleteGalleryItem(id);
      showFeedback("success", "Gallery item deleted.");
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to delete item.");
    }
  };

  // ----------------------------------------------------
  // ANNOUNCEMENTS CRUD
  // ----------------------------------------------------
  const saveAnnouncement = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await db.updateAnnouncement(editingId, announcementForm);
        showFeedback("success", "Notice updated!");
      } else {
        await db.addAnnouncement(announcementForm);
        showFeedback("success", "Notice published!");
      }
      resetAnnouncementForm();
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to save notice.");
    }
  };

  const editAnnouncement = (ann) => {
    setEditingId(ann.id);
    setAnnouncementForm({ ...ann });
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await db.deleteAnnouncement(id);
      showFeedback("success", "Notice removed.");
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to delete notice.");
    }
  };

  const resetAnnouncementForm = () => {
    setEditingId(null);
    setAnnouncementForm({ title: "", message: "", date: new Date().toISOString().split("T")[0], priority: "normal" });
  };

  // ----------------------------------------------------
  // GURU QUOTES CRUD
  // ----------------------------------------------------
  const saveQuote = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await db.updateQuote(editingId, quoteForm);
        showFeedback("success", "Spiritual quote updated!");
      } else {
        await db.addQuote(quoteForm);
        showFeedback("success", "Spiritual quote added!");
      }
      resetQuoteForm();
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to save quote.");
    }
  };

  const editQuote = (quote) => {
    setEditingId(quote.id);
    setQuoteForm({ ...quote });
  };

  const deleteQuote = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await db.deleteQuote(id);
      showFeedback("success", "Quote deleted.");
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to delete quote.");
    }
  };

  const resetQuoteForm = () => {
    setEditingId(null);
    setQuoteForm({ text: "", author: "", shloka: "", translation: "" });
  };

  // ----------------------------------------------------
  // BLOGS CRUD
  // ----------------------------------------------------
  const saveBlog = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await db.updateBlog(editingId, blogForm);
        showFeedback("success", "Blog article updated!");
      } else {
        await db.addBlog(blogForm);
        showFeedback("success", "Blog article published!");
      }
      resetBlogForm();
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to save blog post.");
    }
  };

  const editBlog = (blog) => {
    setEditingId(blog.id);
    setBlogForm({ ...blog });
  };

  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await db.deleteBlog(id);
      showFeedback("success", "Blog post deleted.");
      await fetchData();
    } catch (err) {
      showFeedback("error", "Failed to delete blog post.");
    }
  };

  const resetBlogForm = () => {
    setEditingId(null);
    setBlogForm({ title: "", content: "", summary: "", bannerUrl: "", author: "", category: "Teachings", seoKeywords: "" });
  };


  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-sans">
        <span className="text-sm font-serif italic text-dark-brown/60">Checking Admin Privileges...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-dark-brown flex flex-col md:flex-row font-sans">
      
      {/* ================= ADMIN LEFT SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-maroon text-cream-dark flex-shrink-0 flex flex-col justify-between py-6 px-4 border-b md:border-b-0 md:border-r border-gold/20 shadow-md">
        <div>
          <div className="pb-6 border-b border-gold/15 mb-6 text-center">
            <h1 className="font-serif text-lg font-bold text-gold-glow tracking-wider">
              NKS MISSION
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-cream-dark/60 block mt-0.5">
              Admin Control Center
            </span>
          </div>

          <nav className="space-y-1.5 flex flex-col">
            {[
              { id: "events", label: "Manage Events", icon: <Calendar className="w-4 h-4" /> },
              { id: "campaigns", label: "Seva Campaigns", icon: <HeartHandshake className="w-4 h-4" /> },
              { id: "gallery", label: "Gallery Photos", icon: <ImageIcon className="w-4 h-4" /> },
              { id: "announcements", label: "Notice Board", icon: <Bell className="w-4 h-4" /> },
              { id: "quotes", label: "Daily Quotes", icon: <Quote className="w-4 h-4" /> },
              { id: "blogs", label: "Spiritual Blogs", icon: <BookOpen className="w-4 h-4" /> },
              { id: "registrations", label: "Registrations", icon: <Users className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                  activeTab === tab.id
                    ? "bg-saffron text-white shadow-sm"
                    : "text-cream-dark/80 hover:bg-gold-light/10 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-gold/15 flex flex-col gap-4">
          {/* Seed button */}
          {isFirebaseConfigured && (
            <button
              onClick={handleSeedDatabase}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Seed Mock Data</span>
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-cream-dark/25 hover:bg-white/10 rounded-xl text-xs font-semibold uppercase tracking-widest text-cream-dark transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN DASHBOARD CONTAINER ================= */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* Top bar info */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold/15 pb-4 mb-6 gap-4">
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-maroon uppercase tracking-wide">
              {activeTab} Management
            </h2>
            <p className="text-[10px] text-dark-brown/50 font-bold uppercase mt-0.5">
              System State:{" "}
              <span className={isFirebaseConfigured ? "text-emerald-700 font-extrabold" : "text-amber-800 font-extrabold"}>
                {isFirebaseConfigured ? "Live Firebase Active" : "Running locally in Mock Mode"}
              </span>
            </p>
          </div>

          <button
            onClick={fetchData}
            className="px-4 py-1.5 bg-cream-dark hover:bg-gold-light/45 border border-gold/30 rounded-full text-xs font-bold text-maroon transition-colors"
          >
            Refresh Database
          </button>
        </header>

        {/* Global Feedback notification */}
        {feedback.message && (
          <div className={`p-4 mb-6 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <span className="font-serif text-sm italic text-dark-brown/50">Querying collections...</span>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ================= EVENTS TAB ================= */}
            {activeTab === "events" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    {editingId ? "Edit Satsang Details" : "Add New Satsang Event"}
                  </h3>
                  <form onSubmit={saveEvent} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Title *</label>
                      <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Date *</label>
                        <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Timings *</label>
                        <input type="text" required placeholder="09:00 AM - 02:00 PM" value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Location *</label>
                      <input type="text" required placeholder="Vrindavan Ashram / Delhi Dwarka" value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Organizer Contact *</label>
                        <input type="text" required placeholder="NKS Committee" value={eventForm.organizer} onChange={(e) => setEventForm({...eventForm, organizer: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Venue Type</label>
                        <select value={eventForm.isOnline ? "true" : "false"} onChange={(e) => setEventForm({...eventForm, isOnline: e.target.value === "true"})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs">
                          <option value="false">In-Person (Offline)</option>
                          <option value="true">Virtual (Online)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Banner Image URL</label>
                      <input type="text" placeholder="https://unsplash..." value={eventForm.bannerUrl} onChange={(e) => setEventForm({...eventForm, bannerUrl: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Google Maps Coordinates URL</label>
                      <input type="text" placeholder="https://maps.google..." value={eventForm.googleMapUrl} onChange={(e) => setEventForm({...eventForm, googleMapUrl: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Full Description Outline *</label>
                      <textarea rows="4" required value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs resize-none" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="flex-grow py-2 bg-saffron text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-maroon transition-colors">
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingId ? "Save Changes" : "Publish Event"}</span>
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetEventForm} className="py-2 px-3 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold uppercase">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Table list */}
                <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Published Satsang Calendars ({events.length})
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Satsang Title</th>
                        <th className="py-2.5">Location</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-cream-dark/20">
                          <td className="py-3 font-semibold whitespace-nowrap">{ev.date}</td>
                          <td className="py-3 font-serif font-bold text-maroon line-clamp-1 max-w-[180px]">{ev.title}</td>
                          <td className="py-3 truncate max-w-[120px]" title={ev.location}>{ev.location}</td>
                          <td className="py-3 text-right whitespace-nowrap space-x-1.5">
                            <button onClick={() => editEvent(ev)} className="p-1.5 bg-gold-light/45 text-maroon rounded hover:bg-gold-light/90" title="Edit">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteEvent(ev.id)} className="p-1.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= CAMPAIGNS TAB ================= */}
            {activeTab === "campaigns" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    {editingId ? "Edit Seva Campaign" : "Add Seva Campaign"}
                  </h3>
                  <form onSubmit={saveCampaign} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Campaign Title *</label>
                      <input type="text" required placeholder="e.g. Annadan Food Distribution" value={campaignForm.title} onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Location *</label>
                        <input type="text" required placeholder="Vrindavan Villages" value={campaignForm.location} onChange={(e) => setCampaignForm({...campaignForm, location: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Seva Status</label>
                        <select value={campaignForm.status} onChange={(e) => setCampaignForm({...campaignForm, status: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs">
                          <option value="active">Active Seva</option>
                          <option value="completed">Completed Project</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Banner Image URL</label>
                      <input type="text" value={campaignForm.bannerUrl} onChange={(e) => setCampaignForm({...campaignForm, bannerUrl: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Goal / Purpose (1 line)</label>
                      <input type="text" value={campaignForm.purpose} onChange={(e) => setCampaignForm({...campaignForm, purpose: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Recorded Seva Impact Summary</label>
                      <input type="text" placeholder="e.g. Distributed 5,000 meals weekly" value={campaignForm.impact} onChange={(e) => setCampaignForm({...campaignForm, impact: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">How Volunteers Participate</label>
                      <textarea rows="3" placeholder="Volunteers help pack and cook food..." value={campaignForm.howToParticipate} onChange={(e) => setCampaignForm({...campaignForm, howToParticipate: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Full Campaign Description *</label>
                      <textarea rows="4" required value={campaignForm.description} onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs resize-none" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="flex-grow py-2 bg-saffron text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-maroon transition-colors">
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingId ? "Save Campaign" : "Publish Campaign"}</span>
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetCampaignForm} className="py-2 px-3 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Table list */}
                <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Seva Campaign List ({campaigns.length})
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Location</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {campaigns.map((c) => (
                        <tr key={c.id} className="hover:bg-cream-dark/20">
                          <td className="py-3 font-serif font-bold text-maroon line-clamp-1 max-w-[180px]">{c.title}</td>
                          <td className="py-3">{c.location}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.status === "active" ? "bg-saffron/10 text-saffron" : "bg-stone-100 text-stone-500"}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 text-right whitespace-nowrap space-x-1.5">
                            <button onClick={() => editCampaign(c)} className="p-1.5 bg-gold-light/45 text-maroon rounded hover:bg-gold-light/90">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteCampaign(c.id)} className="p-1.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= GALLERY TAB ================= */}
            {activeTab === "gallery" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Upload Media Item
                  </h3>
                  <form onSubmit={saveGalleryItem} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Title *</label>
                      <input type="text" required placeholder="e.g. Vrindavan Flower Sankirtan" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Category</label>
                        <select value={galleryForm.category} onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs">
                          <option value="Satsang Events">Satsang Events</option>
                          <option value="Charity Activities">Charity Activities</option>
                          <option value="Festivals">Festivals</option>
                          <option value="Campaign Work">Campaign Work</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Media Type</label>
                        <select value={galleryForm.type} onChange={(e) => setGalleryForm({...galleryForm, type: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs">
                          <option value="image">Image Photo</option>
                          <option value="video">Video Embed Link</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">
                        {galleryForm.type === "image" ? "Image Direct URL *" : "YouTube Embed URL *"}
                      </label>
                      <input type="text" required placeholder={galleryForm.type === "image" ? "https://images.unsplash..." : "https://www.youtube.com/embed/..."} value={galleryForm.url} onChange={(e) => setGalleryForm({...galleryForm, url: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-saffron hover:bg-maroon text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Add to Gallery</span>
                    </button>
                  </form>
                </div>

                {/* Listing grid */}
                <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Divine Gallery Items ({gallery.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[450px]">
                    {gallery.map((item) => (
                      <div key={item.id} className="relative rounded-lg overflow-hidden border border-gold/15 aspect-square bg-gold-light/10 group shadow-sm">
                        <img
                          src={item.type === "video" ? `https://img.youtube.com/vi/${item.url.split("/").pop()}/0.jpg` : item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80"; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => deleteGalleryItem(item.id)} className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform transform scale-90 group-hover:scale-100 shadow">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-black/60 px-2 py-1 text-[9px] text-white truncate font-serif">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= ANNOUNCEMENTS TAB ================= */}
            {activeTab === "announcements" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    {editingId ? "Edit Notice Detail" : "Publish Important Notice"}
                  </h3>
                  <form onSubmit={saveAnnouncement} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Notice Title *</label>
                      <input type="text" required placeholder="Satsang Timing Shift" value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Publish Date *</label>
                        <input type="date" required value={announcementForm.date} onChange={(e) => setAnnouncementForm({...announcementForm, date: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Priority Level</label>
                        <select value={announcementForm.priority} onChange={(e) => setAnnouncementForm({...announcementForm, priority: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs">
                          <option value="normal">Normal notice</option>
                          <option value="high">High priority (Urgent glow)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Message Content *</label>
                      <textarea rows="5" required value={announcementForm.message} onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs resize-none" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="flex-grow py-2 bg-saffron text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-maroon transition-colors">
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingId ? "Save Notice" : "Publish Notice"}</span>
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetAnnouncementForm} className="py-2 px-3 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Table list */}
                <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Notice Board Registry ({announcements.length})
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Priority</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {announcements.map((ann) => (
                        <tr key={ann.id} className="hover:bg-cream-dark/20">
                          <td className="py-3 whitespace-nowrap">{ann.date}</td>
                          <td className="py-3 font-serif font-bold text-maroon truncate max-w-[180px]">{ann.title}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${ann.priority === "high" ? "bg-rose-100 text-rose-700" : "bg-stone-100 text-stone-600"}`}>
                              {ann.priority}
                            </span>
                          </td>
                          <td className="py-3 text-right whitespace-nowrap space-x-1.5">
                            <button onClick={() => editAnnouncement(ann)} className="p-1.5 bg-gold-light/45 text-maroon rounded hover:bg-gold-light/90">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteAnnouncement(ann.id)} className="p-1.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= QUOTES TAB ================= */}
            {activeTab === "quotes" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    {editingId ? "Edit Teaching Quote" : "Add Teaching Quote / Shloka"}
                  </h3>
                  <form onSubmit={saveQuote} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Author / Guru *</label>
                      <input type="text" required placeholder="Jagadguru Shri Kripalu Ji Maharaj" value={quoteForm.author} onChange={(e) => setQuoteForm({...quoteForm, author: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Sanskrit / Hindi Shloka Verse</label>
                      <input type="text" placeholder="तस्मादसर्वेषु कालेषु..." value={quoteForm.shloka} onChange={(e) => setQuoteForm({...quoteForm, shloka: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Shloka English/Hindi Translation</label>
                      <input type="text" placeholder="Therefore, at all times remember Me..." value={quoteForm.translation} onChange={(e) => setQuoteForm({...quoteForm, translation: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Teaching Message Content *</label>
                      <textarea rows="4" required value={quoteForm.text} onChange={(e) => setQuoteForm({...quoteForm, text: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs resize-none" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="flex-grow py-2 bg-saffron text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-maroon transition-colors">
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingId ? "Save Quote" : "Publish Quote"}</span>
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetQuoteForm} className="py-2 px-3 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Table list */}
                <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Daily Teachings Repository ({quotes.length})
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Author</th>
                        <th className="py-2.5">Quote Text Snippet</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {quotes.map((q) => (
                        <tr key={q.id} className="hover:bg-cream-dark/20">
                          <td className="py-3 font-semibold whitespace-nowrap">{q.author}</td>
                          <td className="py-3 line-clamp-1 max-w-[240px]" title={q.text}>"{q.text}"</td>
                          <td className="py-3 text-right whitespace-nowrap space-x-1.5">
                            <button onClick={() => editQuote(q)} className="p-1.5 bg-gold-light/45 text-maroon rounded hover:bg-gold-light/90">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteQuote(q.id)} className="p-1.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= BLOGS TAB ================= */}
            {activeTab === "blogs" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    {editingId ? "Edit Spiritual Post" : "Write Spiritual Blog Article"}
                  </h3>
                  <form onSubmit={saveBlog} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Article Title *</label>
                      <input type="text" required placeholder="e.g. The Path of Bhakti Yoga" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Author Name *</label>
                        <input type="text" required placeholder="Shastri Ji" value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Category</label>
                        <select value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs">
                          <option value="Teachings">Teachings</option>
                          <option value="Sadhana">Sadhana</option>
                          <option value="Seva / Charity">Seva / Charity</option>
                          <option value="Festivals">Festivals</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Banner Image URL</label>
                      <input type="text" placeholder="https://unsplash..." value={blogForm.bannerUrl} onChange={(e) => setBlogForm({...blogForm, bannerUrl: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">SEO Keywords (Comma separated)</label>
                      <input type="text" placeholder="bhakti, devotion, kripalu teachings" value={blogForm.seoKeywords} onChange={(e) => setBlogForm({...blogForm, seoKeywords: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Brief Summary / Snippet *</label>
                      <input type="text" required placeholder="A short description summarizing the teaching." value={blogForm.summary} onChange={(e) => setBlogForm({...blogForm, summary: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-brown/60 mb-1">Article Body Content *</label>
                      <textarea rows="7" required value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-cream border border-gold/25 rounded-lg px-3 py-2 text-xs resize-none" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="flex-grow py-2 bg-saffron text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-maroon transition-colors">
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingId ? "Save Article" : "Publish Article"}</span>
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetBlogForm} className="py-2 px-3 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Table list */}
                <div className="lg:col-span-7 bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase">
                    Published Discourses ({blogs.length})
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Author</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-cream-dark/20">
                          <td className="py-3 font-semibold uppercase text-[10px] text-saffron whitespace-nowrap">{b.category}</td>
                          <td className="py-3 font-serif font-bold text-maroon truncate max-w-[200px]">{b.title}</td>
                          <td className="py-3 truncate max-w-[100px]">{b.author}</td>
                          <td className="py-3 text-right whitespace-nowrap space-x-1.5">
                            <button onClick={() => editBlog(b)} className="p-1.5 bg-gold-light/45 text-maroon rounded hover:bg-gold-light/90">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteBlog(b.id)} className="p-1.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= REGISTRATIONS & VOLUNTEERS TAB ================= */}
            {activeTab === "registrations" && (
              <div className="space-y-8">
                
                {/* 1. Event Seat Registrations */}
                <div className="bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-saffron" />
                    <span>Satsang Seat Reservations ({eventRegs.length})</span>
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Event Target</th>
                        <th className="py-2.5">Devotee Name</th>
                        <th className="py-2.5">Mobile</th>
                        <th className="py-2.5">Address</th>
                        <th className="py-2.5 text-center">Seats</th>
                        <th className="py-2.5">Special Requests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5 text-dark-brown/85">
                      {eventRegs.map((reg) => (
                        <tr key={reg.id} className="hover:bg-cream-dark/20 align-top">
                          <td className="py-3 font-serif font-bold text-maroon max-w-[150px] truncate" title={reg.eventName}>{reg.eventName}</td>
                          <td className="py-3 font-semibold">{reg.name}</td>
                          <td className="py-3 whitespace-nowrap">{reg.mobile}</td>
                          <td className="py-3 truncate max-w-[150px]" title={reg.address}>{reg.address}</td>
                          <td className="py-3 text-center font-bold text-saffron">{reg.participantsCount}</td>
                          <td className="py-3 text-dark-brown/70 truncate max-w-[200px]" title={reg.specialRequest || "None"}>
                            {reg.specialRequest || "None"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 2. Volunteer Signups */}
                <div className="bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-saffron" />
                    <span>Volunteer Applications ({volunteers.length})</span>
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Volunteer Name</th>
                        <th className="py-2.5">Seva Area of Interest</th>
                        <th className="py-2.5">Mobile / Email</th>
                        <th className="py-2.5">City & Address</th>
                        <th className="py-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5 text-dark-brown/85 font-sans">
                      {volunteers.map((v) => (
                        <tr key={v.id} className="hover:bg-cream-dark/20 align-top">
                          <td className="py-3 font-semibold">{v.name}</td>
                          <td className="py-3 text-saffron font-bold font-serif">{v.interestArea}</td>
                          <td className="py-3">
                            <span className="block font-semibold">{v.mobile}</span>
                            <span className="text-[10px] text-dark-brown/65">{v.email}</span>
                          </td>
                          <td className="py-3 max-w-[150px] truncate" title={v.address}>
                            <span className="block font-semibold">{v.city}</span>
                            <span className="text-[10px] text-dark-brown/60">{v.address}</span>
                          </td>
                          <td className="py-3 text-dark-brown/70 max-w-[200px] truncate" title={v.message || "None"}>
                            {v.message || "None"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 3. Contact Form Submissions */}
                <div className="bg-white/70 border border-gold/15 p-5 rounded-2xl shadow-sm overflow-x-auto">
                  <h3 className="font-serif text-sm font-bold text-maroon mb-4 pb-2 border-b border-gold/10 uppercase flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-saffron" />
                    <span>Contact Form Queries ({contacts.length})</span>
                  </h3>
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-gold/15 text-dark-brown/50">
                        <th className="py-2.5">Sender</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Subject</th>
                        <th className="py-2.5">Message Query</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5 text-dark-brown/85 font-sans">
                      {contacts.map((con) => (
                        <tr key={con.id} className="hover:bg-cream-dark/20 align-top">
                          <td className="py-3 font-semibold">{con.name}</td>
                          <td className="py-3">{con.email}</td>
                          <td className="py-3 font-bold text-maroon">{con.subject}</td>
                          <td className="py-3 text-dark-brown/70 max-w-[300px] truncate" title={con.message}>
                            {con.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
