'use client';

import { useState } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/lib/services/auth';
import { useContentLoading } from '@/lib/hooks/useContent';

function SetupPage() {
  const { adminUser } = useAuth();
  const router = useRouter();
  const { isInitializing, initError, initializeContent } = useContentLoading();
  
  const [setupStep, setSetupStep] = useState<'welcome' | 'content' | 'admin' | 'complete'>('welcome');
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [adminError, setAdminError] = useState('');
  const [adminCreating, setAdminCreating] = useState(false);

  const handleInitializeContent = async () => {
    await initializeContent();
    if (!initError) {
      setSetupStep('admin');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminCreating(true);

    try {
      await AuthService.createAdminUser(
        adminForm.email,
        adminForm.password,
        adminForm.name
      );
      setSetupStep('complete');
    } catch (err) {
      setAdminError((err as Error).message || 'Failed to create admin user');
    } finally {
      setAdminCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-yellow-400">
              Initial Setup
            </h1>
            {adminUser && (
              <Link
                href="/admin"
                className="text-cyan-300 hover:text-cyan-200"
              >
                Back to Dashboard →
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Step */}
        {setupStep === 'welcome' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Welcome to Your Content Management System! 🎉
            </h2>
            
            <p className="text-white mb-6">
              Let&apos;s get your website set up with initial content and create your admin account.
              This process will only take a couple of minutes.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h3 className="text-cyan-300 font-semibold">Initialize Content</h3>
                  <p className="text-white/80 text-sm">
                    We&apos;ll populate your database with default content for all pages
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h3 className="text-cyan-300 font-semibold">Create Admin Account</h3>
                  <p className="text-white/80 text-sm">
                    Set up your admin credentials to manage content
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h3 className="text-cyan-300 font-semibold">Start Editing!</h3>
                  <p className="text-white/80 text-sm">
                    Access your dashboard and customize your website
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSetupStep('content')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold rounded-lg transition-all"
            >
              Let&apos;s Get Started →
            </button>
          </div>
        )}

        {/* Content Initialization Step */}
        {setupStep === 'content' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Step 1: Initialize Content
            </h2>
            
            <p className="text-white mb-6">
              Click the button below to populate your database with default content.
              This includes all page content, artist lineup, schedule, and ticket information.
            </p>

            {initError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-400 rounded-lg text-red-300">
                {initError}
              </div>
            )}

            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <h3 className="text-cyan-300 font-semibold mb-2">What will be created:</h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>✅ Home page content (headlines, form settings, event details)</li>
                <li>✅ Artist lineup (5 default artists)</li>
                <li>✅ Event schedule (8 timeline events)</li>
                <li>✅ Ticket tiers and pricing</li>
                <li>✅ Navigation menu items</li>
                <li>✅ SEO metadata</li>
              </ul>
            </div>

            <button
              onClick={handleInitializeContent}
              disabled={isInitializing}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Content'}
            </button>
          </div>
        )}

        {/* Admin Account Creation Step */}
        {setupStep === 'admin' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Step 2: Create Admin Account
            </h2>
            
            <p className="text-white mb-6">
              Create your admin account to manage website content.
              Make sure to remember these credentials!
            </p>

            {adminError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-400 rounded-lg text-red-300">
                {adminError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="admin@yachtrock.com"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="••••••••"
                />
                <p className="text-white/60 text-xs mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  ⚠️ Important: Save these credentials! You&apos;ll need them to log in to the admin panel.
                </p>
              </div>

              <button
                type="submit"
                disabled={adminCreating}
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adminCreating ? 'Creating Account...' : 'Create Admin Account'}
              </button>
            </form>
          </div>
        )}

        {/* Complete Step */}
        {setupStep === 'complete' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">🎊</div>
            
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Setup Complete!
            </h2>
            
            <p className="text-white mb-8">
              Your content management system is ready to use.
              You can now log in and start editing your website content.
            </p>

            <div className="bg-green-500/20 border border-green-400 rounded-lg p-6 mb-8">
              <h3 className="text-green-300 font-semibold mb-2">What&apos;s Next?</h3>
              <ul className="text-white/80 text-sm space-y-2 text-left max-w-md mx-auto">
                <li>• Log in with your admin credentials</li>
                <li>• Edit page content through simple forms</li>
                <li>• Changes go live instantly</li>
                <li>• All content is automatically backed up</li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/admin/login')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold rounded-lg transition-all"
              >
                Go to Login Page →
              </button>
              
              <div className="text-white/60 text-sm">
                Admin URL: <span className="text-cyan-300">/admin</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Panel */}
        {adminUser && (
          <div className="mt-8 bg-cyan-500/10 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">
              💡 Quick Setup Instructions
            </h3>
            <ol className="text-white/80 text-sm space-y-2">
              <li>1. Initialize the content to populate your database</li>
              <li>2. Create additional admin accounts if needed</li>
              <li>3. Access the dashboard to start editing content</li>
              <li>4. All changes are saved automatically and go live instantly</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(SetupPage);