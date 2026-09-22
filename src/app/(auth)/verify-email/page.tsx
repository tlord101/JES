import type { Metadata } from 'next';
import PasswordRecoveryForm from '@/components/auth/PasswordRecoveryForm';

export const metadata: Metadata = {
  title: 'Verify Your Email',
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Verify your email address</h1>
        <p className="text-xs text-[var(--muted-text)]">
          We send a confirmation link to every new account. Open that link to activate your portal
          access. If the message never arrived, request another one below.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-md p-6">
        <PasswordRecoveryForm mode="verify" />
      </div>
    </div>
  );
}
