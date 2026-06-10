
CREATE OR REPLACE FUNCTION public.create_campus_invite(p_campus_id uuid, p_max_uses integer DEFAULT 1, p_expires_in_hours integer DEFAULT 168, p_revoke_existing boolean DEFAULT true)
 RETURNS campus_invites
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  alphabet text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  new_code text;
  i int;
  rec public.campus_invites%rowtype;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT (public.is_campus_member(uid, p_campus_id) OR public.has_role(uid, 'admin')) THEN
    RAISE EXCEPTION 'NOT_A_MEMBER';
  END IF;

  IF p_revoke_existing THEN
    UPDATE public.campus_invites
       SET status = 'revoked'
     WHERE inviter_id = uid
       AND campus_id = p_campus_id
       AND status = 'active';
  END IF;

  -- 6-char code from [a-z0-9]; codes may repeat across history (each one is single-use).
  new_code := '';
  FOR i IN 1..6 LOOP
    new_code := new_code || substr(alphabet, 1 + (floor(random() * length(alphabet)))::int, 1);
  END LOOP;

  INSERT INTO public.campus_invites (code, campus_id, inviter_id, max_uses, expires_at)
    VALUES (
      new_code, p_campus_id, uid, 1,
      CASE WHEN p_expires_in_hours IS NULL THEN NULL
           ELSE now() + (p_expires_in_hours || ' hours')::interval END
    )
    RETURNING * INTO rec;
  RETURN rec;
END $function$;
