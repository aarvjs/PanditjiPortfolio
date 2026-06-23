"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SectionHeading from "../../components/SectionHeading";
import { 
  Compass, 
  Eye, 
  Heart, 
  Award, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  BookMarked
} from "lucide-react";

// Easily editable data block (dynamic-ready)
const aboutData = {
  hero: {
    badge: "About Guru Ji",
    heading: "Guiding Devotees Through Bhakti, Seva and Satsang",
    paragraph: "Under the divine shade of Jagadguru Shri Kripalu Ji Maharaj, Neelmani Kripalu Satsang serves as a spiritual sanctuary. We guide devotees on the path of selfless love (Bhakti Yoga), Roopdhyana meditation, and compassionate community service to cleanse the mind and discover supreme bliss.",
    imagePath: "/images/WhatsApp Image 2026-06-18 at 11.36.27 (1).jpeg"
  },
  satsangDetails: {
    title: "About Neelmani Kripalu Satsang",
    subtitle: "OUR FAITH & ASHRAMS",
    description1: "Neelmani Kripalu Satsang was established to carry forward the sweet teachings of Jagadguru Shri Kripalu Ji Maharaj. We believe that true spirituality is not about mechanical rites, but rather about emotional purification and connecting the mind directly to the Lotus feet of Radha Krishna.",
    description2: "We gather weekly in community circles in New Delhi and Gurgaon, and manage a dedicated volunteer Seva Ashram in the holy town of Vrindavan. Devotees participate in melodious, heart-stirring sankirtans, read and reflect on sacred shastras, and offer their physical labor (seva) to support rural development projects."
  },
  guruIntro: {
    title: "Guru Ji Introduction",
    subtitle: "DIVINE INSPIRATION",
    text1: "Jagadguru Shri Kripalu Ji Maharaj (1922-2013) was acclaimed by Kashi Vidvat Parishat as the 5th original Jagadguru of this era. His command over Sanskrit scriptures, including Vedas, Upanishads, and Brahma Sutras, was completely unprecedented.",
    text2: "He synthesized all ancient philosophical paths—Dvaita, Advaita, and Vishishtadvaita—under the single banner of Prema Bhakti (Loving Devotion). Maharaj Ji composed thousands of devotional songs (sankirtans), explaining deep philosophical principles in sweet, simple words that enable everyone to experience divine love."
  },
  qualifications: [
    {
      id: "q1",
      icon: <GraduationCap className="w-4 h-4 text-maroon" />,
      title: "Ph.D. in Sanskrit",
      desc: "Spiritual Studies credential.",
      bgClass: "bg-[#FCFAF6] border-[#D4AF37]/45" // Ivory with gold border
    },
    {
      id: "q2",
      icon: <BookMarked className="w-4 h-4 text-maroon" />,
      title: "Shastra & Vedanta",
      desc: "Deep scriptural command.",
      bgClass: "bg-[#F0F6EB] border-[#7A1C1C]/25" // Soft temple green with maroon border
    },
    {
      id: "q3",
      icon: <Calendar className="w-4 h-4 text-maroon" />,
      title: "Pravachan Experience",
      desc: "Decades of guide & pravachan.",
      bgClass: "bg-[#FAF2DF] border-[#D4AF37]/50" // Warm beige with gold-accent border
    },
    {
      id: "q4",
      icon: <Award className="w-4 h-4 text-maroon" />,
      title: "Mentor & Seva Guide",
      desc: "Social seva & devotee guide.",
      bgClass: "bg-[#FDF6F0] border-saffron/25" // Warm rose-beige with soft saffron border
    }
  ],
  missionVision: {
    mission: {
      title: "Our Sacred Mission",
      desc: "To spread the divine philosophy of Raganuga Bhakti as expounded by Shri Kripalu Ji Maharaj, helping individuals integrate silent contemplation (Roopdhyana) and chanting into their daily lives to attain peace and pure love."
    },
    vision: {
      title: "Our Spiritual Vision",
      desc: "To cultivate a global community of selfless volunteers who serve the Divine through humanity—feeding sadhus, teaching rural children, and preserving the sanctity of holy places like Vrindavan."
    }
  },
  philosophy: {
    title: "Spiritual Philosophy",
    subtitle: "THE PATH OF BHAKTI",
    summary: "At Neelmani Kripalu Satsang, we follow a simple yet deep approach to spiritual life based on the reconciliations of Jagadguru Shri Kripalu Ji Maharaj.",
    points: [
      {
        title: "Roopdhyana Meditation",
        desc: "Visualizing the sweet, loving form of Radha Krishna with the mind during chanting. Because the mind is the seat of attachment, mental remembrance is the primary purifier."
      },
      {
        title: "Melodious Sankirtan",
        desc: "Congregational singing of divine names and pastimes. The sound vibration helps quiet worldly desires and opens the heart to spiritual bliss."
      },
      {
        title: "Selfless Service (Seva)",
        desc: "Engaging the body in physical service without greed for fame or money. Seva erases the ego, making the mind a clean vessel for devotion."
      }
    ]
  },
  sevaActivities: [
    {
      title: "Annadan Seva (Food Distribution)",
      desc: "Distributing nutritious, freshly cooked meals (Prasadam) daily to sadhus, pilgrims, and low-income families in Vrindavan ashrams.",
      location: "Vrindavan Dham"
    },
    {
      title: "Gyan-Daan (Ethics Education)",
      desc: "Hosting weekend morality, traditional chanting, and basic values education camps for underprivileged village kids.",
      location: "Delhi-NCR & Villages"
    },
    {
      title: "Dham Upkeep (Temple Seva)",
      desc: "Cleaning, gardening, and floral decoration drives at local shrines and community satsang centers.",
      location: "All Satsang Branches"
    }
  ],
  committee: [
    { name: "Shri Ram Prasad Shastri", role: "Spiritual Mentor & Head Priest", branch: "Delhi Center" },
    { name: "Smt. Radhika Devi", role: "Seva Coordinator & Secretary", branch: "Vrindavan Ashram" },
    { name: "Shri Raman Kumar", role: "Satsang Committee President", branch: "Dwarka Center" }
  ]
};

