-- Tách "khách tiềm năng" thành field riêng (is_lead), độc lập với status.
-- status từ nay chỉ còn: active (đang hoạt động) / inactive (ngừng hoạt động).

alter table public.customers
  add column if not exists is_lead boolean not null default false;

-- Chuyển dữ liệu cũ: ai đang status='lead' -> đánh dấu tiềm năng + đặt lại active
update public.customers
set is_lead = true, status = 'active'
where status = 'lead';
