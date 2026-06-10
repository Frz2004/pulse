import { createFileRoute } from "@tanstack/react-router";
import { Crown, Medal, Sparkles, Trophy } from "lucide-react";
import { MobileFeatureShell } from "@/components/explore/MobileFeatureShell";
import { getSbtiProgress } from "@/lib/sbti/client-storage";
import { getSbtiRewardMeta } from "@/lib/sbti/rewards";

const MOCK_LEADERS = [
  { name: "苏雨桐", sbti: "LOVE-R", xp: 1280, points: 960 },
  { name: "陈一然", sbti: "THIN-K", xp: 1150, points: 880 },
  { name: "Luna 林", sbti: "MUM", xp: 1020, points: 740 },
  { name: "阿泽", sbti: "GOGO", xp: 980, points: 690 },
  { name: "小北", sbti: "JOKE-R", xp: 910, points: 620 },
];

export const Route = createFileRoute("/games/leaderboard")({
  head: () => ({
    meta: [{ title: "同频排行榜 · Pulse" }],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const mine = typeof window !== "undefined" ? getSbtiProgress() : { xp: 0, points: 0, sbtiType: null };
  const myMeta = mine.sbtiType ? getSbtiRewardMeta(mine.sbtiType) : null;
  const myTotal = mine.xp + mine.points;
  const rank = MOCK_LEADERS.filter((l) => l.xp + l.points > myTotal).length + 1;

  return (
    <MobileFeatureShell
      title="排行榜"
      subtitle="同频玩家"
      icon={Trophy}
      backTo="/games"
      backLabel="小游戏"
    >
      <section className="space-y-5 pb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">同频排行榜</h1>
          <p className="mt-2 text-sm text-muted-foreground">完成 SBTI 测试、分享邀请均可获得积分与经验</p>
        </div>

        <div className="rounded-3xl border border-coral/25 bg-gradient-to-br from-coral/10 via-sun/5 to-mint/10 p-5 ios-card">
          <p className="text-xs font-medium text-muted-foreground">我的排名</p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-3xl font-bold text-coral">#{rank}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {myMeta ? myMeta.nameplate : "尚未选定人格"}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>
                <span className="text-muted-foreground">经验 </span>
                <span className="font-semibold text-mint">{mine.xp}</span>
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">积分 </span>
                <span className="font-semibold text-coral">{mine.points}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface/60 overflow-hidden ios-card">
          <div className="border-b border-border px-4 py-3 flex items-center gap-2">
            <Sparkles className="size-4 text-sun" />
            <span className="text-sm font-semibold">本周同频 TOP</span>
          </div>
          <ul className="divide-y divide-border/60">
            {MOCK_LEADERS.map((row, i) => {
              const meta = getSbtiRewardMeta(row.sbti);
              const RankIcon = i === 0 ? Crown : i === 1 ? Medal : i === 2 ? Medal : Trophy;
              const tone = i === 0 ? "text-sun" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-[#cd7f32]" : "text-muted-foreground/60";
              return (
                <li key={row.name} className="flex items-center gap-3 px-4 py-3.5">
                  <RankIcon className={`size-5 shrink-0 ${tone}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{row.name}</p>
                    <p className="text-[11px] text-muted-foreground">{meta?.nameplate ?? row.sbti}</p>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <p className="font-semibold text-mint">{row.xp} XP</p>
                    <p className="text-muted-foreground">{row.points} 分</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          榜单为演示数据 · 完成测试与分享后你的真实数据会出现在「我的排名」
        </p>
      </section>
    </MobileFeatureShell>
  );
}
