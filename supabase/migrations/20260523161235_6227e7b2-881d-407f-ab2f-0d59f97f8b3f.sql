-- 会话表（两个用户之间的对话）
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a uuid NOT NULL,
  user_b uuid NOT NULL,
  source text NOT NULL DEFAULT 'match', -- match | voice | video | treehole
  last_message text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conv_distinct_users CHECK (user_a <> user_b),
  CONSTRAINT conv_ordered CHECK (user_a < user_b),
  CONSTRAINT conv_unique_pair UNIQUE (user_a, user_b)
);

CREATE INDEX idx_conversations_user_a ON public.conversations(user_a, last_message_at DESC);
CREATE INDEX idx_conversations_user_b ON public.conversations(user_b, last_message_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversations visible to participants"
ON public.conversations FOR SELECT TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Participants can create conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Participants can update conversations"
ON public.conversations FOR UPDATE TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b);

-- 消息表
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

CREATE INDEX idx_messages_conv_created ON public.messages(conversation_id, created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages visible to conv participants"
ON public.messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
  )
);

CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
  )
);

CREATE POLICY "Recipients can mark read"
ON public.messages FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
  )
);

-- 发送消息后自动更新会话最后消息
CREATE OR REPLACE FUNCTION public.bump_conversation_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
    SET last_message = NEW.content,
        last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_messages_bump_conv
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation_on_message();

-- 让 profiles 表对所有已认证用户可见（聊天/匹配场景需要展示对方资料）
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated"
ON public.profiles FOR SELECT TO authenticated
USING (true);

-- 实时
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;