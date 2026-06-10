import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Upload, X, Camera, Heart, Sparkles,
  Shield, Phone, GraduationCap, BadgeCheck, Star, Plus, User2, MapPin,
  Cigarette, Wine, Moon, Utensils, Cat, Image as ImageIcon, Video,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { saveProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });


function WeChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M8.7 2C4.5 2 1 4.9 1 8.5c0 2 1.1 3.8 2.9 5L3 16l2.6-1.4c.7.2 1.5.3 2.3.4-.1-.4-.2-.9-.2-1.4 0-3.5 3.3-6.3 7.4-6.3h.7C15 4.1 12.2 2 8.7 2zm-2.6 4a.9.9 0 110 1.8.9.9 0 010-1.8zm5.2 0a.9.9 0 110 1.8.9.9 0 010-1.8zM15.5 9c-3.6 0-6.5 2.4-6.5 5.4 0 3 2.9 5.4 6.5 5.4.7 0 1.4-.1 2-.3l2.2 1.2-.6-2c1.5-1 2.4-2.6 2.4-4.3 0-3-2.9-5.4-6-5.4zm-2 3.2a.7.7 0 110 1.4.7.7 0 010-1.4zm4 0a.7.7 0 110 1.4.7.7 0 010-1.4z"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3z"/>
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.5l-3.3-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0012 22z"/>
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 010-3.8V7.5H3a10 10 0 000 9l3.4-2.6z"/>
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003 7.5l3.4 2.6C7.2 7.7 9.4 5.9 12 5.9z"/>
    </svg>
  );
}

const STEPS = [
  { key: "basic", title: "账号基础", subtitle: "让我们先认识一下你" },
] as const;

const INTEREST_TAGS = [
  "旅行","摄影","咖啡","健身","徒步","骑行","滑雪","潜水","冲浪","露营",
  "电影","音乐节","Live House","唱跳","乐器","K-Pop","摇滚","电子","民谣","古典",
  "美食","烘焙","火锅","日料","brunch","red wine","调酒","小酒馆","街边小吃","素食",
  "读书","写作","播客","脱口秀","桌游","剧本杀","密室","展览","美术馆","设计",
  "宠物","猫派","狗派","养花","手作","编织","陶艺","香薰","水彩","二次元",
  "原神","王者","CSGO","Switch","主机","街机","台球","羽毛球","网球","篮球",
  "瑜伽","普拉提","跑步","马拉松","攀岩","街舞","拉丁","民族舞","滑板","飞盘",
  "投资","创业","AI","编程","硬件","摄影后期","Vlog","剪辑","短视频","创作者",
];

const PERSONALITY_TAGS = [
  "温柔","幽默","直球","社恐","E人","I人","治愈系","INTJ女孩","松弛感","氛围感",
  "细节控","行动派","完美主义","佛系","感性","理性","浪漫","务实","好奇心","共情力",
  "话痨","安静","酷盖","元气","奶系","御姐","少年感","成熟","小天才","钝感力",
];

const MBTI = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"];
const SBTI = [...MBTI];
const ZODIAC = ["白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯","水瓶","双鱼"];
const INTENT = ["认真恋爱","拓展朋友","兴趣搭子","线下饭搭","旅行同伴","深度聊天","随缘看看"];

type Profile = {
  nickname: string; gender: string; birthday: string; city: string;
  hometown: string; height: string; education: string; job: string; school: string;
  photos: string[]; mainIdx: number; videoIntro: string;
  signature: string; intro: string; status: string;
  interests: string[]; personality: string[]; mbti: string; sbtiType: string; sbtiVisibility: "PUBLIC" | "PRIVATE"; zodiac: string;
  smoke: string; drink: string; sleep: string; diet: string; pet: string;
  intent: string[]; relationship: string; idealType: string;
  ageRange: [number, number]; distance: string;
  icebreaker: string; phone: string;
  verifyReal: boolean; verifyStudent: boolean;
};

const initial: Profile = {
  nickname: "", gender: "", birthday: "", city: "",
  hometown: "", height: "", education: "", job: "", school: "",
  photos: [], mainIdx: 0, videoIntro: "",
  signature: "", intro: "", status: "",
  interests: [], personality: [], mbti: "", sbtiType: "", sbtiVisibility: "PUBLIC", zodiac: "",
  smoke: "", drink: "", sleep: "", diet: "", pet: "",
  intent: [], relationship: "", idealType: "",
  ageRange: [20, 30], distance: "同城",
  icebreaker: "", phone: "",
  verifyReal: false, verifyStudent: false,
};