import { getAboutContent } from "../../lib/db";

export default function AboutPage() {
  const breadcrumbs = [{ name: "About Us", path: "" }];
  const [dynamicAbout, setDynamicAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAboutContent();
        if (data && Object.keys(data).length > 0) {
          setDynamicAbout(data);
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
      }
    };
    fetchAbout();
  }, []);

  const activeAbout = {
    hero: {
      badge: dynamicAbout?.heroSubtitle || aboutData.hero.badge,
      heading: dynamicAbout?.heroTitle || aboutData.hero.heading,
      paragraph: dynamicAbout?.guruJiIntro || aboutData.hero.paragraph,
      imagePath: dynamicAbout?.guruJiImageUrl || aboutData.hero.imagePath
    },
    satsangDetails: aboutData.satsangDetails,
    guruIntro: {
      title: aboutData.guruIntro.title,
      subtitle: aboutData.guruIntro.subtitle,
      text1: dynamicAbout?.guruJiIntro ? `${dynamicAbout.guruJiName || "Jagadguru Shri Kripalu Ji Maharaj"}: ${dynamicAbout.guruJiIntro.slice(0, 200)}...` : aboutData.guruIntro.text1,
      text2: dynamicAbout?.philosophy || aboutData.guruIntro.text2
    },
    qualifications: [
      {
        ...aboutData.qualifications[0],
        desc: dynamicAbout?.qualifications || aboutData.qualifications[0].desc
      },
      aboutData.qualifications[1],
      aboutData.qualifications[2],
      aboutData.qualifications[3]
    ],
    missionVision: {
      mission: {
        title: aboutData.missionVision.mission.title,
        desc: dynamicAbout?.mission || aboutData.missionVision.mission.desc
      },
      vision: {
        title: aboutData.missionVision.vision.title,
        desc: dynamicAbout?.vision || aboutData.missionVision.vision.desc
      }
    },
    philosophy: {
      title: aboutData.philosophy.title,
      subtitle: aboutData.philosophy.subtitle,
      summary: dynamicAbout?.philosophy || aboutData.philosophy.summary,
      points: aboutData.philosophy.points
    },
    sevaActivities: aboutData.sevaActivities,
    committee: aboutData.committee
  };

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        
        {/* ================= 1. COMPACT ABOUT HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FCFAF6] via-[#FAF2DF] to-[#F0F6EB] border-b border-gold/25 pt-28 pb-14 md:pt-32 md:pb-16 shadow-sm">
          
          {/* Static vector mandala background - no spinning animations */}
          <div className="absolute right-[-10%] top-[-25%] md:right-[0%] md:top-[-30%] w-96 h-96 md:w-[480px] md:h-[480px] text-maroon/5 opacity-30 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="35" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
              
              {/* Left Column: Circular frame + floating cards */}
              <div className="lg:col-span-5 flex justify-center items-center relative animate-fade-up order-2 lg:order-1 mt-6 lg:mt-0">
                
                {/* Static backdrop mandala arc */}
                <div className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] text-gold/15 pointer-events-none select-none z-0">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                  </svg>
                </div>

                {/* Circular image frame */}
                <div className="relative z-10 p-2">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-gold shadow-md relative overflow-hidden bg-gold-light/10">
                    <img
                      src={activeAbout.hero.imagePath}
                      alt="Guru Ji - Jagadguru Shri Kripalu Ji Maharaj"
                      className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon/15 to-transparent pointer-events-none" />
                  </div>

                  {/* 3 Small Floating Info Cards around the image */}
                  <div className="absolute top-2 -left-6 bg-white/95 backdrop-blur-sm border border-gold/35 px-3 py-1.5 rounded-xl shadow-sm text-[10px] font-serif font-black text-maroon uppercase tracking-wider transition-all duration-300 hover:scale-105 pointer-events-none">
                    Spiritual Guide
                  </div>
                  <div className="absolute bottom-10 -right-6 bg-white/95 backdrop-blur-sm border border-gold/35 px-3 py-1.5 rounded-xl shadow-sm text-[10px] font-serif font-black text-maroon uppercase tracking-wider transition-all duration-300 hover:scale-105 pointer-events-none">
                    Satsang & Seva
                  </div>
                  <div className="absolute -bottom-2 left-6 bg-white/95 backdrop-blur-sm border border-gold/35 px-3 py-1.5 rounded-xl shadow-sm text-[10px] font-serif font-black text-maroon uppercase tracking-wider transition-all duration-300 hover:scale-105 pointer-events-none">
                    Divine Teachings
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Content */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start animate-fade-up order-1 lg:order-2">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-maroon/75 font-serif">
                  <Link href="/" className="hover:text-gold transition-colors">
                    Home
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gold/60 flex-shrink-0" />
                  <span className="text-dark-brown/70">About Guru Ji</span>
                </nav>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-maroon/5 border border-maroon/15 rounded-full text-[10px] font-bold font-serif uppercase tracking-widest text-maroon shadow-sm">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>{activeAbout.hero.badge}</span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-maroon leading-tight tracking-wide">
                  {activeAbout.hero.heading}
                </h1>

                {/* Paragraph */}
                <p className="text-xs sm:text-sm text-dark-brown/85 leading-relaxed font-sans max-w-xl">
                  {activeAbout.hero.paragraph}
                </p>

                {/* Action Buttons */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href="/join"
                    className="w-full sm:w-auto px-6 py-2.5 bg-maroon hover:bg-gold hover:text-maroon text-white font-bold font-serif tracking-widest text-[10px] uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-white" />
                    <span>Join Satsang</span>
                  </Link>
                  <Link
                    href="/events"
                    className="w-full sm:w-auto px-6 py-2.5 border border-maroon hover:border-gold hover:text-gold text-maroon font-bold font-serif tracking-widest text-[10px] uppercase rounded-full transition-all duration-300 bg-transparent flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Events</span>
                  </Link>
                </div>

              </div>

            </div>
          </div>
          
          {/* Bottom decorative gold border line */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-75" />
        </section>

        {/* ================= A. ABOUT NEELMANI SATSANG ================= */}
        <section className="py-16 bg-[#FCFAF6]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-6">
            <SectionHeading 
              title={activeAbout.satsangDetails.title} 
              subtitle={activeAbout.satsangDetails.subtitle} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-6">
              <div className="bg-white/70 border border-gold/15 p-6 rounded-2xl shadow-sm hover:border-gold/30 transition-colors duration-300">
                <p className="text-xs sm:text-sm text-dark-brown/90 leading-relaxed font-sans">
                  {activeAbout.satsangDetails.description1}
                </p>
              </div>
              <div className="bg-white/70 border border-gold/15 p-6 rounded-2xl shadow-sm hover:border-gold/30 transition-colors duration-300">
                <p className="text-xs sm:text-sm text-dark-brown/90 leading-relaxed font-sans">
                  {activeAbout.satsangDetails.description2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= B. GURU JI INTRO & C. QUALIFICATIONS SECTION ================= */}
        <section className="py-16 bg-[#FAF2DF]/25 border-t border-b border-gold/15 relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Side: Qualifications/Intro Content */}
              <div className="lg:col-span-6 space-y-6 text-left self-stretch flex flex-col justify-center">
                <SectionHeading 
                  title={activeAbout.guruIntro.title} 
                  subtitle={activeAbout.guruIntro.subtitle} 
                  centered={false} 
                />
                
                <p className="text-xs sm:text-sm text-dark-brown/90 leading-relaxed font-sans pt-1">
                  {activeAbout.guruIntro.text1}
                </p>
                <p className="text-xs sm:text-sm text-dark-brown/90 leading-relaxed font-sans">
                  {activeAbout.guruIntro.text2}
                </p>
              </div>

              {/* Right Side: TALL Guru Ji Photo + Overlapping floating qualification cards + Quote Card below */}
              {/* Parent container has extra padding on the sides for absolute floating cards */}
              <div className="lg:col-span-6 flex flex-col items-center relative py-6 px-16 w-full max-w-xl mx-auto">
                
                {/* Tall Photo Container - matches the vertical span of the left column */}
                <div className="relative w-72 sm:w-80 h-[430px] sm:h-[480px] rounded-3xl border-2 border-gold/30 shadow-md overflow-hidden bg-gold-light/10 p-2">
                  <img
                    src={activeAbout.hero.imagePath}
                    alt="Jagadguru Shri Kripalu Ji Maharaj"
                    className="w-full h-full object-cover object-top rounded-2xl"
                    onError={(e) => {
                      e.target.src = "/images/WhatsApp Image 2026-06-18 at 11.36.27 (1).jpeg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Qualification Overlapping Cards */}
                {/* Desktop Absolute Layout: aligns beautifully around the image with less overlap & compact width */}
                <div className="hidden md:block absolute inset-0 pointer-events-none">
                  
                  {/* Card 1: Top Left */}
                  <div className={`absolute top-8 -left-8 md:-left-12 ${activeAbout.qualifications[0].bgClass} backdrop-blur-sm border p-2.5 rounded-2xl shadow-sm max-w-[145px] pointer-events-auto transition-transform hover:scale-105 duration-300`}>
                    <div className="flex gap-2 items-start">
                      <div className="p-1 bg-maroon/5 rounded-lg flex-shrink-0 mt-0.5">
                        {activeAbout.qualifications[0].icon}
                      </div>
                      <div>
                        <h5 className="font-serif text-[10px] font-black text-maroon uppercase tracking-wider">{activeAbout.qualifications[0].title}</h5>
                        <p className="text-[8px] text-dark-brown/70 leading-normal mt-0.5">{activeAbout.qualifications[0].desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Top Right */}
                  <div className={`absolute top-24 -right-8 md:-right-12 ${activeAbout.qualifications[1].bgClass} backdrop-blur-sm border p-2.5 rounded-2xl shadow-sm max-w-[145px] pointer-events-auto transition-transform hover:scale-105 duration-300`}>
                    <div className="flex gap-2 items-start">
                      <div className="p-1 bg-maroon/5 rounded-lg flex-shrink-0 mt-0.5">
                        {activeAbout.qualifications[1].icon}
                      </div>
                      <div>
                        <h5 className="font-serif text-[10px] font-black text-maroon uppercase tracking-wider">{activeAbout.qualifications[1].title}</h5>
                        <p className="text-[8px] text-dark-brown/70 leading-normal mt-0.5">{activeAbout.qualifications[1].desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Bottom Left */}
                  <div className={`absolute bottom-36 -left-8 md:-left-12 ${activeAbout.qualifications[2].bgClass} backdrop-blur-sm border p-2.5 rounded-2xl shadow-sm max-w-[145px] pointer-events-auto transition-transform hover:scale-105 duration-300`}>
                    <div className="flex gap-2 items-start">
                      <div className="p-1 bg-maroon/5 rounded-lg flex-shrink-0 mt-0.5">
                        {activeAbout.qualifications[2].icon}
                      </div>
                      <div>
                        <h5 className="font-serif text-[10px] font-black text-maroon uppercase tracking-wider">{activeAbout.qualifications[2].title}</h5>
                        <p className="text-[8px] text-dark-brown/70 leading-normal mt-0.5">{activeAbout.qualifications[2].desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Bottom Right */}
                  <div className={`absolute bottom-16 -right-8 md:-right-12 ${activeAbout.qualifications[3].bgClass} backdrop-blur-sm border p-2.5 rounded-2xl shadow-sm max-w-[145px] pointer-events-auto transition-transform hover:scale-105 duration-300`}>
                    <div className="flex gap-2 items-start">
                      <div className="p-1 bg-maroon/5 rounded-lg flex-shrink-0 mt-0.5">
                        {activeAbout.qualifications[3].icon}
                      </div>
                      <div>
                        <h5 className="font-serif text-[10px] font-black text-maroon uppercase tracking-wider">{activeAbout.qualifications[3].title}</h5>
                        <p className="text-[8px] text-dark-brown/70 leading-normal mt-0.5">{activeAbout.qualifications[3].desc}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Mobile / Tablet Flow Grid: Stacks cleanly below the image to prevent overflow clipping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full md:hidden">
                  {activeAbout.qualifications.map((q) => (
                    <div 
                      key={q.id}
                      className={`${q.bgClass} border p-3 rounded-2xl shadow-sm`}
                    >
                      <div className="flex gap-2.5 items-center">
                        <div className="p-1.5 bg-maroon/5 rounded-lg flex-shrink-0">
                          {q.icon}
                        </div>
                        <div>
                          <h5 className="font-serif text-[10px] font-black text-maroon uppercase tracking-wider">{q.title}</h5>
                          <p className="text-[9px] text-dark-brown/75 mt-0.5">{q.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Beautiful Gold-Accented Card Directly Below the Image */}
                <div className="w-72 sm:w-80 mt-6 bg-[#FCFAF6] border-2 border-gold/20 p-5 rounded-2xl shadow-sm hover:border-maroon/30 transition-colors duration-300 relative group">
                  <div className="absolute inset-1.5 border border-gold/10 rounded-xl pointer-events-none" />
                  <div className="relative z-10 flex gap-3 items-start text-left font-serif">
                    <div className="p-2 bg-maroon/5 rounded-full flex-shrink-0">
                      <Flame className="w-4 h-4 text-gold animate-pulse" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-extrabold text-maroon uppercase tracking-widest">Shri Kripalu Vani</h5>
                      <p className="text-[10px] italic text-dark-brown/85 leading-relaxed mt-1">
                        "The main goal of human birth is to purify the heart. Turn your mind to the Lotus feet of Shyama-Shyam and find your true nature."
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= D. MISSION & VISION ================= */}
        <section className="py-16 bg-[#FCFAF6]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Mission Card */}
              <div className="bg-gradient-to-br from-[#FFFDF9] to-cream border-2 border-gold/15 p-6 sm:p-8 rounded-3xl relative shadow-sm text-left flex flex-col justify-between hover:border-maroon/20 transition-colors duration-300 group">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-maroon/5 text-maroon rounded-full flex items-center justify-center group-hover:bg-maroon group-hover:text-white transition-colors duration-300">
                    <Compass className="w-5 h-5 text-maroon group-hover:text-white" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-maroon uppercase tracking-wider">
                    {activeAbout.missionVision.mission.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-dark-brown/85 leading-relaxed font-sans">
                    {activeAbout.missionVision.mission.desc}
                  </p>
                </div>
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gold/45" />
              </div>

              {/* Vision Card */}
              <div className="bg-gradient-to-br from-[#FFFDF9] to-cream border-2 border-gold/15 p-6 sm:p-8 rounded-3xl relative shadow-sm text-left flex flex-col justify-between hover:border-maroon/20 transition-colors duration-300 group">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-maroon/5 text-maroon rounded-full flex items-center justify-center group-hover:bg-maroon group-hover:text-white transition-colors duration-300">
                    <Eye className="w-5 h-5 text-maroon group-hover:text-white" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-maroon uppercase tracking-wider">
                    {activeAbout.missionVision.vision.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-dark-brown/85 leading-relaxed font-sans">
                    {activeAbout.missionVision.vision.desc}
                  </p>
                </div>
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gold/45" />
              </div>

            </div>
          </div>
        </section>

        {/* ================= E. SPIRITUAL PHILOSOPHY ================= */}
        <section className="py-16 bg-[#FAF2DF]/25 border-t border-b border-gold/15 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-4">
            <SectionHeading 
              title={activeAbout.philosophy.title} 
              subtitle={activeAbout.philosophy.subtitle} 
            />
            
            <p className="text-xs sm:text-sm text-dark-brown/75 leading-relaxed font-sans max-w-xl mx-auto mb-8">
              {activeAbout.philosophy.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAbout.philosophy.points.map((pt, idx) => (
                <div 
                  key={idx}
                  className="bg-white/70 border border-gold/15 p-6 rounded-2xl shadow-sm text-center hover:border-maroon/25 transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-gold-light/25 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/10">
                    <span className="font-serif text-xs font-black text-maroon">{idx + 1}</span>
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-maroon mb-2">{pt.title}</h4>
                  <p className="text-xs text-dark-brown/75 leading-relaxed font-sans">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= F. SEVA ACTIVITIES ================= */}
        <section className="py-16 bg-[#FCFAF6]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gold/15 pb-3">
              <div>
                <SectionHeading title="Daily Seva Activities" subtitle="DEVOTION IN ACTION" centered={false} />
              </div>
              <div className="mt-2 md:mt-0 flex-shrink-0">
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-maroon hover:text-gold transition-colors font-serif border-b border-maroon hover:border-gold pb-0.5 uppercase"
                >
                  <span>All Campaigns</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAbout.sevaActivities.map((act, idx) => (
                <div 
                  key={idx}
                  className="bg-white/80 border border-gold/15 p-5 rounded-2xl relative shadow-sm hover:shadow-md hover:border-gold/35 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div className="space-y-2.5">
                    <div className="inline-flex text-[9px] uppercase tracking-widest text-maroon font-bold bg-maroon/5 px-2.5 py-0.5 rounded border border-maroon/10">
                      {act.location}
                    </div>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-maroon">{act.title}</h4>
                    <p className="text-[11px] sm:text-xs text-dark-brown/75 leading-relaxed font-sans">{act.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-gold/10 mt-3 flex items-center justify-between text-[9px] font-bold text-maroon font-serif uppercase tracking-widest">
                    <span>Active Project</span>
                    <Flame className="w-3 h-3 text-gold animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= G. COMMITTEE / TEAM ================= */}
        <section className="py-16 bg-[#FAF2DF]/15 border-t border-gold/15">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-4">
            <SectionHeading title="Satsang Organizing Committee" subtitle="DEVOTED WORKERS" />
            <p className="text-[11px] sm:text-xs text-dark-brown/70 leading-relaxed font-sans max-w-md mx-auto mb-6">
              Under Maharaj Ji's guidance, these dedicated devotees and volunteers manage the daily operations, food distribution, and weekly kirtan services.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAbout.committee.map((member, idx) => (
                <div 
                  key={idx}
                  className="bg-white/80 border border-gold/15 p-5 rounded-2xl text-center shadow-sm hover:border-maroon/20 transition-colors duration-300"
                >
                  <div className="w-10 h-10 bg-maroon/5 text-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-4 h-4 text-maroon" />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-maroon">{member.name}</h4>
                  <span className="text-[9px] text-maroon font-bold tracking-widest uppercase block mt-1">{member.role}</span>
                  <span className="text-[8px] text-dark-brown/55 uppercase block font-semibold">{member.branch}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Operational Integrity Callout */}
        <section className="py-14 bg-maroon text-cream-dark border-t border-gold/25">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-3">
            <Flame className="w-6 h-6 text-gold mx-auto animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-gold-glow">Operational Integrity Notice</h3>
            <p className="text-xs text-cream-dark/85 leading-relaxed font-sans max-w-xl mx-auto">
              Neelmani Kripalu Satsang operates purely on selfless devotion. In keeping with our spiritual code, <strong>we do not collect, request, or process any monetary donations or online payments</strong> through this website. Our campaigns are supported entirely by volunteers offering physical service and raw materials locally.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
