
create table if not exists public.profiles_privacy (
  id uuid primary key,
  searchable boolean not null default true,
  allow_messages text not null default 'everyone' check (allow_messages in ('everyone','matches','none')),
  hide_city boolean not null default false,
  hide_distance boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles_privacy enable row level security;

create policy "Privacy readable to authed"
on public.profiles_privacy for select
to authenticated using (true);

create policy "Owner insert privacy"
on public.profiles_privacy for insert
to authenticated with check (auth.uid() = id);

create policy "Owner update privacy"
on public.profiles_privacy for update
to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create trigger trg_privacy_updated_at
before update on public.profiles_privacy
for each row execute function public.set_updated_at();
