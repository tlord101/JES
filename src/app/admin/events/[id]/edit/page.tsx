'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eventsCMSStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const eventId = resolvedParams.id;

  const eventItem = eventsCMSStore.find((e) => e.id === eventId) || eventsCMSStore[0];

  const [title, setTitle] = useState(eventItem.title);
  const [date, setDate] = useState(eventItem.date);
  const [time, setTime] = useState(eventItem.time);
  const [location, setLocation] = useState(eventItem.location);
  const [description, setDescription] = useState(eventItem.description);
  const [category, setCategory] = useState(eventItem.category);
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    eventItem.title = title;
    eventItem.date = date;
    eventItem.time = time;
    eventItem.location = location;
    eventItem.description = description;
    eventItem.category = category;

    logAuditEvent('Event Updated', 'CMS', `Updated details for event "${title}"`);
    setMsg('Event saved successfully!');
    setTimeout(() => {
      router.push('/admin/events');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/events" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Events List
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Edit Event Details</h1>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Event Title *</label>
          <input
            type="text"
            required
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
            Save Event Changes
          </button>
        </div>
      </form>
    </div>
  );
}
