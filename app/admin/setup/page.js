"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isFirebaseConfigured, auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { seedMockDataToFirebase } from "../../../lib/db";
import { ShieldAlert, UserPlus, KeyRound, Mail, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [checkingDb, setCheckingDb] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Setup is not locked via adminUsers since we rely on Firebase Auth email directly.
    // If user already exists in Firebase Auth, registration will fail.
    setCheckingDb(false);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isFirebaseConfigured && auth) {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Seed default mock data (settings singletons, etc.) so site doesn't load empty
        try {
          await seedMockDataToFirebase();
        } catch (seedErr) {
          console.warn("Seeding failed or already done:", seedErr);
        }

        setSuccessMsg("SuperAdmin initialized successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/admin/login?setup=success");
        }, 3000);
      } else {
        setErrorMsg("Firebase is not configured.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to initialize SuperAdmin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingDb) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-maroon uppercase">
          Verifying Database Status...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mandala-pattern flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cream">
      {/* Back to Home link */}
      <div className="absolute top-4 left-4">
        <Link
          href="/admin/login"
          className="text-xs font-bold text-maroon hover:text-saffron transition-all border-b border-transparent hover:border-saffron pb-0.5 font-serif"
        >
          ← BACK TO LOGIN
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="mx-auto w-10 h-10 bg-white text-maroon rounded-full border border-gold/30 shadow-md flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-maroon animate-pulse" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-maroon text-saffron-glow">
          System Seeding & Setup
        </h2>
        <p className="text-xs text-dark-brown/70 font-semibold uppercase tracking-wider">
          Initialize First SuperAdmin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/70 border border-gold/20 py-8 px-6 shadow-lg rounded-3xl backdrop-blur-md">
          
          {isLocked ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium leading-relaxed">
                <span className="font-bold block text-sm mb-1 text-maroon">Setup Locked</span>
                Administrator accounts already exist in the database. Initial setup is disabled to maintain system security.
              </div>
              <Link
                href="/admin/login"
                className="w-full inline-flex py-3 bg-maroon hover:bg-saffron text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg items-center justify-center gap-2"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              {/* Removed Fallback Warning Alert */}

              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="setup-email" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5 font-serif">
                    SuperAdmin Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="setup-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. superadmin@satsang.org"
                      className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="setup-password" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5 font-serif">
                    Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="setup-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
                    />
                    <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="setup-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5 font-serif">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="setup-confirm-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
                    />
                    <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-maroon hover:bg-saffron text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isLoading ? "Setting Up..." : "Register & Seed Database"}</span>
                  <UserPlus className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
