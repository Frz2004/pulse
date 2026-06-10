
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS media jsonb NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public)
VALUES ('community-media', 'community-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Community media public read" ON storage.objects;
CREATE POLICY "Community media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-media');

DROP POLICY IF EXISTS "Community media owner upload" ON storage.objects;
CREATE POLICY "Community media owner upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'community-media' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Community media owner update" ON storage.objects;
CREATE POLICY "Community media owner update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'community-media' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Community media owner delete" ON storage.objects;
CREATE POLICY "Community media owner delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'community-media' AND auth.uid()::text = (storage.foldername(name))[1]);
