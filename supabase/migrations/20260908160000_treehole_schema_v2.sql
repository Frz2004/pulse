-- =============================================================
-- Treehole schema v2：对齐前端代码（src/lib/treehole.functions.ts）
-- 旧版：treehole_posts(anon_name/mood/media_url/resonance/hug) + treehole_reactions + treehole_reveals
-- 新版：匿名发布(多图/话题/分类) + 点赞 + 评论 + 匿名私聊 + 身份揭开 + 举报
-- 另为 profiles_private 增加手机认证标记 phone_verified
-- =============================================================

-- 0) profiles_private：手机认证标记
ALTER TABLE public.profiles_private
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;

-- 1) 清理旧树洞对象（已被 v2 取代：reactions -> treehole_likes；reveals -> treehole_chats）
DROP TRIGGER IF EXISTS trg_treehole_reactions ON public.treehole_reactions;
DROP FUNCTION IF EXISTS public.sync_treehole_reactions();
DROP TABLE IF EXISTS public.treehole_reveals;
DROP TABLE IF EXISTS public.treehole_reactions;

-- 2) treehole_posts：列迁移
DROP VIEW IF EXISTS public.treehole_posts_public;

ALTER TABLE public.treehole_posts
  ADD COLUMN IF NOT EXISTS anonymous_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS anonymous_avatar text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS content_tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '最新',
  ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS allow_comments boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS anonymous_display boolean NOT NULL DEFAULT true;

-- 旧行回填匿名昵称
UPDATE public.treehole_posts
  SET anonymous_name = anon_name
  WHERE anonymous_name = '' AND anon_name IS NOT NULL AND anon_name <> '';

-- 删除旧版列
ALTER TABLE public.treehole_posts
  DROP COLUMN IF EXISTS anon_name,
  DROP COLUMN IF EXISTS mood,
  DROP COLUMN IF EXISTS media_url,
  DROP COLUMN IF EXISTS resonance_count,
  DROP COLUMN IF EXISTS hug_count;

-- 约束与索引
ALTER TABLE public.treehole_posts
  ADD CONSTRAINT treehole_posts_category_check
    CHECK (category IN ('最新', '吐槽', '提问')),
  ADD CONSTRAINT treehole_posts_status_check
    CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  ADD CONSTRAINT treehole_posts_content_type_check
    CHECK (content_type IN ('text', 'image', 'emoji', 'topic'));

CREATE INDEX IF NOT EXISTS idx_treehole_posts_feed
  ON public.treehole_posts (status, created_at DESC);

-- 3) 树洞图片附件
CREATE TABLE public.treehole_post_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.treehole_posts(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'audio', 'video')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_treehole_attachments_post
  ON public.treehole_post_attachments (post_id, sort_order);
ALTER TABLE public.treehole_post_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Treehole attachments readable by authenticated"
  ON public.treehole_post_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins read treehole attachments"
  ON public.treehole_post_attachments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4) 树洞浏览记录（去重浏览计数）
CREATE TABLE public.treehole_views (
  post_id uuid NOT NULL REFERENCES public.treehole_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
ALTER TABLE public.treehole_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own treehole views"
  ON public.treehole_views FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users record own treehole views"
  ON public.treehole_views FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 5) 树洞评论
CREATE TABLE public.treehole_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.treehole_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_name text NOT NULL DEFAULT '',
  content text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  parent_comment_id uuid,
  visible_to_author_only boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_treehole_comments_post
  ON public.treehole_comments (post_id, created_at);
ALTER TABLE public.treehole_comments ENABLE ROW LEVEL SECURITY;
-- 公开评论全员可见；“仅作者可见”只对作者与发评人可见
CREATE POLICY "Treehole comments visible"
  ON public.treehole_comments FOR SELECT TO authenticated
  USING (
    (NOT visible_to_author_only)
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.treehole_posts p
      WHERE p.id = post_id AND p.author_id = auth.uid()
    )
  );
CREATE POLICY "Admins manage treehole comments"
  ON public.treehole_comments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6) 树洞点赞（多态：post_id 或 comment_id 二选一）
