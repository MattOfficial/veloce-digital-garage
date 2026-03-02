create table if not exists public.user_badges (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    badge_id text not null,
    earned_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index if not exists idx_user_badges_user_id on public.user_badges(user_id);
create unique index if not exists idx_user_badges_user_badge on public.user_badges(user_id, badge_id);

-- Enable RLS
alter table public.user_badges enable row level security;

-- Policies
drop policy if exists "Users can view their own badges" on public.user_badges;
create policy "Users can view their own badges"
on public.user_badges for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own badges" on public.user_badges;
create policy "Users can insert their own badges"
on public.user_badges for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own badges" on public.user_badges;
create policy "Users can delete their own badges"
on public.user_badges for delete
using (auth.uid() = user_id);
