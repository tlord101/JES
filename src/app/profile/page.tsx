'use client';

import { useState, useEffect } from 'react';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    announcements: boolean;
  };
  twoFactorEnabled?: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [announcementsNotif, setAnnouncementsNotif] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setName(data.user.name || '');
          setPhone(data.user.phone || '');
          if (data.user.notificationPreferences) {
            setEmailNotif(data.user.notificationPreferences.email ?? true);
            setSmsNotif(data.user.notificationPreferences.sms ?? true);
            setAnnouncementsNotif(data.user.notificationPreferences.announcements ?? true);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user profile.');
        setLoading(false);
      });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      setSaving(false);
      return;
    }

    try {
      const payload: any = {
        name,
        phone,
        notificationPreferences: {
          email: emailNotif,
          sms: smsNotif,
          announcements: announcementsNotif,
        },
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile.');
        setSaving(false);
        return;
      }

      setMessage('Profile updated successfully.');
      if (data.user) {
        setProfile((prev) => (prev ? { ...prev, ...data.user } : data.user));
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaving(false);
    } catch (err) {
      setError('An error occurred updating profile.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-[var(--muted-text)]">
        <i className="bi bi-arrow-repeat text-2xl animate-spin inline-block mb-2 text-[var(--primary)]"></i>
        <div>Loading profile information...</div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[var(--soft-bg)] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--primary)] text-white text-2xl font-bold rounded-full flex items-center justify-center">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[var(--primary-dark)]">{profile?.name}</h1>
                <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded border border-blue-200">
                  {profile?.role}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-text)]">{profile?.email}</p>
            </div>
          </div>
          <div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 ${
                profile?.isEmailVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <i className={`bi bi-${profile?.isEmailVerified ? 'check-circle-fill' : 'exclamation-circle-fill'}`}></i>
              <span>{profile?.isEmailVerified ? 'Email Verified' : 'Unverified Email'}</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-base flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-green-600 text-base flex-shrink-0"></i>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* General Information */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <i className="bi bi-person-lines-fill text-[var(--primary)]"></i>
              <span>Personal Profile Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--soft-bg)] text-[var(--muted-text)] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Assigned Role Category</label>
                <input
                  type="text"
                  disabled
                  value={profile?.role || ''}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--soft-bg)] text-[var(--muted-text)] cursor-not-allowed font-bold"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <i className="bi bi-key-fill text-[var(--primary)]"></i>
              <span>Security & Password Update</span>
            </h2>
            <p className="text-xs text-[var(--muted-text)]">
              Leave password fields blank if you do not wish to modify your current password.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <i className="bi bi-bell-fill text-[var(--primary)]"></i>
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-0"
                />
                <div>
                  <div className="font-bold text-[var(--text)]">Email Alerts & Term Notifications</div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Receive official school circulars, broadsheets, and bursary statements via email.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={(e) => setSmsNotif(e.target.checked)}
                  className="w-4 h-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-0"
                />
                <div>
                  <div className="font-bold text-[var(--text)]">SMS Emergency Broadcasting</div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Receive critical SMS alerts regarding school reopening dates, emergencies, and meeting reminders.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementsNotif}
                  onChange={(e) => setAnnouncementsNotif(e.target.checked)}
                  className="w-4 h-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-0"
                />
                <div>
                  <div className="font-bold text-[var(--text)]">General School News Digest</div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Monthly newsletter highlighting student achievements, sports events, and gallery updates.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <i className="bi bi-arrow-repeat animate-spin"></i>}
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
