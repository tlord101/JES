'use client';

import React, { useState } from 'react';
import { notificationsStore, NotificationType, TargetAudience, NotificationItem } from '@/lib/communicationStore';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([...notificationsStore]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('Announcement');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('All Students');

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      targetAudience,
      senderName: 'Super Administrator',
      senderRole: 'Super Admin',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      readBy: [],
    };

    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    notificationsStore.unshift(newNotif);

    setTitle('');
    setMessage('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Broadcast Notifications System</h1>
          <p className="text-sm text-slate-500">Dispatch targeted alerts, fee reminders, exam dates, and announcements across portal user roles.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-send-fill"></i> Send Broadcast Notification
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Notification History Logs</h2>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      notif.type === 'Fee reminder'
                        ? 'bg-amber-100 text-amber-800'
                        : notif.type === 'Exam'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {notif.type}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{notif.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{notif.sentAt}</span>
              </div>

              <p className="text-slate-600 leading-relaxed">{notif.message}</p>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                <span>
                  Target: <strong className="text-slate-700">{notif.targetAudience}</strong>
                </span>
                <span>
                  Sender: <strong className="text-slate-700">{notif.senderName} ({notif.senderRole})</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISPATCH MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSendNotification}
            className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">New Broadcast Alert</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Parent-Teacher Assembly"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as NotificationType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                  >
                    <option>Announcement</option>
                    <option>Exam</option>
                    <option>Assignment</option>
                    <option>Fee reminder</option>
                    <option>Result</option>
                    <option>Event</option>
                    <option>Admission</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                  >
                    <option>All Students</option>
                    <option>All Parents</option>
                    <option>All Teachers</option>
                    <option>All Staff</option>
                    <option>Class Group</option>
                    <option>Individual User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alert Message Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write clear broadcast message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
              >
                Broadcast Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
