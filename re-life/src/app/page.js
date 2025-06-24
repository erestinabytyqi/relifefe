'use client';

import { useAuth } from '../components/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

export default function HomePage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }
  }, [user, role, loading]);

  if (loading) {
    return <Spin tip="Loading..." size="large" fullscreen />;
  }

  return null;
}
