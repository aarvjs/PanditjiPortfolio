"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-sans">
      <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-xs font-semibold text-dark-brown/70">
        Redirecting to dashboard...
      </p>
    </div>
  );
}
