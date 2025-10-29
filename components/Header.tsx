"use client";

import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  const defaultAvatar = "/images/candidate-avatar.svg";
  const adminAvatar = "/images/admin-avatar.svg";

  return (
  <header
      className={`flex items-center h-16 p-[18px] bg-white border-b border-[#E0E0E0] ${
        isAdmin ? "justify-between" : "justify-end"
      }`}
    >
      {isAdmin && <h1 className="text-xl font-bold text-gray-800">Job List</h1>}
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
