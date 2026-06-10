import { N as jsxRuntimeExports, O as Outlet, X as reactExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link, A as ArrowLeft, T as Trophy } from "./router-qNgQXy3C.js";
import { u as useLocation } from "./useLocation-B9sJa9xD.js";
import { a as NeonInner, n as neonButtonClass } from "./AuthButtons-B3_2j8VE.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { B as Brain } from "./brain-okrslru0.js";
import { H as Hand } from "./hand-i4ZbhQ_u.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { Z as Zap } from "./zap-CP9rJA2P.js";
import { U as Users } from "./users-DxsiCKVk.js";
import { F as Flame } from "./flame-lI1Os8Ee.js";
import { A as ArrowRight } from "./arrow-right-BzzcpbFw.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-C8UrIk37.js";
import "./index-m6JgwYlt.js";
import "./types-DNG0tEns.js";
import "./message-circle-DLgZCMdI.js";
import "./plus-Bydlo4jQ.js";
const __iconNode$2 = [
  ["rect", { width: "12", height: "12", x: "2", y: "10", rx: "2", ry: "2", key: "6agr2n" }],
  [
    "path",
    { d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6", key: "1o487t" }
  ],
  ["path", { d: "M6 18h.01", key: "uhywen" }],
  ["path", { d: "M10 14h.01", key: "ssrbsk" }],
  ["path", { d: "M15 6h.01", key: "cblpky" }],
  ["path", { d: "M18 9h.01", key: "2061c0" }]
];
const Dices = createLucideIcon("dices", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
      key: "1n2ejm"
    }
  ],
  [
    "path",
    {
      d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
      key: "1qfcsi"
    }
  ]
];
const MessagesSquare = createLucideIcon("messages-square", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
];
const WandSparkles = createLucideIcon("wand-sparkles", __iconNode);
const GAMES = [{
  id: "sbti",
  title: "SBTI 人格测试",
  tagline: "比 MBTI 更损的 30 题破冰测试。",
  desc: "15 维度行为建模，27+ 种互联网原生人格。纯本地算分，测完可分享结果，适合和刚认识的人一起开聊。",
  players: "1 人",
  duration: "5-8 分钟",
  hotness: 94,
  color: "mint",
  icon: Brain,
  badge: "新上线",
  href: "/games/sbti"
}, {
  id: "palm",
  title: "AI 看手相",
  tagline: "拍张手掌，读懂你的爱情线。",
  desc: "上传手掌照片，AI 解读感情线、生命线与事业线。生成专属手相报告，可与心动对象交换查看缘分契合度。",
  players: "1 人 / 双人对照",
  duration: "1-2 分钟",
  hotness: 96,
  color: "coral",
  icon: Hand,
  badge: "AI 新玩法",
  href: "/games/palm"
}, {
  id: "truth",
  title: "真心话 · 心动版",
  tagline: "100 道走心问题，从浅聊到深聊。",
  desc: "覆盖日常、回忆、爱情、未来四大主题。系统会根据你们的聊天进度逐步解锁更深入的问题。",
  players: "2 人",
  duration: "5-15 分钟",
  hotness: 92,
  color: "coral",
  icon: Heart,
  badge: "最受欢迎"
}, {
  id: "blindbox",
  title: "心动盲盒",
  tagline: "随机抽取，缘分由系统决定。",
  desc: "每天 3 次机会，盲抽一位附近同频的人，限时 24 小时聊天窗口。聊得来就解锁完整资料。",
  players: "1v1",
  duration: "24 小时",
  hotness: 88,
  color: "sun",
  icon: Dices
}, {
  id: "soul",
  title: "灵魂 36 问",
  tagline: "心理学经典：让任何两个人爱上彼此。",
  desc: "源自著名社会心理学实验，由浅入深的 36 个问题，据说能在 45 分钟内让陌生人产生强烈连接。",
  players: "2 人",
  duration: "30-45 分钟",
  hotness: 95,
  color: "mint",
  icon: Sparkles,
  badge: "高浓度"
}, {
  id: "wouldyou",
  title: "你会怎么选",
  tagline: "二选一，秒懂三观契合度。",
  desc: "山或海？早 C 晚 A？50 道犀利二选一，实时比对你们的契合度。",
  players: "2 人",
  duration: "3-5 分钟",
  hotness: 78,
  color: "coral",
  icon: Zap
}, {
  id: "story",
  title: "接龙故事",
  tagline: "一人一句，写出只属于你们的剧本。",
  desc: "AI 给开头，你们轮流续写。结束时生成一张专属漫画封面，可保存收藏。",
  players: "2-4 人",
  duration: "10 分钟",
  hotness: 76,
  color: "mint",
  icon: WandSparkles
}, {
  id: "vibe",
  title: "今日情绪同步",
  tagline: "用一个 emoji 描述此刻的你。",
  desc: "每日轻量打卡，匹配情绪相近的人。失眠的、高兴的、想被抱抱的，都能找到此刻的同类。",
  players: "开放匹配",
  duration: "随时",
  hotness: 84,
  color: "sun",
  icon: MessagesSquare
}];
function GamesPage() {
  const location = useLocation();
  if (location.pathname !== "/games") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-grid text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--coral)_22%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/explore", className: "inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " 返回发现"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/games/leaderboard", className: neonButtonClass("ghost"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(NeonInner, { variant: "ghost", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-4 text-sun" }),
        "战绩榜"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl md:text-5xl font-semibold tracking-tight", children: [
        "小 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display italic text-gradient-hero", children: "游戏" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-muted-foreground", children: "精选轻量社交小游戏，让你们的第一句话就有意思。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GameGrid, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "games" })
  ] });
}
function GameGrid() {
  const [filter, setFilter] = reactExports.useState("all");
  const filters = ["all", "2人", "群聊", "新"];
  const labels = {
    all: "全部",
    "2人": "双人",
    群聊: "群聊",
    新: "新上线"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-2 mb-6 overflow-x-auto", children: filters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: `shrink-0 h-9 px-4 rounded-full text-sm border transition ${filter === f ? "bg-foreground text-background border-foreground" : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"}`, children: labels[f] }, f)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: GAMES.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(GameCard, { game: g }, g.id)) })
  ] });
}
function GameCard({
  game
}) {
  const Icon = game.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative rounded-3xl border border-border bg-surface/60 backdrop-blur p-6 hover:bg-surface transition overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-16 -right-16 size-48 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition", style: {
      background: `var(--${game.color})`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-2xl flex items-center justify-center", style: {
        background: `color-mix(in oklab, var(--${game.color}) 20%, transparent)`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5", style: {
        color: `var(--${game.color})`
      } }) }),
      game.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-1", style: {
        background: `color-mix(in oklab, var(--${game.color}) 18%, transparent)`,
        color: `var(--${game.color})`
      }, children: game.badge })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "relative text-xl font-bold mb-1", children: game.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative text-sm text-coral/90 mb-3", style: {
      color: `var(--${game.color})`
    }, children: game.tagline }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative text-sm text-muted-foreground leading-relaxed mb-5 min-h-[60px]", children: game.desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between text-xs text-muted-foreground mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3" }),
          game.players
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: game.duration })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-coral", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3" }),
        game.hotness,
        "°"
      ] })
    ] }),
    game.href ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: game.href, className: `${neonButtonClass("coral")} w-full justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(NeonInner, { variant: "coral", children: [
      "立即开玩",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5" })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: `${neonButtonClass("ghost")} w-full justify-center opacity-60 cursor-not-allowed`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(NeonInner, { variant: "ghost", children: "敬请期待" }) })
  ] });
}
export {
  GamesPage as component
};
