import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEventBySlug, listEvents } from '@/lib/data/cms';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found | JES' };
  return {
    title: `${event.title} | Jasmine Exclusive School`,
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      images: event.coverImageUrl ? [event.coverImageUrl] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== 'published') notFound();

  const start = new Date(event.startsAt);
  const other = (await listEvents({ status: 'published', upcomingOnly: true, limit: 4 }))
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-10 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <Link href="/events" className="text-xs font-bold text-amber-300 hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Events
          </Link>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">{event.category}</span>
          <h1 className="text-2xl md:text-4xl font-extrabold">{event.title}</h1>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {event.coverImageUrl && (
            <div className="relative h-72 rounded-lg overflow-hidden border border-[var(--border)]">
              <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover" unoptimized priority />
            </div>
          )}
          <div className="space-y-4 text-sm leading-relaxed text-[var(--muted-text)] whitespace-pre-line">
            {event.description ?? 'Further details about this event will be communicated to parents and students.'}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-5 bg-white border border-[var(--border)] rounded space-y-3 text-xs">
            <h2 className="font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Event Details</h2>
            <div className="flex items-start gap-2">
              <i className="bi bi-calendar-event text-[var(--primary)]"></i>
              <span>{start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-start gap-2">
              <i className="bi bi-clock text-[var(--primary)]"></i>
              <span>
                {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                {event.endsAt &&
                  ` – ${new Date(event.endsAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <i className="bi bi-geo-alt text-[var(--primary)]"></i>
              <span>{event.location ?? 'Main Campus, Aduwawa, Benin City'}</span>
            </div>
          </div>

          {other.length > 0 && (
            <div className="p-5 bg-white border border-[var(--border)] rounded space-y-3 text-xs">
              <h2 className="font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
                Other Upcoming Events
              </h2>
              {other.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="block hover:text-[var(--primary)]">
                  <div className="font-bold">{e.title}</div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    {new Date(e.startsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </article>
    </div>
  );
}
