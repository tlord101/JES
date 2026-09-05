'use client';

import { useState } from 'react';

interface ParentMessage {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  body: string;
  timestamp: string;
}

const initialMessages: ParentMessage[] = [
  {
    id: 'pmsg_1',
    senderName: 'Engr. K. Igbinovia',
    senderRole: 'SS1 Physics & Form Teacher',
    subject: 'David Okafor Performance Update',
    body: 'Dear Dr. Okafor, David performed brilliantly in our physics practical test scoring 92%. Keep encouraging his home study schedule.',
    timestamp: '2025-02-14 11:30 AM',
  },
  {
    id: 'pmsg_2',
    senderName: 'Dr. (Mrs.) E. A. Jasmine',
    senderRole: 'School Principal',
    subject: 'Commendation for Chinecherem Okafor',
    body: 'Greetings Dr. Okafor. Chinecherem was awarded student of the week in Junior Secondary for outstanding discipline and academic rank.',
    timestamp: '2025-02-10 09:15 AM',
  },
];

export default function ParentMessagesPage() {
  const [messages, setMessages] = useState<ParentMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ParentMessage | null>(messages[0] || null);

  const [newMessageRecipient, setNewMessageRecipient] = useState('Engr. K. Igbinovia (Form Teacher - SS1)');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageSubject.trim() || !newMessageBody.trim()) {
      alert('Please fill out subject and message text.');
      return;
    }

    const created: ParentMessage = {
      id: `pmsg_${Date.now()}`,
      senderName: 'Dr. Emmanuel Okafor',
      senderRole: 'Parent',
      subject: newMessageSubject,
      body: `[To ${newMessageRecipient}]\n\n${newMessageBody}`,
      timestamp: 'Just now',
    };

    setMessages([created, ...messages]);
    setSelectedMessage(created);
    setNewMessageSubject('');
    setNewMessageBody('');
    setIsComposing(false);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Communication Portal
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Teacher & Management Messaging
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Communicate directly with class teachers, department heads, and school principal.
          </p>
        </div>

        <button
          onClick={() => setIsComposing(!isComposing)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-pencil-square"></i>
          <span>{isComposing ? 'Cancel' : 'Send Message to School'}</span>
        </button>
      </div>

      {sendSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded text-xs font-bold flex items-center gap-2">
          <i className="bi bi-check-circle-fill text-green-600"></i>
          <span>Your message has been sent to school management!</span>
        </div>
      )}

      {isComposing && (
        <form onSubmit={handleSendMessage} className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-send text-[var(--primary)]"></i>
            <span>Compose Message to School Staff</span>
          </h2>

          <div>
            <label className="font-bold text-[var(--primary-dark)] block mb-1">Recipient</label>
            <select
              value={newMessageRecipient}
              onChange={(e) => setNewMessageRecipient(e.target.value)}
              className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
            >
              <option>Engr. K. Igbinovia (Form Teacher - David Okafor)</option>
              <option>Mrs. C. Nwachukwu (Form Teacher - Chinecherem Okafor)</option>
              <option>Mr. Osagie Aghedo (Mathematics Dept Head)</option>
              <option>Dr. (Mrs.) E. A. Jasmine (School Principal)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[var(--primary-dark)] block mb-1">Subject</label>
            <input
              type="text"
              required
              value={newMessageSubject}
              onChange={(e) => setNewMessageSubject(e.target.value)}
              placeholder="Message subject..."
              className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--primary-dark)] block mb-1">Message Body</label>
            <textarea
              rows={4}
              required
              value={newMessageBody}
              onChange={(e) => setNewMessageBody(e.target.value)}
              placeholder="Type message content..."
              className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 border rounded font-bold hover:bg-[var(--soft-bg)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
            >
              Send Message
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox */}
        <div className="bg-white p-4 border border-[var(--border)] rounded space-y-3 text-xs">
          <h2 className="font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-inbox text-[var(--primary)]"></i>
            <span>Inbox ({messages.length})</span>
          </h2>

          <div className="space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full p-3 text-left border rounded transition-colors block ${
                  selectedMessage?.id === msg.id
                    ? 'bg-[var(--primary)] text-white font-bold border-transparent'
                    : 'bg-[var(--soft-bg)] border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span>{msg.senderName}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="font-bold text-xs mt-1 truncate">{msg.subject}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Viewer */}
        <div className="lg:col-span-2 bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="border-b border-[var(--border)] pb-3">
                <h2 className="text-base font-extrabold text-[var(--primary-dark)]">{selectedMessage.subject}</h2>
                <div className="text-[11px] text-[var(--muted-text)]">
                  From: {selectedMessage.senderName} ({selectedMessage.senderRole}) • {selectedMessage.timestamp}
                </div>
              </div>

              <div className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded leading-relaxed whitespace-pre-line text-[var(--text)] min-h-[160px]">
                {selectedMessage.body}
              </div>
            </div>
          ) : (
            <p className="text-[var(--muted-text)]">Select a message from inbox to read.</p>
          )}
        </div>
      </div>
    </div>
  );
}
