#!/usr/bin/env node
/**
 * RLS cross-tenant probe for Jasmine Exclusive School.
 *
 * Signs in as two real portal users (e.g. two parents of different students)
 * with the ANON key — exactly what a browser attacker could do — and tries to
 * read rows outside their own scope. Any row that comes back is a leak.
 *
 * Usage:
 *   npm run check:rls
 *
 * Required in .env.local (anon key, NOT the service role key):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   RLS_USER1_EMAIL / RLS_USER1_PASSWORD
 *   RLS_USER2_EMAIL / RLS_USER2_PASSWORD
 */
import { existsSync, readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const users = [
  { label: 'user1', email: process.env.RLS_USER1_EMAIL, password: process.env.RLS_USER1_PASSWORD },
  { label: 'user2', email: process.env.RLS_USER2_EMAIL, password: process.env.RLS_USER2_PASSWORD },
];

function fail(message) {
  console.error(`\n[check:rls] ${message}\n`);
  process.exit(1);
}

if (!url || !anonKey) fail('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.');
for (const u of users) {
  if (!u.email || !u.password) fail(`RLS_USER credentials missing for ${u.label}.`);
}

const ANON = createClient(url, anonKey, { auth: { persistSession: false } });

/**
 * Tables a regular portal user must NEVER list unscoped. A select with no
 * filters should return an empty set (or a policy error) for every role
 * except staff/admin — if these test accounts are parents/students, any
 * non-empty result is an RLS leak.
 */
const SENSITIVE_TABLES = [
  'results',
  'continuous_assessments',
  'report_cards',
  'invoices',
  'payments',
  'payment_receipts',
  'students',
  'attendance',
  'assignment_submissions',
  'messages',
  'notifications',
  'audit_logs',
  'profiles',
  'admission_applications',
  'contact_messages',
];

async function signIn(u) {
  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email: u.email, password: u.password });
  if (error) fail(`Could not sign in as ${u.email}: ${error.message}`);
  return client;
}

let leaks = 0;
let errors = 0;

function report(user, table, status, detail) {
  const icon = status === 'PASS' ? '✓' : status === 'LEAK' ? '✗ LEAK' : '! ERROR';
  console.log(`${icon.padEnd(8)} ${user.email.padEnd(34)} ${table.padEnd(26)} ${detail}`);
  if (status === 'LEAK') leaks += 1;
  if (status === 'ERROR') errors += 1;
}

async function probe(user) {
  console.log(`\n--- signed in as ${user.email} ---`);
  for (const table of SENSITIVE_TABLES) {
    const { data, error } = await ANON.from(table).select('id').limit(5);
    if (error) {
      // A permission/policy error is fine — it means RLS blocked the query.
      report(user, table, 'PASS', `blocked: ${error.message.slice(0, 60)}`);
      continue;
    }
    if ((data?.length ?? 0) > 0) {
      report(user, table, 'LEAK', `returned ${data.length}+ rows unscoped`);
    } else {
      report(user, table, 'PASS', '0 rows');
    }
  }
}

async function main() {
  console.log('[check:rls] Probing', url);
  for (const u of users) {
    const client = await signIn(u);
    u.email = (await client.auth.getUser()).data.user?.email ?? u.email;
    await probe(u);
    await client.auth.signOut();
  }

  console.log(`\n[check:rls] done — ${leaks} leak(s), ${errors} error(s).`);
  if (leaks > 0) {
    console.error('[check:rls] RLS LEAKS FOUND — do not ship. Review the policies for the tables above.');
    process.exit(1);
  }
  console.log('[check:rls] All sensitive tables are correctly scoped for non-privileged users.');
}

main().catch((error) => fail(error?.message ?? String(error)));
