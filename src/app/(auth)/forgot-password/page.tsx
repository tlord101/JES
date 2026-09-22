import type { Metadata } from 'next';
import PasswordRecoveryForm from '@/components/auth/PasswordRecoveryForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Reset your password</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Enter the email address on your school account and we will send you a secure reset link.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-md p-6">
        <PasswordRecoveryForm mode="forgot" />
      </div>
    </div>
  );
}
