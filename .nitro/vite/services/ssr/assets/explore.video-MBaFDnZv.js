import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
import { V as Video } from "./video-BqXgI5MD.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { S as Shuffle, M as MicOff, P as PhoneOff, R as RotateCcw } from "./shuffle-DHkrUWYO.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { S as Star } from "./star-DExa2ZiW.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { U as UserPlus } from "./user-plus-BFbiOZ_5.js";
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
  [
    "path",
    { d: "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196", key: "w8jjjt" }
  ],
  ["path", { d: "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2", key: "1xawa7" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const VideoOff = createLucideIcon("video-off", __iconNode);
const PROPS = [{
  id: "none",
  name: "原貌",
  emoji: "🙂"
}, {
  id: "mask",
  name: "口罩",
  emoji: "😷"
}, {
  id: "panda",
  name: "熊猫",
  emoji: "🐼"
}, {
  id: "cat",
  name: "猫猫",
  emoji: "🐱"
}, {
  id: "alien",
  name: "外星人",
  emoji: "👽"
}, {
  id: "shades",
  name: "墨镜",
  emoji: "🕶️"
}];
const MATCH_POOL = [{
  name: "可乐",
  age: 23,
  city: "杭州",
  avatar: "from-coral to-sun",
  emoji: "🐱"
}, {
  name: "雾岛",
  age: 27,
  city: "重庆",
  avatar: "from-mint to-[#38bdf8]",
  emoji: "🐼"
}, {
  name: "Nova",
  age: 25,
  city: "上海",
  avatar: "from-sun to-coral",
  emoji: "👽"
}];
const CALL_SECONDS = 5 * 60;
const PROP_PREF_KEY = "pulse:video:prop";
function VideoChatPage() {
  const [stage, setStage] = reactExports.useState("idle");
  const [myProp, setMyPropState] = reactExports.useState(PROPS[2]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(PROP_PREF_KEY);
      if (saved) {
        const found = PROPS.find((p) => p.id === saved);
        if (found) setMyPropState(found);
      }
    } catch {
    }
  }, []);
  const setMyProp = (p) => {
    setMyPropState(p);
    try {
      window.localStorage.setItem(PROP_PREF_KEY, p.id);
    } catch {
    }
  };
  const [meReady, setMeReady] = reactExports.useState(false);
  const [taReady, setTaReady] = reactExports.useState(false);
  const [match, setMatch] = reactExports.useState(MATCH_POOL[0]);
  const [seconds, setSeconds] = reactExports.useState(CALL_SECONDS);
  const [muted, setMuted] = reactExports.useState(false);
  const [camOff, setCamOff] = reactExports.useState(false);
  const [rating, setRating] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, []);
  const goPreview = () => setStage("preview");
  const startMatch = () => {
    setStage("matching");
    setMeReady(false);
    setTaReady(false);
    window.setTimeout(() => {
      setMatch(MATCH_POOL[Math.floor(Math.random() * MATCH_POOL.length)]);
      setStage("confirm");
      window.setTimeout(() => setTaReady(true), 1500 + Math.random() * 1500);
    }, 1800);
  };
  reactExports.useEffect(() => {
    if (stage === "confirm" && meReady && taReady) {
      setStage("in_call");
      setSeconds(CALL_SECONDS);
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            if (timerRef.current) window.clearInterval(timerRef.current);
            setStage("ended");
            return 0;
          }
          return s - 1;
        });
      }, 1e3);
    }
  }, [stage, meReady, taReady]);
  const hangUp = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setStage("ended");
  };
  const reset = () => {
    setStage("idle");
    setMeReady(false);
    setTaReady(false);
    setRating(0);
    setSeconds(CALL_SECONDS);
  };
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-grid text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--sun)_18%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/explore", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " 发现"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-5 pb-20 pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      stage === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0
      }, className: "w-full text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-sun to-coral text-background shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-14 w-14" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-8 font-display text-3xl font-semibold tracking-tight", children: "5 分钟视频,自在做自己" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "想素颜出镜就素颜,想戴口罩、加点小装饰也都行——按自己的节奏来。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: goPreview, className: "mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-sun to-coral px-7 font-semibold text-background shadow-lg hover:scale-[1.02]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          " 进入视频预览"
        ] })
      ] }, "idle"),
      stage === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0
      }, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background via-surface to-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[160px] leading-none", children: myProp.emoji }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur", children: "预览 · 镜像" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur", children: [
            "当前形象:",
            myProp.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "选择道具" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-3 gap-2", children: PROPS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMyProp(p), className: `flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs transition ${myProp.id === p.id ? "border-sun bg-sun/10 text-foreground" : "border-border bg-surface/40 text-muted-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: p.emoji }),
            p.name
          ] }, p.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: startMatch, className: "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sun to-coral font-semibold text-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "h-4 w-4" }),
          " 开始匹配"
        ] })
      ] }, "preview"),
      stage === "matching" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "w-full text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-56 w-56", children: [
          [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 rounded-full border-2 border-sun/40", animate: {
            scale: [1, 1.4],
            opacity: [0.8, 0]
          }, transition: {
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity
          } }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-12 grid place-items-center rounded-full bg-surface text-5xl ring-1 ring-border", children: myProp.emoji })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 font-display text-xl", children: "正在为你寻找有缘的人…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline", children: "取消" })
      ] }, "matching"),
      stage === "confirm" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewTile, { label: "我", emoji: myProp.emoji, ready: meReady, grad: "from-sun/30 to-coral/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewTile, { label: "TA", emoji: match.emoji, ready: taReady, grad: "from-mint/30 to-[#38bdf8]/30" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-3xl border border-border bg-surface/70 p-5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl", children: [
            match.name,
            " · ",
            match.age
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            match.city,
            " · 双方都确认后开始"
          ] }),
          !meReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "flex-1 rounded-full border border-border py-2.5 text-sm", children: "跳过" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMeReady(true), className: "flex-1 rounded-full bg-gradient-to-r from-sun to-coral py-2.5 text-sm font-semibold text-background", children: "确认接通" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: taReady ? "正在接通…" : "等待对方确认…" })
        ] })
      ] }, "confirm"),
      stage === "in_call" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-mint/20 via-background to-[#38bdf8]/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[180px] leading-none", children: match.emoji }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur", children: [
            match.name,
            " · ",
            match.city
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur", children: [
            mm,
            ":",
            ss
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 h-32 w-24 overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-sun/30 to-coral/30 backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-5xl", children: camOff ? "📷" : myProp.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 left-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white", children: "我" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "切换道具" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-2 overflow-x-auto pb-1", children: PROPS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMyProp(p), className: `flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-1.5 text-[10px] ${myProp.id === p.id ? "border-sun bg-sun/10 text-foreground" : "border-border bg-surface/40 text-muted-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: p.emoji }),
            p.name
          ] }, p.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMuted((m) => !m), className: `grid h-12 w-12 place-items-center rounded-full border ${muted ? "border-sun/50 bg-sun/10 text-sun" : "border-border bg-background/40 text-muted-foreground"}`, children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: hangUp, className: "grid h-16 w-16 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-lg active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCamOff((c) => !c), className: `grid h-12 w-12 place-items-center rounded-full border ${camOff ? "border-sun/50 bg-sun/10 text-sun" : "border-border bg-background/40 text-muted-foreground"}`, children: camOff ? /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5" }) })
        ] })
      ] }, "call"),
      stage === "ended" && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/70 p-6 text-center backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-mint/30 to-[#38bdf8]/30 text-4xl", children: match.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 font-display text-2xl font-semibold", children: [
          "与 ",
          match.name,
          " 的视频结束"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          "通话时长 ",
          String(Math.floor((CALL_SECONDS - seconds) / 60)).padStart(2, "0"),
          ":",
          String((CALL_SECONDS - seconds) % 60).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center gap-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRating(n), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-7 w-7 ${n <= rating ? "fill-sun text-sun" : "text-muted-foreground"}` }) }, n)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center justify-center gap-1.5 rounded-full border border-coral/40 bg-coral/10 px-4 py-2.5 text-sm text-coral", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" }),
            " 关注 TA"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center justify-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 px-4 py-2.5 text-sm text-mint", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
            " 加为好友"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/chat", search: {
          name: match.name,
          avatar: match.avatar,
          from: "video",
          city: match.city
        }, className: "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-mint to-coral px-4 py-3 text-sm font-semibold text-background", children: "继续聊聊 →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: startMatch, className: "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-sun to-coral px-4 py-3 text-sm font-semibold text-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
          " 重新匹配"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "mt-3 w-full text-xs text-muted-foreground", children: "返回" })
      ] }) }, "ended")
    ] }) })
  ] });
}
function PreviewTile({
  label,
  emoji,
  ready,
  grad
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative aspect-[3/4] overflow-hidden rounded-3xl border ${ready ? "border-mint" : "border-border"} bg-gradient-to-br ${grad}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center text-[110px]", children: emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] ${ready ? "bg-mint text-background" : "bg-black/40 text-white"}`, children: ready ? "已确认" : "待确认" })
  ] });
}
export {
  VideoChatPage as component
};
