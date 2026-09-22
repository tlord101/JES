import type { Metadata } from 'next';
import PasswordRecoveryForm from '@/components/auth/PasswordRecoveryForm';

export const metadata: Metadata = {
  title: 'Set a New Password',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Choose a new password</h1>
        <p className="text-xs text-[var(--muted-text)]">
          This page is reached from the reset link in your email. The link expires shortly after it
          is issued, so set your password now.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-md p-6">
        <PasswordRecoveryForm mode="reset" />
      </div>
    </div>
  );
}
