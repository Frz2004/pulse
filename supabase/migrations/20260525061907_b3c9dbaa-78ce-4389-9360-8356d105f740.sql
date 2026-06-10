
-- 1. Attach immutability triggers
DROP TRIGGER IF EXISTS conversations_immutable_columns_trg ON public.conversations;
CREATE TRIGGER conversations_immutable_columns_trg
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.conversations_immutable_columns();

DROP TRIGGER IF EXISTS call_sessions_guard_update_trg ON public.call_sessions;
CREATE TRIGGER call_sessions_guard_update_trg
  BEFORE UPDATE ON public.call_sessions
  FOR EACH ROW EXECUTE FUNCTION public.call_sessions_guard_update();

-- 2. Tighten UPDATE policies with WITH CHECK
DROP POLICY IF EXISTS "Participants can update conversations" ON public.conversations;
CREATE POLICY "Participants can update conversations"
  ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = user_a OR auth.uid() = user_b)
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

DROP POLICY IF EXISTS "Call participants update" ON public.call_sessions;
CREATE POLICY "Call participants update"
  ON public.call_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = caller_id OR auth.uid() = callee_id)
  WITH CHECK (auth.uid() = caller_id OR auth.uid() = callee_id);

-- 3. Storage UPDATE/DELETE policies for media + treehole-media (owner only)
DROP POLICY IF EXISTS "media owner update" ON storage.objects;
CREATE POLICY "media owner update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'media' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "media owner delete" ON storage.objects;
CREATE POLICY "media owner delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "treehole-media owner update" ON storage.objects;
CREATE POLICY "treehole-media owner update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'treehole-media' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'treehole-media' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "treehole-media owner delete" ON storage.objects;
CREATE POLICY "treehole-media owner delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'treehole-media' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- 4. Treehole posts: strip author_id from public read
REVOKE SELECT ON public.treehole_posts FROM anon, authenticated;
GRANT SELECT (id, anon_name, mood, content, media_url, resonance_count, hug_count, created_at)
  ON public.treehole_posts TO authenticated;
-- Author + admin keep full access via separate policy/grant
DROP POLICY IF EXISTS "Author or admin read treehole full" ON public.treehole_posts;
-- We grant column author_id only to a privileged role path via policies that already allow author/admin.
-- Re-grant full SELECT only to service role contexts; author/admin reads use existing policies + we re-grant author_id to authenticated as it's necessary for author/admin policies to match.
GRANT SELECT (author_id) ON public.treehole_posts TO authenticated;
-- But column grant alone allows reading; we need column-level revoke via a view-like approach.
-- Replace public SELECT policy so non-owner/non-admin rows don't expose author_id-bearing rows? That breaks public feed.
-- Simpler: keep author_id grant but enforce via dedicated SELECT policies splitting visibility.
REVOKE SELECT (author_id) ON public.treehole_posts FROM authenticated;
-- Now author_id is unreadable to authenticated. Author/admin code paths that need author_id must go through SECURITY DEFINER RPC.

-- 5. Treehole reactions: tighten visibility — users only see their own reactions
DROP POLICY IF EXISTS "Reactions readable" ON public.treehole_reactions;
CREATE POLICY "Own reactions readable" ON public.treehole_reactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins read all reactions" ON public.treehole_reactions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
