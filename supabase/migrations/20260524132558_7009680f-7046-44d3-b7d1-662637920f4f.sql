
-- 1) campuses
create table public.campuses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  location text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.campuses enable row level security;

create policy "Campuses readable by authed"
  on public.campuses for select to authenticated using (true);

create policy "Admins manage campuses"
  on public.campuses for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 2) memberships
create table public.campus_memberships (
  campus_id uuid not null references public.campuses(id) on delete cascade,
  user_id uuid not null,
  invited_by uuid,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (campus_id, user_id)
);
alter table public.campus_memberships enable row level security;
create index on public.campus_memberships(user_id);

create policy "Users see own memberships"
  on public.campus_memberships for select to authenticated
  using (auth.uid() = user_id);

create policy "Admins read memberships"
  on public.campus_memberships for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins manage memberships"
  on public.campus_memberships for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
-- NOTE: no direct INSERT for regular users; must go through redeem_campus_invite()

-- 3) invites
create table public.campus_invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  campus_id uuid not null references public.campuses(id) on delete cascade,
  inviter_id uuid not null,
  max_uses integer not null default 1,
  uses integer not null default 0,
  expires_at timestamptz,
  status text not null default 'active', -- active | revoked
  created_at timestamptz not null default now()
);
alter table public.campus_invites enable row level security;
create index on public.campus_invites(campus_id);
create index on public.campus_invites(inviter_id);

create policy "Inviter sees own invites"
  on public.campus_invites for select to authenticated
  using (auth.uid() = inviter_id);

create policy "Admins read invites"
  on public.campus_invites for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins manage invites"
  on public.campus_invites for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
-- NOTE: regular users create invites via create_campus_invite() RPC

-- 4) is_campus_member helper (SECURITY DEFINER to bypass RLS on memberships)
create or replace function public.is_campus_member(_user_id uuid, _campus_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.campus_memberships
    where user_id = _user_id and campus_id = _campus_id
  )
$$;

-- 5) community_posts: add campus_id + RLS scoped to membership
alter table public.community_posts add column campus_id uuid references public.campuses(id);

-- seed default campus
insert into public.campuses (slug, name, location, description)
values ('lingshui-lianan', '陵水黎安国际教育创新试验区', '海南陵水', '由多所国内外名校联合办学的教育创新试验区')
on conflict (slug) do nothing;

-- backfill existing posts to default campus
update public.community_posts
set campus_id = (select id from public.campuses where slug = 'lingshui-lianan')
where campus_id is null;

-- auto-join existing users to default campus
insert into public.campus_memberships (campus_id, user_id)
select (select id from public.campuses where slug = 'lingshui-lianan'), p.id
from public.profiles p
on conflict do nothing;

alter table public.community_posts alter column campus_id set not null;
create index on public.community_posts(campus_id);

-- replace permissive SELECT/INSERT policies
drop policy if exists "Posts viewable by authenticated users" on public.community_posts;
drop policy if exists "Users can create own posts" on public.community_posts;

create policy "Posts visible to campus members"
  on public.community_posts for select to authenticated
  using (
    public.is_campus_member(auth.uid(), campus_id)
    or public.has_role(auth.uid(), 'admin')
  );

create policy "Members create posts in their campus"
  on public.community_posts for insert to authenticated
  with check (
    auth.uid() = author_id
    and public.is_campus_member(auth.uid(), campus_id)
  );

-- 6) RPCs
create or replace function public.redeem_campus_invite(p_code text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  inv public.campus_invites%rowtype;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  select * into inv from public.campus_invites
    where code = p_code for update;
  if not found then raise exception 'INVITE_NOT_FOUND'; end if;
  if inv.status <> 'active' then raise exception 'INVITE_REVOKED'; end if;
  if inv.expires_at is not null and inv.expires_at < now() then
    raise exception 'INVITE_EXPIRED';
  end if;
  if inv.uses >= inv.max_uses then raise exception 'INVITE_USED_UP'; end if;

  insert into public.campus_memberships (campus_id, user_id, invited_by)
    values (inv.campus_id, uid, inv.inviter_id)
    on conflict do nothing;

  update public.campus_invites set uses = uses + 1 where id = inv.id;
  return inv.campus_id;
end $$;

create or replace function public.create_campus_invite(
  p_campus_id uuid,
  p_max_uses integer default 1,
  p_expires_in_hours integer default 168
) returns public.campus_invites
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  new_code text;
  rec public.campus_invites%rowtype;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if not (public.is_campus_member(uid, p_campus_id) or public.has_role(uid, 'admin')) then
    raise exception 'NOT_A_MEMBER';
  end if;
  if p_max_uses < 1 or p_max_uses > 500 then raise exception 'INVALID_USES'; end if;

  -- 8-char alphanumeric code (uppercase, no confusing chars)
  new_code := upper(translate(substr(encode(gen_random_bytes(8),'base64'),1,8),'+/=','XYZ'));

  insert into public.campus_invites (code, campus_id, inviter_id, max_uses, expires_at)
    values (
      new_code, p_campus_id, uid, p_max_uses,
      case when p_expires_in_hours is null then null
           else now() + (p_expires_in_hours || ' hours')::interval end
    )
    returning * into rec;
  return rec;
end $$;

revoke execute on function public.redeem_campus_invite(text) from anon;
revoke execute on function public.create_campus_invite(uuid,integer,integer) from anon;
revoke execute on function public.is_campus_member(uuid,uuid) from anon;

-- 7) extend handle_new_user to auto-join default campus (optional convenience)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare default_campus uuid;
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  if new.phone is not null then
    insert into public.profiles_private (id, phone) values (new.id, new.phone)
    on conflict (id) do nothing;
  end if;
  -- NOTE: do NOT auto-join any campus; users must redeem an invite code
  return new;
end $$;
