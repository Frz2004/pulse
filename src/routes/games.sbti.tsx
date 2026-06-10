import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Copy,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  SBTI_ATTRIBUTION,
  sbtiConfig,
  sbtiDimOrder,
  sbtiDimensions,
  sbtiQuestions,
  sbtiSpecialTypes,
  sbtiStandardTypes,
} from "@/lib/sbti/data";
import { scoreSbti } from "@/lib/sbti/engine";
import { getSbtiTypeImageUrl } from "@/lib/sbti/images";
import { buildQuestionQueue, nextQueueAfterAnswer } from "@/lib/sbti/quiz-flow";
import type { SbtiQuestion, SbtiResult } from "@/lib/sbti/types";

export const Route = createFileRoute("/games/sbti")({
  head: () => ({
    meta: [{ title: "SBTI 人格测试 · Pulse" }],
  }),
  component: SbtiGamePage,
});

type Stage = "intro" | "quiz" | "result";
const LEVEL_LABEL = { L: "低", M: "中", H: "高" } as const;

function TypeImage({ code, cn, large }: { code: string; cn: string; large?: boolean }) {
  const src = getSbtiTypeImageUrl(code);
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-background/50 ${
        large ? "mx-auto max-w-sm aspect-square" : "size-10 shrink-0"
      }`}
    >
      <img
        src={src}
        alt={`${code} ${cn}`}
        className={`w-full object-cover ${large ? "h-full" : "h-full aspect-square"}`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

function SbtiGamePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [queue, setQueue] = useState<SbtiQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isDrunk, setIsDrunk] = useState(false);
  const [result, setResult] = useState<SbtiResult | null>(null);

  const drinkGate = sbtiConfig.drinkGate;

  const startQuiz = useCallback(() => {
    setQueue(buildQuestionQueue(sbtiQuestions.main, sbtiQuestions.special, drinkGate));
    setIndex(0);
    setAnswers({});
    setIsDrunk(false);
    setResult(null);
    setStage("quiz");
  }, [drinkGate]);

  const current = queue[index];
  const progress = queue.length ? Math.round((index / queue.length) * 100) : 0;

  const pickOption = (value: number) => {
    if (!current) return;
    const nextAnswers = { ...answers, [current.id]: value };
    setAnswers(nextAnswers);

    const { queue: nextQueue, isDrunk: drunkNow } = nextQueueAfterAnswer(
      queue,
      current,
      value,
      sbtiQuestions.special,
      drinkGate,
    );
    if (drunkNow) setIsDrunk(true);

    const nextIndex = index + 1;
    if (nextIndex >= nextQueue.length) {
      setResult(
        scoreSbti(
          nextAnswers,
          sbtiQuestions.main,
          sbtiDimOrder,
          sbtiStandardTypes,
          sbtiSpecialTypes,
          drunkNow || isDrunk,
          sbtiConfig.scoring.levelThresholds,
        ),
      );
      setStage("result");
      return;
    }

    setQueue(nextQueue);
    setIndex(nextIndex);
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `我在 Pulse 测出了 SBTI：${result.primary.code}（${result.primary.cn}）— 匹配度 ${result.primary.similarity}%`;
  }, [result]);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("结果已复制");
    } catch {
      toast.error("复制失败");
    }
  };

  return (
    <div className="mobile-page bg-background text-foreground overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute top-10 -left-20 size-[420px] rounded-full bg-mint/25 blur-[120px]" />

      <header className="relative sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-between px-4">
          <Link
            to={stage === "intro" ? "/games" : "/games"}
            onClick={(e) => {
              if (stage !== "intro") {
                e.preventDefault();
                if (stage === "result") setStage("intro");
                else if (stage === "quiz") { setStage("intro"); setIndex(0); setAnswers({}); }
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {stage === "intro" ? "小游戏" : "上一步"}
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-mint" />
            <span className="font-display font-bold text-sm">内置问卷</span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[430px] px-4 pt-8 pb-8">
        {stage === "intro" && (
          <section>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs text-mint mb-6">
              <Sparkles className="size-3.5" />
              提升匹配准确度
            </span>
            <h1 className="font-display text-3xl font-bold">SBTI 人格测试</h1>
            <p className="mt-3 text-muted-foreground">
              约 30 题，测完生成你的同频人格类型，用于提升推荐与破冰质量。答案只在本地计算。
            </p>
            <button
              type="button"
              onClick={startQuiz}
              className="mt-8 w-full rounded-2xl bg-mint text-background font-semibold py-4 hover:bg-mint/90"
            >
              开始测试
            </button>
            <p className="mt-6 text-xs text-muted-foreground">{SBTI_ATTRIBUTION}</p>
          </section>
        )}

        {stage === "quiz" && current && (
          <section>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>进度</span>
                <span>
                  {index + 1} / {queue.length}
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface overflow-hidden">
                <div className="h-full bg-mint transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-surface/60 p-5 md:p-8 ios-card">
              <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">{current.text}</p>
              <div className="mt-8 flex flex-col gap-3">
                {current.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => pickOption(opt.value)}
                    className="text-left rounded-2xl border border-border px-4 py-3.5 text-sm hover:border-mint/50 hover:bg-mint/5"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {stage === "result" && result && (
          <section className="space-y-6">
            <TypeImage code={result.primary.code} cn={result.primary.cn} large />

            <div className="rounded-3xl border border-border bg-surface/60 p-5 ios-card">
              {result.mode !== "normal" && (
                <p className="text-xs font-semibold text-sun mb-2">
                  {result.mode === "drunk" ? "隐藏人格已激活" : "系统强制兜底"}
                </p>
              )}
              <h2 className="font-display text-4xl font-bold text-mint">{result.primary.code}</h2>
              <p className="text-xl font-semibold mt-1">{result.primary.cn}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                匹配度 {result.primary.similarity}%
                {result.primary.exact != null ? ` · 精准 ${result.primary.exact}/15 维` : ""}
              </p>
              {result.primary.intro && (
                <p className="mt-4 text-coral font-medium">{result.primary.intro}</p>
              )}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-h-40 overflow-y-auto">
                {result.primary.desc}
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-surface/40 p-5 ios-card">
              <h3 className="text-sm font-semibold mb-4">TOP 5 接近类型</h3>
              <ul className="space-y-3">
                {result.rankings.slice(0, 5).map((t, i) => (
                  <li key={t.code} className="flex items-center gap-3 text-sm">
                    <TypeImage code={t.code} cn={t.cn} />
                    <span className="flex-1 text-muted-foreground">
                      #{i + 1} {t.code} · {t.cn}
                    </span>
                    <span>{t.similarity}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyShare}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm"
              >
                <Copy className="size-4" />
                复制结果
              </button>
              <Link
                to="/sbti"
                search={{ from: result.primary.code }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-mint text-background py-3"
              >
                <Sparkles className="size-4" />
                领取限定装扮
              </Link>
            </div>
            <Link
              to="/discover"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm text-muted-foreground"
            >
              <ArrowRight className="size-4" />
              去看匹配
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
