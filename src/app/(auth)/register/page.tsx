import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create an Account',
  description:
    'Request a parent, student or alumni account for the Jasmine Exclusive School portal.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Create your portal account</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Parents, students and alumni can request access. Staff accounts are created by the school
          administration.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-md p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
