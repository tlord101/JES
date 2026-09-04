import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { galleryAlbums } from '@/data/gallery';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ albumSlug: string }>;
}) {
  const { albumSlug } = await params;
  const album = galleryAlbums.find((a) => a.slug === albumSlug);

  if (!album) {
    notFound();
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-0.5 rounded">
              {album.category}
            </span>
            <span className="text-xs text-[var(--muted-text)]">• {album.date}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--primary-dark)] leading-tight">{album.title}</h1>
          <p className="text-xs text-[var(--muted-text)]">{album.description}</p>
        </div>

        {/* Masonry / Clean Grid Layout for album photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.photos.map((photo, idx) => (
            <div key={idx} className="bg-white border border-[var(--border)] rounded overflow-hidden">
              <div className="relative h-64 w-full">
                <Image src={photo.url} alt={photo.caption} fill className="object-cover" />
              </div>
              <div className="p-3 bg-[var(--soft-bg)] text-xs text-[var(--muted-text)] font-medium">
                {photo.caption}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-200">
          <Link href="/gallery" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Gallery Albums
          </Link>
        </div>
      </div>
    </div>
  );
}
