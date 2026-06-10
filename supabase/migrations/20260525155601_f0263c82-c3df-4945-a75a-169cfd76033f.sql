-- ============ 比赛公告 contests ============
CREATE TABLE public.contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  description text,
  cover text,
  category text NOT NULL DEFAULT 'general',
  location text,
  prize text,
  organizer text,
  contact text,
  register_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  deadline timestamptz,
  status text NOT NULL DEFAULT 'open',
  hot int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contests readable by authed" ON public.contests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own contests" ON public.contests FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Owner or admin update contests" ON public.contests FOR UPDATE TO authenticated USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete contests" ON public.contests FOR DELETE TO authenticated USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX contests_created_at_idx ON public.contests (created_at DESC);

-- ============ 工作需求 jobs ============
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'parttime',
  location text,
  salary text,
  contact text NOT NULL,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'open',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs readable by authed" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Owner or admin update jobs" ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete jobs" ON public.jobs FOR DELETE TO authenticated USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX jobs_created_at_idx ON public.jobs (created_at DESC);

-- ============ 场地 venues + 预约 bookings ============
CREATE TABLE public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover text,
  category text NOT NULL DEFAULT 'study',
  location text,
  capacity int,
  open_hours text,
  rules text,
  manager_id uuid,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Venues readable by authed" ON public.venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage venues" ON public.venues FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.venue_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  purpose text NOT NULL,
  attendees int NOT NULL DEFAULT 1,
  contact text,
  status text NOT NULL DEFAULT 'pending',
  review_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own bookings" ON public.venue_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users create own bookings" ON public.venue_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel own pending" ON public.venue_bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX venue_bookings_venue_starts_idx ON public.venue_bookings (venue_id, starts_at);
CREATE INDEX venue_bookings_user_idx ON public.venue_bookings (user_id, created_at DESC);

-- 防重叠预约触发器
CREATE OR REPLACE FUNCTION public.venue_booking_no_overlap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('pending', 'approved') THEN
    IF EXISTS (
      SELECT 1 FROM public.venue_bookings b
      WHERE b.venue_id = NEW.venue_id
        AND b.id <> NEW.id
        AND b.status IN ('pending', 'approved')
        AND tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(NEW.starts_at, NEW.ends_at, '[)')
    ) THEN
      RAISE EXCEPTION '该时段已有预约,请换个时间' USING ERRCODE = '23505';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.venue_booking_no_overlap() FROM PUBLIC, anon;

CREATE TRIGGER venue_bookings_overlap_check
BEFORE INSERT OR UPDATE ON public.venue_bookings
FOR EACH ROW EXECUTE FUNCTION public.venue_booking_no_overlap();

-- 种子几个场地
INSERT INTO public.venues (name, description, category, location, capacity, open_hours) VALUES
('多功能讨论室 A', '8 人小组讨论室,带白板与投屏', 'study', '图书馆 3F-301', 8, '08:00 - 22:00'),
('路演剧场', '可容纳 80 人,适合活动与发布会', 'event', '创新中心 1F', 80, '09:00 - 21:00'),
('露天篮球场', '标准半场 ×2', 'sport', '体育馆东侧', 20, '06:00 - 22:00'),
('音乐排练房', '隔音房,带架子鼓/键盘', 'music', '艺术楼 B1', 6, '10:00 - 22:00');