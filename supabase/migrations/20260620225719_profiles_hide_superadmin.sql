-- Ẩn tài khoản super_admin khỏi admin.
-- super_admin: xem tất cả. admin: chỉ xem tài khoản không phải super_admin (+ chính mình).

drop policy if exists "Profiles: admins read all" on public.profiles;

drop policy if exists "Profiles: super_admin read all" on public.profiles;
create policy "Profiles: super_admin read all"
  on public.profiles for select
  to authenticated
  using (public.current_user_role() = 'super_admin');

drop policy if exists "Profiles: admin read non-superadmin" on public.profiles;
create policy "Profiles: admin read non-superadmin"
  on public.profiles for select
  to authenticated
  using (public.current_user_role() = 'admin' and role <> 'super_admin');
