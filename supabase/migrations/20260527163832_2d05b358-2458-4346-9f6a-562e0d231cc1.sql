
-- Force every invite to be single-use.
CREATE OR REPLACE FUNCTION public.create_campus_invite(
  p_campus_id uuid,
  p_max_uses integer DEFAULT 1,
  p_expires_in_hours integer DEFAULT 168
)
RETURNS public.campus_invites
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  new_code text;
  rec public.campus_invites%rowtype;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT (public.is_campus_member(uid, p_campus_id) OR public.has_role(uid, 'admin')) THEN
    RAISE EXCEPTION 'NOT_A_MEMBER';
  END IF;

  -- Revoke any existing active invites this user holds for this campus.
  UPDATE public.campus_invites
     SET status = 'revoked'
   WHERE inviter_id = uid
     AND campus_id = p_campus_id
     AND status = 'active';

  -- Single-use invite code (uppercase, simple alnum).
  new_code := upper(translate(substr(encode(gen_random_bytes(8),'base64'),1,8),'+/=','XYZ'));

  INSERT INTO public.campus_invites (code, campus_id, inviter_id, max_uses, expires_at)
    VALUES (
      new_code, p_campus_id, uid, 1,
      CASE WHEN p_expires_in_hours IS NULL THEN NULL
           ELSE now() + (p_expires_in_hours || ' hours')::interval END
    )
    RETURNING * INTO rec;
  RETURN rec;
END $function$;

-- Mark code as 'used' the moment it's redeemed.
CREATE OR REPLACE FUNCTION public.redeem_campus_invite(p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  inv public.campus_invites%rowtype;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Lock the most recent matching active invite (codes may repeat across history).
  SELECT * INTO inv
    FROM public.campus_invites
   WHERE code = p_code
     AND status = 'active'
   ORDER BY created_at DESC
   LIMIT 1
   FOR UPDATE;

  IF NOT FOUND THEN
    -- Fall back to any record with this code to give a clearer error.
    SELECT * INTO inv FROM public.campus_invites WHERE code = p_code ORDER BY created_at DESC LIMIT 1;
    IF NOT FOUND THEN RAISE EXCEPTION 'INVITE_NOT_FOUND'; END IF;
    IF inv.status <> 'active' THEN RAISE EXCEPTION 'INVITE_REVOKED'; END IF;
  END IF;

  IF inv.expires_at IS NOT NULL AND inv.expires_at < now() THEN
    UPDATE public.campus_invites SET status = 'revoked' WHERE id = inv.id;
    RAISE EXCEPTION 'INVITE_EXPIRED';
  END IF;
  IF inv.uses >= inv.max_uses THEN
    UPDATE public.campus_invites SET status = 'used' WHERE id = inv.id;
    RAISE EXCEPTION 'INVITE_USED_UP';
  END IF;

  INSERT INTO public.campus_memberships (campus_id, user_id, invited_by)
    VALUES (inv.campus_id, uid, inv.inviter_id)
    ON CONFLICT DO NOTHING;

  -- Increment uses and auto-void after this single use.
  UPDATE public.campus_invites
     SET uses = uses + 1,
         status = 'used'
   WHERE id = inv.id;

  RETURN inv.campus_id;
END $function$;
