import Link from 'next/link';
import { listPages } from '@/lib/data/cms';
import { deletePageAction } from '@/lib/cms/actions';

export const metadata = { title: 'Pages CMS | JES Admin' };

export default async function AdminPagesPage() {
  const pages = await listPages();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Editable Pages</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage editable content blocks (mission statement, principal&apos;s message, history, etc.).
          </p>
        </div>
        <Link
          href="/admin/pages/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)]"
        >
          New Page
        </Link>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        {pages.length === 0 ? (
          <p className="p-8 text-center text-xs text-[var(--muted-text)]">No editable pages yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--soft-bg)] text-left">
                <tr>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Title</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Section</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Slug</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Status</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Updated</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-t border-[var(--border)] hover:bg-[var(--soft-bg)]">
                    <td className="p-3 font-bold text-[var(--primary-dark)]">{page.title}</td>
                    <td className="p-3 capitalize">{page.section}</td>
                    <td className="p-3 font-mono text-[11px]">{page.slug}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded font-bold text-[10px] ${
                          page.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--muted-text)] font-mono text-[11px]">
                      {page.updatedAt.substring(0, 10)}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deletePageAction} className="inline">
                        <input type="hidden" name="id" value={page.id} />
                        <button type="submit" className="text-[11px] font-bold text-red-600 hover:underline">
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
