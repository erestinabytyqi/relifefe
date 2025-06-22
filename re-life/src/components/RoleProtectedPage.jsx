'use client';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleProtectedPage({ allowedRoles, children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (!allowedRoles.includes(role)) {
        router.replace('/unauthorized');
      }
    }
  }, [user, role, loading]);

  if (loading || !user || !allowedRoles.includes(role)) {
    return <p className="p-4">Checking access...</p>;
  }

  return children;
}
