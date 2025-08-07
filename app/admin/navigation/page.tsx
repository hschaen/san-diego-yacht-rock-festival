'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, X, Eye, EyeOff, Check } from 'lucide-react';
import { ContentService } from '@/lib/services/content';
import { Navigation, NavigationItem } from '@/lib/types/content';
import { useNavigation } from '@/lib/hooks/useContent';

function NavigationEditor() {
  const { adminUser } = useAuth();
  const { content, loading: contentLoading } = useNavigation();
  
  const [formData, setFormData] = useState<Navigation | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleCtaChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({ 
      ...formData, 
      ctaButton: { ...formData.ctaButton, [field]: value }
    });
  };

  const handleEventInfoChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({ 
      ...formData, 
      eventInfo: { ...formData.eventInfo, [field]: value }
    });
  };

  const handleItemChange = (index: number, field: keyof NavigationItem, value: string | boolean) => {
    if (!formData) return;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    if (!formData) return;
    const newItem: NavigationItem = {
      id: Date.now().toString(),
      label: '',
      href: '',
      order: formData.items.length + 1,
      active: true
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    if (!formData) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    // Reorder remaining items
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });
    setFormData({ ...formData, items: newItems });
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || !formData) return;

    const draggedNavItem = formData.items[draggedItem];
    const newItems = [...formData.items];
    
    // Remove dragged item
    newItems.splice(draggedItem, 1);
    
    // Insert at new position
    newItems.splice(dropIndex, 0, draggedNavItem);
    
    // Update order
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });
    
    setFormData({ ...formData, items: newItems });
    setDraggedItem(null);
  };

  const handleSave = async () => {
    if (!formData || !adminUser) return;
    
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await ContentService.updateNavigation(formData, adminUser.id);
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
            <h1 className="text-3xl font-bold text-white mb-6">Navigation Management</h1>

            {/* Basic Info */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-cyan-300 mb-2">Site Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Yacht Rock Festival"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Navigation Items */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-400">Navigation Items</h3>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="bg-purple-800/30 rounded-lg p-4 cursor-move"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="text-white/50 mt-2" size={20} />
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                            placeholder="Label (e.g., Home)"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.href}
                              onChange={(e) => handleItemChange(index, 'href', e.target.value)}
                              placeholder="URL (e.g., /)"
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                            />
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            checked={item.active}
                            onChange={(e) => handleItemChange(index, 'active', e.target.checked)}
                            className="rounded"
                          />
                          <Check size={16} />
                          Active (visible in navigation)
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">CTA Button</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaButton.label}
                    onChange={(e) => handleCtaChange('label', e.target.value)}
                    placeholder="e.g., Get Tickets"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-300 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={formData.ctaButton.href}
                    onChange={(e) => handleCtaChange('href', e.target.value)}
                    placeholder="e.g., /tickets"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Event Info</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 mb-2">Event Date</label>
                  <input
                    type="text"
                    value={formData.eventInfo.date}
                    onChange={(e) => handleEventInfoChange('date', e.target.value)}
                    placeholder="e.g., August 17, 2025"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-300 mb-2">Venue</label>
                  <input
                    type="text"
                    value={formData.eventInfo.venue}
                    onChange={(e) => handleEventInfoChange('venue', e.target.value)}
                    placeholder="e.g., Liberty Station"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
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
              
              <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg">
                {/* Navigation Bar Preview */}
                <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-yellow-400 font-bold text-xl">{formData.title}</span>
                      
                      <nav className="flex gap-4">
                        {formData.items.filter(item => item.active).map((item) => (
                          <a
                            key={item.id}
                            href={item.href}
                            className="text-white hover:text-cyan-300 transition-colors"
                            onClick={(e) => e.preventDefault()}
                          >
                            {item.label}
                          </a>
                        ))}
                      </nav>
                    </div>
                    
                    <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold rounded-full hover:scale-105 transition-transform">
                      {formData.ctaButton.label}
                    </button>
                  </div>
                </div>

                {/* Mobile Menu Preview */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Mobile Menu Preview</h3>
                  
                  <div className="bg-black/50 rounded-lg p-4 max-w-sm">
                    <div className="space-y-3">
                      {formData.items.filter(item => item.active).map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          className="block text-white hover:text-cyan-300 py-2 border-b border-white/10"
                          onClick={(e) => e.preventDefault()}
                        >
                          {item.label}
                        </a>
                      ))}
                      
                      <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold rounded-lg">
                        {formData.ctaButton.label}
                      </button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/20 text-center">
                      <p className="text-cyan-300 text-sm">{formData.eventInfo.date}</p>
                      <p className="text-white/60 text-sm">{formData.eventInfo.venue}</p>
                    </div>
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

export default withAuth(NavigationEditor);