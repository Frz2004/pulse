import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Copy,
  Download,
  ExternalLink,
  Gift,
  Loader2,
  Share2,
  Sparkles,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SbtiCharacter } from "@/components/sbti/SbtiCharacter";
import { SbtiPosterCard } from "@/components/sbti/SbtiPosterCard";
import { SbtiTypePicker } from "@/components/sbti/SbtiTypePicker";
import { track } from "@/lib/analytics";
import { saveSbtiSelection } from "@/lib/sbti.functions";
import {
  buildShareUrl,
  getOrCreateInviteCode,
  getSbtiProgress,
  unlockSbtiReward,
} from "@/lib/sbti/client-storage";
import { downloadBlob, renderSbtiPosterBlob } from "@/lib/sbti/poster";
import { getSbtiRewardMeta, SBTI_EXTERNAL_TEST_URL } from "@/lib/sbti/rewards";
import { supabase } from "@/integrations/supabase/client";

type Stage = "hub" | "pick-known" | "pick-after-test" | "result";

type SbtiSearch = {
  ref?: string;
  from?: string;
};

export const Route = createFileRoute("/sbti")({
  head: () => ({
    meta: [
      { title: "SBTI 人格 · Pulse" },
      { name: "description", content: "选择或测试你的 SBTI 人格，解锁限定装扮与专属铭牌。" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): SbtiSearch => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
    from: typeof s.from === "string" ? s.from : undefined,
  }),
  component: SbtiHubPage,
});

function SbtiHubPage() {
  const search = Route.useSearch();
  const [stage, setStage] = useState<Stage>("hub");
  const [picked, setPicked] = useState<string | null>(null);
  const [progress, setProgress] = useState(() => getSbtiProgress());
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState<string>("");
  const [userId, setUserId] = useState<string | undefined>();

  const saveFn = useServerFn(saveSbtiSelection);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id);
      if (data.session?.user.id) {
        setProgress(getSbtiProgress(data.session.user.id));
      }
    });
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata;
      if (meta?.nickname) setNickname(meta.nickname);
    });
  }, []);

  useEffect(() => {
    if (search.from && getSbtiRewardMeta(search.from)) {
      toast.message(`好友分享了 ${search.from} 人格，来测测你的同频类型吧`);
    }
  }, [search.from]);

  const inviteCode = progress.inviteCode || getOrCreateInviteCode(userId);
  const resultMeta = useMemo(
    () => (progress.sbtiType ? getSbtiRewardMeta(progress.sbtiType) : null),
    [progress.sbtiType],
  );

  const confirmSelection = useCallback(
    async (code: string, source: "known" | "external_test" | "internal_quiz") => {
      const meta = getSbtiRewardMeta(code);
      if (!meta) {
        toast.error("无效的人格类型");
        return;
      }
      setSaving(true);
      try {
        const { progress: next, referral } = unlockSbtiReward(code, search.ref ?? null);
        setProgress(next);
        setPicked(code);

        const { data: session } = await supabase.auth.getSession();
        if (session.session) {
          try {
            await saveFn({ data: { sbtiType: code, source } });
          } catch {
            /* profile column may be missing locally — localStorage still works */
          }
        }

        if (referral) {
          toast.success(
            `邀请奖励已到账：+${referral.inviteeBonus.points} 积分 · +${referral.inviteeBonus.xp} 经验`,
            { description: "分享者也将获得对应奖励" },
          );
        } else {
          toast.success(`已解锁 ${meta.outfit.label} 与铭牌 ${meta.nameplate}`);
        }
        track("sbti_type_confirmed", { code, source, has_ref: !!search.ref });
        setStage("result");
      } finally {
        setSaving(false);
      }
    },
    [saveFn, search.ref],
  );

  const sharePayload = useMemo(() => {
    if (!resultMeta) return "";
    const url = buildShareUrl(window.location.origin, inviteCode, resultMeta.code);
    return `我在 Pulse 测出了【${resultMeta.title}】\n关键词：${resultMeta.keywords.join(" · ")}\n邀请码：${inviteCode}\n${url}`;
  }, [resultMeta, inviteCode]);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(sharePayload);
      toast.success("分享文案已复制");
    } catch {
      toast.error("复制失败");
    }
  };

  const nativeShare = async () => {
    const url = buildShareUrl(window.location.origin, inviteCode, resultMeta?.code);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `我的 Pulse SBTI：${resultMeta?.title}`,
          text: sharePayload,
          url,
        });
        return;
      } catch {
        /* fall through */
      }
    }
    await copyShare();
  };

  const savePoster = async () => {
    if (!resultMeta) return;
    try {
      const blob = await renderSbtiPosterBlob(resultMeta, inviteCode, nickname || undefined);
      downloadBlob(blob, `pulse-sbti-${resultMeta.code}.png`);
      toast.success("海报已保存");
      track("sbti_poster_saved", { code: resultMeta.code });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };

  const openExternalTest = () => {
    track("sbti_external_test_open");
    window.open(SBTI_EXTERNAL_TEST_URL, "_blank", "noopener,noreferrer");
    setStage("pick-after-test");
  };

  return (
    <div className="mobile-page bg-background text-foreground overflow-x-hidden pb-6">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute top-10 -left-20 size-[420px] rounded-full bg-mint/25 blur-[120px]" />
      <div className="absolute top-32 -right-24 size-[360px] rounded-full bg-coral/20 blur-[100px]" />

      <header className="relative sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-between px-4">
          {stage === "hub" ? (
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              小游戏
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (stage === "result") setStage("hub");
                else setStage("hub");
              }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              上一步
            </button>
          )}
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-mint" />
            <span className="font-display font-bold text-sm">SBTI 人格</span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[430px] px-4 pt-6 pb-6">
        {search.ref && stage === "hub" && (
          <div className="mb-4 rounded-2xl border border-sun/30 bg-sun/10 px-4 py-3 text-sm">
            <p className="flex items-center gap-2 font-medium text-sun">
              <Gift className="size-4" /> 好友邀请你测试 SBTI
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              完成选择后，双方各得积分与经验奖励
            </p>
          </div>
        )}

        {search.from && getSbtiRewardMeta(search.from) && stage === "hub" && !resultMeta && (
          <div className="mb-4 rounded-2xl border border-mint/30 bg-mint/10 p-4">
            <p className="text-sm font-medium">检测到测试结果：{search.from}</p>
            <p className="mt-1 text-xs text-muted-foreground">一键领取对应限定装扮与铭牌</p>
            <button
              type="button"
              disabled={saving}
              onClick={() => confirmSelection(search.from!, "internal_quiz")}
              className="mt-3 w-full rounded-xl bg-mint py-2.5 text-sm font-semibold text-background disabled:opacity-50"
            >
              {saving ? "领取中…" : `确认 ${search.from} 并解锁奖励`}
            </button>
          </div>
        )}

        {/* ── 入口：两种路径 ── */}
        {stage === "hub" && (
          <section className="space-y-5">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs text-mint mb-4">
                <Sparkles className="size-3.5" />
                解锁限定装扮 · 专属铭牌
              </span>
              <h1 className="font-display text-3xl font-bold leading-tight">发现你的同频人格</h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                选定 SBTI 人格后，可获得对应限定服装装饰个人主页小人，以及专属铭牌彰显身份。
              </p>
            </div>

            {resultMeta && (
              <button
                type="button"
                onClick={() => setStage("result")}
                className="w-full rounded-3xl border border-mint/30 bg-mint/5 p-4 text-left ios-card tap-scale"
              >
                <p className="text-xs text-mint font-medium">当前人格</p>
                <div className="mt-3 flex items-center gap-4">
                  <SbtiCharacter code={resultMeta.code} size="sm" />
                  <div>
                    <p className="font-display text-lg font-bold">{resultMeta.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">点击查看海报与分享</p>
                  </div>
                </div>
              </button>
            )}

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setStage("pick-known")}
                className="group rounded-3xl border border-border bg-surface/60 p-5 text-left ios-card hover:border-mint/40 transition tap-scale"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-mint to-brand text-background shadow-lg">
                    <UserCheck className="size-6" />
                  </span>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold">我已了解自己的人格类型</h2>
                    <p className="mt-1 text-sm text-muted-foreground">从 26 种人格中直接选择你的类型</p>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-mint transition mt-1" />
                </div>
              </button>

              <button
                type="button"
                onClick={openExternalTest}
                className="group rounded-3xl border border-border bg-surface/60 p-5 text-left ios-card hover:border-coral/40 transition tap-scale"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-coral to-sun text-background shadow-lg">
                    <HelpCircle className="size-6" />
                  </span>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold">我还不清楚自己的人格类型</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      前往 SBTI 官网在线测试，完成后回来选择结果
                    </p>
                  </div>
                  <ExternalLink className="size-5 text-muted-foreground group-hover:text-coral transition mt-1" />
                </div>
              </button>
            </div>

            <div className="rounded-2xl border border-dashed border-border/80 bg-surface/30 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                也可在 Pulse 内做完整问卷 ·{" "}
                <Link to="/games/sbti" className="text-mint font-medium hover:underline">
                  开始内置测试
                </Link>
              </p>
            </div>

            {(progress.points > 0 || progress.xp > 0) && (
              <div className="flex gap-3 text-center text-xs">
                <div className="flex-1 rounded-2xl border border-border bg-surface/50 py-3">
                  <p className="text-muted-foreground">积分</p>
                  <p className="font-display text-lg font-bold text-coral">{progress.points}</p>
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-surface/50 py-3">
                  <p className="text-muted-foreground">经验</p>
                  <p className="font-display text-lg font-bold text-mint">{progress.xp}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── 已知类型：直接选择 ── */}
        {stage === "pick-known" && (
          <section className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold">选择你的人格</h2>
              <p className="mt-2 text-sm text-muted-foreground">选定后将解锁对应限定装扮与铭牌</p>
            </div>
            <SbtiTypePicker selected={picked} onSelect={setPicked} />
            <button
              type="button"
              disabled={!picked || saving}
              onClick={() => picked && confirmSelection(picked, "known")}
              className="w-full rounded-2xl bg-mint py-4 font-semibold text-background disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
              确认并解锁装扮
            </button>
          </section>
        )}

        {/* ── 外部测试后：回来选择 ── */}
        {stage === "pick-after-test" && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-coral/25 bg-coral/5 p-4 text-sm">
              <p className="font-medium text-coral">测试完成了吗？</p>
              <p className="mt-1 text-muted-foreground">
                若已在{" "}
                <a
                  href={SBTI_EXTERNAL_TEST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral underline"
                >
                  sbti-test.org
                </a>{" "}
                完成测试，请在下方选择你的结果人格。
              </p>
              <button
                type="button"
                onClick={openExternalTest}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-coral"
              >
                <ExternalLink className="size-3.5" /> 还没测？打开测试页
              </button>
            </div>
            <SbtiTypePicker selected={picked} onSelect={setPicked} />
            <button
              type="button"
              disabled={!picked || saving}
              onClick={() => picked && confirmSelection(picked, "external_test")}
              className="w-full rounded-2xl bg-gradient-to-r from-coral to-sun py-4 font-semibold text-background disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
              领取人格奖励
            </button>
          </section>
        )}

        {/* ── 结果：装扮 + 海报 + 分享 ── */}
        {stage === "result" && resultMeta && (
          <section className="space-y-6">
            <div className="text-center">
              <SbtiCharacter code={resultMeta.code} size="lg" className="mx-auto" />
              <h2 className="mt-4 font-display text-3xl font-bold text-mint">{resultMeta.code}</h2>
              <p className="text-xl font-semibold">{resultMeta.cn}</p>
              <p className="mt-2 text-sm text-muted-foreground">{resultMeta.intro}</p>
            </div>

            <div className="rounded-3xl border border-border bg-surface/60 p-5 ios-card space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">已获得奖励</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-mint/15 text-base">{resultMeta.outfit.accessory}</span>
                    <span>
                      限定服装 · <strong>{resultMeta.outfit.label}</strong>（已装饰个人主页小人）
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-sun/15 text-mint font-bold text-xs">ID</span>
                    <span>
                      专属铭牌 · <strong className="text-sun">{resultMeta.nameplate}</strong>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resultMeta.keywords.map((k) => (
                  <span key={k} className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px]">
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">人格海报</p>
              <SbtiPosterCard meta={resultMeta} inviteCode={inviteCode} nickname={nickname || undefined} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={savePoster}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-medium tap-scale"
              >
                <Download className="size-4" />
                保存海报
              </button>
              <button
                type="button"
                onClick={nativeShare}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint py-3.5 text-sm font-semibold text-background tap-scale"
              >
                <Share2 className="size-4" />
                分享给好友
              </button>
            </div>

            <button
              type="button"
              onClick={copyShare}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm text-muted-foreground"
            >
              <Copy className="size-4" />
              复制分享文案（含邀请码）
            </button>

            <div className="rounded-2xl border border-mint/20 bg-mint/5 p-4 text-xs text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-1">邀请奖励说明</p>
              好友通过你的分享链接完成 SBTI 选择后，双方各获得积分与经验；好友还可解锁各自人格的限定装扮。
            </div>

            <Link
              to="/me"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-coral/15 to-sun/15 border border-coral/25 py-3.5 text-sm font-medium text-coral"
            >
              去个人主页查看小人装扮
              <ArrowRight className="size-4" />
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
