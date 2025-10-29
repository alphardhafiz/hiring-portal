"use client";

import React, { useEffect } from "react";
import { Job } from "@prisma/client";
import { useState } from "react";
import CardJob from "./CardJob";
import DescriptionJob from "./DescriptionJob";

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full h-full gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center text-gray-600">
        <p className="text-lg font-semibold">Loading job openings...</p>
        <p className="text-sm">Please wait a moment</p>
      </div>
    </div>
  );
}

function MainContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const selectJob = (id: number) => {
    const selectedJobById = jobs.find((job) => job.id === id);
    if (selectedJobById) {
      setSelectedJob(selectedJobById);
    }
  };

  // ====== Fetch jobs from API ======
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data || []);
      setSelectedJob(data[0] || null);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="h-[calc(100vh-4rem)]">
      {loading ? (
        <LoadingSpinner />
      ) : jobs.length > 0 ? (
        <div className="py-10 px-[104px] flex gap-6 h-[calc(100vh-80px)]">
          <div className="flex-1 flex flex-col gap-2 overflow-y-scroll rounded-lg">
            {jobs.map((job) => (
              <CardJob
                key={job.id}
                selected={job.id === selectedJob?.id}
                job={job}
                selectJob={selectJob}
              />
            ))}
          </div>
          <div className="flex-[2] min-h-full">
            <DescriptionJob job={selectedJob} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center w-full h-full gap-4">
          <img
            src="/images/icon-job-empty.svg"
            alt="iconjobempty"
            className="w-[300px]"
          />
          <div className="text-center text-gray-600">
            <p className="text-[20px] font-bold">
              No job openings available
            </p>
            <p>Please wait for the next batch of openings.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default MainContent;