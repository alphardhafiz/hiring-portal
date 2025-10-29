import { Job } from "@prisma/client";
import ButtonApplyJob from "./ButtonApplyJob";

interface DescriptionJobProps {
  job?: Job | null;
}

const DescriptionJob = ({ job = null }: DescriptionJobProps) => {
  return (
    <div className="border border-[#E0E0E0] rounded-lg p-6 h-full">
      {job ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 flex gap-6 items-start">
              <img
                src="/images/icon-rakamin.svg"
                className="w-12"
                alt="icon rakamin"
              />
              <div className="flex flex-col gap-[4px]">
                <p
                  className={`px-2 py-1 rounded text-white text-[12px] font-bold w-fit ${
                    job.jobType === "FULL_TIME"
                      ? "bg-[#43936C]"
                      : job.jobType === "CONTRACT"
                      ? "bg-[#007BFF]"
                      : job.jobType === "PART_TIME"
                      ? "bg-[#FBC037]"
                      : job.jobType === "INTERNSHIP"
                      ? "bg-[#01959F]"
                      : job.jobType === "FREELANCE"
                      ? "bg-[#E11428]"
                      : "bg-gray-400"
                  }`}
                >
                  {job.jobType
                    .replace("_", "-") // ubah underscore jadi dash
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                  {/* Capital huruf awal */}
                </p>

                <p className="text-[18px] font-bold">{job.jobName}</p>
                <p className="text-[14px] text-[#757575]">Rakamin</p>
              </div>
            </div>
           <ButtonApplyJob slug={job.slug} />
          </div>
          <div className="border border-[#E0E0E0] " />
          <p className="text-[14px] text-[#404040]">{job.jobDescription}</p>
        </div>
      ) : null}
    </div>
  );
};

export default DescriptionJob;
