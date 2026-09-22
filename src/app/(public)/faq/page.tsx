import { listFaqs } from '@/lib/data/cms';

export const metadata = {
  title: 'Frequently Asked Questions | Jasmine Exclusive School',
  description: 'Answers to common questions about admissions, fees, academics, and school life at JES.',
};

export default async function FaqPage() {
  const faqs = await listFaqs({ publishedOnly: true });

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-12 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-200">
            Quick answers about admissions, fees, academics, and daily life at Jasmine Exclusive School.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {faqs.length === 0 ? (
          <p className="text-sm text-[var(--muted-text)]">
            No FAQs published yet. Please contact the school office for any questions.
          </p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 capitalize">
                {category}
              </h2>
              {items.map((faq) => (
                <details
                  key={faq.id}
                  className="group bg-white border border-[var(--border)] rounded p-4"
                >
                  <summary className="flex justify-between items-center cursor-pointer font-bold text-sm text-[var(--text)]">
                    {faq.question}
                    <i className="bi bi-chevron-down text-[var(--primary)] transition-transform group-open:rotate-180"></i>
                  </summary>
                  <p className="pt-3 text-xs text-[var(--muted-text)] leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
