
-- =============================================================
-- 1. 角色系统
-- =============================================================
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 2. 匹配 / 滑卡
-- =============================================================
create table public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('like','super','nope')),
  created_at timestamptz not null default now(),
  unique (swiper_id, target_id)
);
create index idx_swipes_target on public.swipes(target_id);
alter table public.swipes enable row level security;
create policy "Users see own swipes" on public.swipes
  for select to authenticated using (auth.uid() = swiper_id);
create policy "Users insert own swipes" on public.swipes
  for insert to authenticated with check (auth.uid() = swiper_id);
create policy "Admins read swipes" on public.swipes
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b),
  check (user_a < user_b)
);
alter table public.matches enable row level security;
create policy "Match participants read" on public.matches
  for select to authenticated using (auth.uid() = user_a or auth.uid() = user_b);
create policy "Admins read matches" on public.matches
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- 自动建立 match
create or replace function public.handle_mutual_swipe()
returns trigger language plpgsql security definer set search_path = public as $$
declare a uuid; b uuid;
begin
  if new.action in ('like','super') then
    if exists (
      select 1 from public.swipes
      where swiper_id = new.target_id and target_id = new.swiper_id and action in ('like','super')
    ) then
      if new.swiper_id < new.target_id then a := new.swiper_id; b := new.target_id;
      else a := new.target_id; b := new.swiper_id; end if;
      insert into public.matches(user_a, user_b) values (a, b) on conflict do nothing;
    end if;
  end if;
  return new;
end $$;
create trigger trg_mutual_swipe after insert on public.swipes
  for each row execute function public.handle_mutual_swipe();

-- =============================================================
-- 3. 位置 / 雷达
-- =============================================================
create table public.user_locations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  lat double precision,
  lng double precision,
  city text,
  status text default 'online' check (status in ('online','away','offline','hidden')),
  updated_at timestamptz not null default now()
);
create index idx_user_locations_status on public.user_locations(status, updated_at desc);
alter table public.user_locations enable row level security;
create policy "Locations visible to authed (non-hidden)" on public.user_locations
  for select to authenticated using (status <> 'hidden' or auth.uid() = user_id);
create policy "Users upsert own location" on public.user_locations
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own location" on public.user_locations
  for update to authenticated using (auth.uid() = user_id);
create policy "Admins read locations" on public.user_locations
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 4. 关注 / 拉黑 / 举报
-- =============================================================
create table public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followee_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
alter table public.follows enable row level security;
create policy "Follows readable by authed" on public.follows
  for select to authenticated using (true);
create policy "Users follow as self" on public.follows
  for insert to authenticated with check (auth.uid() = follower_id);
create policy "Users unfollow as self" on public.follows
  for delete to authenticated using (auth.uid() = follower_id);

create table public.blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);
alter table public.blocks enable row level security;
create policy "Users see own blocks" on public.blocks
  for select to authenticated using (auth.uid() = blocker_id);
create policy "Users add own blocks" on public.blocks
  for insert to authenticated with check (auth.uid() = blocker_id);
create policy "Users delete own blocks" on public.blocks
  for delete to authenticated using (auth.uid() = blocker_id);
create policy "Admins read blocks" on public.blocks
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('user','message','post','treehole')),
  target_id uuid not null,
  reason text not null,
  detail text,
  status text not null default 'pending' check (status in ('pending','reviewing','resolved','rejected')),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
create policy "Users see own reports" on public.reports
  for select to authenticated using (auth.uid() = reporter_id);
create policy "Users create reports" on public.reports
  for insert to authenticated with check (auth.uid() = reporter_id);
