
-- Add comments_count to short_videos
ALTER TABLE public.short_videos ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0;

-- Comments table
CREATE TABLE IF NOT EXISTS public.short_video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_svc_video_created ON public.short_video_comments(video_id, created_at DESC);

ALTER TABLE public.short_video_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video comments readable" ON public.short_video_comments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "User comments as self" ON public.short_video_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "User deletes own comment" ON public.short_video_comments
  FOR DELETE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Admins manage video comments" ON public.short_video_comments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers: maintain counter + notify author
CREATE OR REPLACE FUNCTION public.short_video_comment_after_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_author uuid; commenter_name text;
BEGIN
  UPDATE public.short_videos SET comments_count = comments_count + 1
    WHERE id = NEW.video_id RETURNING author_id INTO v_author;
  IF v_author IS NOT NULL AND v_author <> NEW.author_id THEN
    SELECT nickname INTO commenter_name FROM public.profiles WHERE id = NEW.author_id;
    PERFORM public.create_notification(v_author, 'video_comment', jsonb_build_object(
      'video_id', NEW.video_id,
      'commenter_id', NEW.author_id,
      'commenter_name', COALESCE(commenter_name, 'Pulse 用户'),
      'preview', LEFT(NEW.content, 80)
    ));
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.short_video_comment_after_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.short_videos SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.video_id;
  RETURN OLD;
END $$;

DROP TRIGGER IF EXISTS trg_svc_insert ON public.short_video_comments;
CREATE TRIGGER trg_svc_insert AFTER INSERT ON public.short_video_comments
  FOR EACH ROW EXECUTE FUNCTION public.short_video_comment_after_insert();

DROP TRIGGER IF EXISTS trg_svc_delete ON public.short_video_comments;
CREATE TRIGGER trg_svc_delete AFTER DELETE ON public.short_video_comments
  FOR EACH ROW EXECUTE FUNCTION public.short_video_comment_after_delete();

-- Realtime
ALTER TABLE public.short_video_comments REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='short_video_comments') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.short_video_comments';
  END IF;
END $$;
