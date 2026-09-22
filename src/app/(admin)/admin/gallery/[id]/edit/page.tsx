import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { GalleryAlbumRow } from '@/types/database';
import type { GalleryAlbum } from '@/lib/data/cms';
import AlbumForm from '../../AlbumForm';
import { addAlbumImageAction, deleteAlbumImageAction } from '@/lib/cms/actions';

export const metadata = { title: 'Manage Album | JES Admin' };

export default async function ManageAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: albumRow } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!albumRow) notFound();

  const { data: images } = await supabase
    .from('gallery_images')
    .select('id, image_url, caption')
    .eq('album_id', id)
    .order('sort_order', { ascending: true });

  const row = albumRow as GalleryAlbumRow;
  const album: GalleryAlbum = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    category: row.category,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    imageCount: images?.length ?? 0,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AlbumForm album={album} />

      {/* Album photos */}
      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
          <i className="bi bi-images text-[var(--primary)]"></i>
          <span>Album Photos ({album.imageCount})</span>
        </h2>

        {/* Add photo form */}
        <form action={addAlbumImageAction} className="flex flex-col sm:flex-row gap-2 text-xs">
          <input type="hidden" name="albumId" value={album.id} />
          <input
            name="imageUrl"
            type="url"
            required
            placeholder="Image URL (Supabase Storage)"
            className="flex-1 p-2 border border-[var(--border)] rounded"
          />
          <input
            name="caption"
            type="text"
            placeholder="Caption (optional)"
            className="flex-1 p-2 border border-[var(--border)] rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded"
          >
            Add Photo
          </button>
        </form>

        {images && images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <div className="relative h-28 bg-[var(--soft-bg)] rounded overflow-hidden">
                  <Image
                    src={img.image_url}
                    alt={img.caption ?? 'Gallery photo'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <form action={deleteAlbumImageAction} className="absolute top-1 right-1">
                  <input type="hidden" name="imageId" value={img.id} />
                  <button
                    type="submit"
                    className="w-6 h-6 bg-red-600 text-white rounded-full text-[10px] font-bold"
                    title="Remove photo"
                  >
                    ×
                  </button>
                </form>
                {img.caption && (
                  <p className="text-[10px] text-[var(--muted-text)] mt-1 truncate">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted-text)]">No photos in this album yet.</p>
        )}
      </div>
    </div>
  );
}
