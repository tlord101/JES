'use client';

import React, { useState } from 'react';
import {
  messageThreadsStore,
  contactSubmissionsStore,
  MessageThreadItem,
  ContactSubmission,
} from '@/lib/communicationStore';

export default function UnifiedMessagingClientComponent({
  portalRole,
}: {
  portalRole: 'admin' | 'student' | 'parent' | 'staff' | 'public';
}) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose' | 'contact_form'>(
    'inbox'
  );
  const [threads, setThreads] = useState<MessageThreadItem[]>([...messageThreadsStore]);
  const [contactForms, setContactForms] = useState<ContactSubmission[]>([...contactSubmissionsStore]);
  const [selectedThread, setSelectedThread] = useState<MessageThreadItem | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  // Compose State
  const [recipient, setRecipient] = useState('Mr. John Adebayo (Teacher)');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Reply State
  const [replyText, setReplyText] = useState('');

  const currentUserId =
    portalRole === 'student'
      ? 'std-101'
      : portalRole === 'parent'
      ? 'par-201'
      : portalRole === 'staff'
      ? 'stf-301'
      : 'adm-001';

  const inboxMessages = threads.filter(
    (m) => m.recipientId === currentUserId || portalRole === 'admin'
  );
  const sentMessages = threads.filter((m) => m.senderId === currentUserId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;

    const newMsg: MessageThreadItem = {
      id: `msg-${Date.now()}`,
      threadId: `th-${Date.now()}`,
      senderId: currentUserId,
      senderName:
        portalRole === 'student'
          ? 'David Okafor'
          : portalRole === 'parent'
          ? 'Chief Emeka Okafor'
          : portalRole === 'staff'
          ? 'Mr. John Adebayo'
          : 'School Administrator',
      senderRole: portalRole.toUpperCase(),
      recipientId: 'stf-301',
      recipientName: recipient,
      recipientRole: 'Teacher',
      subject,
      body,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      isRead: false,
    };

    setThreads([newMsg, ...threads]);
    messageThreadsStore.unshift(newMsg);

    setSubject('');
    setBody('');
    setActiveTab('sent');
  };

  const handleReplyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !replyText) return;

    selectedContact.status = 'Replied';
    selectedContact.replyMessage = replyText;
    selectedContact.repliedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setContactForms([...contactForms]);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communication & Messaging Center</h1>
          <p className="text-sm text-slate-500">Internal messaging, parent-teacher inquiry threads, and public contact form desk.</p>
        </div>
        <button
          onClick={() => {
            setActiveTab('compose');
            setSelectedThread(null);
            setSelectedContact(null);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-pencil-square"></i> Compose Message
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab('inbox');
            setSelectedThread(null);
            setSelectedContact(null);
          }}
          className={`pb-3 ${activeTab === 'inbox' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Inbox ({inboxMessages.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('sent');
            setSelectedThread(null);
            setSelectedContact(null);
          }}
          className={`pb-3 ${activeTab === 'sent' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Sent Messages ({sentMessages.length})
        </button>

        {portalRole === 'admin' && (
          <button
            onClick={() => {
              setActiveTab('contact_form');
              setSelectedThread(null);
              setSelectedContact(null);
            }}
            className={`pb-3 ${activeTab === 'contact_form' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Website Contact Inquiries ({contactForms.length})
          </button>
        )}
      </div>

      {/* MAIN MESSAGING PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT LIST PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          {activeTab === 'inbox' && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Received Threads</span>
              {inboxMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedThread(msg)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors space-y-1 ${
                    selectedThread?.id === msg.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{msg.sentAt.split(' ')[0]}</span>
                  </div>
                  <div className="font-semibold text-slate-800 truncate">{msg.subject}</div>
                  <p className="text-[11px] text-slate-500 truncate">{msg.body}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sent Threads</span>
              {sentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedThread(msg)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors space-y-1 ${
                    selectedThread?.id === msg.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>To: {msg.recipientName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{msg.sentAt.split(' ')[0]}</span>
                  </div>
                  <div className="font-semibold text-slate-800 truncate">{msg.subject}</div>
                  <p className="text-[11px] text-slate-500 truncate">{msg.body}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact_form' && portalRole === 'admin' && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Public Contact Submissions</span>
              {contactForms.map((cnt) => (
                <div
                  key={cnt.id}
                  onClick={() => setSelectedContact(cnt)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors space-y-1 ${
                    selectedContact?.id === cnt.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{cnt.senderName}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        cnt.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : cnt.status === 'Replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cnt.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 truncate">{cnt.subject}</div>
                  <p className="text-[11px] text-slate-500 truncate">{cnt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT DISPLAY / COMPOSE PANEL */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          {activeTab === 'compose' ? (
            <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-slate-900">Compose New Internal Message</h2>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                >
                  <option>Mr. John Adebayo (Teacher)</option>
                  <option>Chief Emeka Okafor (Parent)</option>
                  <option>Super Administrator (Admin)</option>
                  <option>Bursary Department (Accountant)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Subject line..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Type your message here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Send Message Thread
                </button>
              </div>
            </form>
          ) : selectedThread ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3 space-y-1">
                <span className="text-[10px] text-blue-600 uppercase font-bold">
                  From: {selectedThread.senderName} ({selectedThread.senderRole})
                </span>
                <h2 className="text-lg font-bold text-slate-900">{selectedThread.subject}</h2>
                <span className="text-slate-400 block">{selectedThread.sentAt}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium">
                {selectedThread.body}
              </div>

              {selectedThread.attachments && selectedThread.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Attachments ({selectedThread.attachments.length})</span>
                  {selectedThread.attachments.map((att, idx) => (
                    <div key={idx} className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center w-fit gap-4">
                      <span className="font-bold text-blue-900">{att.name} ({att.size})</span>
                      <a href="#" className="text-blue-600 hover:underline font-bold">Download</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedContact ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-blue-600 uppercase font-bold">
                    Website Contact Desk Submission
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                    Status: {selectedContact.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedContact.subject}</h2>
                <div className="text-slate-500 font-medium">
                  {selectedContact.senderName} ({selectedContact.senderEmail} • {selectedContact.senderPhone})
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                {selectedContact.message}
              </div>

              {selectedContact.replyMessage ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-emerald-900">
                  <span className="font-bold block">Administrator Reply ({selectedContact.repliedAt}):</span>
                  <p>{selectedContact.replyMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleReplyContact} className="space-y-3 pt-2">
                  <label className="block font-bold text-slate-700">Reply to Sender *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type official response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    Send Official Reply
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <i className="bi bi-chat-text text-4xl"></i>
              <p className="text-xs font-medium">Select a thread from the left or click 'Compose Message'.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
