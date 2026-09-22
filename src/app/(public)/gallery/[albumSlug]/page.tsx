import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAlbumBySlug } from '@/lib/data/cms';

export async function generateMetadata({ params }: { params: Promise<{ albumSlug: string }> }) {
  const { albumSlug } = await params;
  const result = await getAlbumBySlug(albumSlug);
  if (!result) return { title: 'Album Not Found | JES' };
  return {
    title: `${result.album.title} | Gallery | JES`,
    description: result.album.description ?? undefined,
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ albumSlug: string }> }) {
  const { albumSlug } = await params;
  const result = await getAlbumBySlug(albumSlug);

  if (!result || !result.album.isPublished) notFound();
  const { album, images } = result;

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-10 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <Link href="/gallery" className="text-xs font-bold text-amber-300 hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Gallery
          </Link>
          <h1 className="text-2xl md:text-4xl font-extrabold">{album.title}</h1>
          <p className="text-xs text-slate-300 capitalize">
            {album.category} • {album.imageCount} photo{album.imageCount === 1 ? '' : 's'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-6">
        {album.description && (
          <p className="text-sm text-[var(--muted-text)] leading-relaxed max-w-3xl">{album.description}</p>
        )}

        {images.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[var(--border)] rounded space-y-2">
            <i className="bi bi-image text-3xl text-[var(--muted-text)]"></i>
            <p className="text-sm font-bold text-[var(--primary-dark)]">No photos in this album yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={img.id} className="space-y-1">
                <div className="relative h-48 rounded overflow-hidden border border-[var(--border)]">
                  <Image
                    src={img.imageUrl}
                    alt={img.caption ?? album.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    unoptimized
                    priority={index < 4}
                  />
                </div>
                {img.caption && (
                  <p className="text-[11px] text-[var(--muted-text)] text-center">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