function Onboarding() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Profile>(initial);
  const navigate = useNavigate();
  const saveProfileFn = useServerFn(saveProfile);

  // 校验登录态：未登录跳到 /auth 注册模式
  useEffect(() => {
    const demoMode = typeof window !== "undefined" && localStorage.getItem("pulse_demo_mode") === "true";
    if (demoMode) {
      setAuthed(true);
      setData((d) => ({
        ...d,
        nickname: d.nickname || "演示用户",
        phone: d.phone || "13800000000",
      }));
      return;
    }

    supabase.auth.getSession().then(({ data: s }) => {
      if (!s.session) {
        navigate({ to: "/auth", search: { mode: "signup", redirect: "/onboarding" } });
      } else {
        setAuthed(true);
        const meta = s.session.user.user_metadata as { nickname?: string } | null;
        const fallback = s.session.user.email?.split("@")[0] ?? "";
        setData((d) => ({
          ...d,
          nickname: d.nickname || meta?.nickname || fallback,
          phone: d.phone || s.session.user.phone || "",
        }));
      }
    });
  }, [navigate]);

  const update = (patch: Partial<Profile>) => setData((d) => ({ ...d, ...patch }));

  const validators: Array<() => string | null> = [
    () => {
      if (!data.gender) return "请选择性别";
      if (!data.city.trim()) return "请填写所在城市";
      return null;
    },
  ];

  const [error, setError] = useState<string | null>(null);
  const next = async () => {
    const err = validators[step]();
    if (err) { setError(err); return; }
    setError(null);
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setSubmitting(true);
      try {
        try {
          await saveProfileFn({ data: data as unknown as Record<string, unknown> });
        } catch {}
        try {
          localStorage.setItem("pulse_profile", JSON.stringify(data));
          localStorage.setItem("pulse_my_sbti", data.sbtiType || "");
          localStorage.setItem("pulse_profile_completed", "true");
          localStorage.setItem("pulse_first_login_done", "true");
        } catch {}
        toast.success("资料已保存，开始遇见");
        navigate({ to: "/community" });
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "保存失败，请重试");
      } finally {
        setSubmitting(false);
      }
    }
  };
  const prev = () => { setError(null); setStep(Math.max(0, step - 1)); };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        正在校验登录状态…
      </div>
    );
  }

  return (
    <div className="mobile-page bg-background text-foreground relative overflow-hidden">
      <div className="absolute -top-32 -left-20 size-[420px] rounded-full bg-coral/20 blur-[140px]" />
      <div className="absolute top-40 -right-20 size-[380px] rounded-full bg-mint/15 blur-[140px]" />

      <header className="relative z-10 mx-auto w-full max-w-[430px] px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3">
        <div className="flex items-center justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="size-4" /> 返回
          </Link>
        </div>
        <div className="mt-5">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            {STEPS[step].title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[430px] px-4 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            {step === 0 && <StepBasic data={data} update={update} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-end gap-3">
          <div className="flex-1 text-center">
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
          <button
            onClick={next}
            className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold glow-coral hover:scale-[1.02] active:scale-[0.98] transition"
          >
            {step === STEPS.length - 1 ? "完成并进入" : "下一步"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Shared atoms ---------- */

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-coral">*</span>}
          {!required && <span className="ml-1 text-[10px] text-muted-foreground">可选</span>}
        </label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-11 rounded-xl bg-background border-2 border-border px-4 text-sm text-foreground outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition placeholder:text-muted-foreground/60 shadow-inner"
    />
  );
}

function Chip({ active, onClick, children, locked }: { active: boolean; onClick: () => void; children: React.ReactNode; locked?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked && !active}
      className={[
        "inline-flex items-center gap-1 h-9 px-4 rounded-full border text-sm transition",
        active
          ? "bg-coral text-primary-foreground border-coral glow-coral"
          : "bg-surface/60 border-border text-foreground hover:border-coral/60",
        locked && !active ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {active && <Check className="size-3.5" />} {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.75rem] border border-border/70 bg-white/70 p-5 shadow-[0_18px_60px_rgba(56,189,248,0.08)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Step 1: Basic ---------- */

function StepBasic({ data, update }: { data: Profile; update: (p: Partial<Profile>) => void }) {
  return (
    <Card className="space-y-6">
      <Field label="昵称" required>
        <TextInput
          maxLength={16}
          placeholder="给自己起个有记忆点的名字"
          value={data.nickname}
          onChange={(e) => update({ nickname: e.target.value })}
          className="h-12 rounded-2xl border border-border/70 bg-slate-50/90 px-4 text-[15px] shadow-sm placeholder:text-slate-400 focus:border-coral/50 focus:bg-white"
        />
      </Field>

      <Field label="所在城市" required>
        <TextInput
          placeholder="如：上海"
          value={data.city}
          onChange={(e) => update({ city: e.target.value })}
          className="h-12 rounded-2xl border border-border/70 bg-slate-50/90 px-4 text-[15px] shadow-sm placeholder:text-slate-400 focus:border-coral/50 focus:bg-white"
        />
      </Field>

      <Field label="性别" required>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "女生", label: "♀ 女生" },
            { id: "男生", label: "♂ 男生" },
            { id: "其他", label: "⚧ 其他" },
          ].map((g) => (
            <Chip key={g.id} active={data.gender === g.id} onClick={() => update({ gender: g.id })}>{g.label}</Chip>
          ))}
        </div>
      </Field>
    </Card>
  );
}

/* ---------- Step 2: Photos ---------- */


/* ---------- Step 3: Bio ---------- */

function StepBio({ data, update }: { data: Profile; update: (p: Partial<Profile>) => void }) {
  return (
    <Card className="space-y-5">

      <Field label="当前状态">
        <div className="flex flex-wrap gap-2">
          {["在家躺平","加班中","刚下班","想找人吃饭","旅行ing","周末发呆","出差中"].map((s) => (
            <Chip key={s} active={data.status === s} onClick={() => update({ status: data.status === s ? "" : s })}>{s}</Chip>
          ))}
        </div>
      </Field>
    </Card>
  );
}

/* ---------- Step 4: Tags ---------- */

function StepTags({ data, update }: { data: Profile; update: (p: Partial<Profile>) => void }) {
  const toggle = (key: "interests" | "personality", tag: string, max: number) => {
    const arr = data[key];
    if (arr.includes(tag)) update({ [key]: arr.filter((t) => t !== tag) } as any);
    else if (arr.length < max) update({ [key]: [...arr, tag] } as any);
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-lg font-semibold">兴趣爱好</h3>
            <p className="text-xs text-muted-foreground mt-0.5">最多选 15 个，用于匹配同频的人</p>
          </div>
          <span className={`text-sm font-semibold ${data.interests.length >= 15 ? "text-coral" : "text-muted-foreground"}`}>
            {data.interests.length}/15
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTEREST_TAGS.map((t) => (
            <Chip
              key={t}
              active={data.interests.includes(t)}
              locked={data.interests.length >= 15}
              onClick={() => toggle("interests", t, 15)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-lg font-semibold">性格标签</h3>
            <p className="text-xs text-muted-foreground mt-0.5">最多选 8 个，描述真实的你</p>
          </div>
          <span className={`text-sm font-semibold ${data.personality.length >= 8 ? "text-coral" : "text-muted-foreground"}`}>
            {data.personality.length}/8
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TAGS.map((t) => (
            <Chip
              key={t}
              active={data.personality.includes(t)}
              locked={data.personality.length >= 8}
              onClick={() => toggle("personality", t, 8)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </Card>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="MBTI">
          <div className="flex flex-wrap gap-1.5">
            {MBTI.map((m) => (
              <button
                key={m}
                onClick={() => update({ mbti: data.mbti === m ? "" : m })}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${
                  data.mbti === m ? "bg-mint text-background" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>
        <Field label="SBTI（可选）" hint="用于提升匹配准确度，可跳过">
          <div className="flex flex-wrap gap-1.5">
            {SBTI.map((m) => (
              <button
                key={m}
                onClick={() => update({ sbtiType: data.sbtiType === m ? "" : m })}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${
                  data.sbtiType === m ? "bg-coral text-background" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Chip active={data.sbtiVisibility === "PUBLIC"} onClick={() => update({ sbtiVisibility: "PUBLIC" })}>公开</Chip>
            <Chip active={data.sbtiVisibility === "PRIVATE"} onClick={() => update({ sbtiVisibility: "PRIVATE" })}>仅自己可见</Chip>
          </div>
        </Field>
        <Field label="星座">
          <div className="flex flex-wrap gap-1.5">
            {ZODIAC.map((z) => (
              <button
                key={z}
                onClick={() => update({ zodiac: data.zodiac === z ? "" : z })}
                className={`h-8 px-2.5 rounded-lg text-xs transition ${
                  data.zodiac === z ? "bg-sun text-background font-semibold" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </Field>
      </Card>
    </div>
  );
}

/* ---------- Step 5: Lifestyle ---------- */

function StepLifestyle({ data, update }: { data: Profile; update: (p: Partial<Profile>) => void }) {
  const rows: Array<{ key: keyof Profile; label: string; icon: React.ReactNode; options: string[] }> = [
    { key: "smoke", label: "抽烟", icon: <Cigarette className="size-4" />, options: ["不抽","偶尔","社交场合","抽"] },
    { key: "drink", label: "喝酒", icon: <Wine className="size-4" />, options: ["不喝","偶尔小酌","聚会喝","酒鬼一枚"] },
    { key: "sleep", label: "作息", icon: <Moon className="size-4" />, options: ["早睡早起","规律","夜猫子","昼夜颠倒"] },
    { key: "diet", label: "饮食", icon: <Utensils className="size-4" />, options: ["火锅党","健身餐","素食","什么都吃","brunch 爱好者"] },
    { key: "pet", label: "宠物", icon: <Cat className="size-4" />, options: ["猫派","狗派","都爱","没养","想养"] },
  ];

  return (
    <Card className="space-y-5">
      {rows.map((row) => (
        <div key={row.key as string}>
          <div className="flex items-center gap-2 mb-2.5 text-sm font-medium">
            <span className="size-7 rounded-lg bg-surface grid place-items-center text-coral">{row.icon}</span>
            {row.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {row.options.map((o) => (
              <Chip
                key={o}
                active={data[row.key] === o}
                onClick={() => update({ [row.key]: data[row.key] === o ? "" : o } as any)}
              >
                {o}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ---------- Step 6: Intent ---------- */

function StepIntent({ data, update }: { data: Profile; update: (p: Partial<Profile>) => void }) {
  const toggleIntent = (t: string) => {
    update({ intent: data.intent.includes(t) ? data.intent.filter(x => x !== t) : [...data.intent, t] });
  };
  return (
    <div className="space-y-5">
      <Card>
        <Field label="交友目的" required hint="可多选">
          <div className="flex flex-wrap gap-2">
            {INTENT.map((t) => (
              <Chip key={t} active={data.intent.includes(t)} onClick={() => toggleIntent(t)}>{t}</Chip>
            ))}
          </div>
        </Field>
      </Card>

      <Card className="space-y-5">
        <Field label="感情状态">
          <div className="flex flex-wrap gap-2">
            {["单身","开放交友","暧昧中","稳定关系","一言难尽"].map((s) => (
              <Chip key={s} active={data.relationship === s} onClick={() => update({ relationship: data.relationship === s ? "" : s })}>{s}</Chip>
            ))}
          </div>
        </Field>

        <Field label="理想型" hint={`${data.idealType.length}/200`}>
          <textarea
            maxLength={200}
            rows={3}
            placeholder="希望 TA 是什么样的人？"
            value={data.idealType}
            onChange={(e) => update({ idealType: e.target.value })}
            className="w-full rounded-xl bg-surface/70 border border-border px-4 py-3 text-sm outline-none focus:border-coral/60 transition placeholder:text-muted-foreground resize-none"
          />
        </Field>

        <Field label="年龄偏好" hint={`${data.ageRange[0]} – ${data.ageRange[1]} 岁`}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">最小</span>
              <input
                type="range" min={18} max={60} value={data.ageRange[0]}
                onChange={(e) => update({ ageRange: [Number(e.target.value), Math.max(Number(e.target.value), data.ageRange[1])] })}
                className="w-full accent-coral"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">最大</span>
              <input
                type="range" min={18} max={60} value={data.ageRange[1]}
                onChange={(e) => update({ ageRange: [Math.min(data.ageRange[0], Number(e.target.value)), Number(e.target.value)] })}
                className="w-full accent-coral"
              />
            </div>
          </div>
        </Field>

        <Field label="距离偏好">
          <div className="flex flex-wrap gap-2">
            {["3km 内","同城","本省","全国"].map((d) => (
              <Chip key={d} active={data.distance === d} onClick={() => update({ distance: d })}>
                <MapPin className="size-3.5" /> {d}
              </Chip>
            ))}
          </div>
        </Field>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="size-4 text-sun" /> 破冰问题（可选）
        </div>
        <p className="text-xs text-muted-foreground">设置一个问题让对方回答，降低搭讪门槛</p>
        <TextInput
          placeholder="例如：周末最想去哪里发呆？"
          value={data.icebreaker}
          onChange={(e) => update({ icebreaker: e.target.value })}
        />
      </Card>
    </div>
  );
}

/* ---------- Step 7: Verify ---------- */

function StepVerify({ data, update }: { data: Profile; update: (p: Partial<Profile>) => void }) {
  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Phone className="size-4 text-coral" /> 手机认证
          <span className="ml-auto text-[10px] text-coral">必填</span>
        </div>
        <div className="flex gap-2">
          <TextInput
            placeholder="手机号"
            inputMode="numeric"
            maxLength={11}
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value.replace(/\D/g, "") })}
          />
          <button className="shrink-0 h-11 px-4 rounded-xl border border-border bg-surface text-sm hover:bg-surface-2 transition">
            获取验证码
          </button>
        </div>
        <TextInput placeholder="6 位短信验证码" inputMode="numeric" maxLength={6} />
      </Card>

      <button
        onClick={() => update({ verifyReal: !data.verifyReal })}
        className={`w-full text-left rounded-2xl border p-5 transition ${
          data.verifyReal ? "border-mint bg-mint/10" : "border-border bg-surface/50 hover:bg-surface"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`size-10 rounded-xl grid place-items-center ${data.verifyReal ? "bg-mint text-background" : "bg-surface-2 text-mint"}`}>
            <BadgeCheck className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">真人认证</span>
              <span className="text-[10px] text-muted-foreground">建议</span>
              {data.verifyReal && <Check className="size-4 text-mint ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">面部识别确认是真人，匹配率提升 3 倍，防机器人骚扰</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => update({ verifyStudent: !data.verifyStudent })}
        className={`w-full text-left rounded-2xl border p-5 transition ${
          data.verifyStudent ? "border-sun bg-sun/10" : "border-border bg-surface/50 hover:bg-surface"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`size-10 rounded-xl grid place-items-center ${data.verifyStudent ? "bg-sun text-background" : "bg-surface-2 text-sun"}`}>
            <GraduationCap className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">学生认证</span>
              <span className="text-[10px] text-muted-foreground">可选</span>
              {data.verifyStudent && <Check className="size-4 text-sun ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">解锁校园社交圈，遇见同校或同城高校的人</p>
          </div>
        </div>
      </button>

      <Card className="bg-surface/30">
        <div className="flex items-start gap-3">
          <Shield className="size-5 text-mint mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            Pulse 启用 24h 风控体系，任何用户均可一键 <span className="text-foreground font-medium">举报 / 拉黑</span>。
            我们承诺：照片仅用于审核，绝不公开你的真实姓名与手机号。
          </div>
        </div>
      </Card>

      <Card>
        <Preview data={data} />
      </Card>
    </div>
  );
}

function Preview({ data }: { data: Profile }) {
  const cover = data.photos[data.mainIdx] || data.photos[0];
  return (
    <div className="flex items-center gap-4">
      <div className="size-16 rounded-2xl overflow-hidden bg-surface-2 grid place-items-center shrink-0">
        {cover ? <img src={cover} alt="" className="size-full object-cover" /> : <User2 className="size-6 text-muted-foreground" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold truncate">{data.nickname || "未命名"}</span>
          {data.gender && <span className="text-xs text-muted-foreground">· {data.gender}</span>}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {data.city || "未填城市"} · {data.interests.length} 兴趣 · {data.personality.length} 性格
        </p>
        <p className="text-xs text-foreground/80 truncate mt-1">{data.signature || "（个性签名待填写）"}</p>
      </div>
    </div>
  );
}
