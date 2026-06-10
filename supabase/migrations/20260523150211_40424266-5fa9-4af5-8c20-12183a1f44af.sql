
-- Profiles table linked to auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  gender text,
  birthday date,
  city text,
  hometown text,
  height text,
  education text,
  job text,
  school text,
  photos jsonb not null default '[]'::jsonb,
  main_idx int not null default 0,
  video_intro text,
  signature text,
  intro text,
  status text,
  interests jsonb not null default '[]'::jsonb,
  personality jsonb not null default '[]'::jsonb,
  mbti text,
  zodiac text,
  smoke text,
  drink text,
  sleep text,
  diet text,
  pet text,
  intent jsonb not null default '[]'::jsonb,
  relationship text,
  ideal_type text,
  age_range jsonb,
  distance text,
  icebreaker text,
  phone text,
  verify_real boolean not null default false,
  verify_student boolean not null default false,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create empty profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)),
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
