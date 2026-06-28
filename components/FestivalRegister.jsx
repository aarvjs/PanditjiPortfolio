"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, MapPin, CheckCircle, AlertTriangle, 
  User, Phone, Mail, FileText, Download, Printer, Share2, Compass, Home
} from "lucide-react";
import * as db from "../lib/db";

export default function FestivalRegister({ festival }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    participantsCount: 1,
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [passData, setPassData] = useState(null); // stores registered ticket details
  const [showPassModal, setShowPassModal] = useState(false);

  if (!festival) {
    return (
      <div className="text-center py-20 bg-white/40 rounded-3xl border border-gold/15 shadow-sm max-w-xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-serif font-bold text-lg text-dark-brown">Festival Not Found</h3>
        <p className="text-xs text-dark-brown/60 mt-1">
          The requested spiritual festival could not be found.
        </p>
        <Link 
          href="/festivals" 
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white text-xs font-bold rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Festivals
        </Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date(festival.registrationLastDate) < new Date().setHours(0,0,0,0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isDeadlinePassed) {
      setFeedback({ type: "error", message: "Registrations are closed for this festival." });
      return;
    }

    if (!form.name || !form.mobile || !form.email) {
      setFeedback({ type: "error", message: "Name, Mobile, and Email are required fields." });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });
    
    try {
      const regId = `NKS-FEST-${Math.floor(10000 + Math.random() * 90000)}`;
      const payload = {
        ...form,
        festivalId: festival.id,
        festivalName: festival.name,
        participantsCount: parseInt(form.participantsCount),
        registrationId: regId,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${regId}`
      };

      await db.createFestivalRegistration(payload);
      
      setPassData(payload);
      setShowPassModal(true);
      setFeedback({ type: "success", message: "Festival registration succeeded! Download your pass below." });
      
      // Reset form
      setForm({
        name: "",
        mobile: "",
        email: "",
        address: "",
        participantsCount: 1,
        notes: ""
      });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to submit registration. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPng = () => {
    if (typeof window === "undefined" || !passData) return;

    const canvas = document.createElement("canvas");
    canvas.width = 650;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");

    // Draw background (cream)
    ctx.fillStyle = "#fffbeb";
    ctx.fillRect(0, 0, 650, 420);

    // Draw outer golden border
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 630, 400);

    // Draw inner maroon border
    ctx.strokeStyle = "#881337";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 610, 380);

    // Print Header text
    ctx.fillStyle = "#881337"; // maroon
    ctx.font = "bold 22px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("NEELMANI KRIPALU SATSANG", 325, 55);

    ctx.fillStyle = "#d97706"; // amber/saffron
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("FESTIVAL ENTRY PASS • OFFICIAL DISCOURSE ADMISSION", 325, 80);

    // Info details
    ctx.fillStyle = "#1c1917"; // dark brown
    ctx.textAlign = "left";
    
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("FESTIVAL:", 45, 135);
    ctx.font = "normal 13px sans-serif";
    ctx.fillText(festival.name, 155, 135);

    ctx.font = "bold 13px sans-serif";
    ctx.fillText("PARTICIPANT:", 45, 175);
    ctx.font = "normal 13px sans-serif";
    ctx.fillText(passData.name, 155, 175);

    ctx.font = "bold 13px sans-serif";
    ctx.fillText("SEATS REG:", 45, 215);
    ctx.font = "normal 13px sans-serif";
    ctx.fillText(`${passData.participantsCount} Persons`, 155, 215);

    ctx.font = "bold 13px sans-serif";
    ctx.fillText("REG ID:", 45, 255);
    ctx.fillStyle = "#881337";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(passData.registrationId, 155, 255);

    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("DATE:", 45, 295);
    ctx.font = "normal 13px sans-serif";
    ctx.fillText(festival.date, 155, 295);

    ctx.font = "bold 13px sans-serif";
    ctx.fillText("VENUE:", 45, 335);
    ctx.font = "normal 13px sans-serif";
    
    // Handle multiline address/venue on ticket image
    const venueText = festival.venue;
    if (venueText.length > 35) {
      ctx.fillText(venueText.substring(0, 35), 155, 335);
      ctx.fillText(venueText.substring(35), 155, 355);
    } else {
      ctx.fillText(venueText, 155, 335);
    }

    // Load QR Code dynamically to draw onto the ticket
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${passData.registrationId}`;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 445, 125, 150, 150);
      
      // Draw signature block
      ctx.fillStyle = "#881337";
      ctx.font = "italic bold 11px Georgia, serif";
      ctx.fillText("Organizing Committee", 450, 325);
      ctx.fillStyle = "#d97706";
      ctx.font = "normal 8px sans-serif";
      ctx.fillText("Authorized NKS Signatory", 455, 340);

      // Trigger file download
      const link = document.createElement("a");
      link.download = `${passData.registrationId}_Pass.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="space-y-10">
      {/* Detail Block */}
      <div className="bg-white/80 border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        {festival.bannerUrl && (
          <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden border border-gold/15 shadow-sm flex-shrink-0 bg-cream/10">
            <img src={festival.bannerUrl} alt={festival.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 space-y-4 w-full">
          <div>
            <span className="px-2.5 py-0.5 bg-saffron/10 text-saffron text-[9px] font-extrabold uppercase rounded tracking-wider border border-saffron/5">
              Spiritual Mahotsav
            </span>
            <h1 className="font-serif font-black text-2xl md:text-3xl text-maroon mt-1.5 leading-tight">
              {festival.name}
            </h1>
          </div>

          <div className="border-t border-b border-gold/15 py-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-brown/55 font-serif">
              About the Celebration
            </h3>
            <p className="text-xs text-dark-brown/75 leading-relaxed font-sans whitespace-pre-line">
              {festival.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-cream/40 border border-gold/10 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-dark-brown/40 uppercase block">Timings & Date</span>
              <p className="font-serif font-bold text-maroon flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-saffron" />
                {festival.date}
              </p>
            </div>
            <div className="p-3.5 bg-cream/40 border border-gold/10 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-dark-brown/40 uppercase block">Holy Venue</span>
              <p className="font-serif font-bold text-maroon flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-saffron" />
                {festival.venue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Portal / Form */}
      <div className="max-w-2xl mx-auto">
        {isDeadlinePassed ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-center space-y-3 shadow-sm">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
            <h3 className="font-serif font-black text-maroon text-lg">Registrations Closed</h3>
            <p className="text-xs text-dark-brown/65 max-w-md mx-auto">
              Online pass registration deadline was {festival.registrationLastDate}. We are unable to accept new registration entries. You may contact ashram organizers directly.
            </p>
            <div className="pt-2">
              <Link 
                href="/festivals"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all bg-white"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Festivals
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="bg-white/85 border border-gold/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-base font-serif font-black text-maroon flex items-center gap-2 border-b border-gold/10 pb-3">
              <User className="w-4.5 h-4.5 text-saffron" />
              Admission Registration Form
            </h2>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Amit Patel"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 9123456789"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. amit.patel@gmail.com"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Number of Participants *</label>
                <input
                  type="number"
                  name="participantsCount"
                  min={1}
                  max={20}
                  value={form.participantsCount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">City & State *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Rohini, New Delhi"
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-brown/80 mb-1">Special Notes / Needs (Optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Need wheelchair access, senior citizen seating, late arrival..."
                  className="w-full px-3.5 py-2 bg-cream/25 border border-gold/15 rounded-xl text-xs focus:outline-none focus:border-saffron font-sans"
                />
              </div>
            </div>

            <div className="border-t border-gold/10 pt-4 flex justify-between items-center">
              <span className="text-[10px] text-dark-brown/50">
                Deadline: {festival.registrationLastDate}
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                {isSubmitting ? "Registering..." : "Submit & Generate Pass"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Ticket Pass Modal */}
      {showPassModal && passData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:relative print:bg-white print:p-0">
          <div className="bg-white rounded-3xl border border-gold/20 p-6 max-w-xl w-full shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0 print:w-full">
            
            {/* Pass Heading */}
            <div className="flex justify-between items-center border-b border-gold/10 pb-3 print:hidden">
              <h3 className="font-serif font-black text-maroon text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Admission Pass Generated Successfully
              </h3>
              <button
                onClick={() => setShowPassModal(false)}
                className="text-dark-brown/50 hover:text-maroon text-xs font-bold p-1 bg-cream rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Printable Pass Card */}
            <div id="pass-card" className="border-4 border-amber-600 p-5 rounded-2xl bg-amber-50/20 relative overflow-hidden flex flex-col justify-between min-h-[320px] print:border-amber-600 print:rounded-2xl">
              {/* Decorative print overlay */}
              <div className="absolute top-2 right-2 w-24 h-24 bg-maroon/5 rounded-bl-full flex items-center justify-center pointer-events-none print:hidden"></div>

              <div>
                {/* Organization Brand */}
                <div className="text-center pb-4 border-b border-gold/15">
                  <h2 className="font-serif font-black text-maroon text-base tracking-wide uppercase">
                    Neelmani Kripalu Satsang
                  </h2>
                  <span className="text-[8px] text-amber-600 font-extrabold tracking-widest block uppercase mt-0.5">
                    Official entry pass • Satsang Mahotsav discources
                  </span>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-3 gap-4 pt-4 text-[11px] leading-relaxed">
                  <div className="col-span-2 space-y-2 text-dark-brown">
                    <p><strong className="font-bold block text-[10px] text-dark-brown/50 uppercase">Festival:</strong> {festival.name}</p>
                    <p><strong className="font-bold block text-[10px] text-dark-brown/50 uppercase">Participant:</strong> {passData.name}</p>
                    <p><strong className="font-bold block text-[10px] text-dark-brown/50 uppercase">Admitted Seats:</strong> {passData.participantsCount} Persons</p>
                    <p><strong className="font-bold block text-[10px] text-dark-brown/50 uppercase">Pass ID:</strong> <span className="font-black text-maroon text-xs">{passData.registrationId}</span></p>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${passData.registrationId}`} 
                      alt="Pass QR Code"
                      className="w-24 h-24 border border-gold/15 bg-white p-1 rounded"
                    />
                    <span className="text-[8px] font-bold text-dark-brown/40 tracking-wider mt-1">{passData.registrationId}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="border-t border-gold/15 pt-3 mt-4 grid grid-cols-2 gap-4 text-[10px] text-dark-brown/70">
                <p><strong>Date:</strong> {festival.date}</p>
                <p className="truncate"><strong>Venue:</strong> {festival.venue}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap gap-3 pt-2 print:hidden justify-end">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 border border-gold/20 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all bg-white"
              >
                <Printer className="w-4 h-4 text-maroon" /> Print Pass
              </button>
              <button
                onClick={handleDownloadPng}
                className="flex items-center gap-1.5 px-4 py-2 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                <Download className="w-4 h-4" /> Save as Image (PNG)
              </button>
              <button
                onClick={() => setShowPassModal(false)}
                className="px-4 py-2 bg-white border border-gold/20 hover:bg-gold-light/10 text-dark-brown text-xs font-bold rounded-xl transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
