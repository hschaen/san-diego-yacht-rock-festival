'use client';

import { withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Site Settings</h1>
          <p className="text-white/80">Site settings management coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage);