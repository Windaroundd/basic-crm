-- Giá riêng theo từng khách cho từng sản phẩm (override giá mặc định lẻ/sỉ).
-- Mỗi cặp (khách, sản phẩm) chỉ 1 giá riêng.

create table if not exists public.customer_prices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  price numeric not null,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create index if not exists customer_prices_customer_idx
  on public.customer_prices (customer_id);

alter table public.customer_prices enable row level security;

-- Đã đăng nhập là đọc/ghi được (cô là người dùng chính).
drop policy if exists "Customer prices: all" on public.customer_prices;
create policy "Customer prices: all"
  on public.customer_prices for all
  to authenticated
  using (true)
  with check (true);
