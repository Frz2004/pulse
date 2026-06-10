import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { track, Events } from "@/lib/analytics";
import {
  Settings, Edit3, LogOut, Shield, Bell, Lock, Heart, MessageCircle,
  Sparkles, MapPin, Cake, Briefcase, GraduationCap, Crown, ChevronRight,
  Home, User as UserIcon, Flame, Camera, Film, Mic, Users, ShieldCheck, QrCode, X, Brain,
} from "lucide-react";
import { getMyProfile } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { SbtiCharacter } from "@/components/sbti/SbtiCharacter";
import { getSbtiProgress } from "@/lib/sbti/client-storage";
import { getSbtiRewardMeta } from "@/lib/sbti/rewards";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "我的 · Pulse" },
      { name: "description", content: "查看与编辑你的 Pulse 个人主页：资料、相册、兴趣标签、认证与设置。" },
    ],
  }),
  component: MePage,
});

function MePage() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const demoMode = typeof window !== "undefined" && localStorage.getItem("pulse_demo_mode") === "true";
    if (demoMode) {
      if (!mounted) return;
      setAuthed(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const fetchMe = useServerFn(getMyProfile);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchMe(),
    enabled: authed === true,
  });

  const demoMode = typeof window !== "undefined" && localStorage.getItem("pulse_demo_mode") === "true";
  const demoProfile = {
    nickname: "演示用户",
    city: "上海",
    signature: "这是一个用于演示用户流程的测试账号。",
    verify_real: false,
    verify_student: false,
    onboarded: true,
    interests: ["旅行", "咖啡", "电影"],
    personality: ["温柔", "幽默"],
    sbti_type: "ENFP",
    sbti_visibility: "PUBLIC",
    photos: [],
    main_idx: 0,
  } as Record<string, any>;
  const profile = ((demoMode ? demoProfile : data?.profile) as Record<string, any> | null | undefined);
  const onboarded = profile?.onboarded;
  const photos: string[] = Array.isArray(profile?.photos) ? profile!.photos : [];
  const mainIdx = profile?.main_idx ?? 0;
  const mainPhoto = photos[mainIdx] || photos[0];
  const interests: string[] = Array.isArray(profile?.interests) ? profile!.interests : [];
  const personality: string[] = Array.isArray(profile?.personality) ? profile!.personality : [];
  const sbtiType = typeof profile?.sbti_type === "string" ? profile.sbti_type : "";
  const sbtiVisibility = profile?.sbti_visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";
  const localSbti = typeof window !== "undefined" ? getSbtiProgress().sbtiType : null;
  const effectiveSbti = sbtiType || localSbti || "";
  const sbtiMeta = effectiveSbti ? getSbtiRewardMeta(effectiveSbti) : null;
  const [showSbtiPrompt, setShowSbtiPrompt] = useState(false);

  useEffect(() => {
    if (!profile) return;
    if (sbtiType) return;
    const key = "pulse_sbti_prompt_dismiss_until";
    const until = Number(localStorage.getItem(key) || "0");
    if (Date.now() < until) return;
    setShowSbtiPrompt(true);
    track(Events.SbtiPromptShow);
  }, [profile, sbtiType]);

  const dismissSbtiPrompt = () => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("pulse_sbti_prompt_dismiss_until", String(Date.now() + sevenDays));
    setShowSbtiPrompt(false);
    track(Events.SbtiPromptClickLater);
  };

  const goFillSbti = () => {
    track(Events.SbtiPromptClickFill);
    navigate({ to: "/explore" });
  };

  if (pathname !== "/me") return <Outlet />;

  if (authed === false) {
    return (
      <Shell>
        <div className="grid place-items-center pt-32 text-center">
          <div className="mx-5 max-w-sm rounded-3xl border border-border bg-surface/70 p-8 backdrop-blur">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-coral to-sun text-background shadow-lg">
              <UserIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold">还没有登录</h2>
            <p className="mt-2 text-sm text-muted-foreground">登录后即可查看你的个人主页、消息和匹配</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link to="/auth" search={{ mode: "login" }} className="rounded-[10px] border border-brand/40 px-4 py-2.5 text-sm font-medium text-brand">登录</Link>
              <Link to="/auth" search={{ mode: "signup" }} className="rounded-[10px] bg-coral px-4 py-2.5 text-sm font-semibold text-background">注册</Link>
            </div>
          </div>
        </div>
        <BottomNav active="me" />
      </Shell>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    try {
      localStorage.removeItem("pulse_demo_mode");
      localStorage.removeItem("pulse_first_login_done");
      localStorage.removeItem("pulse_profile_completed");
      localStorage.removeItem("pulse_profile");
      localStorage.removeItem("pulse_my_sbti");
    } catch {}
    const { track, Events, resetAnalytics } = await import("@/lib/analytics");
    track(Events.SignOut);
    resetAnalytics();
    setAuthed(false);
    refetch();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  };

  return (
    <Shell>
      {/* Hero */}
      <header className="relative">
        {/* Decorative banner */}
        <div className="absolute inset-x-0 top-0 h-80 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-coral/40 via-sun/25 to-mint/30" />
          <div className="absolute -top-24 -left-16 size-72 rounded-full bg-coral/40 blur-3xl" />
          <div className="absolute top-10 -right-20 size-80 rounded-full bg-mint/35 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[430px] items-center justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <div className="ml-auto flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-card/70 backdrop-blur hover:border-coral/40 transition" aria-label="二维码名片">
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </button>
            <Link to="/me" className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-card/70 backdrop-blur hover:border-coral/40 transition" aria-label="设置">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[430px] px-4">
          <div className="relative rounded-[28px] border border-white/60 bg-card/85 p-5 pt-12 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(214,113,71,0.35)] ios-card">
            {/* Floating avatar + SBTI 小人 */}
            <div className="absolute -top-10 left-5 flex items-end gap-2">
              <div className="relative">
                <div className="absolute inset-0 -m-1 rounded-[26px] bg-gradient-to-br from-coral via-sun to-mint blur-md opacity-70" />
                {mainPhoto ? (
                  <img src={mainPhoto} alt="头像" className="relative h-24 w-24 rounded-[24px] object-cover ring-4 ring-background shadow-xl" />
                ) : (
                  <div className="relative grid h-24 w-24 place-items-center rounded-[24px] bg-gradient-to-br from-coral to-sun font-display text-4xl text-background ring-4 ring-background shadow-xl">
                    {(profile?.nickname || "我").slice(0, 1)}
                  </div>
                )}
                <Link to="/me/edit" className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-foreground text-background shadow-lg">
                  <Camera className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>

            {/* Name row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 pl-[108px] -mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="truncate font-display text-2xl font-bold tracking-tight">
                    {isLoading ? "—" : profile?.nickname || "未命名"}
                  </h1>
                  {profile?.verify_real && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-mint/20 px-1.5 py-0.5 text-[10px] font-medium text-mint border border-mint/30">
                      <ShieldCheck className="h-3 w-3" /> 真人
                    </span>
                  )}
                  {profile?.verify_student && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/25">
                      <GraduationCap className="h-3 w-3" /> 学生
                    </span>
                  )}
                  {sbtiMeta && sbtiVisibility === "PUBLIC" && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-mint/20 to-sun/20 px-2 py-0.5 text-[10px] font-semibold text-mint border border-mint/30">
                      {sbtiMeta.nameplate}
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {profile?.signature || "还没有签名，点编辑加一句让人记住你的话"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile?.city && <Chip icon={MapPin}>{profile.city}</Chip>}
              {profile?.mbti && <Chip icon={Sparkles}>{profile.mbti}</Chip>}
              {sbtiMeta && <Chip icon={Brain}>{sbtiMeta.code}</Chip>}
              {profile?.zodiac && <Chip icon={Cake}>{profile.zodiac}</Chip>}
              {!profile?.city && !profile?.mbti && !profile?.zodiac && !isLoading && (
                <Link to="/onboarding" className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-coral/40 hover:text-coral transition">
                  + 添加标签
                </Link>
              )}
            </div>

            {!onboarded && !isLoading && (
              <Link
                to="/onboarding"
                className="group mt-4 flex items-center justify-between rounded-2xl border border-coral/30 bg-gradient-to-r from-coral/15 via-sun/10 to-coral/15 px-4 py-3 text-sm text-coral hover:border-coral/60 transition tap-scale"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles className="h-4 w-4" /> 完善资料解锁更多匹配
                </span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
            )}

            {showSbtiPrompt && (
              <div className="mt-3 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">补充你的 SBTI</p>
                    <p className="mt-1 text-xs text-muted-foreground">完善后可提升匹配准确度（可跳过）</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={goFillSbti} className="rounded-lg bg-mint px-3 py-1.5 text-xs font-semibold text-background">立即填写</button>
                      <button onClick={dismissSbtiPrompt} className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">稍后再说</button>
                    </div>
                  </div>
                  <button onClick={dismissSbtiPrompt} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <StatPill icon={Heart} label="同频喜欢" value="0" tone="coral" />
              <StatPill icon={Sparkles} label="互相匹配" value="0" tone="sun" />
              <StatPill icon={MessageCircle} label="收到留言" value="0" tone="mint" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-md px-5 pb-28 pt-5">
        {/* Photo gallery */}
        <section className="mt-2">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-base font-semibold flex items-center gap-2">
              <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-coral to-sun" />
              我的相册
              {photos.length > 0 && <span className="text-xs text-muted-foreground font-normal">· {photos.length}</span>}
            </h2>

          </div>
          {photos.length === 0 ? (
            <Link
              to="/onboarding"
              className="grid h-32 place-items-center rounded-2xl border-2 border-dashed border-border bg-surface/40 text-sm text-muted-foreground hover:border-coral/40 hover:text-coral transition"
            >
              <span className="flex items-center gap-2"><Camera className="h-4 w-4" /> 上传你的第一张照片</span>
            </Link>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {photos.slice(0, 9).map((p, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border border-border/70 shadow-sm hover:shadow-lg hover:shadow-coral/10 hover:-translate-y-0.5 transition-all duration-300">
                  <img src={p} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {i === mainIdx && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-gradient-to-r from-coral to-sun px-2 py-0.5 text-[9px] font-semibold text-background shadow-md">主图</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About */}
        <section className="mt-6">
          <h2 className="mb-3 font-display text-base font-semibold flex items-center gap-2">
            <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-mint to-primary" />
            关于我
          </h2>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 text-sm leading-relaxed text-foreground/90 shadow-sm">
            {profile?.intro || "还没有写自我介绍。让别人通过你的故事认识你。"}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {profile?.gender && <InfoRow icon={UserIcon}>{profile.gender}</InfoRow>}
            {profile?.birthday && <InfoRow icon={Cake}>{profile.birthday}</InfoRow>}
            {profile?.job && <InfoRow icon={Briefcase}>{profile.job}</InfoRow>}
            {profile?.education && <InfoRow icon={GraduationCap}>{profile.education}</InfoRow>}
            {profile?.school && <InfoRow icon={GraduationCap}>{profile.school}</InfoRow>}
            {profile?.height && <InfoRow icon={UserIcon}>{profile.height}</InfoRow>}
            {profile?.hometown && <InfoRow icon={Home}>{profile.hometown}</InfoRow>}
            {profile?.status && <InfoRow icon={Flame}>{profile.status}</InfoRow>}
          </div>
        </section>

        {/* Tags */}
        <section className="mt-6">
          <h2 className="mb-3 font-display text-base font-semibold flex items-center gap-2">
            <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-sun to-coral" />
            兴趣 &amp; 性格
          </h2>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {interests.map((t) => (
                  <span key={t} className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[11px] text-mint">
                    #{t}
                  </span>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">还没有填写兴趣爱好。</p>}
            {personality.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {personality.map((t) => (
                  <span key={t} className="rounded-full border border-sun/30 bg-sun/10 px-2.5 py-1 text-[11px] text-sun">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile?.mbti && <MiniBadge>{profile.mbti}</MiniBadge>}
              {profile?.zodiac && <MiniBadge>{profile.zodiac}</MiniBadge>}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 font-display text-base font-semibold flex items-center gap-2">
            <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-primary to-mint" />
            生活方式
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {profile?.smoke && <InfoRow icon={ShieldCheck}>抽烟：{profile.smoke}</InfoRow>}
            {profile?.drink && <InfoRow icon={ShieldCheck}>喝酒：{profile.drink}</InfoRow>}
            {profile?.sleep && <InfoRow icon={Cake}>作息：{profile.sleep}</InfoRow>}
            {profile?.diet && <InfoRow icon={Heart}>饮食：{profile.diet}</InfoRow>}
            {profile?.pet && <InfoRow icon={Home}>宠物：{profile.pet}</InfoRow>}
            {profile?.health && <InfoRow icon={Shield}>健康：{profile.health}</InfoRow>}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 font-display text-base font-semibold flex items-center gap-2">
            <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-coral to-sun" />
            交友意向
          </h2>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
            {Array.isArray(profile?.intent) && profile.intent.length > 0 ? <div className="flex flex-wrap gap-1.5">{profile.intent.map((t: string) => <span key={t} className="rounded-full border border-coral/30 bg-coral/10 px-2.5 py-1 text-[11px] text-coral">{t}</span>)}</div> : <p className="text-sm text-muted-foreground">还没有填写交友目的。</p>}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {profile?.relationship && <InfoRow icon={Heart}>状态：{profile.relationship}</InfoRow>}
              {profile?.sexual_orientation && <InfoRow icon={UserIcon}>取向：{profile.sexual_orientation}</InfoRow>}
              {profile?.distance && <InfoRow icon={MapPin}>距离：{profile.distance}</InfoRow>}
              {profile?.age_range && <InfoRow icon={Cake}>年龄：{profile.age_range.min || "不限"}-{profile.age_range.max || "不限"}</InfoRow>}
            </div>
            {profile?.ideal_type && <div className="mt-3 rounded-2xl bg-background/50 p-3 text-sm text-foreground/90"><span className="text-muted-foreground">理想型：</span>{profile.ideal_type}</div>}
            {profile?.icebreaker && <div className="mt-2 rounded-2xl bg-background/50 p-3 text-sm text-foreground/90"><span className="text-muted-foreground">破冰问题：</span>{profile.icebreaker}</div>}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 font-display text-base font-semibold flex items-center gap-2">
            <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-mint to-primary" />
            认证与安全
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <InfoRow icon={ShieldCheck}>{profile?.phone_verified ? "手机已认证" : "手机未认证"}</InfoRow>
            <InfoRow icon={ShieldCheck}>{profile?.verify_real ? "真人已认证" : "真人未认证"}</InfoRow>
            <InfoRow icon={GraduationCap}>{profile?.verify_student ? "学生已认证" : "学生未认证"}</InfoRow>
          </div>
        </section>

        {/* Menu - 内容创作 */}
        <SectionLabel>创作与互动</SectionLabel>
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 divide-y divide-border/60 shadow-sm">
          <MenuItem icon={Edit3} label="编辑资料" to="/me/edit" iconColor="text-primary" iconBg="bg-primary/15" />
          <MenuItem icon={Film} label="我的短视频" to="/videos" iconColor="text-coral" iconBg="bg-coral/15" />
          <MenuItem icon={Mic} label="语音名片" to="/voice-card" iconColor="text-mint" iconBg="bg-mint/15" />
          <MenuItem icon={Heart} label="我喜欢的人" badge="敬请期待" iconColor="text-coral" iconBg="bg-coral/15" />
          <MenuItem icon={MessageCircle} label="我的消息" to="/messages" iconColor="text-primary" iconBg="bg-primary/15" />
          <MenuItem icon={Crown} label="钱包 · Pulse Pro" to="/wallet" badge="HOT" badgeColor="bg-gradient-to-r from-coral to-sun text-background" iconColor="text-sun" iconBg="bg-sun/20" />
        </section>

        <SectionLabel>设置与安全</SectionLabel>
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 divide-y divide-border/60 shadow-sm">
          <MenuItem icon={Bell} label="通知中心" to="/notifications" iconColor="text-sun" iconBg="bg-sun/15" />
          <MenuItem icon={Lock} label="隐私与可见性" to="/privacy" iconColor="text-mint" iconBg="bg-mint/15" />
          <MenuItem icon={ShieldCheck} label="实名 & 学生认证" to="/verify" iconColor="text-primary" iconBg="bg-primary/15" />
          <MenuItem icon={Shield} label="我的举报与申诉" to="/me/reports" iconColor="text-coral" iconBg="bg-coral/15" />
          <MenuItem icon={Users} label="账号安全" iconColor="text-muted-foreground" iconBg="bg-muted" />
        </section>

        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface/40 py-3 text-sm text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> 退出登录
        </button>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">Pulse v0.1 · 让相遇变得有趣</p>
      </main>

      <BottomNav active="me" />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}

function Chip({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-lg font-semibold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function StatPill({
  icon: Icon, label, value, tone,
}: { icon: any; label: string; value: string; tone: "coral" | "sun" | "mint" }) {
  const tones = {
    coral: "from-coral/20 to-coral/5 text-coral border-coral/25",
    sun: "from-sun/25 to-sun/5 text-amber-700 border-sun/30",
    mint: "from-mint/20 to-mint/5 text-mint border-mint/25",
  } as const;
  return (
    <div className={`relative rounded-2xl border bg-gradient-to-br ${tones[tone]} px-3 py-3 text-center overflow-hidden`}>
      <Icon className="absolute -top-1 -right-1 h-8 w-8 opacity-15" />
      <div className="font-display text-xl font-bold text-foreground tabular-nums leading-none">{value}</div>
      <div className="mt-1.5 text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
      {children}
    </h3>
  );
}

function InfoRow({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate text-foreground/90">{children}</span>
    </div>
  );
}

function MiniBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">{children}</span>;
}

function MenuItem({
  icon: Icon, label, to, search, badge, badgeColor, iconColor, iconBg,
}: {
  icon: any; label: string; to?: string; search?: Record<string, unknown>;
  badge?: string; badgeColor?: string; iconColor?: string; iconBg?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className={`grid h-8 w-8 place-items-center rounded-xl ${iconBg ?? "bg-muted"}`}>
        <Icon className={`h-4 w-4 ${iconColor ?? "text-muted-foreground"}`} />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColor ?? "bg-muted text-muted-foreground"}`}>
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  if (to) {
    return (
      <Link to={to} search={search as never} className="block hover:bg-background/40">
        {inner}
      </Link>
    );
  }
  return <button className="block w-full text-left hover:bg-background/40">{inner}</button>;
}

// BottomNav lives in src/components/BottomNav.tsx