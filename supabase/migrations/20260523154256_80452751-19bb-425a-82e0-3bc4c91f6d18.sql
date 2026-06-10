
-- Posts table
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('second','vent','ask')),
  title text not null check (length(title) between 1 and 120),
  content text not null check (length(content) between 1 and 2000),
  cover text not null default 'from-coral/40 via-coral/10 to-transparent',
  tags jsonb not null default '[]'::jsonb,
  location text not null default '陵水黎安国际教育创新试验区',
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  hot integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_community_posts_created on public.community_posts(created_at desc);
create index idx_community_posts_category on public.community_posts(category);
create index idx_community_posts_location on public.community_posts(location);

alter table public.community_posts enable row level security;

create policy "Posts viewable by authenticated users"
  on public.community_posts for select to authenticated using (true);

create policy "Users can create own posts"
  on public.community_posts for insert to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update own posts"
  on public.community_posts for update to authenticated
  using (auth.uid() = author_id);

create policy "Users can delete own posts"
  on public.community_posts for delete to authenticated
  using (auth.uid() = author_id);

create trigger trg_community_posts_updated
  before update on public.community_posts
  for each row execute function public.set_updated_at();

-- Likes table
create table public.community_post_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.community_post_likes enable row level security;

create policy "Likes viewable by authenticated users"
  on public.community_post_likes for select to authenticated using (true);

create policy "Users can like as themselves"
  on public.community_post_likes for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can unlike themselves"
  on public.community_post_likes for delete to authenticated
  using (auth.uid() = user_id);

-- Likes counter trigger
create or replace function public.sync_post_likes_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.community_posts
      set likes_count = likes_count + 1,
          hot = hot + 10
      where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.community_posts
      set likes_count = greatest(likes_count - 1, 0),
          hot = greatest(hot - 10, 0)
      where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger trg_post_likes_count
  after insert or delete on public.community_post_likes
  for each row execute function public.sync_post_likes_count();
