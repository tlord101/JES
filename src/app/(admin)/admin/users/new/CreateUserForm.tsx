'use client';

import { useActionState, useState } from 'react';
import { initialAuthState } from '@/lib/auth/action-state';
import { createUserAction } from '../actions';

type Props = { classes: { id: string; name: string }[] };

const ROLE_OPTIONS: [string, string][] = [
  ['super_admin', 'Super Administrator'],
  ['admin', 'Administrator'],
  ['principal', 'Principal'],
  ['vice_principal', 'Vice Principal'],
  ['hod', 'Head of Department'],
  ['teacher', 'Teacher'],
  ['accountant', 'Accountant'],
  ['parent', 'Parent / Guardian'],
  ['student', 'Student'],
  ['alumni', 'Alumni'],
];

const STAFF_CREATE_ROLES = ['teacher', 'hod'];

export default function CreateUserForm({ classes }: Props) {
  const [state, formAction, isPending] = useActionState(createUserAction, initialAuthState);
  const [role, setRole] = useState('teacher');

  return (
    <form action={formAction} className="bg-white p-6 border border-[var(--border)] rounded space-y-5">
      {state.status !== 'idle' && (
        <div
          className={`p-3 text-xs rounded font-bold ${
            state.status === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold mb-1" htmlFor="fullName">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="e.g. Mr. Chidi Amadi"
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="email">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="chidi@jasmine.edu.ng"
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="phone">
            Phone Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+234 800 000 0000"
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="role">
            Assigned Role Category *
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {ROLE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="password">
            Temporary Password *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters. The user can change it after first sign-in."
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
      </div>

      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-[var(--border)] pt-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="gender">Gender *</label>
            <select id="gender" name="gender" className="w-full p-2 border border-[var(--border)] rounded font-bold">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="classId">Assign to Class *</label>
            <select id="classId" name="classId" className="w-full p-2 border border-[var(--border)] rounded font-bold">
              <option value="">Select a classâ€¦</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="admissionNo">Admission Number (auto if blank)</label>
            <input id="admissionNo" name="admissionNo" type="text" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
        </div>
      )}

      {(role === 'teacher' || role === 'hod') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border-t border-[var(--border)] pt-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="position">Position *</label>
            <input id="position" name="position" type="text" placeholder="e.g. Mathematics Teacher" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="department">Department</label>
            <input id="department" name="department" type="text" placeholder="e.g. Sciences" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="staffNo">Staff Number (auto if blank)</label>
            <input id="staffNo" name="staffNo" type="text" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
        </div>
      )}

      {role === 'parent' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border-t border-[var(--border)] pt-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="occupation">Occupation</label>
            <input id="occupation" name="occupation" type="text" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="relationship">Relationship to Student</label>
            <input id="relationship" name="relationship" type="text" placeholder="e.g. Mother" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="address">Home Address</label>
            <input id="address" name="address" type="text" className="w-full p-2 border border-[var(--border)] rounded" />
          </div>
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {isPending ? 'Creatingâ€¦' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}

