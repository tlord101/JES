import Link from 'next/link';
import { galleryVideos } from '@/data/gallery';

export default function VideosPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Media & Campus Life</span>
            <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Video Library</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="px-4 py-2 bg-[var(--soft-bg)] border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-slate-100"
            >
              Photo Albums
            </Link>
            <Link
              href="/gallery/videos"
              className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded"
            >
              Video Gallery
            </Link>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryVideos.map((vid) => (
            <div key={vid.id} className="bg-white border border-[var(--border)] rounded overflow-hidden space-y-3">
              <div className="aspect-video w-full bg-slate-900 flex items-center justify-center">
                <iframe
                  src={vid.videoUrl}
                  title={vid.title}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
                  Duration: {vid.duration}
                </span>
                <h3 className="font-bold text-base text-[var(--primary-dark)] pt-1">{vid.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/gallery" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Photo Gallery
          </Link>
        </div>

      </div>
    </div>
  );
}
