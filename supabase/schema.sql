-- ============================================
-- XENOTIF® — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text check (plan in ('pro', 'elite')) not null,
  status text check (status in ('trialing','active','canceled','past_due','incomplete')) default 'trialing' not null,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Workouts
create table public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  discipline text not null,
  duration_minutes integer default 0,
  notes text,
  completed_at timestamptz default now() not null
);

-- Progress (session completion tracking)
create table public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  discipline text not null,
  week integer not null,
  session_name text not null,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, discipline, week, session_name)
);

-- Admin users
create table public.admin_users (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null
);

-- ============================================
-- Row Level Security
-- ============================================
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.workouts enable row level security;
alter table public.progress enable row level security;
alter table public.admin_users enable row level security;

-- Profiles policies
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Service role access profiles" on public.profiles for all using (auth.role() = 'service_role');

-- Subscriptions policies
create policy "Users view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Service role access subscriptions" on public.subscriptions for all using (auth.role() = 'service_role');

-- Workouts policies
create policy "Users manage own workouts" on public.workouts for all using (auth.uid() = user_id);

-- Progress policies
create policy "Users manage own progress" on public.progress for all using (auth.uid() = user_id);

-- Admin policies
create policy "Admins view admin table" on public.admin_users for select using (auth.uid() = id);
create policy "Service role access admin" on public.admin_users for all using (auth.role() = 'service_role');

-- ============================================
-- Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Updated_at trigger
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();
