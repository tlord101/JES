'use client';

import { useState } from 'react';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminSettingsPage() {
  const [schoolName, setSchoolName] = useState('Jasmine Exclusive School');
  const [motto, setMotto] = useState('Diligence for Excellence');
  const [phone, setPhone] = useState('+234 806 078 2404');
  const [email, setEmail] = useState('jasmineexclusiveschool@gmail.com');
  const [addr1, setAddr1] = useState('12 Aitamegbe Street, Off Narrow Way Street, Off Reliance, Aduwawa, Benin City, Edo State.');
  const [addr2, setAddr2] = useState('7 Asemota Street, Off College Road, Aduwawa, Benin City, Edo State.');
  const [facebook, setFacebook] = useState('https://facebook.com/jasmineexclusiveschool');
  const [instagram, setInstagram] = useState('https://instagram.com/jasmineexclusiveschool');
  const [whatsapp, setWhatsapp] = useState('+234 806 078 2404');
  const [youtube, setYoutube] = useState('https://youtube.com/@jasmineexclusiveschool');
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditEvent('Site Settings Saved', 'System', 'Updated institutional contact details, campus addresses, and social links');
    setMsg('System configuration and contact settings updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Global Institutional Settings & Social Links</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Manage public school details, campus location addresses, official phone numbers, and social media URLs.
        </p>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core School Branding */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-building text-[var(--primary)]"></i>
            <span>School Identification</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Official School Name *</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">School Motto *</label>
              <input
                type="text"
                required
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded italic"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Primary Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Official Contact Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-mono"
              />
            </div>
          </div>
        </div>

        {/* Campus Addresses */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-geo-alt-fill text-[var(--primary)]"></i>
            <span>Campus Location Addresses</span>
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Primary Campus Address *</label>
              <textarea
                rows={2}
                required
                value={addr1}
                onChange={(e) => setAddr1(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded"
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold mb-1">Annex Campus Address *</label>
              <textarea
                rows={2}
                required
                value={addr2}
                onChange={(e) => setAddr2(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-share-fill text-[var(--primary)]"></i>
            <span>Social Media Channels</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Facebook URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)]">
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
