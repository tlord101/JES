import Link from 'next/link';
import Image from 'next/image';
import { listGalleryAlbums } from '@/lib/data/cms';
import { deleteAlbumAction } from '@/lib/cms/actions';

export const metadata = { title: 'Gallery CMS | JES Admin' };

export default async function AdminGalleryPage() {
  const albums = await listGalleryAlbums();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Photo Gallery CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Organize school photo albums by category, term, or event for the public gallery.
          </p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-images"></i>
          <span>New Album</span>
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="bg-white p-10 border border-[var(--border)] rounded text-center space-y-2">
          <i className="bi bi-images text-3xl text-[var(--muted-text)]"></i>
          <p className="text-xs font-bold text-[var(--primary-dark)]">No albums yet</p>
          <p className="text-xs text-[var(--muted-text)]">Create the first photo album.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="bg-white border border-[var(--border)] rounded overflow-hidden">
              <div className="relative h-36 bg-[var(--soft-bg)]">
                {album.coverImageUrl ? (
                  <Image
                    src={album.coverImageUrl}
                    alt={album.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <i className="bi bi-image text-3xl text-[var(--muted-text)]"></i>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-bold text-[var(--primary-dark)]">{album.title}</h2>
                    <p className="text-[11px] text-[var(--muted-text)] capitalize">
                      {album.category} · {album.imageCount} photo{album.imageCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded font-bold text-[10px] ${
                      album.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {album.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-3 pt-1">
                  <Link
                    href={`/admin/gallery/${album.id}/edit`}
                    className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                  >
                    Manage
                  </Link>
                  <form action={deleteAlbumAction}>
                    <input type="hidden" name="id" value={album.id} />
                    <button type="submit" className="text-[11px] font-bold text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
