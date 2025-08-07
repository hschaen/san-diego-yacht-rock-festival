'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, X, Eye, EyeOff, Star } from 'lucide-react';
import { ContentService } from '@/lib/services/content';
import { TicketsPage, TicketTier } from '@/lib/types/content';
import { useTicketsPage } from '@/lib/hooks/useContent';

function TicketsEditor() {
  const { adminUser } = useAuth();
  const { content, loading: contentLoading } = useTicketsPage();
  
  const [formData, setFormData] = useState<TicketsPage | null>(null);
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

  const handleInfoChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({ 
      ...formData, 
      infoSection: { ...formData.infoSection, [field]: value }
    });
  };

  const handleTierChange = (index: number, field: keyof TicketTier, value: string | number | boolean) => {
    if (!formData) return;
    const newTiers = [...formData.tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleFeatureChange = (tierIndex: number, featureIndex: number, value: string) => {
    if (!formData) return;
    const newTiers = [...formData.tiers];
    newTiers[tierIndex].features[featureIndex] = value;
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleAddFeature = (tierIndex: number) => {
    if (!formData) return;
    const newTiers = [...formData.tiers];
    newTiers[tierIndex].features.push('');
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleRemoveFeature = (tierIndex: number, featureIndex: number) => {
    if (!formData) return;
    const newTiers = [...formData.tiers];
    newTiers[tierIndex].features.splice(featureIndex, 1);
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleAddTier = () => {
    if (!formData) return;
    const newTier: TicketTier = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      features: [],
      popular: false,
      soldOut: false,
      order: formData.tiers.length + 1
    };
    setFormData({ ...formData, tiers: [...formData.tiers, newTier] });
  };

  const handleRemoveTier = (index: number) => {
    if (!formData) return;
    const newTiers = formData.tiers.filter((_, i) => i !== index);
    // Reorder remaining tiers
    newTiers.forEach((tier, i) => {
      tier.order = i + 1;
    });
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleInfoItemChange = (index: number, value: string) => {
    if (!formData) return;
    const newItems = [...formData.infoSection.items];
    newItems[index] = value;
    setFormData({ 
      ...formData, 
      infoSection: { ...formData.infoSection, items: newItems }
    });
  };

  const handleAddInfoItem = () => {
    if (!formData) return;
    setFormData({ 
      ...formData, 
      infoSection: { 
        ...formData.infoSection, 
        items: [...formData.infoSection.items, ''] 
      }
    });
  };

  const handleRemoveInfoItem = (index: number) => {
    if (!formData) return;
    const newItems = formData.infoSection.items.filter((_, i) => i !== index);
    setFormData({ 
      ...formData, 
      infoSection: { ...formData.infoSection, items: newItems }
    });
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

    const draggedTier = formData.tiers[draggedItem];
    const newTiers = [...formData.tiers];
    
    // Remove dragged item
    newTiers.splice(draggedItem, 1);
    
    // Insert at new position
    newTiers.splice(dropIndex, 0, draggedTier);
    
    // Update order
    newTiers.forEach((tier, i) => {
      tier.order = i + 1;
    });
    
    setFormData({ ...formData, tiers: newTiers });
    setDraggedItem(null);
  };

  const handleSave = async () => {
    if (!formData || !adminUser) return;
    
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await ContentService.updateTicketsPage(formData, adminUser.id);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold text-white mb-6">Tickets Management</h1>

            {/* Basic Info */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-cyan-300 mb-2">Page Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-cyan-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-cyan-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Ticket Tiers */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-400">Ticket Tiers</h3>
                <button
                  onClick={handleAddTier}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Plus size={16} />
                  Add Tier
                </button>
              </div>

              <div className="space-y-4">
                {formData.tiers.map((tier, tierIndex) => (
                  <div
                    key={tier.id}
                    draggable
                    onDragStart={() => handleDragStart(tierIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, tierIndex)}
                    className="bg-purple-800/30 rounded-lg p-4 cursor-move"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="text-white/50 mt-2" size={20} />
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleTierChange(tierIndex, 'name', e.target.value)}
                            placeholder="Tier Name"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={tier.price}
                              onChange={(e) => handleTierChange(tierIndex, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="Price"
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                            />
                            <button
                              onClick={() => handleRemoveTier(tierIndex)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 text-white">
                            <input
                              type="checkbox"
                              checked={tier.popular || false}
                              onChange={(e) => handleTierChange(tierIndex, 'popular', e.target.checked)}
                              className="rounded"
                            />
                            <Star size={16} />
                            Popular
                          </label>
                          <label className="flex items-center gap-2 text-white">
                            <input
                              type="checkbox"
                              checked={tier.soldOut || false}
                              onChange={(e) => handleTierChange(tierIndex, 'soldOut', e.target.checked)}
                              className="rounded"
                            />
                            Sold Out
                          </label>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-cyan-300">Features</span>
                            <button
                              onClick={() => handleAddFeature(tierIndex)}
                              className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                            >
                              Add Feature
                            </button>
                          </div>
                          <div className="space-y-2">
                            {tier.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => handleFeatureChange(tierIndex, featureIndex, e.target.value)}
                                  placeholder="Feature description"
                                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/50"
                                />
                                <button
                                  onClick={() => handleRemoveFeature(tierIndex, featureIndex)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Info Section</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 mb-2">Info Title</label>
                  <input
                    type="text"
                    value={formData.infoSection.title}
                    onChange={(e) => handleInfoChange('title', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-cyan-300">Info Items</label>
                    <button
                      onClick={handleAddInfoItem}
                      className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.infoSection.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleInfoItemChange(index, e.target.value)}
                          placeholder="Info item..."
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                        />
                        <button
                          onClick={() => handleRemoveInfoItem(index)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
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
              
              <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg p-6">
                <h3 className="text-3xl font-bold text-yellow-400 mb-2">{formData.title}</h3>
                <p className="text-cyan-300 mb-6">{formData.subtitle}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {formData.tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`relative bg-white/10 rounded-lg p-6 ${tier.popular ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      
                      <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                      <div className="text-3xl font-bold text-cyan-300 mb-4">
                        ${tier.price}
                        {tier.soldOut && <span className="text-red-400 text-sm ml-2">SOLD OUT</span>}
                      </div>
                      
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="text-white/80 text-sm">✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {formData.infoSection.items.length > 0 && (
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                      {formData.infoSection.title}
                    </h4>
                    <ul className="space-y-1">
                      {formData.infoSection.items.map((item, index) => (
                        <li key={index} className="text-white/60 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-center text-white/60 text-sm mt-4">
                  Questions? Email {formData.contactEmail}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(TicketsEditor);