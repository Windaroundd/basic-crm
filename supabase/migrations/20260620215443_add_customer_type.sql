-- Phân loại khách: sỉ (wholesale) / lẻ (retail). Mặc định lẻ.

alter table public.customers
  add column if not exists customer_type text not null default 'retail'
    check (customer_type in ('retail', 'wholesale'));
