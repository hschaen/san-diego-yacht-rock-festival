'use client';

import { withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Book, Edit, Eye, Save, Users, Settings, Calendar, Ticket, Navigation, Home, HelpCircle, Mail } from 'lucide-react';

function HelpPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: <Book className="text-yellow-400" size={24} />,
      content: [
        'Welcome to the San Diego Yacht Rock Festival CMS!',
        'This admin panel allows you to manage all content on your website.',
        'Navigate between sections using the dashboard or the links below.',
        'All changes are saved to Firebase and update the live site immediately.'
      ]
    },
    {
      title: 'Home Page',
      icon: <Home className="text-cyan-300" size={24} />,
      content: [
        'Edit the main landing page content including headlines and descriptions',
        'Customize form labels and placeholders for the registration form',
        'Update event details like date, time, and venue information',
        'Manage trust builders and success messages'
      ]
    },
    {
      title: 'Lineup Management',
      icon: <Users className="text-pink-400" size={24} />,
      content: [
        'Add, edit, or remove artists from the lineup',
        'Categorize artists as Headliner, Featured, or Opener',
        'Drag and drop to reorder artists within each category',
        'Add artist descriptions and performance times',
        'Upload artist images (optional)'
      ]
    },
    {
      title: 'Schedule Management',
      icon: <Calendar className="text-green-400" size={24} />,
      content: [
        'Create and organize event schedule items',
        'Set times, titles, and descriptions for each event',
        'Add emoji icons to make events more visual',
        'Drag and drop to reorder events',
        'Add important notes or announcements'
      ]
    },
    {
      title: 'Tickets Management',
      icon: <Ticket className="text-purple-400" size={24} />,
      content: [
        'Create different ticket tiers with custom pricing',
        'Add features and benefits for each tier',
        'Mark tiers as "Popular" or "Sold Out"',
        'Drag and drop to reorder ticket tiers',
        'Update contact information for ticket inquiries'
      ]
    },
    {
      title: 'Navigation Management',
      icon: <Navigation className="text-orange-400" size={24} />,
      content: [
        'Customize the main navigation menu items',
        'Add or remove menu links',
        'Set active/inactive states for menu items',
        'Configure the CTA (Call-to-Action) button',
        'Update event info shown in the navigation'
      ]
    },
    {
      title: 'Site Settings',
      icon: <Settings className="text-blue-400" size={24} />,
      content: [
        'Update SEO metadata (title, description)',
        'Manage SEO keywords for better search visibility',
        'Set Open Graph image for social media sharing',
        'Preview how your site appears in search results',
        'Preview social media card appearance'
      ]
    },
    {
      title: 'Registration Data',
      icon: <Users className="text-indigo-400" size={24} />,
      content: [
        'View all user registrations in a table format',
        'Export registration data to CSV',
        'Edit registrations inline',
        'Delete registrations with confirmation',
        'Manually add new registrations'
      ]
    }
  ];

  const tips = [
    {
      icon: <Eye className="text-cyan-300" size={20} />,
      text: 'Use the Preview button to see changes before saving'
    },
    {
      icon: <Save className="text-green-400" size={20} />,
      text: 'Always save your changes before leaving a page'
    },
    {
      icon: <Edit className="text-yellow-400" size={20} />,
      text: 'Click and drag items to reorder them in most sections'
    },
    {
      icon: <HelpCircle className="text-purple-400" size={20} />,
      text: 'Changes are reflected on the live site immediately after saving'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Help & Documentation</h1>
            <p className="text-cyan-300 text-lg">
              Everything you need to know about managing your Yacht Rock Festival website
            </p>
          </div>

          {/* Quick Tips */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Quick Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3">
                  {tip.icon}
                  <span className="text-white">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {section.icon}
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-white/80 flex items-start">
                      <span className="text-cyan-300 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl p-8 text-center">
            <Mail className="text-yellow-400 mx-auto mb-4" size={32} />
            <h2 className="text-2xl font-bold text-white mb-2">Need More Help?</h2>
            <p className="text-cyan-300 mb-4">
              If you have questions or need assistance, contact support
            </p>
            <a
              href="mailto:support@sdyachtrockfest.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold rounded-full hover:scale-105 transition-transform"
            >
              <Mail size={20} />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(HelpPage);