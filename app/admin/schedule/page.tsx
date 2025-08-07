'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, X, Eye, EyeOff } from 'lucide-react';
import { ContentService } from '@/lib/services/content';
import { SchedulePage, ScheduleEvent } from '@/lib/types/content';
import { useSchedulePage } from '@/lib/hooks/useContent';

function ScheduleEditor() {
  const { adminUser } = useAuth();
  const { content, loading: contentLoading } = useSchedulePage();
  
  const [formData, setFormData] = useState<SchedulePage | null>(null);
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

  const handleEventChange = (index: number, field: keyof ScheduleEvent, value: string) => {
    if (!formData) return;
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData({ ...formData, events: newEvents });
  };

  const handleAddEvent = () => {
    if (!formData) return;
    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      time: '',
      title: '',
      description: '',
      icon: '🎵',
      order: formData.events.length + 1
    };
    setFormData({ ...formData, events: [...formData.events, newEvent] });
  };

  const handleRemoveEvent = (index: number) => {
    if (!formData) return;
    const newEvents = formData.events.filter((_, i) => i !== index);
    // Reorder remaining events
    newEvents.forEach((event, i) => {
      event.order = i + 1;
    });
    setFormData({ ...formData, events: newEvents });
  };

  const handleNoteChange = (index: number, value: string) => {
    if (!formData) return;
    const newNotes = [...formData.notes];
    newNotes[index] = value;
    setFormData({ ...formData, notes: newNotes });
  };

  const handleAddNote = () => {
    if (!formData) return;
    setFormData({ ...formData, notes: [...formData.notes, ''] });
  };

  const handleRemoveNote = (index: number) => {
    if (!formData) return;
    const newNotes = formData.notes.filter((_, i) => i !== index);
    setFormData({ ...formData, notes: newNotes });
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

    const draggedEvent = formData.events[draggedItem];
    const newEvents = [...formData.events];
    
    // Remove dragged item
    newEvents.splice(draggedItem, 1);
    
    // Insert at new position
    newEvents.splice(dropIndex, 0, draggedEvent);
    
    // Update order
    newEvents.forEach((event, i) => {
      event.order = i + 1;
    });
    
    setFormData({ ...formData, events: newEvents });
    setDraggedItem(null);
  };

  const handleSave = async () => {
    if (!formData || !adminUser) return;
    
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await ContentService.updateSchedulePage(formData, adminUser.id);
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

        {/* Edit Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Schedule Management</h1>

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
                <label className="block text-cyan-300 mb-2">Event Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  placeholder="e.g., Saturday, August 17, 2025"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Schedule Events */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-400">Schedule Events</h3>
                <button
                  onClick={handleAddEvent}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Plus size={16} />
                  Add Event
                </button>
              </div>

              <div className="space-y-4">
                {formData.events.map((event, index) => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="bg-purple-800/30 rounded-lg p-4 cursor-move"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="text-white/50 mt-2" size={20} />
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={event.time}
                            onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                            placeholder="Time (e.g., 2:00 PM)"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                          />
                          <input
                            type="text"
                            value={event.icon || ''}
                            onChange={(e) => handleEventChange(index, 'icon', e.target.value)}
                            placeholder="Icon (emoji)"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                          />
                          <button
                            onClick={() => handleRemoveEvent(index)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                          placeholder="Event Title"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                        />
                        
                        <textarea
                          value={event.description}
                          onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                          placeholder="Event Description"
                          rows={2}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-400">Event Notes</h3>
                <button
                  onClick={handleAddNote}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Plus size={16} />
                  Add Note
                </button>
              </div>

              <div className="space-y-3">
                {formData.notes.map((note, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      placeholder="Enter a note..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    />
                    <button
                      onClick={() => handleRemoveNote(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>
              
              <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg p-6">
                <h3 className="text-3xl font-bold text-yellow-400 mb-2">{formData.title}</h3>
                <p className="text-cyan-300 mb-6">{formData.date}</p>

                <div className="space-y-4 mb-8">
                  {formData.events.map((event) => (
                    <div key={event.id} className="flex gap-4 items-start">
                      <div className="text-white/60 min-w-[80px]">{event.time}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {event.icon && <span className="text-2xl">{event.icon}</span>}
                          <h4 className="text-xl font-semibold text-white">{event.title}</h4>
                        </div>
                        <p className="text-white/80">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.notes.length > 0 && (
                  <div className="border-t border-white/20 pt-4">
                    <ul className="space-y-2">
                      {formData.notes.map((note, index) => (
                        <li key={index} className="text-white/60 text-sm">• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(ScheduleEditor);