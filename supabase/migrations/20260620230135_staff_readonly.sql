-- Staff chỉ được XEM. Mọi thao tác ghi đều cần admin trở lên.

-- customers: chỉ admin được thêm/sửa (xóa đã là admin sẵn)
drop policy if exists "Customers: insert" on public.customers;
create policy "Customers: insert (admins)"
  on public.customers for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Customers: update" on public.customers;
create policy "Customers: update (admins)"
  on public.customers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- customer_prices: đọc cho mọi người đăng nhập, ghi chỉ admin
drop policy if exists "Customer prices: all" on public.customer_prices;

drop policy if exists "Customer prices: read" on public.customer_prices;
create policy "Customer prices: read"
  on public.customer_prices for select
  to authenticated
  using (true);

drop policy if exists "Customer prices: write (admins)" on public.customer_prices;
create policy "Customer prices: write (admins)"
  on public.customer_prices for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
