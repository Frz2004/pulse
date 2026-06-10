import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link, G as track, E as Events } from "./router-qNgQXy3C.js";
import { F as Flame } from "./flame-lI1Os8Ee.js";
import { R as Radar } from "./radar-mA_nUGGd.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { G as Ghost } from "./ghost-D3bn_ySd.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { i as interpolate, u as useConstant, d as motionValue, M as MotionConfigContext, e as useIsomorphicLayoutEffect, c as cancelFrame, f as frame, a as collectMotionValues, m as motion } from "./proxy-F-Xk4oX5.js";
import { X } from "./x-C9W7T09B.js";
import { S as Star } from "./star-DExa2ZiW.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
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
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
];
const Undo2 = createLucideIcon("undo-2", __iconNode);
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const isOutputMap = outputRangeOrMap !== void 0 && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
  if (isOutputMap) {
    return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
  const keys = useConstant(() => Object.keys(outputMap));
  const output = useConstant(() => ({}));
  for (const key of keys) {
    output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
  }
  return output;
}
const profile1 = "/assets/profile-1-CIiv6TVm.jpg";
const profile2 = "/assets/profile-2-BsmEuVXw.jpg";
const profile3 = "/assets/profile-3-DEb6t5LO.jpg";
const profile4 = "/assets/profile-4-B8GgLNs7.jpg";
const profile5 = "/assets/profile-5-D9ehrUiI.jpg";
const PROFILES = [{
  id: 1,
  name: "苏雨桐",
  age: 24,
  city: "上海 · 静安",
  distance: "1.2 km",
  bio: "喜欢去 livehouse 听独立乐队，周末沿着苏州河散步，找一个能一起赖在沙发上看老电影的人。",
  tags: ["独立音乐", "电影", "City Walk", "猫"],
  gradient: "from-[#ff8a7a] via-[#ff5a6e] to-[#7a4bff]",
  match: 96,
  photo: profile1
}, {
  id: 2,
  name: "陈一然",
  age: 27,
  city: "北京 · 朝阳",
  distance: "3.8 km",
  bio: "前端工程师 / 业余冲浪选手。最近在学陶艺,周末常常往海边跑。想找一个能一起做傻事的伙伴。",
  tags: ["冲浪", "陶艺", "代码", "旅行"],
  gradient: "from-[#5eead4] via-[#38bdf8] to-[#6366f1]",
  match: 92,
  photo: profile2
}, {
  id: 3,
  name: "Luna 林",
  age: 23,
  city: "成都 · 锦江",
  distance: "0.6 km",
  bio: "插画师,养了一只叫年糕的橘猫。喜欢小酒馆、爵士乐和一切毛茸茸的东西。",
  tags: ["插画", "爵士", "猫奴", "小酒馆"],
  gradient: "from-[#fde68a] via-[#fb923c] to-[#ef4444]",
  match: 89,
  photo: profile3
}, {
  id: 4,
  name: "周野",
  age: 29,
  city: "杭州 · 西湖",
  distance: "5.1 km",
  bio: "户外向导,带过 200+ 人去爬雪山。简介里写不下我去过的地方,但写得下我想和谁一起去。",
  tags: ["登山", "摄影", "露营", "滑雪"],
  gradient: "from-[#a7f3d0] via-[#34d399] to-[#0f766e]",
  match: 87,
  photo: profile4
}, {
  id: 5,
  name: "夏季限定",
  age: 25,
  city: "广州 · 天河",
  distance: "2.4 km",
  bio: "广告策划,白天写 brief,晚上写诗。最近在练习不那么用力地生活。",
  tags: ["写作", "诗歌", "美食", "瑜伽"],
  gradient: "from-[#fbcfe8] via-[#f472b6] to-[#7c3aed]",
  match: 84,
  photo: profile5
}];
function DiscoverPage() {
  const [index, setIndex] = reactExports.useState(0);
  const [history, setHistory] = reactExports.useState([]);
  const [lastAction, setLastAction] = reactExports.useState(null);
  const [matched, setMatched] = reactExports.useState(null);
  const current = PROFILES[index % PROFILES.length];
  const next = PROFILES[(index + 1) % PROFILES.length];
  const after = PROFILES[(index + 2) % PROFILES.length];
  const swipe = (dir) => {
    track(Events.MatchSwipe, {
      direction: dir,
      profile_id: current.id
    });
    setHistory((h) => [...h, {
      id: current.id,
      dir
    }]);
    setLastAction(dir === "right" ? "like" : dir === "left" ? "nope" : "super");
    if (dir === "right" || dir === "up") {
      if (dir === "up" || Math.random() < 0.5) {
        const matchedProfile = current;
        window.setTimeout(() => setMatched(matchedProfile), 600);
      }
    }
    setIndex((i) => i + 1);
    window.setTimeout(() => setLastAction(null), 700);
  };
  const undo = () => {
    if (!history.length) return;
    setHistory((h) => h.slice(0, -1));
    setIndex((i) => Math.max(0, i - 1));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-grid text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--coral)_25%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-md items-center gap-3 px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-coral to-sun text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold tracking-tight", children: "Pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "h-3.5 w-3.5", style: {
          color: "var(--mint)"
        }, "aria-label": "社交雷达" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-3.5 w-3.5", style: {
          color: "var(--coral)"
        }, "aria-label": "语音破冰" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ghost, { className: "h-3.5 w-3.5", style: {
          color: "var(--sun)"
        }, "aria-label": "匿名树洞" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/messages", className: "ml-auto grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60 text-muted-foreground backdrop-blur hover:text-coral", "aria-label": "消息", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur", children: "5km" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-5 pb-28 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex w-full items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold tracking-tight", children: "今天为你推荐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "基于你的兴趣 · 实时更新" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-surface px-3 py-1 text-xs text-muted-foreground", children: [
          Math.min(index + 1, PROFILES.length),
          " / ",
          PROFILES.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[560px] w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StaticCard, { profile: after, offset: 2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StaticCard, { profile: next, offset: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SwipeCard, { profile: current, onSwipe: swipe }, current.id + "-" + index) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: lastAction && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          scale: 0.6
        }, animate: {
          opacity: 1,
          scale: 1
        }, exit: {
          opacity: 0,
          scale: 1.4
        }, transition: {
          duration: 0.5
        }, className: "pointer-events-none absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full px-6 py-3 text-lg font-bold backdrop-blur " + (lastAction === "like" ? "bg-mint/20 text-mint border border-mint/40" : lastAction === "super" ? "bg-sun/20 text-sun border border-sun/40" : "bg-destructive/20 text-destructive border border-destructive/40"), children: lastAction === "like" ? "LIKE" : lastAction === "super" ? "SUPER" : "NOPE" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "撤回", onClick: undo, className: "h-12 w-12 border-border bg-surface text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "跳过", onClick: () => swipe("left"), className: "h-16 w-16 border-destructive/40 bg-surface text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "超级喜欢", onClick: () => swipe("up"), className: "h-14 w-14 border-sun/40 bg-surface text-sun hover:bg-sun/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "喜欢", onClick: () => swipe("right"), className: "h-16 w-16 border-mint/40 bg-gradient-to-br from-mint/20 to-coral/20 text-coral hover:from-mint/30 hover:to-coral/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-7 w-7 fill-current" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/chat", search: {
          name: current.name,
          avatar: current.gradient,
          from: "match",
          city: current.city
        }, "aria-label": "打招呼", className: "grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-coral", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: "左右滑动卡片 · 向上滑动表示超级喜欢" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: matched && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-xl", initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      scale: 0.85,
      y: 30,
      opacity: 0
    }, animate: {
      scale: 1,
      y: 0,
      opacity: 1
    }, exit: {
      scale: 0.9,
      opacity: 0
    }, transition: {
      type: "spring",
      damping: 18
    }, className: "relative w-full max-w-sm overflow-hidden rounded-3xl border border-coral/40 bg-surface p-6 text-center shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${matched.gradient} opacity-50` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-coral", children: "It's a Match" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-3xl font-semibold", children: "你们互相喜欢 💞" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          "和 ",
          matched.name,
          " 同频度 ",
          matched.match,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto mt-6 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-24 w-24 -mr-4 place-items-center rounded-full border-4 border-background bg-gradient-to-br from-coral to-sun font-display text-2xl text-background shadow-lg", children: "我" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-24 w-24 -ml-4 place-items-center rounded-full border-4 border-background bg-gradient-to-br ${matched.gradient} font-display text-2xl text-background shadow-lg`, children: matched.name.slice(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute grid h-10 w-10 place-items-center rounded-full bg-coral text-background shadow-xl", initial: {
            scale: 0
          }, animate: {
            scale: 1
          }, transition: {
            delay: 0.3,
            type: "spring"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5 fill-current" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/chat", search: {
          name: matched.name,
          avatar: matched.gradient,
          from: "match",
          city: matched.city
        }, className: "mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-coral to-sun px-4 py-3 text-sm font-semibold text-background shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          " 发送第一条消息"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMatched(null), className: "mt-3 w-full text-xs text-muted-foreground", children: "继续滑卡" })
      ] })
    ] }) }) })
  ] });
}
function StaticCard({
  profile,
  offset
}) {
  const scale = 1 - offset * 0.05;
  const y = offset * 14;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl", style: {
    transform: `translateY(${y}px) scale(${scale})`,
    opacity: 1 - offset * 0.25,
    zIndex: 10 - offset
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.photo, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) });
}
function SwipeCard({
  profile,
  onSwipe
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const nopeOpacity = useTransform(x, [-160, -40], [1, 0]);
  const superOpacity = useTransform(y, [-160, -40], [1, 0]);
  const handleEnd = (_, info) => {
    const {
      offset,
      velocity
    } = info;
    if (offset.y < -120 || velocity.y < -600) return onSwipe("up");
    if (offset.x > 140 || velocity.x > 600) return onSwipe("right");
    if (offset.x < -140 || velocity.x < -600) return onSwipe("left");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 z-20 cursor-grab overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl active:cursor-grabbing", style: {
    x,
    y,
    rotate
  }, drag: true, dragElastic: 0.6, dragConstraints: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, onDragEnd: handleEnd, initial: {
    scale: 0.96,
    opacity: 0
  }, animate: {
    scale: 1,
    opacity: 1
  }, exit: {
    x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
    y: y.get() < 0 ? -600 : 0,
    opacity: 0,
    transition: {
      duration: 0.35
    }
  }, whileTap: {
    cursor: "grabbing"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.photo, alt: profile.name, className: "absolute inset-0 h-full w-full object-cover", draggable: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-4 right-4 top-4 flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-sun" }),
        "匹配度 ",
        profile.match,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
        profile.distance
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: {
      opacity: likeOpacity
    }, className: "absolute left-6 top-16 rotate-[-12deg] rounded-xl border-4 border-mint bg-mint/20 px-4 py-2 text-2xl font-extrabold text-mint backdrop-blur", children: "LIKE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: {
      opacity: nopeOpacity
    }, className: "absolute right-6 top-16 rotate-[12deg] rounded-xl border-4 border-destructive bg-destructive/20 px-4 py-2 text-2xl font-extrabold text-destructive backdrop-blur", children: "NOPE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: {
      opacity: superOpacity
    }, className: "absolute left-1/2 top-10 -translate-x-1/2 rounded-xl border-4 border-sun bg-sun/20 px-4 py-2 text-2xl font-extrabold text-sun backdrop-blur", children: "SUPER" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 pt-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold tracking-tight", children: profile.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-light opacity-90", children: profile.age }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs opacity-70", children: profile.city })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-3 text-sm leading-relaxed text-white/85", children: profile.bio }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: profile.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] text-white backdrop-blur", children: [
        "#",
        t
      ] }, t)) })
    ] })
  ] }) });
}
function ActionBtn({
  children,
  label,
  onClick,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, "aria-label": label, className: `grid place-items-center rounded-full border shadow-lg transition-transform active:scale-90 ${className ?? ""}`, children });
}
export {
  DiscoverPage as component
};
