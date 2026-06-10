import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Compass, Gamepad2, Mic2, Sparkles, MessageCircleMore } from "lucide-react";
import { FeatureHubCard, MobileFeatureShell } from "@/components/explore/MobileFeatureShell";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "发现 · Pulse" },
      { name: "description", content: "小游戏、掌纹人格测试，用趣味方式认识更同频的自己。" },
    ],
  }),
  component: ExploreHubPage,
});

function ExploreHubPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/explore") {
    return <Outlet />;
  }

  return (
    <MobileFeatureShell
      title="发现"
      subtitle="玩出同频人格"
      icon={Compass}
      showBottomNav
      bottomNavActive="explore"
      footerPad
    >
      <section className="space-y-6 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-xs text-coral mb-4">
            <Sparkles className="size-3.5" />
            趣味探索 · 解锁人格
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight">发现更多面的你</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            通过小游戏或掌纹测试，找到你的 SBTI 同频人格，解锁限定装扮与专属铭牌。
          </p>
        </div>

        <div className="grid gap-4">
          <FeatureHubCard
            to="/games"
            title="小游戏"
            description="SBTI 人格选择、内置问卷挑战与同频排行榜，测完可领取限定装扮与分享海报。"
            icon={Gamepad2}
            gradient="from-coral via-sun to-coral"
            badge="热门"
            tags={["SBTI 26 人格", "限定装扮", "分享海报"]}
          />

          <FeatureHubCard
            to="/explore/voice"
            title="语音大厅"
            description="选择匹配性别，进入在线语音队列，与同样在线的人随机连麦，最长 10 分钟。"
            icon={Mic2}
            gradient="from-mint via-brand to-mint"
            badge="新"
            tags={["在线匹配", "10 分钟", "继续聊天"]}
          />

          <FeatureHubCard
            to="/explore/treehole"
            title="匿名树洞"
            description="匿名发布文字、图片和话题，匿名评论、点赞和聊聊，尽情释放情绪。"
            icon={MessageCircleMore}
            gradient="from-sun via-coral to-mint"
            badge="热"
            tags={["匿名发帖", "匿名评论", "匿名聊聊"]}
          />

        </div>

        <p className="text-center text-[11px] text-muted-foreground px-4">
          所有测试结果仅供娱乐与社交破冰，不构成专业心理或命理建议。
        </p>
      </section>
    </MobileFeatureShell>
  );
}