create policy "Admins manage reports" on public.reports
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 5. 通话
-- =============================================================
create table public.call_sessions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('voice','video')),
  caller_id uuid not null references auth.users(id) on delete cascade,
  callee_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_sec integer,
  rating_caller integer check (rating_caller between 1 and 5),
  rating_callee integer check (rating_callee between 1 and 5),
  props jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','ended','cancelled'))
);
create index idx_call_sessions_users on public.call_sessions(caller_id, callee_id);
alter table public.call_sessions enable row level security;
create policy "Call participants read" on public.call_sessions
  for select to authenticated using (auth.uid() = caller_id or auth.uid() = callee_id);
create policy "Call participants update" on public.call_sessions
  for update to authenticated using (auth.uid() = caller_id or auth.uid() = callee_id);
create policy "Caller insert" on public.call_sessions
  for insert to authenticated with check (auth.uid() = caller_id);
create policy "Admins read calls" on public.call_sessions
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 6. 树洞
-- =============================================================
create table public.treehole_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  anon_name text not null,
  mood text,
  content text not null,
  media_url text,
  resonance_count integer not null default 0,
  hug_count integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.treehole_posts enable row level security;
create policy "Treehole posts readable" on public.treehole_posts
  for select to authenticated using (true);
create policy "Author manages own treehole" on public.treehole_posts
  for all to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Admins manage treehole" on public.treehole_posts
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.treehole_reactions (
  post_id uuid not null references public.treehole_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('resonance','hug')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, kind)
);
alter table public.treehole_reactions enable row level security;
create policy "Reactions readable" on public.treehole_reactions
  for select to authenticated using (true);
create policy "Users react as self" on public.treehole_reactions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users unreact as self" on public.treehole_reactions
  for delete to authenticated using (auth.uid() = user_id);

create or replace function public.sync_treehole_reactions()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if new.kind = 'resonance' then
      update public.treehole_posts set resonance_count = resonance_count + 1 where id = new.post_id;
    else
      update public.treehole_posts set hug_count = hug_count + 1 where id = new.post_id;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.kind = 'resonance' then
      update public.treehole_posts set resonance_count = greatest(resonance_count - 1, 0) where id = old.post_id;
    else
      update public.treehole_posts set hug_count = greatest(hug_count - 1, 0) where id = old.post_id;
    end if;
    return old;
  end if;
  return null;
end $$;
create trigger trg_treehole_reactions
  after insert or delete on public.treehole_reactions
  for each row execute function public.sync_treehole_reactions();

create table public.treehole_reveals (
  conversation_id uuid primary key references public.conversations(id) on delete cascade,
  user_a_consent boolean not null default false,
  user_b_consent boolean not null default false,
  revealed_at timestamptz
);
alter table public.treehole_reveals enable row level security;
create policy "Reveal visible to conv participants" on public.treehole_reveals
  for select to authenticated using (
    exists (select 1 from public.conversations c
      where c.id = conversation_id and (auth.uid() = c.user_a or auth.uid() = c.user_b))
  );
create policy "Participants upsert reveal" on public.treehole_reveals
  for insert to authenticated with check (
    exists (select 1 from public.conversations c
      where c.id = conversation_id and (auth.uid() = c.user_a or auth.uid() = c.user_b))
  );
create policy "Participants update reveal" on public.treehole_reveals
  for update to authenticated using (
    exists (select 1 from public.conversations c
      where c.id = conversation_id and (auth.uid() = c.user_a or auth.uid() = c.user_b))
  );

-- =============================================================
-- 7. 社区评论
-- =============================================================
create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create index idx_comments_post on public.community_comments(post_id, created_at);
alter table public.community_comments enable row level security;
create policy "Comments readable" on public.community_comments
  for select to authenticated using (true);
create policy "Users comment as self" on public.community_comments
  for insert to authenticated with check (auth.uid() = author_id);
create policy "Users delete own comments" on public.community_comments
  for delete to authenticated using (auth.uid() = author_id);
