import Link from 'next/link';
import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
  actions,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  actions?: ReactNode;
}) {
  const right = action ?? actions;
  return (
    <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">{title}</h1>
        {description ? <p className="text-xs text-[var(--muted-text)]">{description}</p> : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

type FlashValue = string | string[] | undefined;
function flashStr(v: FlashValue): string | undefined {
  return typeof v === 'string' && v ? v : undefined;
}

export function Flash({ ok, err }: { ok?: FlashValue; err?: FlashValue }) {
  const okMsg = flashStr(ok);
  const errMsg = flashStr(err);
  if (!okMsg && !errMsg) return null;
  return (
    <div
      className={`p-3 rounded text-xs font-bold border ${
        errMsg
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-green-50 text-green-700 border-green-200'
      }`}
    >
      {errMsg ? <i className="bi bi-exclamation-triangle mr-1" /> : <i className="bi bi-check-circle mr-1" />}
      {errMsg ?? okMsg}
    </div>
  );
}

const TONES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-amber-100 text-amber-800',
  review: 'bg-amber-100 text-amber-800',
  under_review: 'bg-amber-100 text-amber-800',
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  active: 'bg-green-100 text-green-800',
  present: 'bg-green-100 text-green-800',
  enrolled: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800',
  late: 'bg-amber-100 text-amber-800',
  partial: 'bg-amber-100 text-amber-800',
  waitlisted: 'bg-amber-100 text-amber-800',
  excused: 'bg-blue-100 text-blue-800',
  waitlisted_: 'bg-blue-100 text-blue-800',
  suspended: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-700',
  graduated: 'bg-blue-100 text-blue-800',
  unpaid: 'bg-red-100 text-red-800',
  urgent: 'bg-red-100 text-red-800',
  high: 'bg-amber-100 text-amber-800',
  normal: 'bg-gray-100 text-gray-700',
  low: 'bg-gray-100 text-gray-500',
  read: 'bg-blue-100 text-blue-800',
  unread: 'bg-amber-100 text-amber-800',
};

export function StatusBadge({ status }: { status?: string | null }) {
  const key = (status ?? '').toLowerCase();
  return (
    <span className={`px-2 py-0.5 font-bold text-[10px] rounded capitalize ${TONES[key] ?? 'bg-gray-100 text-gray-700'}`}>
      {(status ?? '—').replace('_', ' ')}
    </span>
  );
}

export function EmptyState({
  message,
  cta,
  title,
  body,
  action,
}: {
  message?: string;
  cta?: { href: string; label: string };
  title?: string;
  body?: string;
  action?: ReactNode;
}) {
  const text = body ?? message;
  return (
    <div className="bg-white p-10 border border-[var(--border)] rounded text-center space-y-3">
      <i className="bi bi-inbox text-3xl text-[var(--muted-text)]"></i>
      {title ? <p className="text-sm font-semibold text-slate-800">{title}</p> : null}
      {text ? <p className="text-xs text-[var(--muted-text)]">{text}</p> : null}
      {action ? <div>{action}</div> : null}
      {cta ? (
        <Link href={cta.href} className="inline-block px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded">
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}

/** Generic pill badge used for statuses not covered by StatusBadge. */
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}) {
  const tones: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    error: 'bg-red-50 text-red-700 ring-red-200',
    info: 'bg-sky-50 text-sky-700 ring-sky-200',
    neutral: 'bg-slate-50 text-slate-600 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}
