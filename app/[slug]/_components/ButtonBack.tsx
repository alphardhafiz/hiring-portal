"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ButtonBack = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };
  return (
    <button
      onClick={handleClick}
      className="w-7 h-7 flex items-center justify-center bg-white border border-[#E0E0E0] rounded"
    >
      <ArrowLeft className="w-4 h-4 text-gray-800" />
    </button>
  );
};

export default ButtonBack;
