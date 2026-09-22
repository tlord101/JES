import Link from 'next/link';

export default function FeesPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admissions</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Tuition & School Fees</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs text-amber-900 flex items-center gap-2">
            <i className="bi bi-info-circle-fill text-amber-600 text-base"></i>
            <span>School fees cover tuition, laboratory sessions, ICT access, library services, and core co-curricular activities.</span>
          </div>

          <div className="border border-[var(--border)] rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--primary)] text-white font-bold">
                  <th className="p-3 border-b border-slate-300">Academic Division</th>
                  <th className="p-3 border-b border-slate-300">Application Form</th>
                  <th className="p-3 border-b border-slate-300">Termly Tuition (₦)</th>
                  <th className="p-3 border-b border-slate-300">Development Fee (One-off)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[var(--text)]">
                <tr>
                  <td className="p-3 font-semibold">Creche & Toddlers</td>
                  <td className="p-3">₦5,000</td>
                  <td className="p-3">₦65,000</td>
                  <td className="p-3">₦15,000</td>
                </tr>
                <tr className="bg-[var(--soft-bg)]">
                  <td className="p-3 font-semibold">Nursery (1 - 3)</td>
                  <td className="p-3">₦5,000</td>
                  <td className="p-3">₦75,000</td>
                  <td className="p-3">₦20,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Primary (1 - 6)</td>
                  <td className="p-3">₦5,000</td>
                  <td className="p-3">₦90,000</td>
                  <td className="p-3">₦25,000</td>
                </tr>
                <tr className="bg-[var(--soft-bg)]">
                  <td className="p-3 font-semibold">Junior Secondary (JSS 1 - 3)</td>
                  <td className="p-3">₦10,000</td>
                  <td className="p-3">₦120,000</td>
                  <td className="p-3">₦30,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Senior Secondary (SSS 1 - 3)</td>
                  <td className="p-3">₦10,000</td>
                  <td className="p-3">₦140,000</td>
                  <td className="p-3">₦35,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
            <h3 className="font-bold text-sm text-[var(--primary-dark)]">Additional Services (Optional)</h3>
            <ul className="text-xs text-[var(--muted-text)] space-y-1 list-disc pl-5">
              <li><strong>School Bus Shuttle Service:</strong> ₦25,000 - ₦35,000 per term (based on route distance).</li>
              <li><strong>Boarding Facility (Hostel):</strong> ₦180,000 per term (includes meals, laundry, and prep supervision).</li>
              <li><strong>Official Uniform & Sportswear Package:</strong> ₦35,000 (3 sets of uniforms, sportswear, cardigan, badge).</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Admissions
          </Link>
        </div>
      </div>
    </div>
  );
}
