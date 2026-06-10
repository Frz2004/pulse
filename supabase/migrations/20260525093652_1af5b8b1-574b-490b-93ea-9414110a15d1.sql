CREATE TABLE public.verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('real','student')),
  evidence_url text NOT NULL,
  evidence_extra text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  review_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_verifications_user_kind ON public.verifications(user_id, kind);
CREATE INDEX idx_verifications_status ON public.verifications(status, created_at DESC);

-- 同一用户同一类型，只能存在一条 pending 或 approved 记录
CREATE UNIQUE INDEX uniq_verifications_active
  ON public.verifications(user_id, kind)
  WHERE status IN ('pending','approved');

ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own verifications"
  ON public.verifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users submit own verifications"
  ON public.verifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins read verifications"
  ON public.verifications FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update verifications"
  ON public.verifications FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER verifications_set_updated_at
  BEFORE UPDATE ON public.verifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();