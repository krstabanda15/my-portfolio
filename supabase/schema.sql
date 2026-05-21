create table if not exists public.portfolio_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

create policy "Portfolio content is public"
on public.portfolio_content
for select
using (id = 'public');

create policy "Only the owner can insert portfolio content"
on public.portfolio_content
for insert  
with check (auth.uid() = 'REPLACE_WITH_YOUR_AUTH_USER_ID');

create policy "Only the owner can update portfolio content"
on public.portfolio_content
for update
using (auth.uid() = 'REPLACE_WITH_YOUR_AUTH_USER_ID')
with check (auth.uid() = 'REPLACE_WITH_YOUR_AUTH_USER_ID');
