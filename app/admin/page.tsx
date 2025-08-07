'use client';

import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function AdminDashboard() {
  const { adminUser, signOut } = useAuth();
  const router = useRouter();

  const contentSections = [
    {
      title: 'Home Page',
      description: 'Edit headlines, event details, and signup form',
      href: '/admin/home',
      icon: '🏠',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      title: 'Lineup',
      description: 'Manage artists and performance times',
      href: '/admin/lineup',
      icon: '🎸',
      color: 'from-purple-400 to-pink-400'
    },
    {
      title: 'Schedule',
      description: 'Update event timeline and activities',
      href: '/admin/schedule',
      icon: '📅',
      color: 'from-cyan-400 to-blue-400'
    },
    {
      title: 'Tickets',
      description: 'Edit pricing tiers and ticket information',
      href: '/admin/tickets',
      icon: '🎟️',
      color: 'from-green-400 to-teal-400'
    },
    {
      title: 'Navigation',
      description: 'Manage menu items and CTAs',
      href: '/admin/navigation',
      icon: '🧭',
      color: 'from-red-400 to-pink-400'
    },
    {
      title: 'Site Settings',
      description: 'SEO metadata and global settings',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'from-indigo-400 to-purple-400'
    },
    {
      title: 'Registrations',
      description: 'View event registrations and export data',
      href: '/admin/registrations',
      icon: '👥',
      color: 'from-amber-400 to-orange-400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/assets/Yacht Rock Festival logo.png"
                alt="Yacht Rock Festival"
                width={120}
                height={48}
                className="h-8 w-auto"
              />
              <span className="ml-4 text-yellow-400 font-semibold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm">
                Welcome, {adminUser?.name || adminUser?.email}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Content Management
          </h1>
          <p className="text-cyan-300 text-lg">
            Select a section to edit your website content
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-all text-sm border border-cyan-500/30"
            >
              View Live Site →
            </Link>
            <button
              onClick={() => router.push('/admin/setup')}
              className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-all text-sm border border-yellow-500/30"
            >
              Initial Setup Guide
            </button>
            <button
              onClick={() => router.push('/admin/help')}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all text-sm border border-purple-500/30"
            >
              Help & Tutorial
            </button>
          </div>
        </div>

        {/* Content Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  '--tw-gradient-from': section.color.split(' ')[1],
                  '--tw-gradient-to': section.color.split(' ')[3],
                } as React.CSSProperties}
              />
              <div className="relative p-6">
                <div className="text-4xl mb-4">{section.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {section.description}
                </p>
                <div className="mt-4 text-cyan-300 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Edit →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Dashboard */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Site Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <p className="text-green-300 text-sm">Content Status</p>
              <p className="text-2xl font-bold text-white">Live</p>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <p className="text-blue-300 text-sm">Last Updated</p>
              <p className="text-2xl font-bold text-white">Today</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <p className="text-purple-300 text-sm">Admin Users</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-yellow-500/10 backdrop-blur-md rounded-xl border border-yellow-500/30">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">
            💡 Getting Started
          </h3>
          <ul className="text-white/80 text-sm space-y-2">
            <li>• Click any content section above to start editing</li>
            <li>• Changes are saved automatically and go live instantly</li>
            <li>• Use the preview feature to see changes before publishing</li>
            <li>• All content is backed up with version history</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default withAuth(AdminDashboard);