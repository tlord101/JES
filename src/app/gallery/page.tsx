import Link from 'next/link';
import Image from 'next/image';
import { galleryAlbums } from '@/data/gallery';

export default function GalleryPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Media & Campus Life</span>
            <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Photo Gallery</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded"
            >
              Photo Albums
            </Link>
            <Link
              href="/gallery/videos"
              className="px-4 py-2 bg-[var(--soft-bg)] border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-slate-100"
            >
              Video Gallery
            </Link>
          </div>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryAlbums.map((album) => (
            <Link
              key={album.slug}
              href={`/gallery/${album.slug}`}
              className="group bg-white border border-[var(--border)] rounded overflow-hidden hover:border-[var(--primary)] transition-colors space-y-2"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
                    {album.category}
                  </span>
                  <span className="text-slate-400">{album.date}</span>
                </div>
                <h3 className="font-bold text-base text-[var(--primary-dark)] group-hover:text-[var(--primary)]">
                  {album.title}
                </h3>
                <p className="text-xs text-[var(--muted-text)] line-clamp-2 leading-relaxed">
                  {album.description}
                </p>
                <div className="pt-2 text-xs font-bold text-[var(--primary)]">
                  View {album.photos.length} Photos <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
