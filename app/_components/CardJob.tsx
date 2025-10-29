import firstCharCapical from "@/utils/firstCharCapital";
import formatRupiah from "@/utils/formatRupiah";
import { Job, JobType } from "@prisma/client";
import { Banknote, MapPin } from "lucide-react";
import React from "react";

interface CardJobProps {
  job: Job;
  selected: boolean;
  selectJob: (id: number) => void;
}

function CardJob({ job, selected, selectJob }: CardJobProps) {
  const formattedJobType = (word: string) => {
    return word
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div
      onClick={() => selectJob(job.id)}
      className={`px-[16px] py-[12px] rounded-[8px] border-2 cursor-pointer transition-colors flex flex-col gap-2 
        ${
          selected
            ? "border-[#01777F] bg-[#F7FEFF]"
            : "border-[#E0E0E0] bg-white"
        }`}
    >
      <div className="flex gap-4">
        <img
          src="/images/icon-rakamin.svg"
          className="w-12"
          alt="icon rakamin"
        />
        <div className="flex flex-1 flex-col">
          <p className="font-bold text-base">{job.jobName}</p>
          <p className=" text-base">Rakamin</p>
        </div>
      </div>
      <div className="border border-dotted border-[#E0E0E0] " />
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#616161]" />
        <span className="text-[#616161] text-[12px]">Jakarta Selatan</span>
      </div>
      <div className="flex items-center gap-2">
        <Banknote className="w-4 h-4 text-[#616161]" />
        <span className="text-[#616161] text-[12px]">
          Rp{formatRupiah(job.minSalary!)} - Rp{formatRupiah(job.maxSalary!)}
        </span>
      </div>
    </div>
  );
}

export default CardJob;
