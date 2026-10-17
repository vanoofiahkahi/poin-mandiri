-- remind+ · pengaturan database Supabase
-- Jalankan sekali di Supabase → SQL Editor → New query → tempel → Run.

-- 1. Tabel data aplikasi: satu baris per akun
create table if not exists public.app_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Keamanan: setiap akun hanya bisa membaca dan mengubah datanya sendiri
alter table public.app_state enable row level security;

drop policy if exists "baca data sendiri"  on public.app_state;
drop policy if exists "tambah data sendiri" on public.app_state;
drop policy if exists "ubah data sendiri"  on public.app_state;
drop policy if exists "hapus data sendiri" on public.app_state;

create policy "baca data sendiri"  on public.app_state for select using (auth.uid() = user_id);
create policy "tambah data sendiri" on public.app_state for insert with check (auth.uid() = user_id);
create policy "ubah data sendiri"  on public.app_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hapus data sendiri" on public.app_state for delete using (auth.uid() = user_id);

-- 3. Fitur "Hapus akun" di aplikasi
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = public
as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
