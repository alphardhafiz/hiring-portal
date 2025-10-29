"use client";

import { useAdminStore } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import CardCreateNewJob from "./_components/CardCreateNewJob";
import ModalCreateJob from "./_components/ModalCreateJob";
import CardJob from "./_components/CardJob";
import { Job } from "@prisma/client";

export default function DashboardPage() {
  const session = useAdminStore((s) => s.session);
  const clearSession = useAdminStore((s) => s.clearSession);
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // hydration
  useEffect(() => setIsHydrated(true), []);

  useEffect(() => {
    if (isHydrated && !session) router.push("/admin/login");
  }, [isHydrated, session, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    clearSession();
    router.push("/admin/login");
  };

  // ====== Fetch jobs from API ======
  const fetchJobs = useCallback(async (search = "") => {
    try {
      setLoading(true);
      const url = search
        ? `/api/jobs?search=${encodeURIComponent(search)}`
        : "/api/jobs";
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hapus useEffect fetchJobs() yang terpisah

  // Hanya pakai debounced search, yang juga handle initial load
  useEffect(() => {
    const delayDebounce = setTimeout(
      () => {
        fetchJobs(searchQuery);
      },
      searchQuery ? 500 : 0
    ); // no delay untuk initial load (searchQuery kosong)

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchJobs]);

  if (!isHydrated)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01959F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01959F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <main className="m-6 flex justify-between gap-6 min-h-[calc(100vh-4rem-3rem)]">
        <div className="flex-[5] flex flex-col gap-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />

          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01959F]"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-scroll scrollbar-hide">
              {jobs.map((job) => (
                <CardJob key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center w-full h-full gap-4">
              <img
                src="/images/icon-job-empty.svg"
                alt="iconjobempty"
                className="w-[300px]"
              />
              <div className="text-center color-[#404040]">
                <p className="text-[20px] font-bold color-[#404040]">
                  No job openings available
                </p>
                <p>Create a job opening now and start the candidate process.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FBC037] px-4 py-2 text-[16px] w-[158px] rounded-lg"
              >
                Create a new job
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 text-white">
          <CardCreateNewJob onClick={() => setIsModalOpen(true)} />
        </div>
      </main>

      <ModalCreateJob
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJobCreated={fetchJobs}
      />
    </>
  );
}