
-- 1. 给 reports 表加处理说明
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS resolution_note text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid;

-- 2. 新建 appeals 表
CREATE TABLE IF NOT EXISTS public.appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('report_rejected','content_removed','account_action','other')),
  target_type text,
  target_id uuid,
  related_report_id uuid REFERENCES public.reports(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewing','accepted','rejected')),
  resolution_note text,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appeals_user_id_idx ON public.appeals(user_id);
CREATE INDEX IF NOT EXISTS appeals_status_idx ON public.appeals(status);

ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users submit own appeals" ON public.appeals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users see own appeals" ON public.appeals
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage appeals" ON public.appeals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER appeals_set_updated_at
  BEFORE UPDATE ON public.appeals
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. 举报结果通知触发器
CREATE OR REPLACE FUNCTION public.notify_on_report_resolved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status IN ('resolved','rejected') THEN
    PERFORM public.create_notification(NEW.reporter_id, 'report_resolved', jsonb_build_object(
      'report_id', NEW.id,
      'target_type', NEW.target_type,
      'target_id', NEW.target_id,
      'status', NEW.status,
      'note', COALESCE(NEW.resolution_note, '')
    ));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_on_report_resolved ON public.reports;
CREATE TRIGGER trg_notify_on_report_resolved
  AFTER UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_report_resolved();

-- 4. 申诉结果通知触发器
CREATE OR REPLACE FUNCTION public.notify_on_appeal_resolved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status IN ('accepted','rejected') THEN
    PERFORM public.create_notification(NEW.user_id, 'appeal_resolved', jsonb_build_object(
      'appeal_id', NEW.id,
      'kind', NEW.kind,
      'status', NEW.status,
      'note', COALESCE(NEW.resolution_note, '')
    ));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_on_appeal_resolved ON public.appeals;
CREATE TRIGGER trg_notify_on_appeal_resolved
  AFTER UPDATE ON public.appeals
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_appeal_resolved();
