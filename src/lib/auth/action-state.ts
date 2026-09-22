/** Shared state shape for `useActionState` forms (safe for client + server). */
export type AuthActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Record<string, string>;
};

export const initialAuthState: AuthActionState = { status: 'idle' };
