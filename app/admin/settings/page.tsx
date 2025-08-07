'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Save, X, Eye, EyeOff, Plus, Trash2, Upload } from 'lucide-react';
import { ContentService } from '@/lib/services/content';
import { SiteMetadata } from '@/lib/types/content';
import { useSiteMetadata } from '@/lib/hooks/useContent';

function SettingsEditor() {
  const { adminUser } = useAuth();
  const { content, loading: contentLoading } = useSiteMetadata();
  
  const [formData, setFormData] = useState<SiteMetadata | null>(null);
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

  const handleKeywordChange = (index: number, value: string) => {
    if (!formData) return;
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({ ...formData, keywords: newKeywords });
  };

  const handleAddKeyword = () => {
    if (!formData) return;
    setFormData({ ...formData, keywords: [...formData.keywords, ''] });
  };

  const handleRemoveKeyword = (index: number) => {
    if (!formData) return;
    const newKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData({ ...formData, keywords: newKeywords });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    // For demo purposes, we'll use a placeholder URL
    // In production, you'd upload to a storage service
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, ogImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData || !adminUser) return;
    
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await ContentService.updateSiteMetadata(formData, adminUser.id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (content) {
      setFormData(content);
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">No content found</div>
      </div>
    );
  }

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
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-300 rounded-lg">
            Changes saved successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Site Settings</h1>

            {/* SEO Metadata */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">SEO Metadata</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 mb-2">Site Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., San Diego Yacht Rock Festival 2025"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    This appears in browser tabs and search results
                  </p>
                </div>

                <div>
                  <label className="block text-cyan-300 mb-2">Meta Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of your website for search engines"
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    160 characters max for best SEO results
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-400">SEO Keywords</h3>
                <button
                  onClick={handleAddKeyword}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Plus size={16} />
                  Add Keyword
                </button>
              </div>

              <div className="space-y-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder="Enter keyword..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    />
                    <button
                      onClick={() => handleRemoveKeyword(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-2">
                Keywords help search engines understand your content
              </p>
            </div>

            {/* Open Graph Image */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Social Media Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 mb-2">Open Graph Image URL</label>
                  <input
                    type="text"
                    value={formData.ogImage || ''}
                    onChange={(e) => handleChange('ogImage', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Recommended size: 1200x630 pixels for best results
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm">Or upload an image:</span>
                  <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors">
                    <Upload size={16} />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>
              
              {/* Browser Tab Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Browser Tab</h3>
                <div className="bg-gray-800 rounded-t-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-600 rounded px-3 py-1 text-sm text-white flex items-center gap-2">
                      <span className="text-yellow-400">🎵</span>
                      <span className="truncate max-w-xs">{formData.title}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Result Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Google Search Result</h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-green-700 mb-1">sandiegoyachtrockfestival.com</div>
                  <h4 className="text-xl text-blue-800 hover:underline cursor-pointer mb-2">
                    {formData.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {formData.description}
                  </p>
                </div>
              </div>

              {/* Social Media Card Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Social Media Card</h3>
                <div className="bg-white rounded-lg overflow-hidden max-w-sm">
                  {formData.ogImage ? (
                    <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-white/60 text-sm">Image Preview</span>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-white/60">No image set</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 uppercase mb-1">sandiegoyachtrockfestival.com</div>
                    <h4 className="font-bold text-gray-900 mb-1">{formData.title}</h4>
                    <p className="text-sm text-gray-600">{formData.description}</p>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {formData.keywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.filter(k => k).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-600/50 text-white rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsEditor);