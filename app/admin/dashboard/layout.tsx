// app/admin/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/app/store/useStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useAdminStore((s) => s.session);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect jika tidak ada session
  useEffect(() => {
    if (isHydrated && !session) {
      router.push('/admin/login');
    }
  }, [isHydrated, session, router]);

  // Tampilkan loading saat hydration atau redirect
  if (!isHydrated || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}