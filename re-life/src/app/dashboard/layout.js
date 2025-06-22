'use client';

import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }) {
  const { role, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/login');
      else if (!['doctor', 'nurse'].includes(role)) router.replace('/unauthorized');
    }
  }, [role, loading, user]);

  if (loading || !user || !['doctor', 'nurse'].includes(role)) return <p>Loading...</p>;

  return (
    <>
  <Navbar/>
      <div className="flex">
      
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
