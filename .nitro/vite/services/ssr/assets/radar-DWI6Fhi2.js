import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { R as Radar } from "./radar-mA_nUGGd.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { F as Flame } from "./flame-lI1Os8Ee.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
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
const __iconNode$1 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
const RING_KM = [0.5, 1, 2, 5];
const MAX_KM = RING_KM[RING_KM.length - 1];
const NAMES = ["苏雨桐", "陈一然", "Luna", "周野", "夏季", "阿岚", "宥宥", "小满", "言之", "树洞", "Echo", "野草莓", "千禾", "白噪", "Momo", "南屿"];
const TAGS = ["独立音乐", "City Walk", "猫奴", "冲浪", "摄影", "陶艺", "诗歌", "Livehouse", "桌游", "咖啡", "滑板", "瑜伽"];
const STATUSES = ["正在听歌", "刚发了动态", "想找人喝一杯", "在线 · 想聊", "刚上线", "正在直播", "求推荐电影", "周末有空"];
function rand(arr, seed) {
  return arr[seed % arr.length];
}
function makeBlips(count) {
  return Array.from({
    length: count
  }).map((_, i) => {
    const r = Math.pow(Math.random(), 0.7);
    const distanceM = Math.round(r * MAX_KM * 1e3);
    const heat = r < 0.35 ? "hot" : r < 0.7 ? "warm" : "cool";
    return {
      id: Date.now() + i,
      name: rand(NAMES, Math.floor(Math.random() * 9999)),
      age: 22 + Math.floor(Math.random() * 10),
      angle: Math.random() * 360,
      radius: r,
      distanceM,
      tag: rand(TAGS, Math.floor(Math.random() * 9999)),
      heat,
      status: rand(STATUSES, Math.floor(Math.random() * 9999)),
      compat: 60 + Math.floor(Math.random() * 39)
    };
  });
}
function RadarPage() {
  const [sweep, setSweep] = reactExports.useState(0);
  const [blips, setBlips] = reactExports.useState(() => makeBlips(28));
  const [selected, setSelected] = reactExports.useState(null);
  const [revealed, setRevealed] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t) => {
      const dt = t - last;
      last = t;
      setSweep((s) => (s + dt * 0.12) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  reactExports.useEffect(() => {
    setRevealed((prev) => {
      const next = new Set(prev);
      for (const b of blips) {
        const diff = (sweep - b.angle + 360) % 360;
        if (diff < 6) next.add(b.id);
      }
      return next;
    });
  }, [sweep, blips]);
  reactExports.useEffect(() => {
    const id = window.setInterval(() => {
      setBlips((prev) => {
        const keep = prev.slice(2);
        return [...keep, ...makeBlips(2)];
      });
    }, 4500);
    return () => window.clearInterval(id);
  }, []);
  const stats = reactExports.useMemo(() => {
    const inRing = (max) => blips.filter((b) => b.distanceM <= max * 1e3).length;
    return RING_KM.map((km) => ({
      km,
      count: inRing(km)
    }));
  }, [blips]);
  const hot = blips.filter((b) => b.heat === "hot").length;
  const active = blips.filter((b) => b.heat !== "cool").length;
  const heatScore = Math.min(100, Math.round((hot * 6 + active * 2 + blips.length) * 0.9));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground bg-grid", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--mint)_22%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "返回" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-mint to-coral text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold tracking-tight", children: "社交雷达" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full border border-mint/40 bg-mint/10 px-2.5 py-1 text-[11px] text-mint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" })
        ] }),
        "LIVE"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto w-full max-w-md px-5 pb-20 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold tracking-tight", children: [
          "你周围有 ",
          blips.length,
          " 个同频灵魂"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
          " 上海 · 静安区 · 实时定位"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-full border border-mint/20 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--mint)_8%,transparent),transparent_70%)] shadow-[inset_0_0_60px_color-mix(in_oklab,var(--mint)_15%,transparent)]", children: [
        RING_KM.map((km, i) => {
          const pct = km / MAX_KM * 100;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/25", style: {
            width: `${pct}%`,
            height: `${pct}%`
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute right-1 top-1 text-[9px] text-mint/60", children: [
            km,
            "km"
          ] }) }, km);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-mint/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-mint/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 rounded-full", style: {
          transform: `rotate(${sweep}deg)`,
          background: "conic-gradient(from -4deg, color-mix(in oklab, var(--mint) 70%, transparent) 0deg, color-mix(in oklab, var(--mint) 35%, transparent) 4deg, transparent 8deg, transparent 360deg)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-coral to-sun text-background shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 fill-current" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 -z-0 animate-ping rounded-full bg-coral/40" })
        ] }) }),
        blips.map((b) => {
          const isRevealed = revealed.has(b.id);
          const x = 50 + Math.cos(b.angle * Math.PI / 180) * b.radius * 48;
          const y = 50 + Math.sin(b.angle * Math.PI / 180) * b.radius * 48;
          const color = b.heat === "hot" ? "var(--coral)" : b.heat === "warm" ? "var(--sun)" : "var(--mint)";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(b), className: "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity", style: {
            left: `${x}%`,
            top: `${y}%`,
            opacity: isRevealed ? 1 : 0
          }, "aria-label": `${b.name} ${b.distanceM}m`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block h-2.5 w-2.5 rounded-full", style: {
              background: color,
              boxShadow: `0 0 12px ${color}, 0 0 4px ${color}`
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1/2 top-1/2 -z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full", style: {
              background: color,
              opacity: 0.5
            } })
          ] }, b.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-4 gap-2", children: stats.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-surface/70 p-2.5 text-center backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          "≤ ",
          s.km,
          "km"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold text-foreground", children: s.count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
          width: `${Math.min(100, s.count / Math.max(1, blips.length) * 100)}%`,
          background: i === 0 ? "var(--coral)" : i === 1 ? "var(--sun)" : i === 2 ? "var(--mint)" : "color-mix(in oklab, var(--mint) 60%, var(--foreground))"
        } }) })
      ] }, s.km)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg bg-coral/15 text-coral", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "附近社交热度" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl font-semibold", children: [
                heatScore,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground", children: "/ 100" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-3 w-3 text-mint" }),
              "实时"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: "每 5s 刷新" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
          width: `${heatScore}%`
        }, transition: {
          duration: 0.8
        }, className: "h-full rounded-full bg-gradient-to-r from-mint via-sun to-coral" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "var(--coral)", label: "高活跃", value: hot }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "var(--sun)", label: "活跃中", value: blips.filter((b) => b.heat === "warm").length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "var(--mint)", label: "潜水", value: blips.filter((b) => b.heat === "cool").length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "最近上线" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
            "刚刚扫描到"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [...blips].sort((a, b) => a.distanceM - b.distanceM).slice(0, 5).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(b), className: "group flex w-full items-center gap-3 rounded-xl border border-border bg-surface/70 p-3 text-left transition hover:border-mint/40 hover:bg-mint/90 active:bg-mint focus:bg-mint/90 dark:bg-[#f4f5f7] dark:border-[#d4d6dc] dark:hover:bg-white dark:active:bg-white dark:focus:bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-10 w-10 place-items-center rounded-full font-display font-semibold text-background dark:text-white", style: {
            background: b.heat === "hot" ? "var(--coral)" : b.heat === "warm" ? "var(--sun)" : "var(--mint)"
          }, children: [
            b.name.slice(0, 1),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-mint dark:border-[#f4f5f7] group-hover:dark:border-white" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate group-hover:text-background dark:text-black dark:group-hover:text-black", children: b.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground group-hover:text-background/80 dark:text-black/70 dark:group-hover:text-black/80", children: b.age }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground group-hover:text-background/80 dark:text-black/70 dark:group-hover:text-black/80", children: b.distanceM < 1e3 ? `${b.distanceM}m` : `${(b.distanceM / 1e3).toFixed(1)}km` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-xs text-muted-foreground truncate group-hover:text-background/80 dark:text-black/70 dark:group-hover:text-black/80", children: [
              "#",
              b.tag,
              " · ",
              b.status
            ] })
          ] })
        ] }) }, b.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selected && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "fixed inset-0 z-50 grid place-items-end bg-black/50 backdrop-blur-sm sm:place-items-center", onClick: () => setSelected(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      y: 60,
      opacity: 0
    }, animate: {
      y: 0,
      opacity: 1
    }, exit: {
      y: 60,
      opacity: 0
    }, className: "w-full max-w-md rounded-t-3xl border border-border bg-surface p-5 sm:rounded-3xl", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-muted sm:hidden" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl font-display text-2xl font-semibold text-background", style: {
          background: selected.heat === "hot" ? "var(--coral)" : selected.heat === "warm" ? "var(--sun)" : "var(--mint)"
        }, children: selected.name.slice(0, 1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold", children: selected.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: selected.age })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
            selected.distanceM < 1e3 ? `${selected.distanceM}m` : `${(selected.distanceM / 1e3).toFixed(1)}km`,
            " · ",
            selected.status
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-sun" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px]", children: [
          "#",
          selected.tag
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-mint/40 bg-mint/10 px-2.5 py-1 text-[11px] text-mint", children: [
          "同频度 ",
          selected.compat,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 py-3 text-sm hover:bg-background/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          " 打招呼"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/discover", className: "flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coral to-sun py-3 text-sm font-semibold text-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 fill-current" }),
          " 查看资料"
        ] })
      ] })
    ] }) }) })
  ] });
}
function Legend({
  color,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: {
      background: color,
      boxShadow: `0 0 8px ${color}`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto font-semibold text-foreground", children: value })
  ] });
}
export {
  RadarPage as component
};
