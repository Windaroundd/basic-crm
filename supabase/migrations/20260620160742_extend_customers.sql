-- Mở rộng thông tin khách hàng (tất cả optional)

alter table public.customers
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists position text,
  add column if not exists website text,
  add column if not exists source text check (
    source in ('referral', 'ads', 'website', 'social', 'other')
  ),
  add column if not exists tax_code text,
  add column if not exists date_of_birth date,
  add column if not exists gender text check (gender in ('male', 'female', 'other'));
