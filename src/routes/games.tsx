import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Brain, Gamepad2, Sparkles, Trophy, ClipboardList, Hand } from "lucide-react";
import { FeatureHubCard, MobileFeatureShell } from "@/components/explore/MobileFeatureShell";
import { getSbtiProgress } from "@/lib/sbti/client-storage";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [{ title: "小游戏 · Pulse" }],
  }),
  component: GamesHubPage,
});

function GamesHubPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/games") {
    return <Outlet />;
  }

  const progress = typeof window !== "undefined" ? getSbtiProgress() : null;

  return (
    <MobileFeatureShell
      title="小游戏"
      subtitle="SBTI 同频挑战"
      icon={Gamepad2}
      backTo="/explore"
      backLabel="发现"
      showBottomNav
      bottomNavActive="explore"
      footerPad
    >
      <section className="space-y-5 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">同频小游戏</h1>
        </div>

        <div className="grid gap-3">
          <FeatureHubCard
            to="/sbti"
            title="SBTI 人格"
            description="已知类型直接选，或去官网测试后回来领取 26 人格限定装扮、铭牌与分享海报。"
            icon={Brain}
            gradient="from-mint via-brand to-mint"
            badge="核心"
            tags={["26 人格", "限定服装", "邀请奖励"]}
          />

          <FeatureHubCard
            to="/games/sbti"
            title="内置问卷挑战"
            description="约 30 题完整 SBTI 问卷，本地计算结果，可一键跳转领取装扮奖励。"
            icon={ClipboardList}
            gradient="from-[#6366f1] via-mint to-brand"
            tags={["30 题", "本地计算", "精准匹配"]}
          />

          <FeatureHubCard
            to="/games/palm"
            title="掌纹人格测试"
            description="上传手掌照片，解读生命线、感情线与智慧线，匹配最同频的 SBTI 人格类型。"
            icon={Hand}
            gradient="from-mint via-brand to-mint"
            badge="新"
            tags={["掌纹解读", "AI 侧写", "同频匹配"]}
          />

          <FeatureHubCard
            to="/games/leaderboard"
            title="同频排行榜"
            description="查看积分与经验排名，看看谁是最活跃的 Pulse 同频玩家。"
            icon={Trophy}
            gradient="from-sun via-coral to-sun"
            tags={["积分", "经验", "榜单"]}
          />
        </div>

        {(progress?.points ?? 0) > 0 && (
          <div className="rounded-2xl border border-border bg-surface/40 p-4">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-sun" /> 我的游戏数据
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-background/60 py-2.5">
                <p className="text-[10px] text-muted-foreground">积分</p>
                <p className="font-display text-xl font-bold text-coral">{progress?.points ?? 0}</p>
              </div>
              <div className="rounded-xl bg-background/60 py-2.5">
                <p className="text-[10px] text-muted-foreground">经验</p>
                <p className="font-display text-xl font-bold text-mint">{progress?.xp ?? 0}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </MobileFeatureShell>
  );
}