create policy "Admins manage comments" on public.community_comments
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.sync_comments_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts set comments_count = comments_count + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.community_posts set comments_count = greatest(comments_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end $$;
create trigger trg_comments_count
  after insert or delete on public.community_comments
  for each row execute function public.sync_comments_count();

-- =============================================================
-- 8. 消息附件
-- =============================================================
create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  kind text not null check (kind in ('image','video','audio','file')),
  url text not null,
  thumb_url text,
  duration_sec integer,
  width integer,
  height integer,
  size_bytes integer,
  created_at timestamptz not null default now()
);
create index idx_attachments_message on public.message_attachments(message_id);
alter table public.message_attachments enable row level security;
create policy "Attachments visible to conv participants" on public.message_attachments
  for select to authenticated using (
    exists (select 1 from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = message_id and (auth.uid() = c.user_a or auth.uid() = c.user_b))
  );
create policy "Sender inserts own attachments" on public.message_attachments
  for insert to authenticated with check (
    exists (select 1 from public.messages m
      where m.id = message_id and m.sender_id = auth.uid())
  );
create policy "Admins read attachments" on public.message_attachments
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 9. 游戏
-- =============================================================
create table public.palm_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text,
  result jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.palm_readings enable row level security;
create policy "Users see own palm" on public.palm_readings
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own palm" on public.palm_readings
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins read palm" on public.palm_readings
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game text not null,
  score integer not null,
  win boolean not null default false,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_game_scores_game on public.game_scores(game, score desc);
create index idx_game_scores_user on public.game_scores(user_id);
alter table public.game_scores enable row level security;
create policy "Scores readable by authed" on public.game_scores
  for select to authenticated using (true);
create policy "Users insert own score" on public.game_scores
  for insert to authenticated with check (auth.uid() = user_id);

-- =============================================================
-- 10. 通知
-- =============================================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "Users see own notifications" on public.notifications
  for select to authenticated using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications
  for update to authenticated using (auth.uid() = user_id);

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('ios','android','web')),
  created_at timestamptz not null default now()
);
alter table public.push_tokens enable row level security;
create policy "Users manage own tokens" on public.push_tokens
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =============================================================
-- 11. 内容审核
-- =============================================================
create table public.content_flags (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('message','post','treehole','profile')),
  target_id uuid not null,
  reason text not null,
  severity text not null default 'low' check (severity in ('low','medium','high','critical')),
  source text not null default 'ai' check (source in ('ai','user','rule')),
  detail jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open','reviewing','closed')),
  created_at timestamptz not null default now()
);
create index idx_flags_status on public.content_flags(status, created_at desc);
alter table public.content_flags enable row level security;
create policy "Admins manage flags" on public.content_flags
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);
alter table public.moderation_actions enable row level security;
create policy "Admins manage actions" on public.moderation_actions
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 12. 管理员可读基础数据(profiles / conversations / messages / posts)
-- =============================================================
create policy "Admins read profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins read conversations" on public.conversations
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins read messages" on public.messages
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins read posts" on public.community_posts
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 13. Storage Buckets
-- =============================================================
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('media', 'media', false),
  ('treehole-media', 'treehole-media', false)
on conflict (id) do nothing;

-- avatars: 公开读、用户写自己目录(<uid>/xxx)
create policy "Avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Avatars owner write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Avatars owner update" on storage.objects
  for update to authenticated using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Avatars owner delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- media: 仅上传者可访问 + 管理员可访问
create policy "Media owner read" on storage.objects
  for select to authenticated using (
    bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Media admin read" on storage.objects
  for select to authenticated using (
    bucket_id = 'media' and public.has_role(auth.uid(), 'admin')
  );
create policy "Media owner write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- treehole-media: 同上,只允许上传者+admin 读
create policy "Treehole owner read" on storage.objects
  for select to authenticated using (
    bucket_id = 'treehole-media' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Treehole admin read" on storage.objects
  for select to authenticated using (
    bucket_id = 'treehole-media' and public.has_role(auth.uid(), 'admin')
  );
create policy "Treehole owner write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'treehole-media' and auth.uid()::text = (storage.foldername(name))[1]
  );
