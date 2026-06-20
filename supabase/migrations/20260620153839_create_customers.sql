-- customers: bảng quản lý thông tin khách hàng cho dashboard đơn giản

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  status text not null default 'active' check (status in ('active', 'inactive', 'lead')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists customers_created_at_idx on public.customers (created_at desc);
create index if not exists customers_name_idx on public.customers (name);

alter table public.customers enable row level security;

-- ⚠️ Dashboard đơn giản, chưa có auth: cho phép anon (publishable key) toàn quyền.
-- Khi thêm đăng nhập thật, siết lại policy theo auth.uid().
drop policy if exists "Public full access to customers" on public.customers;
create policy "Public full access to customers"
  on public.customers
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Vài dòng dữ liệu mẫu
insert into public.customers (name, email, phone, company, status) values
  ('Nguyễn Văn An', 'an.nguyen@example.com', '0901234567', 'Công ty TNHH An Phát', 'active'),
  ('Trần Thị Bình', 'binh.tran@example.com', '0912345678', 'Minno', 'lead'),
  ('Lê Hoàng Cường', 'cuong.le@example.com', '0987654321', 'FPT Software', 'inactive');
