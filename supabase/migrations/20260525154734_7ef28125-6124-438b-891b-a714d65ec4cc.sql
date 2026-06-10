-- 1) profiles_privacy: owner-only SELECT
DROP POLICY IF EXISTS "Privacy readable to authed" ON public.profiles_privacy;
CREATE POLICY "Owner reads privacy"
  ON public.profiles_privacy
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2) treehole_posts: drop public-read; expose only de-identified view
DROP POLICY IF EXISTS "Treehole posts readable" ON public.treehole_posts;

CREATE OR REPLACE VIEW public.treehole_posts_public
WITH (security_invoker = true) AS
SELECT id, anon_name, mood, content, media_url, resonance_count, hug_count, created_at
FROM public.treehole_posts;

REVOKE ALL ON public.treehole_posts_public FROM PUBLIC, anon;
GRANT SELECT ON public.treehole_posts_public TO authenticated;

-- 3) user_locations: hide precise coords; owner-only on base table, coarsened view for others
DROP POLICY IF EXISTS "Locations visible to authed (non-hidden)" ON public.user_locations;
CREATE POLICY "Owner reads own location"
  ON public.user_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW public.user_locations_public
WITH (security_invoker = true) AS
SELECT
  user_id,
  ROUND(lat::numeric, 2)::double precision AS lat_bucket,
  ROUND(lng::numeric, 2)::double precision AS lng_bucket,
  city,
  status,
  updated_at
FROM public.user_locations
WHERE status <> 'hidden';

REVOKE ALL ON public.user_locations_public FROM PUBLIC, anon;
GRANT SELECT ON public.user_locations_public TO authenticated;

-- 4) Revoke default PUBLIC/anon EXECUTE on all SECURITY DEFINER functions in public
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon;', r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- Re-grant EXECUTE to authenticated for RPCs called from the client and helpers used in RLS
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_campus_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_campus_invite(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_campus_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_conversation(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_topup(integer, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_buy_pro(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_send_gift(uuid, text, integer, text, uuid) TO authenticated;