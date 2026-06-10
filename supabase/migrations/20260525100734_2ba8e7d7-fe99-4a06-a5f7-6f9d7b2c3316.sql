
-- 1. profiles: 语音名片
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS voice_card_url text,
  ADD COLUMN IF NOT EXISTS voice_card_duration integer;

-- 2. updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

-- 3. short_videos
CREATE TABLE IF NOT EXISTS public.short_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  video_url text NOT NULL,
  cover_url text,
  caption text NOT NULL DEFAULT '',
  duration_sec integer,
  width integer,
  height integer,
  likes_count integer NOT NULL DEFAULT 0,
  views_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.short_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos readable by authed"
  ON public.short_videos FOR SELECT TO authenticated
  USING (status = 'published' OR auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Author insert own video"
  ON public.short_videos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author update own video"
  ON public.short_videos FOR UPDATE TO authenticated
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author delete own video"
  ON public.short_videos FOR DELETE TO authenticated
  USING (auth.uid() = author_id);
CREATE POLICY "Admins manage videos"
  ON public.short_videos FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_short_videos_created ON public.short_videos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_short_videos_author ON public.short_videos (author_id);

DROP TRIGGER IF EXISTS trg_short_videos_updated ON public.short_videos;
CREATE TRIGGER trg_short_videos_updated
  BEFORE UPDATE ON public.short_videos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. short_video_likes
CREATE TABLE IF NOT EXISTS public.short_video_likes (
  video_id uuid NOT NULL REFERENCES public.short_videos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (video_id, user_id)
);
ALTER TABLE public.short_video_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video likes readable"
  ON public.short_video_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "User likes as self"
  ON public.short_video_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User unlikes self"
  ON public.short_video_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 5. counts + notify
CREATE OR REPLACE FUNCTION public.short_video_like_after_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_author uuid;
BEGIN
  UPDATE public.short_videos SET likes_count = likes_count + 1
    WHERE id = NEW.video_id RETURNING author_id INTO v_author;
  IF v_author IS NOT NULL AND v_author <> NEW.user_id THEN
    PERFORM public.create_notification(v_author, 'video_like',
      jsonb_build_object('video_id', NEW.video_id, 'liker_id', NEW.user_id));
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.short_video_like_after_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.short_videos SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.video_id;
  RETURN OLD;
END $$;

DROP TRIGGER IF EXISTS trg_short_video_like_ins ON public.short_video_likes;
CREATE TRIGGER trg_short_video_like_ins
  AFTER INSERT ON public.short_video_likes
  FOR EACH ROW EXECUTE FUNCTION public.short_video_like_after_insert();
DROP TRIGGER IF EXISTS trg_short_video_like_del ON public.short_video_likes;
CREATE TRIGGER trg_short_video_like_del
  AFTER DELETE ON public.short_video_likes
  FOR EACH ROW EXECUTE FUNCTION public.short_video_like_after_delete();

-- 6. storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('short-videos', 'short-videos', true),
  ('voice-cards', 'voice-cards', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Short videos public read" ON storage.objects;
CREATE POLICY "Short videos public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'short-videos');
DROP POLICY IF EXISTS "Short videos owner upload" ON storage.objects;
CREATE POLICY "Short videos owner upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'short-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Short videos owner update" ON storage.objects;
CREATE POLICY "Short videos owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'short-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Short videos owner delete" ON storage.objects;
CREATE POLICY "Short videos owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'short-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Voice cards public read" ON storage.objects;
CREATE POLICY "Voice cards public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'voice-cards');
DROP POLICY IF EXISTS "Voice cards owner upload" ON storage.objects;
CREATE POLICY "Voice cards owner upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'voice-cards' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Voice cards owner update" ON storage.objects;
CREATE POLICY "Voice cards owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'voice-cards' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Voice cards owner delete" ON storage.objects;
CREATE POLICY "Voice cards owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'voice-cards' AND auth.uid()::text = (storage.foldername(name))[1]);
