-- Sản phẩm + bảng giá (giá lẻ / giá sỉ). Cô tự thêm/sửa.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text,
  retail_price numeric not null default 0,
  wholesale_price numeric not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_name_idx on public.products (name);

alter table public.products enable row level security;

-- Đọc: mọi người đã đăng nhập. Ghi: chỉ admin trở lên.
drop policy if exists "Products: read" on public.products;
create policy "Products: read"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "Products: insert (admins)" on public.products;
create policy "Products: insert (admins)"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Products: update (admins)" on public.products;
create policy "Products: update (admins)"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Products: delete (admins)" on public.products;
create policy "Products: delete (admins)"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- 3 món mặc định (giá 0, cô tự cập nhật)
insert into public.products (name, unit, retail_price, wholesale_price) values
  ('Bánh bò thốt nốt', 'phần', 0, 0),
  ('Rau câu dừa sợi', 'phần', 0, 0),
  ('Tàu hủ Singapore', 'phần', 0, 0);
