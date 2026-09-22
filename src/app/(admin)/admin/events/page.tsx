import Link from 'next/link';
import { listEvents } from '@/lib/data/cms';
import { deleteEventAction } from '@/lib/cms/actions';

export const metadata = { title: 'Events CMS | JES Admin' };

export default async function AdminEventsPage() {
  const events = await listEvents({ status: undefined });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">School Events CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage upcoming institutional events, science fairs, sports festivals, and PTA assemblies.
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-calendar-plus"></i>
          <span>New Event</span>
        </Link>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        {events.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <i className="bi bi-calendar-x text-3xl text-[var(--muted-text)]"></i>
            <p className="text-xs font-bold text-[var(--primary-dark)]">No events yet</p>
            <p className="text-xs text-[var(--muted-text)]">Create the first school event.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--soft-bg)] text-left">
                <tr>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Event</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">When</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Location</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Status</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-[var(--border)] hover:bg-[var(--soft-bg)]">
                    <td className="p-3">
                      <div className="font-bold text-[var(--primary-dark)]">{e.title}</div>
                      <div className="text-[11px] text-[var(--muted-text)] capitalize">{e.category}</div>
                    </td>
                    <td className="p-3 text-[var(--muted-text)] font-mono text-[11px]">
                      {new Date(e.startsAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3 text-[var(--muted-text)]">{e.location ?? '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded font-bold text-[10px] ${
                          e.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/admin/events/${e.id}/edit`}
                        className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteEventAction} className="inline">
                        <input type="hidden" name="id" value={e.id} />
                        <button
                          type="submit"
                          className="text-[11px] font-bold text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
