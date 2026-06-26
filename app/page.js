import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import HomeHero from "../components/HomeHero";
import GuruGallery from "../components/GuruGallery";
import VideoSection from "../components/VideoSection";
import QuoteSection from "../components/QuoteSection";
import Footer from "../components/Footer";
import EventHighlight from "../components/EventHighlight";
import CampaignCard from "../components/CampaignCard";
import SectionHeading from "../components/SectionHeading";
import AnnouncementCard from "../components/AnnouncementCard";
import { 
  getQuotes, 
  getEvents, 
  getCampaigns, 
  getGalleryItems, 
  getAnnouncements,
  getGuruJiVideos,
  getGuruJiImages,
  getAboutContent,
  getSiteSettings
} from "../lib/db";
import { Flame, HeartHandshake, Compass, Users, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";

export default async function HomePage() {
  // Fetch dynamic content on the server (handles Firestore or Mock fallbacks)
  const quotes = await getQuotes();
  const events = await getEvents();
  const campaigns = await getCampaigns();
  const announcements = await getAnnouncements();
  const videos = await getGuruJiVideos();
  const guruJiImages = await getGuruJiImages();
  const aboutContent = await getAboutContent();
  const siteSettings = await getSiteSettings();

  // Get active campaigns (Slice to 3 instead of 2)
  const activeCampaigns = campaigns.filter(c => c.status === "active").slice(0, 3);
  
  // Get latest announcements
  const latestAnnouncements = announcements.slice(0, 3);

  // Get published videos
  const publishedVideos = videos.filter(v => v.status === "published" || !v.status);

  // Get published Guru Ji Images
  const publishedImages = (guruJiImages || []).filter(img => img.status === "published" || !img.status);

  // Get latest quote
  const latestQuote = quotes[0] || {
    text: "Surrender your mind to the Lotus feet of Radha Krishna. Selfless devotion and service are the pathways to supreme bliss.",
    author: "Jagadguru Shri Kripalu Ji Maharaj"
  };

  const whyWeExist = [
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Spiritual Growth",
      desc: "Practice Roopdhyana meditation and understand profound scriptural philosophy under Guru guidance to elevate your inner consciousness."
    },
    {
      icon: <Flame className="w-6 h-6" />,
      title: "Devotional Sankirtan",
      desc: "Purify your thoughts through melodious, congregational chanting (Kirtan) of divine names composed by Kripalu Ji Maharaj."
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Selfless Seva",
      desc: "Eradicate subtle pride by actively engaging in physical service like food distribution, shrine upkeep, and rural teaching camps."
    }
  ];

  const testimonials = [
    {
      name: "Raman Kumar",
      role: "Satsangi, New Delhi",
      story: "The devotional sankirtan and Roopdhyana meditation taught here completely transformed my stressful corporate life. Chanting has filled my home with peace."
    },
    {
      name: "Radhika Devi",
      role: "Seva Volunteer, Vrindavan",
      story: "Participating in the Annadan Food Seva gave me true joy that wealth never could. Serving hot sanctified meals to sadhus is like serving the Lord directly."
    }
  ];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern">
        
        {/* ================= 1. HOME HERO SECTION ================= */}
        <HomeHero settings={siteSettings} />

        {/* ================= 2. GURU JI PHOTO GALLERY SECTION ================= */}
        <GuruGallery initialImages={publishedImages} />

        {/* ================= 3. YOUTUBE VIDEO SECTION ================= */}
        <VideoSection videos={publishedVideos} />

        {/* ================= 4. QUOTE SECTION ================= */}
        <QuoteSection quote={latestQuote} />

        {/* ================= ABOUT OUR SATSANG SECTION ================= */}
        <section className="py-20 bg-gradient-to-br from-saffron/10 via-cream-dark/50 to-saffron/5 border-t border-b border-gold/15 relative overflow-hidden">
          
          {/* Subtle backdrops */}
          <div className="absolute right-[-10%] top-[-10%] w-80 h-80 text-gold/5 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="50" cy="50" r="45" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Handcrafted Devotional Image Frame */}
              <div className="lg:col-span-5 flex justify-center items-center relative animate-fade-up">
                
                {/* SVG Mandalas behind image */}
                <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] text-gold/10 pointer-events-none select-none z-0">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full animate-mandala-spin">
                    <circle cx="50" cy="50" r="45" strokeDasharray="2 2" />
                    <circle cx="50" cy="50" r="35" />
                  </svg>
                </div>

                {/* Saffron Glow Background */}
                <div className="absolute w-64 h-64 rounded-full bg-saffron/15 blur-[40px] pointer-events-none z-0" />
                
                {/* Beautiful Gold/Saffron Border Frame */}
                <div className="relative z-10 w-64 sm:w-72 bg-gradient-to-br from-white to-cream-dark border-2 border-gold/45 rounded-3xl p-3.5 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group">
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] relative bg-gold-light/25 border border-gold/10 p-0.5">
                    <img
                      src={aboutContent?.guruJiImageUrl || "/images/WhatsApp Image 2026-06-18 at 11.36.27 (1).jpeg"}
                      alt="Guru Ji guidance and satsang"
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon/20 to-transparent pointer-events-none" />
                  </div>
                  {/* Decorative diya-like dots */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-saffron" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron" />
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-saffron" />
                  <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron" />
                </div>
              </div>

              {/* Right Column: Narrative Content */}
              <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start animate-fade-up delay-200">
                
                {/* Saffron Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-saffron/10 border border-saffron/20 rounded-full text-xs font-bold font-serif uppercase tracking-widest text-saffron">
                  <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
                  <span>About Our Satsang</span>
                </div>

                {/* Section Heading */}
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-maroon text-saffron-glow leading-snug">
                  {aboutContent?.heroTitle || "Spiritual Haven for Love, Devotion, and Selfless Service"}
                </h2>

                {/* Paragraph */}
                <p className="text-sm sm:text-base text-dark-brown/90 leading-relaxed font-sans">
                  {aboutContent?.guruJiIntro || "Under the supreme spiritual lineage of Jagadguru Shri Kripalu Ji Maharaj, Neelmani Kripalu Satsang is a sacred sanctuary where thirsty souls gather to drink the nectar of pure devotion (Bhakti Yoga). We walk the path of scriptural wisdom, guiding seekers in practical Roopdhyana meditation and active sankirtan chanting to cleanse the mind and awaken the spirit."}
                </p>

                {/* Three feature points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
                  
                  {/* Feature 1 */}
                  <div className="bg-white/80 border border-gold/15 p-4 rounded-xl shadow-inner relative hover:border-saffron/40 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center mb-2">
                      <Flame className="w-4 h-4 text-saffron" />
                    </div>
                    <h4 className="font-serif text-xs font-black text-maroon uppercase tracking-wider mb-1">Daily Satsang</h4>
                    <p className="text-[11px] text-dark-brown/75 leading-normal">Deep Roopdhyana contemplation & group sankirtan.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white/80 border border-gold/15 p-4 rounded-xl shadow-inner relative hover:border-saffron/40 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center mb-2">
                      <Compass className="w-4 h-4 text-saffron" />
                    </div>
                    <h4 className="font-serif text-xs font-black text-maroon uppercase tracking-wider mb-1">Guru Guidance</h4>
                    <p className="text-[11px] text-dark-brown/75 leading-normal">Deep scriptural wisdom of Vedanta & Bhakti literature.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white/80 border border-gold/15 p-4 rounded-xl shadow-inner relative hover:border-saffron/40 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center mb-2">
                      <HeartHandshake className="w-4 h-4 text-saffron" />
                    </div>
                    <h4 className="font-serif text-xs font-black text-maroon uppercase tracking-wider mb-1">Seva & Sanskar</h4>
                    <p className="text-[11px] text-dark-brown/75 leading-normal">Selfless community feeding & youth values education.</p>
                  </div>

                </div>

                {/* Read More button */}
                <div className="pt-2">
                  <Link
                    href="/about"
                    className="px-7 py-3 bg-saffron text-white rounded-full text-xs font-bold font-serif tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-1.5 btn-water-saffron-maroon"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 relative z-10" />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= PILLARS OF DEVOTION ================= */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Pillars of Devotion" subtitle="WHY THIS MISSION" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyWeExist.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/70 border border-gold/15 p-6 rounded-2xl text-center shadow-sm relative group hover:border-saffron/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-saffron group-hover:text-white transition-colors duration-300 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-maroon mb-2">{item.title}</h3>
                  <p className="text-sm text-dark-brown/75 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= UPCOMING EVENT HIGHLIGHT ================= */}
        <section id="upcoming-satsang" className="py-20 bg-white/40 border-t border-b border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Join the Gathering" subtitle="UPCOMING SATSANG HIGHLIGHT" />
            <EventHighlight events={events} />
          </div>
        </section>

        {/* ================= DEVOTEE STORIES / TESTIMONIALS ================= */}
        <section className="py-20 bg-saffron-warm-gradient border-t border-b border-gold/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Devotional Experiences" subtitle="TESTIMONIALS" />
            
            <p className="text-center text-sm md:text-base text-dark-brown/75 leading-relaxed font-sans max-w-2xl mx-auto mb-12">
              Read the heartfelt stories of transformations, peace, and divine connectivity from our global family of satsang devotees and volunteers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="devotional-card p-6 sm:p-8 rounded-2xl relative shadow-md overflow-hidden group border border-saffron/20"
                >
                  {/* Quote icon watermark in corner */}
                  <div className="absolute right-4 top-4 text-gold/10 group-hover:text-saffron/10 transition-colors duration-300 pointer-events-none select-none">
                    <svg className="w-16 h-16 fill-current" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-10 h-10 bg-saffron/15 text-maroon rounded-full flex items-center justify-center flex-shrink-0 border border-saffron/25">
                      <Users className="w-5 h-5 text-saffron" />
                    </div>
                    <div className="space-y-4">
                      <p className="italic text-sm text-dark-brown/90 leading-relaxed font-sans">
                        "{t.story}"
                      </p>
                      
                      <div className="pt-2 border-t border-gold/10">
                        <h4 className="font-serif text-xs font-black uppercase tracking-wider text-maroon">{t.name}</h4>
                        <span className="text-[10px] text-saffron font-bold tracking-wide block">{t.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner floral diya anchor */}
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-gold/45" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LATEST SEVA / CAMPAIGNS ================= */}
        <section className="py-20 bg-white/40 border-t border-b border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div className="flex-1">
                <SectionHeading title="Holy Seva Campaigns" subtitle="LATEST CAMPAIGNS" centered={false} />
              </div>
              <div className="mb-10 md:mb-4 flex-shrink-0">
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-1 text-xs font-bold tracking-widest text-maroon hover:text-saffron transition-colors font-serif border-b border-maroon hover:border-saffron pb-0.5 uppercase"
                >
                  <span>Explore Campaigns</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            
            {/* Shows 3 cards dynamically on desktop, 2 on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCampaigns.map((camp) => (
                <CampaignCard key={camp.id} campaign={camp} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= LATEST ANNOUNCEMENTS ================= */}
        <section className="py-20 bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div className="flex-1 text-center sm:text-left">
                <SectionHeading title="Important Notices" subtitle="LATEST UPDATES" centered={false} />
              </div>
              <div className="mb-10 sm:mb-4 flex-shrink-0 text-center">
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-1 text-xs font-bold tracking-widest text-maroon hover:text-saffron transition-colors font-serif border-b border-maroon hover:border-saffron pb-0.5 uppercase"
                >
                  <span>Notice Board</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {latestAnnouncements.map((ann) => (
                <AnnouncementCard key={ann.id} announcement={ann} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= VOLUNTEER CTA ================= */}
        <section className="py-24 bg-gradient-to-br from-maroon-dark via-maroon to-maroon text-cream-dark relative overflow-hidden border-t border-b border-gold/30 animate-fade-up">
          
          {/* Subtle static mandala backdrop */}
          <div className="absolute right-[-10%] top-[-20%] w-96 h-96 text-gold/5 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="50" cy="50" r="45" />
              <line x1="50" y1="5" x2="50" y2="95" />
              <line x1="5" y1="50" x2="95" y2="50" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <Sparkles className="w-8 h-8 text-gold mx-auto animate-pulse" />
            
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-gold-glow">
              Will You Offer Your Hands in Holy Seva?
            </h2>
            
            <p className="max-w-2xl mx-auto text-sm md:text-base text-cream-dark/85 leading-relaxed font-sans">
              Every small service brings purity and spiritual cleansing. Join our community in Delhi-NCR or Vrindavan in food preparation, value teachings, temple upkeep, or event coordination.
            </p>
            
            <div className="pt-4">
              <Link
                href="/join"
                className="px-8 py-3.5 bg-saffron hover:bg-gold hover:text-maroon text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md inline-flex items-center gap-1.5"
              >
                <span>Become a Volunteer</span>
                <HeartHandshake className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
