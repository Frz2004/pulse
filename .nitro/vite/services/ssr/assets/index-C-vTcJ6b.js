import { N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link } from "./router-qNgQXy3C.js";
import { A as AuthButtons, a as NeonInner, n as neonButtonClass, N as NeonButton } from "./AuthButtons-B3_2j8VE.js";
import { A as ArrowRight } from "./arrow-right-BzzcpbFw.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { R as Radar } from "./radar-mA_nUGGd.js";
import { G as Gamepad2 } from "./gamepad-2-DKVAtx3Q.js";
import { Z as Zap } from "./zap-CP9rJA2P.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
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
const __iconNode = [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Earth = createLucideIcon("earth", __iconNode);
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PhonePreview, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stats, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg tracking-tight", children: "Pulse" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", className: "hover:text-foreground transition", children: "发现" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/community", className: "hover:text-foreground transition", children: "社区" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthButtons, {})
  ] }) });
}
function Logo() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-xl bg-gradient-to-br from-coral via-sun to-mint flex items-center justify-center glow-coral", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4 text-background fill-background" }) });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 -left-20 size-[420px] rounded-full blur-[120px]", style: {
      background: "color-mix(in oklab, #7F77DD 35%, transparent)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 right-0 size-[380px] rounded-full bg-mint/25 blur-[120px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-32 md:pb-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] max-w-5xl", style: {
        fontWeight: 500
      }, children: [
        "不只是认识，是真的",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display italic", style: {
          color: "#7F77DD",
          fontWeight: 500
        }, children: "相遇" }),
        "。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed font-normal", children: "游戏破冰、语音聊天、周边探索——找到那个和你同频的人" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-col sm:flex-row items-center gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/discover", className: neonButtonClass("coral"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(NeonInner, { variant: "coral", children: [
        "免费开始匹配",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 group-hover:translate-x-1 transition" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm", children: [{
        icon: Mic,
        label: "10分钟语音破冰"
      }, {
        icon: Radar,
        label: "社交雷达探索周边"
      }, {
        icon: Gamepad2,
        label: "破冰小游戏"
      }].map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 backdrop-blur px-4 py-2 text-foreground/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "size-4", style: {
          color: "#7F77DD"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.label })
      ] }, i)) })
    ] }) })
  ] });
}
function Features() {
  const items = [{
    icon: Zap,
    color: "coral",
    title: "AI 同频匹配",
    desc: "根据兴趣、生活方式与表达风格，每天为你挑选 10 个最有可能擦出火花的人。"
  }, {
    icon: MessageCircle,
    color: "mint",
    title: "聊得来才重要",
    desc: "破冰话题卡 + 即时聊天，再也不用纠结开场白。语音、表情、贴纸一应俱全。"
  }, {
    icon: Earth,
    color: "sun",
    title: "动态广场",
    desc: "分享此刻的心情，加入兴趣圈子，从一条动态认识真实的彼此。"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "features", className: "mx-auto max-w-7xl px-6 py-24 md:py-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-coral font-semibold", children: "为什么是 Pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight", children: [
        "不只是配对，",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "是 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display italic text-mint", children: "真正的连接" }),
        "。"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 grid md:grid-cols-3 gap-5", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative rounded-3xl border border-border bg-surface/60 backdrop-blur p-7 hover:bg-surface transition overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-12 -right-12 size-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition", style: {
        background: `var(--${it.color})`
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative size-12 rounded-2xl flex items-center justify-center mb-6", style: {
        background: `color-mix(in oklab, var(--${it.color}) 20%, transparent)`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "size-5", style: {
        color: `var(--${it.color})`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "relative text-xl font-bold mb-2", children: it.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative text-sm text-muted-foreground leading-relaxed", children: it.desc })
    ] }, i)) })
  ] });
}
function PhonePreview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "preview", className: "relative mx-auto max-w-7xl px-6 py-24 md:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-mint font-semibold", children: "应用预览" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight", children: [
        "一次",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-coral", children: "右滑" }),
        "，",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "可能就是一辈子。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground leading-relaxed max-w-md", children: "清晰的资料卡片，沉浸式的滑动体验。看到喜欢的人，向右滑；当对方也喜欢你，立即开启专属聊天。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-8 space-y-4", children: [{
        c: "coral",
        t: "实名认证 + 真人头像审核，告别假号"
      }, {
        c: "sun",
        t: "兴趣标签精准筛选，告别尬聊"
      }, {
        c: "mint",
        t: "本地 + 全国双模式，灵活选择"
      }].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 size-5 rounded-full flex items-center justify-center", style: {
          background: `var(--${x.c})`
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-3 text-background", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm md:text-base", children: x.t })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-coral/20 via-transparent to-mint/20 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneMockup, {})
    ] })
  ] }) });
}
function PhoneMockup() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-float", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[320px] h-[640px] rounded-[44px] bg-surface-2 border border-border p-3 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full rounded-[34px] bg-gradient-to-b from-background to-surface overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-background/80 z-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 pt-10 h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm text-foreground", children: "发现" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "今日 8/10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex-1 rounded-3xl relative overflow-hidden", style: {
          background: "linear-gradient(160deg, oklch(0.72 0.18 22), #7F77DD)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-6 right-6 size-20 rounded-full bg-sun/40 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-32 left-4 size-24 rounded-full bg-mint/30 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full flex flex-col justify-end p-4 text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-mint/90 text-background text-[10px] font-bold px-2 py-0.5", children: "在线" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-80", children: "距你 1.2km" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold", children: "林夕, 24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90 mt-1", children: "咖啡、独立电影、晚风、City Walk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-3", children: ["📷 摄影", "🎵 民谣", "☕ 咖啡"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] rounded-full bg-white/15 backdrop-blur px-2 py-1 border border-white/20", children: t }, t)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground", children: "✕" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-16 rounded-full bg-gradient-to-br from-coral to-sun flex items-center justify-center glow-coral", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-7 text-background fill-background" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-12 rounded-full bg-surface border border-border flex items-center justify-center text-mint", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-around text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-coral font-semibold", children: "发现" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "动态" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "消息" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "我的" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -left-12 top-32 hidden md:flex items-center gap-2 rounded-2xl bg-surface border border-border px-4 py-3 shadow-xl animate-float", style: {
      animationDelay: "1.5s"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-gradient-to-br from-mint to-sun" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "小野 发来消息" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "周末一起去看展吗？🎨" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -right-6 top-16 hidden md:flex items-center gap-2 rounded-full bg-coral text-primary-foreground px-4 py-2 shadow-xl glow-coral animate-float", style: {
      animationDelay: "0.8s"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4 fill-current" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: "新的心动!" })
    ] })
  ] });
}
function Stats() {
  const stats = [{
    n: "120万+",
    l: "活跃用户",
    c: "coral"
  }, {
    n: "8500万",
    l: "成功配对",
    c: "sun"
  }, {
    n: "32万",
    l: "情侣诞生",
    c: "mint"
  }, {
    n: "98%",
    l: "次日留存",
    c: "coral"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "community", className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border border-border bg-surface/60 backdrop-blur p-10 md:p-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: stats.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl md:text-5xl font-bold", style: {
      color: `var(--${s.c})`
    }, children: s.n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: s.l })
  ] }, i)) }) }) });
}
function CTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-[40px] p-12 md:p-20 text-center", style: {
    background: "linear-gradient(135deg, oklch(0.72 0.18 22), #7F77DD 60%, #1a1030)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -left-20 size-80 rounded-full bg-sun/40 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -right-20 size-80 rounded-full bg-mint/30 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-6xl font-bold text-white", children: [
        "今晚，",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display italic", children: "就开始" }),
        "。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-white/80 max-w-md mx-auto", children: "下载 Pulse，让下一个让你心跳加速的人，离你只有一次右滑的距离。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-5 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(NeonButton, { variant: "coral", children: "立即下载 iOS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NeonButton, { variant: "ghost", children: "Android 版本" })
      ] })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: "Pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "· 遇见同频的人" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground transition", children: "隐私" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground transition", children: "条款" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground transition", children: "联系" })
    ] })
  ] }) });
}
export {
  Index as component
};
