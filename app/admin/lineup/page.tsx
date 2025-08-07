'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ContentService } from '@/lib/services/content';
import { LineupPage, Artist } from '@/lib/types/content';
import { useLineupPage } from '@/lib/hooks/useContent';

function LineupEditor() {
  const { adminUser } = useAuth();
  const { content, loading: contentLoading } = useLineupPage();
  
  const [formData, setFormData] = useState<LineupPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleArtistChange = (index: number, field: keyof Artist, value: string | Artist['category']) => {
    if (!formData) return;
    const newArtists = [...formData.artists];
    newArtists[index] = { ...newArtists[index], [field]: value };
    setFormData({ ...formData, artists: newArtists });
  };

  const handleAddArtist = () => {
    if (!formData) return;
    const newArtist: Artist = {
      id: Date.now().toString(),
      name: '',
      time: '',
      category: 'opener',
      order: formData.artists.length + 1
    };
    setFormData({ ...formData, artists: [...formData.artists, newArtist] });
  };

  const handleRemoveArtist = (index: number) => {
    if (!formData) return;
    const newArtists = formData.artists.filter((_, i) => i !== index);
    // Reorder remaining artists
    newArtists.forEach((artist, i) => {
      artist.order = i + 1;
    });
    setFormData({ ...formData, artists: newArtists });
  };

  const handleMoveArtist = (index: number, direction: 'up' | 'down') => {
    if (!formData) return;
    const newArtists = [...formData.artists];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newArtists.length) return;
    
    // Swap artists
    [newArtists[index], newArtists[targetIndex]] = [newArtists[targetIndex], newArtists[index]];
    
    // Update order values
    newArtists.forEach((artist, i) => {
      artist.order = i + 1;
    });
    
    setFormData({ ...formData, artists: newArtists });
  };

  const handleSave = async () => {
    if (!formData || !adminUser) return;
    
    setSaving(true);
    setError('');
    
    try {
      await ContentService.updateLineupPage(formData, adminUser.id);
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

  const getCategoryColor = (category: Artist['category']) => {
    switch (category) {
      case 'headliner': return 'text-yellow-400';
      case 'featured': return 'text-cyan-300';
      case 'opener': return 'text-purple-300';
      default: return 'text-white';
    }
  };

  const getCategoryBadge = (category: Artist['category']) => {
    switch (category) {
      case 'headliner': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'featured': return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300';
      case 'opener': return 'bg-purple-500/20 border-purple-500/30 text-purple-300';
      default: return 'bg-white/20 border-white/30 text-white';
    }
  };

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
                Edit Lineup
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
            {/* Page Settings */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Page Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="e.g., More artists to be announced!"
                  />
                </div>
              </div>
            </div>

            {/* Artists List */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-yellow-400">Artists</h2>
                <button
                  onClick={handleAddArtist}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all text-sm border border-green-500/30"
                >
                  + Add Artist
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.artists.map((artist, index) => (
                  <div key={artist.id} className="bg-black/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Artist #{index + 1}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveArtist(index, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveArtist(index, 'down')}
                          disabled={index === formData.artists.length - 1}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveArtist(index)}
                          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/80 text-xs mb-1">
                          Artist Name
                        </label>
                        <input
                          type="text"
                          value={artist.name}
                          onChange={(e) => handleArtistChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                          placeholder="Artist name"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-xs mb-1">
                          Performance Time
                        </label>
                        <input
                          type="text"
                          value={artist.time}
                          onChange={(e) => handleArtistChange(index, 'time', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                          placeholder="e.g., 7:30 PM"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-xs mb-1">
                          Category
                        </label>
                        <select
                          value={artist.category}
                          onChange={(e) => handleArtistChange(index, 'category', e.target.value as Artist['category'])}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                        >
                          <option value="opener">Opener</option>
                          <option value="featured">Featured</option>
                          <option value="headliner">Headliner</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/80 text-xs mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={artist.description || ''}
                          onChange={(e) => handleArtistChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.artists.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    No artists added yet. Click &quot;Add Artist&quot; to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">Live Preview</h2>
                
                <div className="bg-black/30 rounded-lg p-6">
                  <h1 className="text-3xl font-bold text-yellow-400 text-center mb-2">
                    {formData.title}
                  </h1>
                  <p className="text-cyan-300 text-center mb-6">
                    {formData.subtitle}
                  </p>

                  <div className="space-y-4">
                    {formData.artists.map((artist) => (
                      <div key={artist.id} className="flex items-center justify-between py-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <span className={`font-semibold ${getCategoryColor(artist.category)}`}>
                            {artist.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryBadge(artist.category)}`}>
                            {artist.category}
                          </span>
                        </div>
                        <span className="text-white/80">
                          {artist.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {formData.footerText && (
                    <p className="text-center text-cyan-300 mt-6">
                      {formData.footerText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(LineupEditor);