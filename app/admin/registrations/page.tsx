'use client';

import { withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Download, Users, Edit2, Trash2, Plus, X, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: Date;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });

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

  const handleEdit = (reg: Registration) => {
    setEditingId(reg.id);
    setFormData({
      name: reg.name,
      email: reg.email,
      phone: reg.phone
    });
  };

  const handleSave = async (id: string) => {
    if (!db) return;

    try {
      // Check for duplicate registration (excluding current record)
      const registrationsRef = collection(db, 'registrations');
      
      // Query for existing registration with same name AND (same email OR same phone)
      const emailQuery = query(
        registrationsRef,
        where("name", "==", formData.name),
        where("email", "==", formData.email)
      );
      
      const phoneQuery = formData.phone ? query(
        registrationsRef,
        where("name", "==", formData.name),
        where("phone", "==", formData.phone)
      ) : null;
      
      const emailSnapshot = await getDocs(emailQuery);
      const phoneSnapshot = phoneQuery ? await getDocs(phoneQuery) : null;
      
      // Check if duplicate exists (excluding current record)
      const emailDuplicate = emailSnapshot.docs.find(doc => doc.id !== id);
      const phoneDuplicate = phoneSnapshot ? phoneSnapshot.docs.find(doc => doc.id !== id) : null;
      
      if (emailDuplicate || phoneDuplicate) {
        alert('Another registration already exists with the same name and email/phone!');
        return;
      }
      
      // No duplicate found, proceed with update
      await updateDoc(doc(db, 'registrations', id), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      setRegistrations(prev => prev.map(reg => 
        reg.id === id 
          ? { ...reg, name: formData.name, email: formData.email, phone: formData.phone }
          : reg
      ));
      
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error('Error updating registration:', err);
      alert('Failed to update registration');
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'registrations', id));
      setRegistrations(prev => prev.filter(reg => reg.id !== id));
    } catch (err) {
      console.error('Error deleting registration:', err);
      alert('Failed to delete registration');
    }
  };

  const handleAdd = async () => {
    if (!db) return;
    
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    try {
      // Check for duplicate registration
      const registrationsRef = collection(db, 'registrations');
      
      // Query for existing registration with same name AND (same email OR same phone)
      const emailQuery = query(
        registrationsRef,
        where("name", "==", formData.name),
        where("email", "==", formData.email)
      );
      
      const phoneQuery = formData.phone ? query(
        registrationsRef,
        where("name", "==", formData.name),
        where("phone", "==", formData.phone)
      ) : null;
      
      const emailSnapshot = await getDocs(emailQuery);
      const phoneSnapshot = phoneQuery ? await getDocs(phoneQuery) : null;
      
      // Check if duplicate exists
      if (!emailSnapshot.empty || (phoneSnapshot && !phoneSnapshot.empty)) {
        alert('This person is already registered with the same name and email/phone!');
        return;
      }
      
      // No duplicate found, proceed with registration
      const docRef = await addDoc(collection(db, 'registrations'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        timestamp: serverTimestamp()
      });
      
      const newReg: Registration = {
        id: docRef.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        timestamp: new Date()
      };
      
      setRegistrations(prev => [newReg, ...prev]);
      setShowAddForm(false);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error('Error adding registration:', err);
      alert('Failed to add registration');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', email: '', phone: '' });
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
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Entry
            </button>
            <button
              onClick={exportToCSV}
              disabled={registrations.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
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

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-purple-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">Add New Registration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-xl">Loading registrations...</div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/60 text-xl">No registrations yet</div>
              <p className="text-white/40 mt-2">Click &quot;Add Entry&quot; to manually add a registration.</p>
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
                    <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Date</th>
                    <th className="text-center py-3 px-4 text-cyan-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white/60">{index + 1}</td>
                      <td className="py-3 px-4 text-white">
                        {editingId === reg.id ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white w-full"
                          />
                        ) : (
                          reg.name
                        )}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {editingId === reg.id ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white w-full"
                          />
                        ) : (
                          <a href={`mailto:${reg.email}`} className="hover:text-cyan-300">
                            {reg.email}
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {editingId === reg.id ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white w-full"
                          />
                        ) : (
                          reg.phone
                        )}
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {reg.timestamp.toLocaleDateString()} {reg.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          {editingId === reg.id ? (
                            <>
                              <button
                                onClick={() => handleSave(reg.id)}
                                className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(reg)}
                                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(reg.id)}
                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
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