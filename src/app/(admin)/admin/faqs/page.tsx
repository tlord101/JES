import { listFaqs } from '@/lib/data/cms';
import { deleteFaqAction } from '@/lib/cms/actions';
import FaqForm from './FaqForm';

export const metadata = { title: 'FAQs CMS | JES Admin' };

export default async function AdminFaqsPage() {
  const faqs = await listFaqs();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">FAQ Management</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Questions published here appear on the public FAQ page for parents and visitors.
        </p>
      </div>

      <FaqForm />

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        {faqs.length === 0 ? (
          <p className="p-8 text-center text-xs text-[var(--muted-text)]">No FAQs yet — add the first one above.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded capitalize">{faq.category}</span>
                    {!faq.isPublished && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-[var(--text)]">{faq.question}</p>
                  <p className="text-xs text-[var(--muted-text)] line-clamp-2">{faq.answer}</p>
                </div>
                <form action={deleteFaqAction}>
                  <input type="hidden" name="id" value={faq.id} />
                  <button type="submit" className="text-[11px] font-bold text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
