#!/usr/bin/env node
/**
 * Bootstrap the first administrator for Jasmine Exclusive School.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and the
 * SEED_ADMIN_* variables in .env.local. Run it once, then sign in and change
 * the password from the profile screen.
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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const fullName = process.env.SEED_ADMIN_NAME ?? 'School Administrator';

function fail(message) {
  console.error(`\n[seed:admin] ${message}\n`);
  process.exit(1);
}

if (!url) fail('NEXT_PUBLIC_SUPABASE_URL is missing. Copy .env.example to .env.local first.');
if (!serviceRoleKey) fail('SUPABASE_SERVICE_ROLE_KEY is missing.');
if (!email) fail('SEED_ADMIN_EMAIL is missing.');
if (!password) fail('SEED_ADMIN_PASSWORD is missing.');
if (password.length < 8) fail('SEED_ADMIN_PASSWORD must be at least 8 characters long.');
if (/ChangeThisBeforeRunning/i.test(password)) {
  fail('Replace the placeholder SEED_ADMIN_PASSWORD with a real password before running.');
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findExistingAdmin() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('role', 'super_admin')
    .limit(1);

  if (error) fail(`Could not read profiles: ${error.message}`);
  return data?.[0] ?? null;
}

async function main() {
  console.log('[seed:admin] Connecting to', url);

  const existing = await findExistingAdmin();
  if (existing) {
    console.log(`[seed:admin] A super administrator already exists (${existing.email}).`);
    console.log('[seed:admin] Nothing to do. Promote other users from /admin/users.');
    return;
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'super_admin' },
  });

  if (createError) {
    if (/already/i.test(createError.message)) {
      fail(
        `A user with ${email} already exists in auth.users. Delete it in the Supabase dashboard or promote it manually.`
      );
    }
    fail(`Could not create the administrator account: ${createError.message}`);
  }

  const userId = created.user?.id;
  if (!userId) fail('Supabase did not return the new user id.');

  // The handle_new_user trigger creates the profile; make sure the role and
  // activation flags are exactly right.
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        role: 'super_admin',
        is_active: true,
        is_verified: true,
      },
      { onConflict: 'id' }
    );

  if (profileError) fail(`Could not write the administrator profile: ${profileError.message}`);

  await supabase.from('audit_logs').insert({
    action: 'Administrator provisioned',
    category: 'System',
    details: `Initial super administrator ${email} created by the seed script`,
    actor_email: email,
    actor_name: fullName,
  });

  console.log('\n[seed:admin] Super administrator created successfully.');
  console.log(`[seed:admin]   email:    ${email}`);
  console.log('[seed:admin]   portal:   /login/admin');
  console.log('[seed:admin]   next:     sign in and change the password immediately.\n');
}

main().catch((error) => fail(error?.message ?? String(error)));
