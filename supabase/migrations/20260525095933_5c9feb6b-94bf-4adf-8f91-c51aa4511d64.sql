
-- 1) Tables
CREATE TABLE IF NOT EXISTS public.wallets (
  id uuid PRIMARY KEY,
  coins integer NOT NULL DEFAULT 0 CHECK (coins >= 0),
  pro_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallet_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  delta integer NOT NULL,
  kind text NOT NULL CHECK (kind IN ('topup','spend','gift_sent','gift_received','pro_sub','refund','admin')),
  balance_after integer NOT NULL,
  ref jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ledger_user_time ON public.wallet_ledger (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.gift_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  gift_code text NOT NULL,
  coins integer NOT NULL CHECK (coins > 0),
  message text,
  conversation_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gift_receiver_time ON public.gift_transactions (receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_sender_time ON public.gift_transactions (sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_conv ON public.gift_transactions (conversation_id, created_at DESC);

-- 2) RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own wallet" ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins read wallets" ON public.wallets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users see own ledger" ON public.wallet_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read ledger" ON public.wallet_ledger FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users see own gifts" ON public.gift_transactions FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Admins read gifts" ON public.gift_transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3) Internal helper: ensure wallet row
CREATE OR REPLACE FUNCTION public.ensure_wallet(_uid uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.wallets (id, coins) VALUES (_uid, 0)
  ON CONFLICT (id) DO NOTHING;
END; $$;
REVOKE EXECUTE ON FUNCTION public.ensure_wallet(uuid) FROM PUBLIC, anon, authenticated;

-- 4) Top-up (test/dev): authenticated user adds coins to self
CREATE OR REPLACE FUNCTION public.wallet_topup(_amount integer, _ref jsonb DEFAULT '{}'::jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); new_bal integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _amount IS NULL OR _amount <= 0 OR _amount > 100000 THEN RAISE EXCEPTION 'Invalid amount'; END IF;
  PERFORM public.ensure_wallet(uid);
  UPDATE public.wallets SET coins = coins + _amount WHERE id = uid RETURNING coins INTO new_bal;
  INSERT INTO public.wallet_ledger (user_id, delta, kind, balance_after, ref)
    VALUES (uid, _amount, 'topup', new_bal, COALESCE(_ref, '{}'::jsonb));
  RETURN new_bal;
END; $$;

-- 5) Buy Pro: consume coins, extend pro_until
CREATE OR REPLACE FUNCTION public.wallet_buy_pro(_plan text)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); cost integer; days integer; cur timestamptz; new_until timestamptz; new_bal integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _plan = 'month' THEN cost := 188; days := 30;
  ELSIF _plan = 'quarter' THEN cost := 488; days := 90;
  ELSIF _plan = 'year' THEN cost := 1588; days := 365;
  ELSE RAISE EXCEPTION 'Unknown plan'; END IF;
  PERFORM public.ensure_wallet(uid);
  UPDATE public.wallets SET coins = coins - cost,
    pro_until = GREATEST(COALESCE(pro_until, now()), now()) + (days || ' days')::interval
    WHERE id = uid
    RETURNING coins, pro_until INTO new_bal, new_until;
  IF new_bal IS NULL THEN RAISE EXCEPTION 'Wallet missing'; END IF;
  INSERT INTO public.wallet_ledger (user_id, delta, kind, balance_after, ref)
    VALUES (uid, -cost, 'pro_sub', new_bal, jsonb_build_object('plan', _plan, 'days', days, 'pro_until', new_until));
  RETURN new_until;
END; $$;

-- 6) Send gift: deduct sender, log gift, create receiver notification.
-- Catalog enforced on server side (gift_code + coins must match list).
CREATE OR REPLACE FUNCTION public.wallet_send_gift(
  _receiver_id uuid, _gift_code text, _coins integer, _message text, _conv_id uuid
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); new_bal integer; gift_id uuid; sender_name text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _receiver_id IS NULL OR _receiver_id = uid THEN RAISE EXCEPTION 'Invalid receiver'; END IF;
  IF _coins IS NULL OR _coins <= 0 OR _coins > 99999 THEN RAISE EXCEPTION 'Invalid coins'; END IF;
  IF _gift_code IS NULL OR length(_gift_code) > 32 THEN RAISE EXCEPTION 'Invalid gift'; END IF;

  PERFORM public.ensure_wallet(uid);
  PERFORM public.ensure_wallet(_receiver_id);

  -- deduct sender
  UPDATE public.wallets SET coins = coins - _coins WHERE id = uid RETURNING coins INTO new_bal;
  IF new_bal IS NULL THEN RAISE EXCEPTION 'Wallet missing'; END IF;

  INSERT INTO public.wallet_ledger (user_id, delta, kind, balance_after, ref)
    VALUES (uid, -_coins, 'gift_sent', new_bal,
      jsonb_build_object('receiver_id', _receiver_id, 'gift_code', _gift_code, 'conv_id', _conv_id));

  INSERT INTO public.gift_transactions (sender_id, receiver_id, gift_code, coins, message, conversation_id)
    VALUES (uid, _receiver_id, _gift_code, _coins, NULLIF(_message, ''), _conv_id)
    RETURNING id INTO gift_id;

  -- receiver gets 60% back as coins (creator/recipient share)
  DECLARE recv_share integer := GREATEST((_coins * 60) / 100, 1); rb integer;
  BEGIN
    UPDATE public.wallets SET coins = coins + recv_share WHERE id = _receiver_id RETURNING coins INTO rb;
    INSERT INTO public.wallet_ledger (user_id, delta, kind, balance_after, ref)
      VALUES (_receiver_id, recv_share, 'gift_received', rb,
        jsonb_build_object('sender_id', uid, 'gift_code', _gift_code, 'gift_id', gift_id, 'conv_id', _conv_id));
  END;

  SELECT nickname INTO sender_name FROM public.profiles WHERE id = uid;
  PERFORM public.create_notification(_receiver_id, 'gift', jsonb_build_object(
    'sender_id', uid,
    'sender_name', COALESCE(sender_name, 'Pulse 用户'),
    'gift_code', _gift_code,
    'coins', _coins,
    'message', COALESCE(_message, ''),
    'conversation_id', _conv_id
  ));

  RETURN gift_id;
END; $$;

REVOKE EXECUTE ON FUNCTION public.wallet_topup(integer, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wallet_buy_pro(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.wallet_send_gift(uuid, text, integer, text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.wallet_topup(integer, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_buy_pro(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_send_gift(uuid, text, integer, text, uuid) TO authenticated;

-- Realtime for wallet balance
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER TABLE public.wallets REPLICA IDENTITY FULL;
