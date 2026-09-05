'use client';

import { useState } from 'react';

export default function ParentSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [feeReminders, setFeeReminders] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Portal Configurations
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Parent Account Settings
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage notification alerts, fee payment reminders, and security password update.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Preferences */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <i className="bi bi-bell text-[var(--primary)]"></i>
            <span>Notification & Circular Alerts</span>
          </h2>

          {savedSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded font-bold flex items-center gap-2">
              <i className="bi bi-check-circle-fill text-green-600"></i>
              <span>Preferences saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
              <div>
                <span className="font-bold text-[var(--primary-dark)] block">Email Notifications</span>
                <span className="text-[10px] text-[var(--muted-text)]">Receive published results & report card notifications via email</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </div>

            <div className="flex justify-between items-center p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
              <div>
                <span className="font-bold text-[var(--primary-dark)] block">SMS Notifications</span>
                <span className="text-[10px] text-[var(--muted-text)]">Receive SMS notifications for PTA emergency meetings</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </div>

            <div className="flex justify-between items-center p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
              <div>
                <span className="font-bold text-[var(--primary-dark)] block">Fee Payment Reminders</span>
                <span className="text-[10px] text-[var(--muted-text)]">Receive term fee payment deadline reminders</span>
              </div>
              <input
                type="checkbox"
                checked={feeReminders}
                onChange={(e) => setFeeReminders(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Password Update */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <i className="bi bi-shield-lock text-[var(--primary)]"></i>
            <span>Change Security Password</span>
          </h2>

          {passwordSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded font-bold flex items-center gap-2">
              <i className="bi bi-check-circle-fill text-green-600"></i>
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="font-bold text-[var(--primary-dark)] block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--primary-dark)] block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--primary-dark)] block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
