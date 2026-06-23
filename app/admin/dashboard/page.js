"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, HeartHandshake, Image as ImageIcon, Bell, Quote, BookOpen, 
  Users, Mail, ShieldAlert, Sparkles, PlusCircle, ArrowUpRight, CheckCircle 
} from "lucide-react";
import * as db from "../../../lib/db";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    events: 0,
    campaigns: 0,
    gallery: 0,
    announcements: 0,
    quotes: 0,
    blogs: 0,
    volunteers: 0,
    registrations: 0,
    contacts: 0,
    unreadContacts: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [
          evs, camps, gal, anns, qts, blgs, vols, regs, cons
        ] = await Promise.all([
          db.getEvents(),
          db.getCampaigns(),
          db.getGalleryItems(),
          db.getAnnouncements(),
          db.getQuotes(),
          db.getBlogs(),
          db.getVolunteerRegistrations(),
          db.getEventRegistrations(),
          db.getContactSubmissions()
        ]);

        const unread = cons.filter(c => c.status === "new").length;

        setStats({
          events: evs.length,
          campaigns: camps.length,
          gallery: gal.length,
          announcements: anns.length,
          quotes: qts.length,
          blogs: blgs.length,
          volunteers: vols.length,
          registrations: regs.length,
          contacts: cons.length,
          unreadContacts: unread
        });

        // Aggregate recent submissions
        const allSubs = [];

        if (vols && Array.isArray(vols)) {
          vols.forEach(v => {
            allSubs.push({
              id: v.id || `vol-${v.createdAt}`,
              type: "Volunteer",
              name: v.name || "Anonymous",
              details: v.interestArea || "General Seva",
              contact: v.email || v.mobile || "N/A",
              date: v.createdAt,
              link: "/admin/volunteers",
              badgeColor: "bg-maroon/10 text-maroon border-maroon/20"
            });
          });
        }

        if (regs && Array.isArray(regs)) {
          regs.forEach(r => {
            allSubs.push({
              id: r.id || `reg-${r.createdAt}`,
              type: "Event Booking",
              name: r.name || "Anonymous",
              details: `${r.eventName || "Satsang"} (${r.participantsCount || 1} seats)`,
              contact: r.email || r.mobile || "N/A",
              date: r.createdAt,
              link: "/admin/event-registrations",
              badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
            });
          });
        }

        if (cons && Array.isArray(cons)) {
          cons.forEach(c => {
            allSubs.push({
              id: c.id || `con-${c.createdAt}`,
              type: "Contact Enquiry",
              name: c.name || "Anonymous",
              details: c.message ? (c.message.length > 55 ? c.message.substring(0, 55) + "..." : c.message) : "New enquiry message",
              contact: c.email || "N/A",
              date: c.createdAt,
              link: "/admin/contact-messages",
              badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
            });
          });
        }

        // Sort by date descending
        allSubs.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });

        setRecentSubmissions(allSubs.slice(0, 5));

      } catch (err) {
        console.error("Dashboard stats loading failed:", err);
        setFeedback({ type: "error", message: "Failed to sync latest stats. Using cache/mock data." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      await db.seedMockDataToFirebase();
      setFeedback({ type: "success", message: "Firebase database seeded successfully! Refreshing page..." });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: err.message || "Failed to seed database." });
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: "Upcoming Events", count: stats.events, icon: <Calendar className="w-5 h-5 text-saffron" />, href: "/admin/events", color: "border-saffron/20", desc: "Satsang & retreats scheduled" },
    { title: "Seva Campaigns", count: stats.campaigns, icon: <HeartHandshake className="w-5 h-5 text-saffron" />, href: "/admin/seva", color: "border-gold/20", desc: "Donations & outreach programs" },
    { title: "Volunteer Requests", count: stats.volunteers, icon: <Users className="w-5 h-5 text-maroon" />, href: "/admin/volunteers", color: "border-maroon/20", desc: "Registered sevadars" },
    { title: "Seat Bookings", count: stats.registrations, icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, href: "/admin/event-registrations", color: "border-emerald-600/20", desc: "Confirmed event bookings" },
    { title: "Pending Enquiries", count: stats.unreadContacts, icon: <Mail className="w-5 h-5 text-amber-500" />, href: "/admin/contact-messages", color: "border-amber-500/20", desc: "New visitor messages", alert: stats.unreadContacts > 0 },
    { title: "Notice Board", count: stats.announcements, icon: <Bell className="w-5 h-5 text-purple-600" />, href: "/admin/announcements", color: "border-purple-600/20", desc: "Flashing homepage notices" },
    { title: "Spiritual Blogs", count: stats.blogs, icon: <BookOpen className="w-5 h-5 text-indigo-600" />, href: "/admin/blogs", color: "border-indigo-600/20", desc: "Discourses & articles" },
    { title: "Daily Quotes", count: stats.quotes, icon: <Quote className="w-5 h-5 text-pink-600" />, href: "/admin/quotes", color: "border-pink-600/20", desc: "Wisdom of Guru Ji" }
  ];

  const quickActions = [
    { title: "Create New Event", href: "/admin/events", action: "Add new spiritual retreat, satsang or kirtan gathering." },
    { title: "New Seva Campaign", href: "/admin/seva", action: "Launch a donation drive or food distribution work." },
    { title: "Upload Photos/Videos", href: "/admin/gallery", action: "Add holy images or Youtube links of Guru Ji." },
    { title: "Post Announcement", href: "/admin/announcements", action: "Display a flashing notice or urgent message on home page." },
    { title: "Write Blog Article", href: "/admin/blogs", action: "Publish a transcript of discourses or spiritual teachings." },
    { title: "Update Site Contact Info", href: "/admin/site-settings", action: "Modify phone numbers, social media links, or email addresses." }
  ];

  return (
    <div className="space-y-8 animate-fade-up font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-maroon">
            Dashboard Summary
          </h2>
          <p className="text-xs text-dark-brown/70 mt-1">
            Overview of the Neelmani Kripalu Satsang administrative operations.
          </p>
        </div>

        <button
          onClick={handleSeedDatabase}
          disabled={isLoading}
          className="px-4 py-2 bg-saffron hover:bg-maroon text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Seed Firebase Data</span>
        </button>
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

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="dashboard-stats-grid">
            {statCards.map((card, i) => (
              <Link 
                key={i} 
                href={card.href}
                className={`dashboard-stats-card ${card.color}`}
              >
                <div className="card-icon-container bg-cream-dark/30">
                  {card.icon}
                </div>
                <div className="card-info">
                  <div className="card-count-wrapper">
                    <span className="card-count">
                      {card.count}
                    </span>
                    <span className="card-manage">
                      Manage <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <h4 className="card-title">
                    {card.title}
                  </h4>
                  {card.desc && (
                    <p className="card-desc">
                      {card.desc}
                    </p>
                  )}
                </div>
                {card.alert && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                )}
              </Link>
            ))}
          </div>

          {/* Recent Submissions Section */}
          <div className="bg-white/80 border border-gold/15 rounded-2xl shadow-sm overflow-hidden pt-5 pb-2">
            <div className="px-5 pb-4 border-b border-gold/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
                  <Users className="w-5 h-5 text-saffron" />
                  <span>Recent Submissions &amp; Activities</span>
                </h3>
                <p className="text-[10px] text-dark-brown/60 mt-0.5">
                  Latest form responses, registrations, and inquiries from site visitors.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-cream-dark/20 text-[10px] uppercase font-bold tracking-wider text-dark-brown/65 border-b border-gold/10">
                    <th className="py-3 px-5">Type</th>
                    <th className="py-3 px-5">Submitter</th>
                    <th className="py-3 px-5">Contact Details</th>
                    <th className="py-3 px-5">Activity Details</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5 text-xs text-dark-brown/85">
                  {recentSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-dark-brown/50 italic">
                        No submissions received yet.
                      </td>
                    </tr>
                  ) : (
                    recentSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-cream/40 transition-colors">
                        <td className="py-3 px-5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${sub.badgeColor}`}>
                            {sub.type}
                          </span>
                        </td>
                        <td className="py-3 px-5 font-bold whitespace-nowrap text-maroon">
                          {sub.name}
                        </td>
                        <td className="py-3 px-5 whitespace-nowrap">
                          {sub.contact}
                        </td>
                        <td className="py-3 px-5 max-w-[200px] truncate">
                          {sub.details}
                        </td>
                        <td className="py-3 px-5 whitespace-nowrap text-dark-brown/60 text-[11px]">
                          {formatDate(sub.date)}
                        </td>
                        <td className="py-3 px-5 text-right whitespace-nowrap">
                          <Link
                            href={sub.link}
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold text-saffron hover:text-maroon transition-colors"
                          >
                            <span>View All</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Seeding Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Quick Actions grid */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-serif text-base font-bold text-maroon flex items-center gap-1.5">
                <PlusCircle className="w-5 h-5 text-saffron" />
                <span>Quick Actions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="bg-white/50 border border-gold/15 p-4 rounded-2xl hover:border-saffron/40 hover:bg-white/80 transition-all duration-300 text-left flex flex-col justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-maroon group-hover:text-saffron transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-[11px] text-dark-brown/70 leading-relaxed mt-1 font-sans">
                        {action.action}
                      </p>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-saffron mt-3 inline-flex items-center gap-0.5 self-start">
                      Open Form <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Helper Seeding Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-maroon/5 via-[#FCFAF6] to-[#FAF2DF] border border-gold/20 p-5 rounded-3xl relative shadow-inner text-left flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-maroon/5 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-saffron animate-pulse" />
                </div>
                <h4 className="font-serif text-sm font-bold text-maroon uppercase tracking-wider">
                  Database Seeder Utility
                </h4>
                <p className="text-[11px] text-dark-brown/85 leading-relaxed font-sans">
                  Use the seeder to automatically copy default branding details, sample events, active campaigns, daily quotes, and holy videos to your Firestore database.
                </p>
                <p className="text-[10px] text-maroon font-serif italic">
                  *Note: Seeding only writes to collections that are currently empty. It will not overwrite your existing custom items.
                </p>
              </div>
              <button
                onClick={handleSeedDatabase}
                disabled={isLoading}
                className="mt-6 w-full py-2.5 bg-maroon hover:bg-saffron text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Run Data Seeder</span>
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
