"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isFirebaseConfigured, auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LogIn, KeyRound, Mail, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in (Mock mode or Firebase)
    const isMockAuth = localStorage.getItem("nks_admin_auth") === "true";
    if (isMockAuth) {
      router.push("/admin");
      return;
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          router.push("/admin");
        }
      });
      return () => unsubscribe();
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isFirebaseConfigured && auth) {
        // Live Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/admin");
      } else {
        // Mock Admin credentials fallback
        if (email.toLowerCase() === "admin@satsang.org" && password === "admin123") {
          localStorage.setItem("nks_admin_auth", "true");
          router.push("/admin");
        } else {
          setErrorMsg("Invalid credentials. Try admin@satsang.org / admin123 in Mock Mode.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mandala-pattern flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cream">
      
      {/* Back to Home link */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="text-xs font-bold text-maroon hover:text-saffron transition-all border-b border-transparent hover:border-saffron pb-0.5 font-serif"
        >
          ← BACK TO WEBSITE
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        {/* Lotus Icon */}
        <div className="mx-auto w-10 h-10 bg-white text-saffron rounded-full border border-gold/30 shadow-md flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-saffron animate-pulse" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-maroon text-saffron-glow">
          Admin Sign In
        </h2>
        <p className="text-xs text-dark-brown/70 font-semibold uppercase tracking-wider">
          Neelmani Kripalu Satsang
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/70 border border-gold/20 py-8 px-6 shadow-lg rounded-3xl backdrop-blur-md">
          
          {/* Fallback Warning Alert */}
          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium space-y-1.5">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-saffron" />
                Running in Mock Admin Mode
              </span>
              <p className="leading-relaxed">
                Use email <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">admin@satsang.org</code> and password <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">admin123</code> to log in and test.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5 font-serif">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="login-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@satsang.org"
                  className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-dark-brown/65 mb-1.5 font-serif">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="login-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gold/25 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-saffron text-dark-brown"
                />
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-dark-brown/40" />
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-saffron hover:bg-maroon text-white font-bold tracking-widest text-xs uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Signing In..." : "Authenticate"}</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
