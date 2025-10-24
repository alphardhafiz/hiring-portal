"use client";

import { useAdminStore } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import Header from "@/components/Header";

export default function DashboardPage() {
  const session = useAdminStore((s) => s.session);
  const clearSession = useAdminStore((s) => s.clearSession);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Tunggu hingga Zustand selesai hydrate dari localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !session) {
      router.push("/admin/login");
    }
  }, [isHydrated, session, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Logout dari Supabase
    await supabase.auth.signOut();

    // Clear session dari Zustand
    clearSession();

    // Redirect ke login
    router.push("/admin/login");
  };

  // Tampilkan loading sampai hydration selesai
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01959F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Tampilkan loading saat redirect
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01959F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="">
        
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        <LogOut className="w-5 h-5" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
        </div>
    </>
  );
}
