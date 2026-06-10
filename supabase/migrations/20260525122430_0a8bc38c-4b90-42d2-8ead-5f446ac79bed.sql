
-- 1. 新增审核字段
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS auto_flag_reason text,
  ADD COLUMN IF NOT EXISTS review_note text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

-- 校验值
DO $$ BEGIN
  ALTER TABLE public.community_posts
    ADD CONSTRAINT community_posts_status_chk
    CHECK (status IN ('approved','pending','rejected','removed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status, created_at DESC);

-- 2. 更新 SELECT 策略:仅 approved 对其他成员可见;作者/管理员可见全部
DROP POLICY IF EXISTS "Posts visible to campus members" ON public.community_posts;
CREATE POLICY "Posts visible to campus members"
  ON public.community_posts FOR SELECT TO authenticated
  USING (
    (status = 'approved' AND (public.is_campus_member(auth.uid(), campus_id) OR public.has_role(auth.uid(),'admin')))
    OR auth.uid() = author_id
    OR public.has_role(auth.uid(),'admin')
  );

-- 3. 敏感词库 & 自动审核触发器
CREATE OR REPLACE FUNCTION public.community_posts_auto_moderate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  keywords text[] := ARRAY[
    '微信','加微','vx','wechat','+v','薇信',
    'qq群','QQ群','飞机','tg群','telegram',
    '约炮','约pao','一夜情','卖淫','嫖','援交',
    '赌博','博彩','彩票','刷单','返利','兼职日结',
    '贷款','网贷','黑客','代开','发票',
    '法轮','翻墙','VPN','梯子',
    '杀人','自杀','吸毒','毒品'
  ];
  k text;
  haystack text;
BEGIN
  haystack := lower(coalesce(NEW.title,'') || ' ' || coalesce(NEW.content,''));
  FOREACH k IN ARRAY keywords LOOP
    IF position(lower(k) in haystack) > 0 THEN
      NEW.status := 'pending';
      NEW.auto_flag_reason := '命中敏感词: ' || k;
      EXIT;
    END IF;
  END LOOP;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS community_posts_auto_moderate ON public.community_posts;
CREATE TRIGGER community_posts_auto_moderate
  BEFORE INSERT ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.community_posts_auto_moderate();

-- 4. 举报阈值触发:同一帖子累计 ≥3 条 pending 举报 → 自动转待审核
CREATE OR REPLACE FUNCTION public.community_posts_flag_on_reports()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE cnt int;
BEGIN
  IF NEW.target_type <> 'post' THEN RETURN NEW; END IF;
  SELECT count(*) INTO cnt FROM public.reports
    WHERE target_type='post' AND target_id=NEW.target_id AND status='pending';
  IF cnt >= 3 THEN
    UPDATE public.community_posts
      SET status='pending',
          auto_flag_reason = COALESCE(auto_flag_reason, '用户举报阈值触发')
      WHERE id = NEW.target_id AND status='approved';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS reports_flag_post ON public.reports;
CREATE TRIGGER reports_flag_post
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.community_posts_flag_on_reports();

-- 5. 审核结果通知作者
CREATE OR REPLACE FUNCTION public.notify_on_post_reviewed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status IN ('rejected','removed','approved')
     AND OLD.status <> 'approved' THEN
    PERFORM public.create_notification(NEW.author_id, 'post_reviewed', jsonb_build_object(
      'post_id', NEW.id,
      'post_title', NEW.title,
      'status', NEW.status,
      'note', COALESCE(NEW.review_note, NEW.auto_flag_reason, '')
    ));
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS notify_post_reviewed ON public.community_posts;
CREATE TRIGGER notify_post_reviewed
  AFTER UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_post_reviewed();
