'use client';

import { withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Download, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: Date;
}

function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    if (!db) {
      setError('Database not initialized');
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'registrations'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const regs: Registration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        regs.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
        });
      });
      
      setRegistrations(regs);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations to export');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.timestamp.toLocaleString()}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `yacht-rock-registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          
          <button
            onClick={exportToCSV}
            disabled={registrations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Download size={20} />
            Export to CSV
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users size={32} className="text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Event Registrations</h1>
              <p className="text-cyan-300">
                {loading ? 'Loading...' : `${registrations.length} total registrations`}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-xl">Loading registrations...</div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/60 text-xl">No registrations yet</div>
              <p className="text-white/40 mt-2">Registrations will appear here when people sign up on the website.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Date Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white/60">{index + 1}</td>
                      <td className="py-3 px-4 text-white">{reg.name}</td>
                      <td className="py-3 px-4 text-white">
                        <a href={`mailto:${reg.email}`} className="hover:text-cyan-300">
                          {reg.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-white">{reg.phone}</td>
                      <td className="py-3 px-4 text-white/80">
                        {reg.timestamp.toLocaleDateString()} {reg.timestamp.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {registrations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between items-center">
                <p className="text-white/60">
                  Showing all {registrations.length} registrations
                </p>
                <button
                  onClick={fetchRegistrations}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(RegistrationsPage);