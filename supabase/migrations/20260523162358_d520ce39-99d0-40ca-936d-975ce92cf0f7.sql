
-- 1. profiles_private 表存敏感字段
CREATE TABLE public.profiles_private (
  id uuid PRIMARY KEY,
  phone text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read private"
  ON public.profiles_private FOR SELECT TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Owner can insert private"
  ON public.profiles_private FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Owner can update private"
  ON public.profiles_private FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- migrate existing phone
INSERT INTO public.profiles_private (id, phone)
  SELECT id, phone FROM public.profiles WHERE phone IS NOT NULL
  ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.profiles DROP COLUMN phone;

-- update handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  if new.phone is not null then
    insert into public.profiles_private (id, phone)
    values (new.id, new.phone)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

-- 2. messages UPDATE 收紧
DROP POLICY IF EXISTS "Recipients can mark read" ON public.messages;
CREATE POLICY "Recipients can mark read"
  ON public.messages FOR UPDATE TO authenticated
  USING (
    auth.uid() <> sender_id AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
    )
  )
  WITH CHECK (
    auth.uid() <> sender_id AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
    )
  );

-- trigger: only read_at is mutable
CREATE OR REPLACE FUNCTION public.messages_immutable_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.content IS DISTINCT FROM OLD.content
    OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
    OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
    OR NEW.created_at IS DISTINCT FROM OLD.created_at
    OR NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Only read_at may be updated on messages';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS messages_immutable_columns_trg ON public.messages;
CREATE TRIGGER messages_immutable_columns_trg
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.messages_immutable_columns();

-- 3. conversations: 禁止直接 INSERT,用 SECURITY DEFINER 函数
DROP POLICY IF EXISTS "Participants can create conversations" ON public.conversations;

CREATE OR REPLACE FUNCTION public.start_conversation(partner_id uuid, source text DEFAULT 'match')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  caller uuid := auth.uid();
  a uuid;
  b uuid;
  conv_id uuid;
  src text := COALESCE(source, 'match');
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF partner_id IS NULL OR partner_id = caller THEN
    RAISE EXCEPTION 'Invalid partner';
  END IF;
  IF src NOT IN ('match','voice','video','treehole') THEN
    RAISE EXCEPTION 'Invalid source';
  END IF;
  IF caller < partner_id THEN a := caller; b := partner_id;
  ELSE a := partner_id; b := caller; END IF;

  SELECT id INTO conv_id FROM public.conversations
    WHERE user_a = a AND user_b = b LIMIT 1;
  IF conv_id IS NOT NULL THEN RETURN conv_id; END IF;

  INSERT INTO public.conversations (user_a, user_b, source)
    VALUES (a, b, src)
    RETURNING id INTO conv_id;
  RETURN conv_id;
END;
$$;
REVOKE ALL ON FUNCTION public.start_conversation(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_conversation(uuid, text) TO authenticated;
