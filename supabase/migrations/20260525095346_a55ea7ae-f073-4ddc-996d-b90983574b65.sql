
-- Helper to insert notifications bypassing RLS (called from triggers)
CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id uuid, _type text, _payload jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, type, payload) VALUES (_user_id, _type, COALESCE(_payload, '{}'::jsonb));
END;
$$;

-- 1) Message → notify recipient
CREATE OR REPLACE FUNCTION public.notify_on_message() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE recipient uuid; sender_name text;
BEGIN
  SELECT CASE WHEN c.user_a = NEW.sender_id THEN c.user_b ELSE c.user_a END
    INTO recipient FROM public.conversations c WHERE c.id = NEW.conversation_id;
  SELECT nickname INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
  PERFORM public.create_notification(recipient, 'message', jsonb_build_object(
    'conversation_id', NEW.conversation_id,
    'sender_id', NEW.sender_id,
    'sender_name', COALESCE(sender_name, 'Pulse 用户'),
    'preview', LEFT(COALESCE(NEW.content, ''), 80)
  ));
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_message ON public.messages;
CREATE TRIGGER trg_notify_message AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.notify_on_message();

-- 2) Swipe like → notify target
CREATE OR REPLACE FUNCTION public.notify_on_swipe_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE liker_name text;
BEGIN
  IF NEW.action <> 'like' THEN RETURN NEW; END IF;
  SELECT nickname INTO liker_name FROM public.profiles WHERE id = NEW.swiper_id;
  PERFORM public.create_notification(NEW.target_id, 'like', jsonb_build_object(
    'swiper_id', NEW.swiper_id,
    'swiper_name', COALESCE(liker_name, '有人')
  ));
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_swipe_like ON public.swipes;
CREATE TRIGGER trg_notify_swipe_like AFTER INSERT ON public.swipes
FOR EACH ROW EXECUTE FUNCTION public.notify_on_swipe_like();

-- 3) Match → notify both
CREATE OR REPLACE FUNCTION public.notify_on_match() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a_name text; b_name text;
BEGIN
  SELECT nickname INTO a_name FROM public.profiles WHERE id = NEW.user_a;
  SELECT nickname INTO b_name FROM public.profiles WHERE id = NEW.user_b;
  PERFORM public.create_notification(NEW.user_a, 'match', jsonb_build_object('other_id', NEW.user_b, 'other_name', COALESCE(b_name, 'Ta')));
  PERFORM public.create_notification(NEW.user_b, 'match', jsonb_build_object('other_id', NEW.user_a, 'other_name', COALESCE(a_name, 'Ta')));
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_match ON public.matches;
CREATE TRIGGER trg_notify_match AFTER INSERT ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.notify_on_match();

-- 4) Community comment → notify post author
CREATE OR REPLACE FUNCTION public.notify_on_community_comment() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE author uuid; commenter_name text; post_title text;
BEGIN
  SELECT author_id, title INTO author, post_title FROM public.community_posts WHERE id = NEW.post_id;
  IF author IS NULL OR author = NEW.author_id THEN RETURN NEW; END IF;
  SELECT nickname INTO commenter_name FROM public.profiles WHERE id = NEW.author_id;
  PERFORM public.create_notification(author, 'comment', jsonb_build_object(
    'post_id', NEW.post_id,
    'post_title', COALESCE(post_title, ''),
    'commenter_id', NEW.author_id,
    'commenter_name', COALESCE(commenter_name, 'Pulse 用户'),
    'preview', LEFT(NEW.content, 80)
  ));
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_comment ON public.community_comments;
CREATE TRIGGER trg_notify_comment AFTER INSERT ON public.community_comments
FOR EACH ROW EXECUTE FUNCTION public.notify_on_community_comment();

-- 5) Community post like → notify post author
CREATE OR REPLACE FUNCTION public.notify_on_post_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE author uuid; liker_name text; post_title text;
BEGIN
  SELECT author_id, title INTO author, post_title FROM public.community_posts WHERE id = NEW.post_id;
  IF author IS NULL OR author = NEW.user_id THEN RETURN NEW; END IF;
  SELECT nickname INTO liker_name FROM public.profiles WHERE id = NEW.user_id;
  PERFORM public.create_notification(author, 'post_like', jsonb_build_object(
    'post_id', NEW.post_id,
    'post_title', COALESCE(post_title, ''),
    'liker_id', NEW.user_id,
    'liker_name', COALESCE(liker_name, 'Pulse 用户')
  ));
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_post_like ON public.community_post_likes;
CREATE TRIGGER trg_notify_post_like AFTER INSERT ON public.community_post_likes
FOR EACH ROW EXECUTE FUNCTION public.notify_on_post_like();

-- 6) Follow → notify followee
CREATE OR REPLACE FUNCTION public.notify_on_follow() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE follower_name text;
BEGIN
  IF NEW.follower_id = NEW.followee_id THEN RETURN NEW; END IF;
  SELECT nickname INTO follower_name FROM public.profiles WHERE id = NEW.follower_id;
  PERFORM public.create_notification(NEW.followee_id, 'follow', jsonb_build_object(
    'follower_id', NEW.follower_id,
    'follower_name', COALESCE(follower_name, 'Pulse 用户')
  ));
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_follow ON public.follows;
CREATE TRIGGER trg_notify_follow AFTER INSERT ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.notify_on_follow();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Index for unread queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications (user_id, read_at, created_at DESC);
