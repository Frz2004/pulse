
-- 1) treehole_posts: hide author_id from non-owner/non-admin readers
revoke select (author_id) on public.treehole_posts from anon, authenticated;
grant select (
  id, created_at, content, media_url, mood, anon_name,
  hug_count, resonance_count
) on public.treehole_posts to authenticated;
-- author/admin can still read author_id via owner/admin policies + explicit grant
grant select (author_id) on public.treehole_posts to authenticator;

-- 2) messages: enforce immutable columns trigger
drop trigger if exists messages_immutable_columns_trg on public.messages;
create trigger messages_immutable_columns_trg
before update on public.messages
for each row execute function public.messages_immutable_columns();

-- 3) conversations: prevent participants from changing membership / source / created_at
create or replace function public.conversations_immutable_columns()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.user_a is distinct from old.user_a
     or new.user_b is distinct from old.user_b
     or new.source is distinct from old.source
     or new.created_at is distinct from old.created_at
     or new.id is distinct from old.id then
    raise exception 'Only last_message and last_message_at may be updated on conversations';
  end if;
  return new;
end $$;

drop trigger if exists conversations_immutable_columns_trg on public.conversations;
create trigger conversations_immutable_columns_trg
before update on public.conversations
for each row execute function public.conversations_immutable_columns();

-- 4) call_sessions: restrict who may write which rating + lock identity columns
create or replace function public.call_sessions_guard_update()
returns trigger language plpgsql set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if new.caller_id is distinct from old.caller_id
     or new.callee_id is distinct from old.callee_id
     or new.type     is distinct from old.type
     or new.started_at is distinct from old.started_at
     or new.id       is distinct from old.id then
    raise exception 'Cannot modify call identity fields';
  end if;
  -- only callee may change rating_callee
  if new.rating_callee is distinct from old.rating_callee and uid <> old.callee_id then
    raise exception 'Only callee can update rating_callee';
  end if;
  -- only caller may change rating_caller
  if new.rating_caller is distinct from old.rating_caller and uid <> old.caller_id then
    raise exception 'Only caller can update rating_caller';
  end if;
  return new;
end $$;

drop trigger if exists call_sessions_guard_update_trg on public.call_sessions;
create trigger call_sessions_guard_update_trg
before update on public.call_sessions
for each row execute function public.call_sessions_guard_update();

-- 5) media storage: allow conversation participants to read attachment files
drop policy if exists "Conv participants read media attachments" on storage.objects;
create policy "Conv participants read media attachments"
on storage.objects for select to authenticated
using (
  bucket_id = 'media'
  and exists (
    select 1
    from public.message_attachments ma
    join public.messages m on m.id = ma.message_id
    join public.conversations c on c.id = m.conversation_id
    where ma.url like '%' || storage.objects.name || '%'
      and (auth.uid() = c.user_a or auth.uid() = c.user_b)
  )
);

-- 6) avatars bucket: prevent listing while keeping individual object reads
drop policy if exists "Public avatar read" on storage.objects;
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar object read (no listing)"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'avatars'
  and coalesce((current_setting('request.method', true)), '') <> 'LIST'
);

-- 7) SECURITY DEFINER functions: revoke broad execute, grant minimally
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;
revoke execute on function public.sync_post_likes_count() from anon, authenticated, public;
revoke execute on function public.handle_mutual_swipe() from anon, authenticated, public;
revoke execute on function public.sync_treehole_reactions() from anon, authenticated, public;
revoke execute on function public.bump_conversation_on_message() from anon, authenticated, public;
revoke execute on function public.sync_comments_count() from anon, authenticated, public;
revoke execute on function public.messages_immutable_columns() from anon, authenticated, public;
revoke execute on function public.conversations_immutable_columns() from anon, authenticated, public;
revoke execute on function public.call_sessions_guard_update() from anon, authenticated, public;

revoke execute on function public.start_conversation(uuid, text) from anon, public;
grant execute on function public.start_conversation(uuid, text) to authenticated;

revoke execute on function public.has_role(uuid, public.app_role) from anon, public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
