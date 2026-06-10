-- 1) 锁定 realtime.messages: 启用 RLS 但不添加策略 => 拒绝所有 broadcast/presence 订阅
--    postgres_changes 不通过此表授权,所以现有实时订阅(消息/通知/钱包)不受影响
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- 2) treehole-media 桶: 允许聊天参与者读取附件中引用的文件
CREATE POLICY "Conv participants read treehole-media attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'treehole-media'
  AND EXISTS (
    SELECT 1
    FROM message_attachments ma
    JOIN messages m ON m.id = ma.message_id
    JOIN conversations c ON c.id = m.conversation_id
    WHERE ma.url LIKE ('%' || objects.name || '%')
      AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
  )
);