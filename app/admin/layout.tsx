'use client';

import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-purple-900">
        {children}
      </div>
    </AuthProvider>
  );
}