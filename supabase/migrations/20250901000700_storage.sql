-- ============================================================================
-- Jasmine Exclusive School (JES) - Supabase Storage
-- Migration 07: buckets + object policies
--   public-media      : website images (news, events, gallery, logos)
--   avatars           : user profile pictures
--   private-documents : report cards, receipts, admission documents
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'public-media', 'public-media', true, 10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4']
  ),
  (
    'avatars', 'avatars', true, 5242880,
    array['image/png', 'image/jpeg', 'image/webp']
  ),
  (
    'private-documents', 'private-documents', false, 20971520,
    array['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  )
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- public-media / avatars: world readable, staff writable
-- ---------------------------------------------------------------------------
drop policy if exists "jes public media read" on storage.objects;
create policy "jes public media read" on storage.objects
  for select using (bucket_id in ('public-media', 'avatars'));

drop policy if exists "jes media write staff" on storage.objects;
create policy "jes media write staff" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'public-media' and public.can_manage_content());

drop policy if exists "jes media update staff" on storage.objects;
create policy "jes media update staff" on storage.objects
  for update to authenticated
  using (bucket_id = 'public-media' and public.can_manage_content())
  with check (bucket_id = 'public-media' and public.can_manage_content());

drop policy if exists "jes media delete staff" on storage.objects;
create policy "jes media delete staff" on storage.objects
  for delete to authenticated
  using (bucket_id = 'public-media' and public.can_manage_content());

-- Avatar folders are namespaced by user id: {user_id}/photo.png
drop policy if exists "jes avatar write own" on storage.objects;
create policy "jes avatar write own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "jes avatar update own" on storage.objects;
create policy "jes avatar update own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );-- ---------------------------------------------------------------------------
-- private-documents: admission uploads + school records
-- ---------------------------------------------------------------------------
drop policy if exists "jes private docs upload" on storage.objects;
create policy "jes private docs upload" on storage.objects
  for insert
  with check (bucket_id = 'private-documents');

drop policy if exists "jes private docs read" on storage.objects;
create policy "jes private docs read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'private-documents'
    and (public.is_staff() or public.is_admin() or owner = auth.uid())
  );

drop policy if exists "jes private docs manage" on storage.objects;
create policy "jes private docs manage" on storage.objects
  for update to authenticated
  using (bucket_id = 'private-documents' and public.is_staff())
  with check (bucket_id = 'private-documents' and public.is_staff());

drop policy if exists "jes private docs delete" on storage.objects;
create policy "jes private docs delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'private-documents' and public.is_admin());