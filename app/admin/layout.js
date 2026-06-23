"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isFirebaseConfigured, auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { 
  LayoutDashboard, Calendar, HeartHandshake, Image as ImageIcon, 
  Bell, Quote, BookOpen, UserCheck, ShieldAlert, LogOut, Menu, X,
  Compass, Settings, Landmark, Mail, Users, Video
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authError, setAuthError] = useState(null); // Added state to pause on error

  // Exclude auth-related routes from layout wrapping
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/setup";

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      router.push("/admin/login");
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      setCurrentUser({ uid: user.uid, email: user.email });
      setIsAdmin(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router, isAuthPage]);

  const handleSignOut = async () => {
    localStorage.removeItem("admin_auth");
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    router.push("/admin/login");
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (authError) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-maroon uppercase">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // Sidebar Links config
  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Events", href: "/admin/events", icon: <Calendar className="w-4 h-4" /> },
    { name: "Seva Campaigns", href: "/admin/seva", icon: <HeartHandshake className="w-4 h-4" /> },
    { name: "Guru Ji Gallery", href: "/admin/gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { name: "YouTube Videos", href: "/admin/guru-videos", icon: <Video className="w-4 h-4" /> },
    { name: "Announcements", href: "/admin/announcements", icon: <Bell className="w-4 h-4" /> },
    { name: "Daily Quotes", href: "/admin/quotes", icon: <Quote className="w-4 h-4" /> },
    { name: "Teachings & Blogs", href: "/admin/blogs", icon: <BookOpen className="w-4 h-4" /> },
    { name: "About Content", href: "/admin/about", icon: <Compass className="w-4 h-4" /> },
    { name: "Site Settings", href: "/admin/site-settings", icon: <Settings className="w-4 h-4" /> },
    { name: "Donation Info", href: "/admin/donation-info", icon: <Landmark className="w-4 h-4" /> },
    { name: "Volunteers", href: "/admin/volunteers", icon: <Users className="w-4 h-4" /> },
    { name: "Event Seats", href: "/admin/event-registrations", icon: <UserCheck className="w-4 h-4" /> },
    { name: "Contact Enquiries", href: "/admin/contact-messages", icon: <Mail className="w-4 h-4" /> }
  ];

  const visibleItems = navItems;

  return (
    <div className="min-h-screen bg-mandala-pattern bg-cream flex flex-col md:flex-row text-dark-brown font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white/80 border-r border-gold/25 backdrop-blur-md relative z-20 flex-shrink-0">
        {/* Branding header */}
        <div className="p-5 border-b border-gold/15 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-sm font-bold text-maroon tracking-wider">
              NKS Admin Center
            </h1>
            <span className="text-[9px] text-saffron uppercase font-bold tracking-widest block mt-0.5">
              Control Panel
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-maroon text-white shadow-sm"
                    : "text-dark-brown/75 hover:bg-gold-light/20 hover:text-maroon"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gold/15 bg-cream-dark/25">
          <div className="flex flex-col gap-1 mb-3">
            <span className="text-[10px] uppercase font-bold text-dark-brown/50 tracking-wider">Logged in as</span>
            <span className="text-xs font-semibold text-dark-brown truncate" title={currentUser?.email}>
              {currentUser?.email}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white/90 border-b border-gold/25 backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="font-serif text-sm font-black text-maroon tracking-wider">
            NKS Admin
          </h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-maroon hover:bg-gold-light/35 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[49px] bg-black/40 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-64 max-h-[85vh] bg-white border-b border-gold/20 flex flex-col justify-between py-4 shadow-xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="px-3 space-y-1 overflow-y-auto">
              {visibleItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-maroon text-white shadow-sm"
                        : "text-dark-brown/75 hover:bg-gold-light/20 hover:text-maroon"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mx-3 mt-4 pt-4 border-t border-gold/15">
              <div className="flex flex-col gap-0.5 mb-3 px-4">
                <span className="text-[9px] uppercase font-bold text-dark-brown/50">Logged In:</span>
                <span className="text-[11px] font-semibold text-dark-brown truncate">{currentUser?.email}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content body */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10 max-w-full">
        {children}
      </main>
    </div>
  );
}
