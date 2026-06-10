import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Mic2, Shield, Sparkles, Users, X } from "lucide-react";
import { MobileFeatureShell } from "@/components/explore/MobileFeatureShell";

type Gender = "male" | "female";
type MatchState = "idle" | "searching" | "matched" | "continue" | "ended";

type VoiceProfile = {
  name: string;
  sbti: string;
  tags: string[];
  avatar: string;
};

const CANDIDATES: Record<Gender, VoiceProfile[]> = {
  male: [
    { name: "陈予安", sbti: "INTJ · 冷静分析师", tags: ["独立音乐", "咖啡", "夜跑"], avatar: "from-brand via-mint to-coral" },
    { name: "周一川", sbti: "ENFP · 气氛制造机", tags: ["旅行", "电影", "摄影"], avatar: "from-coral via-sun to-coral" },
    { name: "林知夏", sbti: "ISFP · 温柔观察员", tags: ["插画", "猫", "爵士"], avatar: "from-mint via-brand to-mint" },
  ],
  female: [
    { name: "沈语棠", sbti: "INFJ · 治愈系", tags: ["写作", "散步", "茶"], avatar: "from-sun via-coral to-sun" },
    { name: "许以宁", sbti: "ESTP · 行动派", tags: ["运动", "探店", "Livehouse"], avatar: "from-brand via-coral to-brand" },
    { name: "苏晚晴", sbti: "ENFJ · 社交能量包", tags: ["聊天", "桌游", "美食"], avatar: "from-mint via-sun to-brand" },
  ],
};

export const Route = createFileRoute("/explore/voice")({
  head: () => ({
    meta: [{ title: "语音大厅 · Pulse" }],
  }),
  component: VoiceLobbyPage,
});

function VoiceLobbyPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState<Gender>("male");
  const [state, setState] = useState<MatchState>("idle");
  const [progress, setProgress] = useState(0);
  const [matched, setMatched] = useState<VoiceProfile | null>(null);
  const [countdown, setCountdown] = useState(600);
  const [decision, setDecision] = useState<{ me: boolean; ta: boolean }>({ me: false, ta: false });

  const candidate = useMemo(() => {
    const list = CANDIDATES[gender];
    return list[Math.floor(Math.random() * list.length)];
  }, [gender, state === "matched" ? matched?.name : null]);

  useEffect(() => {
    if (state !== "searching") return;
    const timer = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 7);
        if (next >= 100) {
          window.clearInterval(timer);
          const hit = CANDIDATES[gender][Math.floor(Math.random() * CANDIDATES[gender].length)];
          setMatched(hit);
          setState("matched");
          setCountdown(600);
        }
        return next;
      });
    }, 320);
    return () => window.clearInterval(timer);
  }, [state, gender]);

  useEffect(() => {
    if (state !== "matched") return;
    const timer = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(timer);
          setState("continue");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (state !== "continue") return;
    if (decision.me && decision.ta) {
      const t = window.setTimeout(() => navigate({ to: "/messages" }), 1200);
      return () => window.clearTimeout(t);
    }
  }, [state, decision, navigate]);

  const start = () => {
    setState("searching");
    setProgress(0);
    setMatched(null);
    setDecision({ me: false, ta: false });
    setCountdown(600);
  };

  const cancel = () => {
    setState("idle");
    setProgress(0);
    setMatched(null);
    setDecision({ me: false, ta: false });
    setCountdown(600);
  };

  return (
    <MobileFeatureShell title="语音大厅" subtitle="在线语音匹配" icon={Mic2} backTo="/explore" backLabel="发现" showBottomNav bottomNavActive="explore" footerPad>
      <section className="space-y-6 pb-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs text-mint">
            <Sparkles className="size-3.5" />
            匹配在线用户 · 最长 10 分钟
          </span>
          <h1 className="font-display text-3xl font-bold">语音大厅</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            选择你想匹配的性别，进入在线语音队列。系统只会匹配当前在线且也处于匹配状态的用户。
          </p>
        </div>

        {state === "idle" && (
          <div className="grid gap-3 rounded-3xl border border-border bg-surface/60 p-4 ios-card">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`rounded-2xl border px-4 py-4 text-left transition ${gender === "male" ? "border-brand bg-brand/10" : "border-border bg-background/50"}`}
              >
                <div className="flex items-center gap-2 font-medium"><Users className="size-4 text-brand" /> 匹配男性</div>
                <p className="mt-1 text-xs text-muted-foreground">优先展示在线男性</p>
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`rounded-2xl border px-4 py-4 text-left transition ${gender === "female" ? "border-coral bg-coral/10" : "border-border bg-background/50"}`}
              >
                <div className="flex items-center gap-2 font-medium"><Users className="size-4 text-coral" /> 匹配女性</div>
                <p className="mt-1 text-xs text-muted-foreground">优先展示在线女性</p>
              </button>
            </div>
            <button type="button" onClick={start} className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-coral to-sun px-4 py-3 font-semibold text-background tap-scale">
              开始匹配 <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {state === "searching" && (
          <div className="rounded-3xl border border-border bg-surface/60 p-5 text-center ios-card">
            <div className="relative mx-auto size-36">
              <div className="absolute inset-0 rounded-full border-4 border-mint/15" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-mint border-t-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid size-20 place-items-center rounded-full bg-background shadow-lg">
                  <Mic2 className="size-8 text-mint" />
                </div>
              </div>
            </div>
            <p className="mt-6 font-display text-xl font-bold">正在为你匹配在线用户…</p>
            <p className="mt-2 text-sm text-muted-foreground">只匹配当前在线且正在匹配的人</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-gradient-to-r from-mint to-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
            <button type="button" onClick={cancel} className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
              <X className="size-4" /> 取消匹配
            </button>
          </div>
        )}

        {state === "matched" && matched && (
          <div className="rounded-3xl border border-coral/30 bg-gradient-to-br from-coral/10 via-sun/10 to-mint/10 p-5 ios-card text-center">
            <div className="mx-auto flex items-center justify-center gap-3">
              <div className={`grid size-20 place-items-center rounded-full bg-gradient-to-br ${gender === "male" ? "from-brand via-mint to-coral" : "from-coral via-sun to-brand"} text-background shadow-lg`}>
                <Heart className="size-8 fill-current" />
              </div>
              <div className={`grid size-20 place-items-center rounded-full bg-gradient-to-br ${matched.avatar} text-background shadow-lg`}>
                <span className="font-display text-2xl">{matched.name.slice(0, 1)}</span>
              </div>
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">匹配成功</h2>
            <p className="mt-1 text-sm text-muted-foreground">昵称：{matched.name} · {matched.sbti}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {matched.tags.map((t) => (
                <span key={t} className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px]">#{t}</span>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
              本次语音最长可聊 10 分钟，双方都可以随时挂断。
            </div>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setState("continue")} className="flex-1 rounded-2xl bg-[#07c160] px-4 py-3 font-semibold text-white">
                进入通话
              </button>
              <button type="button" onClick={cancel} className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">
                挂断
              </button>
            </div>
          </div>
        )}

        {state === "continue" && (
          <div className="rounded-3xl border border-border bg-surface/60 p-5 ios-card text-center">
            <div className="mx-auto size-24 rounded-full bg-gradient-to-br from-coral via-sun to-brand p-[3px]">
              <div className="grid h-full w-full place-items-center rounded-full bg-background text-center">
                <div>
                  <p className="font-display text-lg font-bold">继续聊天确认</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">剩余通话时间 {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">“是否愿意继续与 TA 交流？”</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision((d) => ({ ...d, me: true }))}
                className={`rounded-2xl px-4 py-3 font-semibold ${decision.me ? "bg-mint text-background" : "border border-border bg-background/60"}`}
              >
                继续聊天
              </button>
              <button
                type="button"
                onClick={() => setDecision((d) => ({ ...d, ta: false, me: false }))}
                className="rounded-2xl border border-border bg-background/60 px-4 py-3 font-semibold"
              >
                结束本次交流
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">等待对方也做出选择…</p>
            <button type="button" onClick={cancel} className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
              <Shield className="size-4" /> 结束通话
            </button>
          </div>
        )}

        {state === "continue" && decision.me && !decision.ta && (
          <div className="rounded-2xl border border-border bg-surface/50 p-4 text-center text-sm text-muted-foreground">
            你已选择继续，等待对方确认…
          </div>
        )}

        {state === "continue" && decision.me && decision.ta && (
          <div className="rounded-3xl border border-mint/30 bg-mint/10 p-5 text-center ios-card">
            <p className="font-display text-xl font-bold">双方均愿意继续聊天</p>
            <p className="mt-2 text-sm text-muted-foreground">已自动建立好友关系，即将跳转消息页面…</p>
            <Link to="/messages" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#07c160] px-4 py-3 font-semibold text-white">
              前往消息 <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>
    </MobileFeatureShell>
  );
}
