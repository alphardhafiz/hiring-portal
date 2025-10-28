import React from "react";

interface CardCreateNewJobProps {
    onClick: () => void;
}

function CardCreateNewJob({onClick}: CardCreateNewJobProps) {
  return (
    <div
      className="relative w-[300px] h-[168px] rounded-[16px] overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg-create-new-job.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 p-6 flex gap-6 flex-col justify-between">
        <div>
          <h3 className="text-[18px] font-bold">Recruit the best candidates</h3>{" "}
          <p className="text-[14px]">Create jobs, invite, and hire with ease</p>
        </div>
        <button onClick={onClick} className="bg-[#01959F] rounded-lg p-2 font-bold">
          Create a new job
        </button>
      </div>
    </div>
  );
}

export default CardCreateNewJob;