CREATE TABLE public.treehole_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.treehole_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.treehole_comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT treehole_likes_single_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL)
    OR (post_id IS NULL AND comment_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX treehole_likes_post_user_key
  ON public.treehole_likes (post_id, user_id);
CREATE UNIQUE INDEX treehole_likes_comment_user_key
  ON public.treehole_likes (comment_id, user_id);
ALTER TABLE public.treehole_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own treehole likes"
  ON public.treehole_likes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read treehole likes"
  ON public.treehole_likes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 点赞/评论/浏览计数触发器（旧版计数由前端手写自增，改为 DB 内保证一致）
CREATE OR REPLACE FUNCTION public.sync_treehole_like_counts()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.treehole_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.comment_id IS NOT NULL THEN
      UPDATE public.treehole_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.treehole_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    ELSIF OLD.comment_id IS NOT NULL THEN
      UPDATE public.treehole_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_treehole_likes_sync
  AFTER INSERT OR DELETE ON public.treehole_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_treehole_like_counts();

CREATE OR REPLACE FUNCTION public.sync_treehole_comments_count()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.treehole_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.treehole_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_treehole_comments_sync
  AFTER INSERT OR DELETE ON public.treehole_comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_treehole_comments_count();

CREATE OR REPLACE FUNCTION public.sync_treehole_views_count()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.treehole_posts SET views_count = views_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_treehole_views_sync
  AFTER INSERT ON public.treehole_views
  FOR EACH ROW EXECUTE FUNCTION public.sync_treehole_views_count();

-- 7) 树洞举报（独立于通用 reports，供树洞评论等快速举报）
CREATE TABLE public.treehole_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('post', 'comment', 'chat')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_treehole_reports_status
  ON public.treehole_reports (status, created_at DESC);
ALTER TABLE public.treehole_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own treehole reports"
  ON public.treehole_reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "Users create treehole reports"
  ON public.treehole_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins manage treehole reports"
  ON public.treehole_reports FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8) 树洞匿名私聊
CREATE TABLE public.treehole_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.treehole_posts(id) ON DELETE CASCADE,
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_anonymous_name text NOT NULL,
  author_anonymous_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revealed', 'ended')),
  reveal_status text NOT NULL DEFAULT 'anonymous' CHECK (reveal_status IN ('anonymous', 'revealed')),
  total_message_count integer NOT NULL DEFAULT 0,
  requester_accept_reveal boolean NOT NULL DEFAULT false,
  author_accept_reveal boolean NOT NULL DEFAULT false,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT treehole_chats_distinct_users CHECK (requester_id <> author_id)
);
CREATE INDEX idx_treehole_chats_requester ON public.treehole_chats (requester_id, created_at DESC);
CREATE INDEX idx_treehole_chats_author ON public.treehole_chats (author_id, created_at DESC);
ALTER TABLE public.treehole_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chat visible to participants"
  ON public.treehole_chats FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = author_id);
CREATE POLICY "Admins manage treehole chats"
  ON public.treehole_chats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.treehole_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.treehole_chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_anonymous_name text NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'emoji')),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_treehole_chat_messages_conv
  ON public.treehole_chat_messages (chat_id, created_at);
ALTER TABLE public.treehole_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chat messages visible to participants"
  ON public.treehole_chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.treehole_chats c
      WHERE c.id = chat_id AND (auth.uid() = c.requester_id OR auth.uid() = c.author_id)
    )
  );
CREATE POLICY "Admins read treehole chat messages"
  ON public.treehole_chat_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9) 树洞身份揭开请求
CREATE TABLE public.treehole_reveal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.treehole_chats(id) ON DELETE CASCADE,
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_accept boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT treehole_reveal_requests_unique UNIQUE (chat_id, requester_id, target_id)
);
CREATE INDEX idx_treehole_reveal_requests_target
  ON public.treehole_reveal_requests (target_id, status);
ALTER TABLE public.treehole_reveal_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reveal requests visible to participants"
  ON public.treehole_reveal_requests FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = target_id);
CREATE POLICY "Users create reveal requests"
  ON public.treehole_reveal_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Admins manage reveal requests"
  ON public.treehole_reveal_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 10) 脱敏视图：向 authenticated 暴露不含 author_id 的已过审树洞
CREATE OR REPLACE VIEW public.treehole_posts_public
WITH (security_invoker = true) AS
SELECT
  id,
  anonymous_name,
  anonymous_avatar,
  content,
  image_url,
  content_type,
  content_tags,
  category,
  likes_count,
  comments_count,
  views_count,
  allow_comments,
  anonymous_display,
  status,
  created_at
FROM public.treehole_posts
WHERE status = 'approved';

REVOKE ALL ON public.treehole_posts_public FROM PUBLIC, anon;
GRANT SELECT ON public.treehole_posts_public TO authenticated;

-- 11) 通用 reports：放宽 target_type（ReportSheet 支持 user/post/treehole/message/comment/video/video_comment）
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_target_type_check;
ALTER TABLE public.reports
  ADD CONSTRAINT reports_target_type_check
  CHECK (target_type IN ('user', 'post', 'treehole', 'message', 'comment', 'video', 'video_comment', 'profile'));
