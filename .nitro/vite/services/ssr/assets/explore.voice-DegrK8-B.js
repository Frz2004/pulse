import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { L as Link, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { S as Shuffle, M as MicOff, P as PhoneOff, R as RotateCcw } from "./shuffle-DHkrUWYO.js";
import { V as Volume2 } from "./volume-2-DOJQY1ut.js";
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
const MATCH_POOL = [{
  name: "晚风",
  age: 24,
  city: "上海",
  tags: ["独立音乐", "猫"],
  avatar: "from-coral to-sun"
}, {
  name: "Echo",
  age: 26,
  city: "北京",
  tags: ["播客", "深夜"],
  avatar: "from-mint to-[#38bdf8]"
}, {
  name: "小蛮",
  age: 22,
  city: "成都",
  tags: ["旅行", "脱口秀"],
  avatar: "from-sun to-coral"
}, {
  name: "James",
  age: 28,
  city: "深圳",
  tags: ["健身", "电影"],
  avatar: "from-[#a78bfa] to-coral"
}];
const CALL_SECONDS = 10 * 60;
function VoiceChatPage() {
  const [stage, setStage] = reactExports.useState("idle");
  const [match, setMatch] = reactExports.useState(MATCH_POOL[0]);
  const [meReady, setMeReady] = reactExports.useState(false);
  const [taReady, setTaReady] = reactExports.useState(false);
  const [seconds, setSeconds] = reactExports.useState(CALL_SECONDS);
  const [muted, setMuted] = reactExports.useState(false);
  const [rating, setRating] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, []);
  const startMatch = () => {
    setStage("matching");
    setMeReady(false);
    setTaReady(false);
    window.setTimeout(() => {
      setMatch(MATCH_POOL[Math.floor(Math.random() * MATCH_POOL.length)]);
      setStage("confirm");
      window.setTimeout(() => setTaReady(true), 1800 + Math.random() * 1500);
    }, 2e3);
  };
  const confirmCall = () => {
    setMeReady(true);
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--coral)_22%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/explore", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " 发现"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "语音聊天" })
    ] }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-48 w-48", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 animate-ping rounded-full bg-coral/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-4 rounded-full bg-coral/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-10 grid place-items-center rounded-full bg-gradient-to-br from-coral to-sun text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-12 w-12" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-8 font-display text-3xl font-semibold tracking-tight", children: "10 分钟,只用声音" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "随机匹配一位陌生人,聊完可以选择留下,也可以再来一次。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: startMatch, className: "mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun px-7 font-semibold text-background shadow-lg hover:scale-[1.02] active:scale-95", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "h-4 w-4" }),
          " 开始随机匹配"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "当前在线 12,438 人 · 平均匹配 8 秒" })
      ] }, "idle"),
      stage === "matching" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "w-full text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-56 w-56", children: [
          [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 rounded-full border-2 border-coral/40", animate: {
            scale: [1, 1.4],
            opacity: [0.8, 0]
          }, transition: {
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity
          } }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-12 grid place-items-center rounded-full bg-surface ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-10 w-10 text-coral" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 font-display text-xl", children: "正在寻找有缘人…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "已为你过滤共同兴趣 #独立音乐 #City Walk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline", children: "取消" })
      ] }, "matching"),
      stage === "confirm" && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, exit: {
        opacity: 0
      }, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 text-center backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br ${match.avatar} font-display text-3xl text-background`, children: match.name.slice(0, 1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 font-display text-2xl font-semibold", children: [
          match.name,
          " · ",
          match.age
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: match.city }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap justify-center gap-1.5", children: match.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground", children: [
          "#",
          t
        ] }, t)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border px-3 py-2 ${meReady ? "border-mint/50 bg-mint/10 text-mint" : "border-border bg-background/40 text-muted-foreground"}`, children: [
            "我 ",
            meReady ? "已确认" : "待确认"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border px-3 py-2 ${taReady ? "border-mint/50 bg-mint/10 text-mint" : "border-border bg-background/40 text-muted-foreground"}`, children: [
            "TA ",
            taReady ? "已确认" : "等待中"
          ] })
        ] }),
        !meReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "flex-1 rounded-full border border-border py-2.5 text-sm", children: "跳过" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: confirmCall, className: "flex-1 rounded-full bg-gradient-to-r from-coral to-sun py-2.5 text-sm font-semibold text-background", children: "确认接通" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs text-muted-foreground", children: taReady ? "正在接通…" : "等待对方确认…" })
      ] }) }, "confirm"),
      stage === "in_call" && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/70 p-6 text-center backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "通话中" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-display text-5xl tabular-nums", children: [
          mm,
          ":",
          ss
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "剩余时长 · 满 10 分钟自动结束" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto mt-8 h-32 w-32", children: [
          [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 rounded-full border border-coral/30", animate: {
            scale: [1, 1.5],
            opacity: [0.6, 0]
          }, transition: {
            duration: 1.6,
            delay: i * 0.4,
            repeat: Infinity
          } }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-4 grid place-items-center rounded-full bg-gradient-to-br ${match.avatar} text-background font-display text-2xl`, children: match.name.slice(0, 1) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-display text-lg", children: match.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          match.city,
          " · 声音传输良好"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex h-10 items-center justify-center gap-1", children: Array.from({
          length: 28
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { className: "w-1 rounded-full bg-coral/70", animate: {
          height: [`${20 + Math.random() * 40}%`, `${30 + Math.random() * 70}%`, `${15 + Math.random() * 35}%`]
        }, transition: {
          duration: 0.6 + Math.random() * 0.6,
          repeat: Infinity,
          repeatType: "reverse"
        } }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMuted((m) => !m), className: `grid h-12 w-12 place-items-center rounded-full border ${muted ? "border-sun/50 bg-sun/10 text-sun" : "border-border bg-background/40 text-muted-foreground"}`, children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: hangUp, className: "grid h-16 w-16 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-lg active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "grid h-12 w-12 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-5 w-5" }) })
        ] })
      ] }) }, "call"),
      stage === "ended" && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0
      }, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/70 p-6 text-center backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${match.avatar} font-display text-2xl text-background`, children: match.name.slice(0, 1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 font-display text-2xl font-semibold", children: [
          "和 ",
          match.name,
          " 的通话结束了"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          "通话时长 ",
          String(Math.floor((CALL_SECONDS - seconds) / 60)).padStart(2, "0"),
          ":",
          String((CALL_SECONDS - seconds) % 60).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "为这次通话打个分" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-center gap-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRating(n), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-7 w-7 ${n <= rating ? "fill-sun text-sun" : "text-muted-foreground"}` }) }, n)) })
        ] }),
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
          from: "voice",
          city: match.city
        }, className: "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-mint to-coral px-4 py-3 text-sm font-semibold text-background", children: "继续聊聊 →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: startMatch, className: "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-coral to-sun px-4 py-3 text-sm font-semibold text-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
          " 重新匹配"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "mt-3 w-full text-xs text-muted-foreground", children: "返回" })
      ] }) }, "ended")
    ] }) })
  ] });
}
export {
  VoiceChatPage as component
};
