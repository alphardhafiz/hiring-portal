"use client";

import { ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
    const router = useRouter();
  const isAdmin = pathname.includes("/admin");
  const isManagePage = pathname.includes('/job-detail')

  const defaultAvatar = "/images/candidate-avatar.svg";
  const adminAvatar = "/images/admin-avatar.svg";

  return (
    <header
      className={`flex items-center h-16 p-[18px] bg-white border-b border-[#E0E0E0] ${
        isAdmin ? "justify-between" : "justify-end"
      }`}
    >
      {
        isManagePage ? (
          <div className="flex gap-4 items-center">
            <button className="text-[14px] border border-[#e0e0e0] py-2 px-4 rounded-lg" onClick={() => router.push("/admin/dashboard")}>Job List</button>
              <ChevronRight className="w-4 h-4 text-[#1D1F20]" />
            <button disabled className="text-[14px] border border-[#c2c2c2] py-2 px-4 rounded-lg bg-[#ededed]">Manage Candidate</button>
          </div>
        ) :
      isAdmin ? (

        <h1 className="text-xl font-bold text-gray-800">Job List</h1>
        
      ): null
      }
      <div>
        <img
          src={isAdmin ? adminAvatar : defaultAvatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
        />
      </div>
    </header>
  );
}
