
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.short_video_like_after_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.short_video_like_after_delete() FROM PUBLIC, anon, authenticated;
