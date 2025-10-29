import JobStatusBadge from "@/components/JobStatusBadge";
import formatRupiah from "@/utils/formatRupiah";
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface CardJobProps {
  job: Job;
}

function CardJob({ job }: CardJobProps) {
  const router = useRouter();

  const handleManageJob = () => {
    router.push(`/admin/dashboard/job-detail/${job.slug}`);
  };

  return (
    <div
      key={job.id}
      className="p-4 border rounded-2xl shadow-sm flex flex-col gap-4"
    >
      <JobStatusBadge status={job.status} />
      <p className="font-bold">{job.jobName}</p>
      <div className="flex justify-between">
        <p>
          Rp{formatRupiah(job.minSalary!)} - Rp{formatRupiah(job.maxSalary!)}
        </p>
        <button 
          onClick={handleManageJob}
          className="bg-[#01959F] text-white rounded-lg p-2 px-4 text-[12px] font-bold hover:bg-[#017a82] transition-colors"
        >
          Manage Job
        </button>
      </div>
    </div>
  );
}

export default CardJob;