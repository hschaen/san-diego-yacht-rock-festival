'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ContentService } from '@/lib/services/content';
import { HomePage } from '@/lib/types/content';
import { useHomePage } from '@/lib/hooks/useContent';

function HomePageEditor() {
  const { adminUser } = useAuth();
  const { content, loading: contentLoading } = useHomePage();
  
  const [formData, setFormData] = useState<HomePage | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleChange = (field: string, value: string | Record<string, string>) => {
    if (!formData) return;
    
    const keys = field.split('.');
    const newData = { ...formData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    if (!formData) return;
    
    const newData = { ...formData };
    const array = field.split('.').reduce((obj: Record<string, unknown>, key) => obj[key] as Record<string, unknown>, newData as Record<string, unknown>) as unknown as string[];
    array[index] = value;
    setFormData(newData);
  };

  const handleAddArrayItem = (field: string) => {
    if (!formData) return;
    
    const newData = { ...formData };
    const array = field.split('.').reduce((obj: Record<string, unknown>, key) => obj[key] as Record<string, unknown>, newData as Record<string, unknown>) as unknown as string[];
    array.push('');
    setFormData(newData);
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    if (!formData) return;
    
    const newData = { ...formData };
    const array = field.split('.').reduce((obj: Record<string, unknown>, key) => obj[key] as Record<string, unknown>, newData as Record<string, unknown>) as unknown as string[];
    array.splice(index, 1);
    setFormData(newData);
  };

  const handleSave = async () => {
    if (!formData || !adminUser) return;
    
    setSaving(true);
    setError('');
    
    try {
      await ContentService.updateHomePage(formData, adminUser.id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (contentLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-cyan-300 hover:text-cyan-200"
              >
                ← Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-yellow-400">
                Edit Home Page
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all text-sm border border-purple-500/30"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-20 right-4 p-4 bg-green-500/20 border border-green-400 rounded-lg text-green-300 z-20">
          ✅ Changes saved successfully!
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-4 p-4 bg-red-500/20 border border-red-400 rounded-lg text-red-300 z-20">
          ❌ {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={showPreview ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}>
          {/* Edit Form */}
          <div className="space-y-6">
            {/* Headlines Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Headlines</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Subheadline
                  </label>
                  <input
                    type="text"
                    value={formData.subheadline}
                    onChange={(e) => handleChange('subheadline', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Event Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.eventDetails.date}
                    onChange={(e) => handleChange('eventDetails.date', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.eventDetails.time}
                    onChange={(e) => handleChange('eventDetails.time', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.eventDetails.venue}
                    onChange={(e) => handleChange('eventDetails.venue', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.eventDetails.address}
                    onChange={(e) => handleChange('eventDetails.address', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Form Settings Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Form Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.submitButton}
                    onChange={(e) => handleChange('submitButton', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Success Title
                    </label>
                    <input
                      type="text"
                      value={formData.successMessage.title}
                      onChange={(e) => handleChange('successMessage.title', e.target.value)}
                      className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Success Description
                    </label>
                    <input
                      type="text"
                      value={formData.successMessage.description}
                      onChange={(e) => handleChange('successMessage.description', e.target.value)}
                      className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Builders Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Trust Builders</h2>
              
              <div className="space-y-3">
                {formData.trustBuilders.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('trustBuilders', index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Trust builder text..."
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('trustBuilders', index)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayItem('trustBuilders')}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all text-sm"
                >
                  + Add Trust Builder
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">Live Preview</h2>
                
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-yellow-400">
                      {formData.headline}
                    </h1>
                    <p className="text-lg text-cyan-300 mt-2">
                      {formData.subheadline}
                    </p>
                    <p className="text-white/90 mt-2">
                      {formData.description}
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm text-white/60">Event Details:</p>
                    <p className="text-white font-semibold">
                      {formData.eventDetails.date} • {formData.eventDetails.time}
                    </p>
                    <p className="text-cyan-200">
                      {formData.eventDetails.venue}
                    </p>
                    <p className="text-white/80 text-sm">
                      {formData.eventDetails.address}
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold rounded-lg">
                      {formData.submitButton}
                    </button>
                  </div>

                  <div className="border-t border-white/20 pt-4 space-y-1">
                    {formData.trustBuilders.map((item, index) => (
                      <p key={index} className="text-white/80 text-sm">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomePageEditor);