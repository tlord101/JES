import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';
import { saveMediaAsset } from '@/lib/admin/content-actions';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('media_assets')
    .select('id, name, url, type, category, created_at')
    .order('created_at', { ascending: false })
    .limit(300);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Media library" />
        <div className="alert-danger">Failed to load media: {error.message}</div>
      </div>
    );
  }

  const rows = (data ?? []) as unknown as {
    id: string;
    name: string;
    url: string;
    type: string;
    category: string | null;
    created_at: string;
  }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media library"
        description="Reusable images and documents referenced across the site (gallery, pages, news)."
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form action={saveMediaAsset} className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <label className="block text-sm lg:col-span-2">
          <span className="mb-1 block font-medium text-slate-600">Name *</span>
          <input name="name" required className="input-field" placeholder="Assembly photo 2025" />
        </label>
        <label className="block text-sm lg:col-span-2">
          <span className="mb-1 block font-medium text-slate-600">URL *</span>
          <input name="url" required className="input-field" placeholder="https://... or /images/..." />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Type</span>
          <select name="type" className="input-field">
            <option value="image">Image</option>
            <option value="document">Document</option>
            <option value="video">Video</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Category</span>
          <input name="category" className="input-field" placeholder="gallery" />
        </label>
        <div className="sm:col-span-2 lg:col-span-6">
          <button type="submit" className="btn-primary">
            Add media
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <EmptyState message="No media yet — add the first asset above." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>URL</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium text-slate-900">{m.name}</td>
                  <td>
                    <Badge tone={m.type === 'image' ? 'info' : m.type === 'video' ? 'warning' : 'neutral'}>{m.type}</Badge>
                  </td>
                  <td>{m.category ?? '—'}</td>
                  <td className="max-w-[22rem] truncate">
                    <a href={m.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                      {m.url}
                    </a>
                  </td>
                  <td className="text-slate-500">{formatDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
