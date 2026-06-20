-- Auth roles + profiles + role-based RLS

-- 1. Role enum
do $$ begin
  create type public.app_role as enum ('super_admin', 'admin', 'staff');
exception
  when duplicate_object then null;
end $$;

-- 2. profiles: 1-1 với auth.users, giữ username + role
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text,
  role public.app_role not null default 'staff',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 3. Helpers (SECURITY DEFINER để tránh đệ quy RLS khi đọc profiles)
create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'super_admin'), false)
$$;

-- 4. RLS profiles: đọc của mình; admin trở lên đọc tất cả.
-- Thao tác ghi (tạo/sửa/xóa user) đi qua Edge Function dùng service_role
-- (bỏ qua RLS), nên KHÔNG mở policy insert/update/delete cho client.
drop policy if exists "Profiles: read own" on public.profiles;
create policy "Profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Profiles: admins read all" on public.profiles;
create policy "Profiles: admins read all"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- 5. Siết RLS customers: phải đăng nhập mới xem/sửa; chỉ admin trở lên mới xóa.
drop policy if exists "Public full access to customers" on public.customers;

drop policy if exists "Customers: read" on public.customers;
create policy "Customers: read"
  on public.customers for select
  to authenticated
  using (true);

drop policy if exists "Customers: insert" on public.customers;
create policy "Customers: insert"
  on public.customers for insert
  to authenticated
  with check (true);

drop policy if exists "Customers: update" on public.customers;
create policy "Customers: update"
  on public.customers for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Customers: delete (admins)" on public.customers;
create policy "Customers: delete (admins)"
  on public.customers for delete
  to authenticated
  using (public.is_admin());
