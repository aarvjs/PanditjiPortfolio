"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { 
  FileText, User, MapPin, Calendar, Upload, CheckCircle, 
  AlertTriangle, Phone, Search, RefreshCw, X, UserMinus
} from "lucide-react";
import * as db from "../../lib/db";
import { uploadImage } from "../../lib/upload";

export default function LostFoundPage() {
  const [activeTab, setActiveTab] = useState("lost"); // 'lost' | 'missing' | 'reports'
  const [reportsTab, setReportsTab] = useState("lost"); // 'lost' | 'missing' for public lists
  
  // Lost Form State
  const [lostForm, setLostForm] = useState({
    reporterName: "",
    reporterPhone: "",
    itemName: "",
    description: "",
    eventName: "",
    date: new Date().toISOString().split("T")[0]
  });
  
  // Missing Form State
  const [missingForm, setMissingForm] = useState({
    reporterName: "",
    reporterPhone: "",
    missingPersonName: "",
    age: "",
    gender: "Male",
    lastSeenLocation: "",
    description: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [lostItems, setLostItems] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    setIsLoadingReports(true);
    let lostLoaded = false;
    let missingLoaded = false;
    
    const unsubscribeLost = db.subscribeToLostItems((lost) => {
      setLostItems((lost || []).filter(item => item.status === "unresolved"));
      lostLoaded = true;
      if (lostLoaded && missingLoaded) setIsLoadingReports(false);
    });

    const unsubscribeMissing = db.subscribeToMissingPersons((missing) => {
      setMissingPersons((missing || []).filter(p => p.status === "unresolved"));
      missingLoaded = true;
      if (lostLoaded && missingLoaded) setIsLoadingReports(false);
    });

    // Fallback if not configured (sets loading false immediately)
    if (!db.isFirebaseConfigured) {
      setIsLoadingReports(false);
    }

    return () => {
      unsubscribeLost && unsubscribeLost();
      unsubscribeMissing && unsubscribeMissing();
    };
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    window.scrollTo({ top: 200, behavior: "smooth" });
    setTimeout(() => setFeedback({ type: "", message: "" }), 6000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLostSubmit = async (e) => {
    e.preventDefault();
    if (!lostForm.reporterName || !lostForm.reporterPhone || !lostForm.itemName || !lostForm.description) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "lostItems");
        imageUrl = uploadResult.downloadUrl;
      }

      await db.createLostItem({
        ...lostForm,
        imageUrl,
        status: "unresolved"
      });

      showFeedback("success", "Lost item report registered successfully. Volunteers will contact you soon.");
      setLostForm({
        reporterName: "",
        reporterPhone: "",
        itemName: "",
        description: "",
        eventName: "",
        date: new Date().toISOString().split("T")[0]
      });
      setImageFile(null);
      setImagePreview("");
      await fetchUnresolvedReports();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to register report. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMissingSubmit = async (e) => {
    e.preventDefault();
    if (!missingForm.reporterName || !missingForm.reporterPhone || !missingForm.missingPersonName || !missingForm.age || !missingForm.lastSeenLocation) {
      showFeedback("error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "missingPersons");
        imageUrl = uploadResult.downloadUrl;
      }

      await db.createMissingPerson({
        ...missingForm,
        age: parseInt(missingForm.age),
        imageUrl,
        status: "unresolved"
      });

      showFeedback("success", "Missing person alert successfully published. Volunteers will search immediately.");
      setMissingForm({
        reporterName: "",
        reporterPhone: "",
        missingPersonName: "",
        age: "",
        gender: "Male",
        lastSeenLocation: "",
        description: ""
      });
      setImageFile(null);
      setImagePreview("");
      await fetchUnresolvedReports();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Failed to register missing alert. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [{ name: "Lost & Found Portal", path: "" }];

  return (
    <>
      <Header />

      <main className="flex-grow bg-mandala-pattern pb-20">
        <PageHero
          title="Lost & Found Portal"
          description="A dynamic community support system during large spiritual festivals to find lost belongings and reunite missing family members."
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
          
          {/* Main Tab Controls */}
          <div className="flex border border-gold/20 rounded-2xl overflow-hidden bg-white shadow-sm p-1 max-w-md mx-auto">
            <button
              onClick={() => { setActiveTab("lost"); setImageFile(null); setImagePreview(""); }}
              className={`flex-1 py-3 text-xs font-bold font-serif uppercase tracking-wider rounded-xl transition-all ${
                activeTab === "lost" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
              }`}
            >
              Report Lost Item
            </button>
            <button
              onClick={() => { setActiveTab("missing"); setImageFile(null); setImagePreview(""); }}
              className={`flex-1 py-3 text-xs font-bold font-serif uppercase tracking-wider rounded-xl transition-all ${
                activeTab === "missing" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
              }`}
            >
              Report Missing Person
            </button>
            <button
              onClick={() => { setActiveTab("reports"); }}
              className={`flex-1 py-3 text-xs font-bold font-serif uppercase tracking-wider rounded-xl transition-all ${
                activeTab === "reports" ? "bg-maroon text-white" : "text-dark-brown/70 hover:bg-gold-light/10"
              }`}
            >
              Unresolved Alerts
            </button>
          </div>

          {/* Feedback alerts */}
          {feedback.message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border ${
              feedback.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}>
              {feedback.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-xs font-semibold">{feedback.message}</span>
            </div>
          )}

          {/* Tab 1: Lost Item Form */}
          {activeTab === "lost" && (
            <form onSubmit={handleLostSubmit} className="bg-white/85 border border-gold/15 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-serif font-black text-maroon flex items-center gap-2 border-b border-gold/10 pb-3">
                <FileText className="w-5 h-5 text-saffron" />
                Lost Item Announcement
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-dark-brown/60 tracking-wider mb-2">Item Image (Optional)</label>
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gold/20 shadow-sm mb-3">
                      <img src={imagePreview} alt="Item Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(""); }}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center bg-cream/10 mb-3 text-center p-3">
                      <Upload className="w-6 h-6 text-gold/50 mb-1.5" />
                      <span className="text-[9px] text-dark-brown/50">Upload a picture of the item if available</span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="lostImagePicker"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => document.getElementById("lostImagePicker").click()}
                      className="px-3 py-1.5 bg-cream border border-gold/20 hover:bg-gold-light/25 text-maroon text-[10px] font-bold rounded-lg transition-all"
                    >
                      Choose Photo
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Belonging Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Leather Wallet, Golden Chain, Keyring"
                      value={lostForm.itemName}
                      onChange={(e) => setLostForm(prev => ({ ...prev, itemName: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={lostForm.reporterName}
                      onChange={(e) => setLostForm(prev => ({ ...prev, reporterName: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={lostForm.reporterPhone}
                      onChange={(e) => setLostForm(prev => ({ ...prev, reporterPhone: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Event Name (e.g. Janmashtami)</label>
                    <input
                      type="text"
                      placeholder="e.g. Janmashtami Mahotsav 2026"
                      value={lostForm.eventName}
                      onChange={(e) => setLostForm(prev => ({ ...prev, eventName: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Approx Date Lost *</label>
                    <input
                      type="date"
                      value={lostForm.date}
                      onChange={(e) => setLostForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Item Description / Details *</label>
                    <textarea
                      rows={3}
                      placeholder="Color, marks, brand, approximate value or critical elements..."
                      value={lostForm.description}
                      onChange={(e) => setLostForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gold/10 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Submit Lost Announcement"}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Missing Person Form */}
          {activeTab === "missing" && (
            <form onSubmit={handleMissingSubmit} className="bg-white/85 border border-gold/15 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-serif font-black text-maroon flex items-center gap-2 border-b border-gold/10 pb-3">
                <User className="w-5 h-5 text-saffron" />
                Missing Person Alert
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-dark-brown/60 tracking-wider mb-2">Recent Photo (Recommended) *</label>
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gold/20 shadow-sm mb-3">
                      <img src={imagePreview} alt="Person Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(""); }}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center bg-cream/10 mb-3 text-center p-3">
                      <Upload className="w-6 h-6 text-gold/50 mb-1.5" />
                      <span className="text-[9px] text-dark-brown/50">Upload a clear photo for identification</span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="missingImagePicker"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => document.getElementById("missingImagePicker").click()}
                      className="px-3 py-1.5 bg-cream border border-gold/20 hover:bg-gold-light/25 text-maroon text-[10px] font-bold rounded-lg transition-all"
                    >
                      Choose Photo
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Missing Person Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={missingForm.missingPersonName}
                      onChange={(e) => setMissingForm(prev => ({ ...prev, missingPersonName: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-dark-brown/80 mb-1">Age *</label>
                      <input
                        type="number"
                        placeholder="e.g. 72"
                        value={missingForm.age}
                        onChange={(e) => setMissingForm(prev => ({ ...prev, age: e.target.value }))}
                        required
                        className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-dark-brown/80 mb-1">Gender</label>
                      <select
                        value={missingForm.gender}
                        onChange={(e) => setMissingForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Reporter Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sunita Sharma (Daughter)"
                      value={missingForm.reporterName}
                      onChange={(e) => setMissingForm(prev => ({ ...prev, reporterName: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Reporter Contact (Phone) *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9988776655"
                      value={missingForm.reporterPhone}
                      onChange={(e) => setMissingForm(prev => ({ ...prev, reporterPhone: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Last Seen Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Near dwarka ashram gate 2 after morning kirtan"
                      value={missingForm.lastSeenLocation}
                      onChange={(e) => setMissingForm(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-dark-brown/80 mb-1">Description (Physical traits, dress color, details) *</label>
                    <textarea
                      rows={3}
                      placeholder="Wearing white kurta, height 5'7'', wearing spectacles, speaks Hindi..."
                      value={missingForm.description}
                      onChange={(e) => setMissingForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gold/10 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Publish Missing Alert"}
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Unresolved Public Reports List */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex border-b border-gold/15 pb-2 justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setReportsTab("lost")}
                    className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      reportsTab === "lost" ? "border-saffron text-maroon font-serif font-black" : "border-transparent text-dark-brown/50 hover:text-maroon"
                    }`}
                  >
                    Lost Items ({lostItems.length})
                  </button>
                  <button
                    onClick={() => setReportsTab("missing")}
                    className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      reportsTab === "missing" ? "border-saffron text-maroon font-serif font-black" : "border-transparent text-dark-brown/50 hover:text-maroon"
                    }`}
                  >
                    Missing Persons ({missingPersons.length})
                  </button>
                </div>
                
                <button
                  onClick={fetchUnresolvedReports}
                  className="text-[10px] uppercase font-bold text-saffron flex items-center gap-1 hover:text-maroon transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {isLoadingReports ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl border border-gold/10">
                  <RefreshCw className="w-6 h-6 text-saffron animate-spin mx-auto mb-2" />
                  <span className="text-[10px] text-dark-brown/40">Loading latest reports...</span>
                </div>
              ) : reportsTab === "lost" ? (
                lostItems.length === 0 ? (
                  <div className="text-center py-16 bg-white/40 border border-gold/15 rounded-3xl">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="font-serif italic text-dark-brown/65 text-sm">All reported lost items have been resolved!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {lostItems.map(item => (
                      <div key={item.id} className="bg-white/80 border border-gold/15 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all duration-300">
                        {item.imageUrl && (
                          <div className="w-20 h-28 rounded-lg overflow-hidden border border-gold/10 flex-shrink-0 bg-cream/10">
                            <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-serif font-black text-sm text-maroon leading-tight mb-1">{item.itemName}</h3>
                            <span className="text-[9px] px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold uppercase rounded border border-rose-100">
                              Lost Item
                            </span>
                            <p className="text-[11px] text-dark-brown/60 line-clamp-3 mt-2">{item.description}</p>
                          </div>
                          <div className="text-[9px] text-dark-brown/50 space-y-0.5 pt-2 border-t border-gold/10 mt-2">
                            <p className="flex items-center gap-1"><Calendar className="w-3 h-3 text-saffron" /> Lost Date: {item.date}</p>
                            {item.eventName && <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-saffron" /> Event: {item.eventName}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                missingPersons.length === 0 ? (
                  <div className="text-center py-16 bg-white/40 border border-gold/15 rounded-3xl">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="font-serif italic text-dark-brown/65 text-sm">All missing alerts have been safely resolved!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {missingPersons.map(p => (
                      <div key={p.id} className="bg-white/80 border border-gold/15 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all duration-300">
                        {p.imageUrl && (
                          <div className="w-20 h-28 rounded-lg overflow-hidden border border-gold/10 flex-shrink-0 bg-cream/10">
                            <img src={p.imageUrl} alt={p.missingPersonName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-serif font-black text-sm text-maroon leading-tight mb-1">
                              {p.missingPersonName} ({p.age} yrs, {p.gender})
                            </h3>
                            <span className="text-[9px] px-1.5 py-0.5 bg-rose-600 text-white font-extrabold uppercase rounded tracking-wider border border-rose-700">
                              Missing Alert
                            </span>
                            <p className="text-[11px] text-dark-brown/60 line-clamp-3 mt-2">{p.description}</p>
                          </div>
                          <div className="text-[9px] text-dark-brown/50 space-y-0.5 pt-2 border-t border-gold/10 mt-2">
                            <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-saffron" /> Last Seen: {p.lastSeenLocation}</p>
                            <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-saffron" /> Call: {p.reporterPhone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
