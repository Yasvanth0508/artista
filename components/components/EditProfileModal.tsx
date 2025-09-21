import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types';
import { dbService } from '@/services/db';

interface EditProfileModalProps {
  user: UserProfile; // current logged-in user
  onClose: () => void;
  onSave?: (updatedUser: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserProfile>({
    id: user.id,
    name: user.name || '',
    avatarUrl: user.avatarUrl || 'https://picsum.photos/seed/user/200/200',
    phone: user.phone || '',
    bio: user.bio || ''
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ensure no undefined values are sent
      const updatedProfile: UserProfile = {
        id: formData.id,
        name: formData.name || '',
        avatarUrl: formData.avatarUrl || 'https://picsum.photos/seed/user/200/200',
        phone: formData.phone || '',
        bio: formData.bio || ''
      };

      const savedProfile = await dbService.updateCurrentUser(updatedProfile);

      if (onSave) onSave(savedProfile); // update parent state

      // Keep formData intact; do NOT reset
      navigate('/dashboard/view'); // redirect after save
    } catch (err) {
      console.error('Failed to update profile:', err);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-surface-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-on-surface">Edit Profile</h2>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-on-surface-secondary mb-1">Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-secondary mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-secondary mb-1">Bio</label>
              <textarea
                name="bio"
                onChange={handleChange}
                rows={5}
                className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-surface-border bg-background flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-surface-hover text-on-surface font-bold py-2 px-6 rounded-lg hover:bg-surface-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
