"use client";

import { useAdminStore } from "@/app/store/useStore";

export default function Header() {
  const session = useAdminStore((s) => s.session);

  const defaultAvatar = "/images/candidate-avatar.svg";
  const adminAvatar = "/images/admin-avatar.svg";

  return (
    <header className="flex justify-between items-center h-16 p-[18px] bg-white border-b border-[#E0E0E0]">
      <h1 className="text-xl font-bold text-gray-800">Job List</h1>
      <div>
        <img
          src={session ? adminAvatar : defaultAvatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
        />
      </div>
    </header>
  );
}
