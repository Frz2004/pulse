import { N as jsxRuntimeExports, O as Outlet } from "./server-ChSCHK5Z.js";
import { L as Link, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { u as useLocation } from "./useLocation-B9sJa9xD.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { F as Flame } from "./flame-lI1Os8Ee.js";
import { R as Radar } from "./radar-mA_nUGGd.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { V as Video } from "./video-BqXgI5MD.js";
import { T as Trees } from "./trees-f20mYION.js";
import { G as Gamepad2 } from "./gamepad-2-DKVAtx3Q.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
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
import "./users-DxsiCKVk.js";
import "./message-circle-DLgZCMdI.js";
import "./plus-Bydlo4jQ.js";
const MODULES = [{
  href: "/radar",
  title: "社交雷达",
  desc: "扫描附近，遇见同频的人",
  icon: Radar,
  grad: "from-mint/30 via-mint/10 to-transparent",
  accent: "text-mint",
  tags: ["附近", "扫描", "在线"]
}, {
  href: "/explore/voice",
  title: "语音聊天",
  desc: "10 分钟随机连线,只用声音认识彼此",
  icon: Mic,
  grad: "from-coral/30 via-coral/10 to-transparent",
  accent: "text-coral",
  tags: ["随机", "10min", "匿名"]
}, {
  href: "/explore/video",
  title: "视频聊天",
  desc: "5 分钟视频,露脸或装扮自由选",
  icon: Video,
  grad: "from-sun/30 via-sun/10 to-transparent",
  accent: "text-sun",
  tags: ["道具", "5min", "趣味"]
}, {
  href: "/explore/treehole",
  title: "匿名树洞",
  desc: "说出口的秘密,总会被人接住",
  icon: Trees,
  grad: "from-[#a78bfa]/30 via-[#a78bfa]/10 to-transparent",
  accent: "text-[#c4b5fd]",
  tags: ["匿名", "倾诉", "共鸣"]
}, {
  href: "/games",
  title: "小游戏",
  desc: "AI 看手相、真心话、心动盲盒，破冰从此不尴尬",
  icon: Gamepad2,
  grad: "from-coral/30 via-sun/10 to-transparent",
  accent: "text-coral",
  tags: ["破冰", "趣味", "互动"]
}];
function ExploreLayout() {
  const {
    pathname
  } = useLocation();
  if (pathname !== "/explore") return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-grid text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--coral)_22%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-coral to-sun text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold tracking-tight", children: "Pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " 首页"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold tracking-tight md:text-5xl", children: [
        "发现 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-hero font-serif-display italic", children: "同频" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-muted-foreground", children: "多种方式打破社恐——附近的人、随机的声音、自在出镜的视频、匿名树洞，还有一起玩的小游戏。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-4 sm:grid-cols-2", children: MODULES.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 16
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: i * 0.06
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: m.href, className: "group relative block overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur transition hover:border-foreground/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${m.grad} blur-2xl` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-12 w-12 place-items-center rounded-2xl bg-surface ${m.accent} ring-1 ring-border`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground opacity-0 transition group-hover:opacity-100", children: "进入 →" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl font-semibold tracking-tight", children: m.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: m.desc })
        ] })
      ] }) }, m.href)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "explore" })
  ] });
}
export {
  ExploreLayout as component
};
