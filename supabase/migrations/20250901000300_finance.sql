-- ============================================================================
-- Jasmine Exclusive School (JES) - Finance
-- Migration 03: fee structures, invoices, payments, receipts
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('unpaid', 'partial', 'paid', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('cash', 'bank_transfer', 'paystack', 'cheque', 'pos');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending', 'completed', 'failed', 'reversed');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Fee structures and their line items
-- ---------------------------------------------------------------------------
create table if not exists public.fee_structures (
  id                uuid primary key default gen_random_uuid(),
  academic_year_id  uuid not null references public.academic_years (id) on delete cascade,
  term_id           uuid references public.terms (id) on delete set null,
  class_id          uuid references public.classes (id) on delete cascade,
  name              text not null,
  description       text,
  total_amount      numeric(12,2) not null default 0 check (total_amount >= 0),
  due_date          date,
  is_active         boolean not null default true,
  created_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (academic_year_id, term_id, class_id, name)
);

create index if not exists fee_structures_term_idx on public.fee_structures (term_id);
create index if not exists fee_structures_class_idx on public.fee_structures (class_id);

drop trigger if exists fee_structures_set_updated_at on public.fee_structures;
create trigger fee_structures_set_updated_at
  before update on public.fee_structures
  for each row execute function public.set_updated_at();

create table if not exists public.fee_items (
  id                uuid primary key default gen_random_uuid(),
  fee_structure_id  uuid not null references public.fee_structures (id) on delete cascade,
  name              text not null,
  amount            numeric(12,2) not null default 0 check (amount >= 0),
  is_optional       boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now()
);

create index if not exists fee_items_structure_idx on public.fee_items (fee_structure_id);

-- Keep the parent structure total in step with its items
create or replace function public.sync_fee_structure_total()
returns trigger
language plpgsql
as $$
declare
  target_structure uuid;
  computed_total numeric(12,2);
begin
  target_structure := coalesce(new.fee_structure_id, old.fee_structure_id);
  select coalesce(sum(amount), 0) into computed_total
    from public.fee_items
   where fee_structure_id = target_structure and not is_optional;
  update public.fee_structures
     set total_amount = computed_total
   where id = target_structure;
  return coalesce(new, old);
end;
$$;

drop trigger if exists fee_items_sync_total on public.fee_items;
create trigger fee_items_sync_total
  after insert or update or delete on public.fee_items
  for each row execute function public.sync_fee_structure_total();-- ---------------------------------------------------------------------------
-- Document numbering helpers
-- ---------------------------------------------------------------------------
create sequence if not exists public.invoice_no_seq start 1;
create sequence if not exists public.receipt_no_seq start 1;

create or replace function public.next_invoice_no()
returns text
language sql volatile
as $$
  select 'JES/INV/' || to_char(now(), 'YYYY') || '/' || lpad(nextval('public.invoice_no_seq')::text, 5, '0');
$$;

create or replace function public.next_receipt_no()
returns text
language sql volatile
as $$
  select 'JES/RCP/' || to_char(now(), 'YYYY') || '/' || lpad(nextval('public.receipt_no_seq')::text, 5, '0');
$$;

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id                uuid primary key default gen_random_uuid(),
  invoice_no        text not null unique,
  student_id        uuid not null references public.students (id) on delete cascade,
  fee_structure_id  uuid references public.fee_structures (id) on delete set null,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  term_id           uuid references public.terms (id) on delete set null,
  title             text not null default 'School fees',
  total_amount      numeric(12,2) not null default 0 check (total_amount >= 0),
  amount_paid       numeric(12,2) not null default 0 check (amount_paid >= 0),
  balance           numeric(12,2) generated always as (total_amount - amount_paid) stored,
  status            public.invoice_status not null default 'unpaid',
  due_date          date,
  issued_at         timestamptz not null default now(),
  notes             text,
  created_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists invoices_student_idx on public.invoices (student_id);
create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists invoices_term_idx on public.invoices (term_id);

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

create or replace function public.invoices_default_number()
returns trigger
language plpgsql
as $$
begin
  if new.invoice_no is null or new.invoice_no = '' then
    new.invoice_no := public.next_invoice_no();
  end if;
  return new;
end;
$$;

drop trigger if exists invoices_default_number on public.invoices;
create trigger invoices_default_number
  before insert on public.invoices
  for each row execute function public.invoices_default_number();-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  invoice_id   uuid references public.invoices (id) on delete set null,
  student_id   uuid not null references public.students (id) on delete cascade,
  amount       numeric(12,2) not null check (amount > 0),
  method       public.payment_method not null default 'cash',
  status       public.payment_status not null default 'completed',
  reference    text,
  narration    text,
  paid_at      timestamptz not null default now(),
  recorded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists payments_student_idx on public.payments (student_id);
create index if not exists payments_invoice_idx on public.payments (invoice_id);
create index if not exists payments_paid_at_idx on public.payments (paid_at desc);

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Recalculate the parent invoice whenever payments change
create or replace function public.recalculate_invoice(target_invoice uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  paid_total numeric(12,2);
  invoice_total numeric(12,2);
begin
  if target_invoice is null then
    return;
  end if;

  select coalesce(sum(amount), 0) into paid_total
    from public.payments
   where invoice_id = target_invoice and status = 'completed';

  select total_amount into invoice_total
    from public.invoices where id = target_invoice;

  if invoice_total is null then
    return;
  end if;

  update public.invoices
     set amount_paid = paid_total,
         status = case
           when paid_total <= 0 then 'unpaid'::public.invoice_status
           when paid_total >= invoice_total then 'paid'::public.invoice_status
           else 'partial'::public.invoice_status
         end
   where id = target_invoice and status <> 'cancelled'::public.invoice_status;
end;
$$;

create or replace function public.payments_after_change()
returns trigger
language plpgsql
as $$
begin
  perform public.recalculate_invoice(coalesce(new.invoice_id, old.invoice_id));
  if tg_op = 'UPDATE' and old.invoice_id is distinct from new.invoice_id then
    perform public.recalculate_invoice(old.invoice_id);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists payments_after_change on public.payments;
create trigger payments_after_change
  after insert or update or delete on public.payments
  for each row execute function public.payments_after_change();-- ---------------------------------------------------------------------------
-- Payment receipts
-- ---------------------------------------------------------------------------
create table if not exists public.payment_receipts (
  id          uuid primary key default gen_random_uuid(),
  payment_id  uuid not null unique references public.payments (id) on delete cascade,
  receipt_no  text not null unique,
  issued_by   uuid references public.profiles (id) on delete set null,
  issued_at   timestamptz not null default now(),
  snapshot    jsonb not null default '{}'::jsonb,
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists payment_receipts_issued_idx on public.payment_receipts (issued_at desc);

create or replace function public.payments_default_receipt()
returns trigger
language plpgsql
as $$
declare
  new_receipt_id uuid;
begin
  if new.status = 'completed' then
    insert into public.payment_receipts (payment_id, receipt_no, issued_by, snapshot)
    values (
      new.id,
      public.next_receipt_no(),
      new.recorded_by,
      jsonb_build_object(
        'student_id', new.student_id,
        'invoice_id', new.invoice_id,
        'amount', new.amount,
        'method', new.method,
        'reference', new.reference,
        'paid_at', new.paid_at
      )
    )
    on conflict (payment_id) do nothing
    returning id into new_receipt_id;
  end if;
  return new;
end;
$$;

drop trigger if exists payments_default_receipt on public.payments;
create trigger payments_default_receipt
  after insert on public.payments
  for each row execute function public.payments_default_receipt();