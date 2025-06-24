'use client';

import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import { App as AntdApp, ConfigProvider } from 'antd';

export default function AdminLayout({ children }) {
  const { role, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/login');
      else if (role !== 'admin') router.replace('/unauthorized');
    }
  }, [loading, user, role]);

  if (loading || !user || role !== 'admin') return <p>Checking access...</p>;

  return (
    <ConfigProvider>
      <AntdApp>
        <Navbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}
