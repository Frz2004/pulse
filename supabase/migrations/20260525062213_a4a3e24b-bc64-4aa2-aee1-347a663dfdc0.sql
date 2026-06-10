
DROP POLICY IF EXISTS "Members create posts in their campus" ON public.community_posts;
CREATE POLICY "Members or admins create posts" ON public.community_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND (
      public.is_campus_member(auth.uid(), campus_id)
      OR public.has_role(auth.uid(), 'admin')
    )
  );
