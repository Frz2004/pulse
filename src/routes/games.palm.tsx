import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { Camera, Hand, ImagePlus, LockKeyhole, RefreshCw, ScanLine, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MobileFeatureShell } from "@/components/explore/MobileFeatureShell";
import { analyzePalmImage, type PalmReadingResult } from "@/lib/palm/analyzer";
import { savePalmReading } from "@/lib/palm.functions";
import { supabase } from "@/integrations/supabase/client";

type Stage = "intro" | "preview" | "scanning" | "shareGate" | "result";

type FunMetric = {
  key: "love" | "slack" | "crazy" | "luck";
  label: string;
  value: number;
  color: string;
  roast: string;
};

export const Route = createFileRoute("/games/palm")({
  head: () => ({
    meta: [{ title: "掌纹人格测试 · Pulse" }],
  }),
  component: PalmTestPage,
});

function clampScore(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function buildFunMetrics(result: PalmReadingResult): FunMetric[] {
  const { life, heart, head, fate } = result.lines;
  return [
    {
      key: "love",
      label: "恋爱脑指数",
      value: clampScore(heart * 0.72 + fate * 0.18 + 9),
      color: "from-coral to-[#ff8ab3]",
      roast: heart > 76 ? "嘴上说随缘，手掌已经替你把情侣头像排期了。" : "心动雷达有点慢热，但一响就是连续剧级别。",
    },
    {
      key: "slack",
      label: "摸鱼指数",
      value: clampScore((100 - head) * 0.44 + life * 0.36 + 18),
      color: "from-mint to-brand",
      roast: life > 74 ? "能量很足，主要用来研究怎么优雅地不被发现摸鱼。" : "摸鱼讲究细水长流，你属于低调潜水型选手。",
    },
    {
      key: "crazy",
      label: "发疯指数",
      value: clampScore(Math.abs(heart - head) * 0.62 + fate * 0.32 + 22),
      color: "from-[#8b5cf6] to-coral",
      roast: Math.abs(heart - head) > 28 ? "理智和情绪轮流上麦，朋友圈文案随时可能爆改人生宣言。" : "精神状态总体稳定，偶尔阴暗爬行但会自己收拾现场。",
    },
    {
      key: "luck",
      label: "好运指数",
      value: clampScore(fate * 0.55 + life * 0.28 + 14),
      color: "from-sun to-coral",
      roast: fate > 72 ? "锦鲤体质轻微外溢，建议今天顺手抽个奖。" : "好运正在加载，先转发给好友蹭一口玄学缓存。",
    },
  ];
}

function buildAiRoast(result: PalmReadingResult, metrics: FunMetric[]) {
  const top = [...metrics].sort((a, b) => b.value - a.value)[0];
  const low = [...metrics].sort((a, b) => a.value - b.value)[0];

  return `AI 掐指一算：你是「${result.archetype.name}」隐藏款人格，${top.label}高到快从掌心溢出来；${low.label}虽然暂时低调，但只是在等一个合适的发作时机。总体来看，你适合一边嘴硬说不信玄学，一边把结果截图发给朋友求鉴定。`;
}

function PalmTestPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PalmReadingResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveFn = useServerFn(savePalmReading);

  const onPickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStage("preview");
    setResult(null);
  };

  const runScan = useCallback(async () => {
    if (!file) return;
    setStage("scanning");
    setScanProgress(0);
    const timer = window.setInterval(() => {
      setScanProgress((p) => Math.min(p + 8, 92));
    }, 120);
    try {
      await new Promise((r) => setTimeout(r, 1400));
      const reading = await analyzePalmImage(file);
      setScanProgress(100);
      setResult(reading);
      setStage("shareGate");

      const { data: session } = await supabase.auth.getSession();
      if (session.session) {
        try {
          await saveFn({
            data: {
              result: reading as unknown as Record<string, unknown>,
              imageUrl: null,
            },
          });
        } catch {
          /* table may be unavailable locally */
        }
      }

      try {
        localStorage.setItem("pulse_palm_last", JSON.stringify(reading));
      } catch {}
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "分析失败");
      setStage("preview");
    } finally {
      window.clearInterval(timer);
    }
  }, [file, saveFn]);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResult(null);
    setStage("intro");
    setScanProgress(0);
  };

  const unlockResult = async () => {
    const shareText = "我刚测出掌纹人格隐藏指数，快来挑战看看你是哪种玄学人设！";
    try {
      if (navigator.share) {
        await navigator.share({ title: "掌纹人格测试", text: shareText, url: window.location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        toast.success("邀请文案已复制，发给微信好友或朋友圈后即可查看结果");
      } else {
        toast.info("请转发给微信好友或朋友圈，邀请好友挑战后查看结果");
      }
    } catch {
      toast.info("分享取消，也可以手动转发给微信好友或朋友圈");
    }
    setStage("result");
  };

  const metrics = result ? buildFunMetrics(result) : [];
  const aiRoast = result ? buildAiRoast(result, metrics) : "";

  const shellBack = stage === "intro"
    ? { backTo: "/explore" as const, backLabel: "发现" }
    : stage === "scanning"
      ? {}
      : { onBack: reset, backLabel: "上一步" };

  return (
    <MobileFeatureShell title="掌纹测试" subtitle="玄学人格挑战" icon={Hand} {...shellBack}>
      {stage === "intro" && (
        <section className="space-y-6 pb-8">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs text-mint">
              <Sparkles className="size-3.5" />
              玄学调侃 · SBTI 风人格
            </span>
            <h1 className="font-display text-3xl font-bold">掌纹人格测试</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              上传手掌照片，生成恋爱脑、摸鱼、发疯、好运四项指数，再由 AI 给你一段不太正经但很会扎心的总结。
            </p>
          </div>

          <div className="relative mx-auto aspect-[4/3] max-w-xs overflow-hidden rounded-[28px] border border-border bg-surface/60 ios-card">
            <div className="absolute inset-0 bg-gradient-to-br from-mint/10 via-brand/5 to-coral/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-mint/30 to-brand/20 text-5xl">🖐️</span>
              <p className="text-sm text-muted-foreground">掌心朝上 · 光线充足 · 结果纯属娱乐</p>
            </div>
            <div className="absolute inset-x-6 top-1/2 h-px bg-mint/30" />
            <div className="absolute inset-y-8 left-1/2 w-px bg-coral/25" />
          </div>

          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0] ?? null)} />

          <div className="grid gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mint to-brand py-4 font-semibold text-background tap-scale">
              <Camera className="size-5" />
              拍照 / 上传手掌照片
            </button>
            <button
              type="button"
              onClick={() => {
                inputRef.current?.removeAttribute("capture");
                inputRef.current?.click();
                inputRef.current?.setAttribute("capture", "environment");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm text-muted-foreground"
            >
              <ImagePlus className="size-4" />
              从相册选择
            </button>
          </div>
        </section>
      )}

      {stage === "preview" && preview && (
        <section className="space-y-5 pb-8">
          <h2 className="font-display text-xl font-bold">确认手掌照片</h2>
          <div className="overflow-hidden rounded-[24px] border border-border bg-black/5">
            <img src={preview} alt="掌纹预览" className="max-h-80 w-full object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={reset} className="rounded-2xl border border-border py-3.5 text-sm">重选</button>
            <button type="button" onClick={runScan} className="flex items-center justify-center gap-2 rounded-2xl bg-mint py-3.5 text-sm font-semibold text-background">
              <ScanLine className="size-4" />
              开始测手相
            </button>
          </div>
        </section>
      )}

      {stage === "scanning" && (
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative size-40">
            <div className="absolute inset-0 rounded-full border-4 border-mint/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-mint border-t-transparent" style={{ animationDuration: "1.2s" }} />
            <Hand className="absolute inset-0 m-auto size-16 text-mint" />
          </div>
          <p className="mt-8 font-display text-lg font-semibold">AI 正在玄学读掌…</p>
          <p className="mt-2 text-sm text-muted-foreground">恋爱脑 · 摸鱼 · 发疯 · 好运 四维生成中</p>
          <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-mint transition-all duration-300" style={{ width: `${scanProgress}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{scanProgress}%</p>
        </section>
      )}

      {stage === "shareGate" && result && (
        <section className="space-y-5 pb-8 text-center">
          <div className="rounded-[32px] border border-coral/25 bg-coral/5 p-6 ios-card">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-coral/15 text-coral">
              <LockKeyhole className="size-8" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold">结果已生成，差一步解锁</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              转发给微信好友或朋友圈，点击「邀请好友挑战」即可查看你的四维掌纹人格报告。
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2 text-xs">
              {metrics.map((item) => (
                <div key={item.key} className="rounded-2xl border border-border bg-background/50 py-3">
                  <p className="text-muted-foreground">{item.label.replace("指数", "")}</p>
                  <p className="mt-1 font-display text-lg font-bold blur-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={unlockResult} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-coral to-sun py-4 font-semibold text-background tap-scale">
            <Share2 className="size-5" />
            邀请好友挑战
          </button>
          <p className="text-[11px] text-muted-foreground">提示：当前为娱乐裂变流程，分享后自动展示结果。</p>
        </section>
      )}

      {stage === "result" && result && (
        <section className="space-y-5 pb-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sun/25 bg-sun/15 px-3 py-1 text-xs font-medium text-sun">
              <Sparkles className="size-3.5" />
              掌纹人格：{result.archetype.name}
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold">你的玄学四维报告</h2>
            <p className="mt-2 px-2 text-sm text-muted-foreground">{result.archetype.desc}</p>
          </div>

          <div className="rounded-3xl border border-border bg-surface/60 p-5 ios-card">
            <p className="mb-4 text-xs font-semibold text-muted-foreground">人格指数</p>
            <div className="space-y-4">
              {metrics.map((item) => (
                <div key={item.key}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span>{item.label}</span>
                    <span className="font-medium text-mint">{item.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-background">
                    <div className={`h-full bg-gradient-to-r ${item.color} transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{item.roast}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-mint/30 bg-mint/5 p-5">
            <p className="text-xs font-medium text-mint">AI 智能调侃总结</p>
            <p className="mt-3 text-sm leading-relaxed">{aiRoast}</p>
          </div>

          <div className="grid gap-3">
            <button type="button" onClick={unlockResult} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-coral to-sun py-3.5 text-sm font-semibold text-background tap-scale">
              <Share2 className="size-4" />
              转发给微信好友 / 朋友圈
            </button>
            <button type="button" onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm text-muted-foreground">
              <RefreshCw className="size-4" />
              重新测试
            </button>
          </div>
        </section>
      )}
    </MobileFeatureShell>
  );
}
