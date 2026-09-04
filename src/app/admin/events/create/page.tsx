'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eventsCMSStore, EventItem } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2025-03-15');
  const [time, setTime] = useState('10:00 AM - 02:00 PM');
  const [location, setLocation] = useState('Main School Auditorium, Aduwawa Campus');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newEvt: EventItem = {
      id: `evt_${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      date,
      time,
      location,
      description,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      category,
    };

    eventsCMSStore.push(newEvt);
    logAuditEvent('Event Created', 'CMS', `Created new school event "${title}" on ${date}`);
    router.push('/admin/events');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/events" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Events List
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Create School Event</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Event Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Annual Cultural Day Exhibition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Event Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Time Range</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="PTA">PTA</option>
              <option value="Co-Curricular">Co-Curricular</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Venue Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Event Description *</label>
          <textarea
            rows={5}
            required
            placeholder="Detailed description of the upcoming event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link href="/admin/events" className="px-4 py-2 border border-[var(--border)] font-bold rounded">
            Cancel
          </Link>
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
