import Link from 'next/link';
import Image from 'next/image';
import { listGalleryAlbums } from '@/lib/data/cms';

export const metadata = {
  title: 'Photo Gallery | Jasmine Exclusive School',
  description: 'Photo albums from campus life, sports, academics, and cultural events at JES.',
};

export default async function GalleryPage() {
  const albums = await listGalleryAlbums({ publishedOnly: true });

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-12 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">Photo Gallery</h1>
          <p className="text-sm text-slate-200 max-w-2xl">
            Campus life in pictures — academics, sports, culture, and the everyday joy of learning
            at Jasmine Exclusive School.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {albums.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[var(--border)] rounded space-y-2">
            <i className="bi bi-images text-3xl text-[var(--muted-text)]"></i>
            <p className="text-sm font-bold text-[var(--primary-dark)]">Gallery coming soon</p>
            <p className="text-xs text-[var(--muted-text)]">Photo albums will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link
                key={album.slug}
                href={`/gallery/${album.slug}`}
                className="group bg-white border border-[var(--border)] rounded overflow-hidden hover:border-[var(--primary)] transition-colors"
              >
                <div className="relative h-48">
                  {album.coverImageUrl ? (
                    <Image
                      src={album.coverImageUrl}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-[var(--soft-bg)]">
                      <i className="bi bi-images text-3xl text-[var(--muted-text)]"></i>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {album.category} • {album.imageCount} photo{album.imageCount === 1 ? '' : 's'}
                  </span>
                  <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)]">
                    {album.title}
                  </h3>
                  {album.description && (
                    <p className="text-xs text-[var(--muted-text)] line-clamp-2">{album.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
