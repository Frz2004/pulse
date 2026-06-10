import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { T as Trees } from "./trees-f20mYION.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { S as Send } from "./send-Dhkts5hY.js";
import { L as Lock } from "./lock-BXO1VJd6.js";
import { X } from "./x-C9W7T09B.js";
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
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
];
const LockOpen = createLucideIcon("lock-open", __iconNode);
const SEED = [{
  id: "p1",
  alias: "夜里的鲸",
  emoji: "🐳",
  time: "3 分钟前",
  mood: "孤独",
  text: "今天又一个人吃了火锅,服务员把小熊放在对面的位置上。我笑了出来,然后突然有点想哭。",
  resonate: 124,
  hugs: 88,
  comments: [{
    alias: "晚风的猫",
    emoji: "🐱",
    text: "小熊知道你今天辛苦了。"
  }, {
    alias: "灯泡先生",
    emoji: "💡",
    text: "下次叫我,我也常一个人吃。"
  }]
}, {
  id: "p2",
  alias: "失眠树懒",
  emoji: "🦥",
  time: "12 分钟前",
  mood: "焦虑",
  text: "面试挂了第 7 次。简历像石头一样砸进 HR 邮箱,然后再也没有回声。",
  resonate: 312,
  hugs: 201,
  comments: [{
    alias: "深夜面包",
    emoji: "🍞",
    text: "我也是。我们一起再投一次。"
  }]
}, {
  id: "p3",
  alias: "薄荷糖",
  emoji: "🍬",
  time: "32 分钟前",
  mood: "暗恋",
  text: "他今天对我笑了一下,我循环了一整天。可能这就是我整周的全部能量来源了。",
  resonate: 487,
  hugs: 156,
  comments: []
}, {
  id: "p4",
  alias: "云朵观察员",
  emoji: "☁️",
  time: "1 小时前",
  mood: "治愈",
  text: "今天发现公司楼下开了一家新的咖啡馆,老板是只胖橘猫。世界对我温柔了一秒。",
  resonate: 622,
  hugs: 88,
  comments: []
}];
const MOODS = ["全部", "孤独", "焦虑", "暗恋", "治愈", "深夜"];
function TreeholePage() {
  const [posts, setPosts] = reactExports.useState(SEED);
  const [filter, setFilter] = reactExports.useState("全部");
  const [composing, setComposing] = reactExports.useState(false);
  const [draftMood, setDraftMood] = reactExports.useState("孤独");
  const [draftText, setDraftText] = reactExports.useState("");
  const [activePost, setActivePost] = reactExports.useState(null);
  const [chatWith, setChatWith] = reactExports.useState(null);
  const [chatStage, setChatStage] = reactExports.useState("requested");
  const list = reactExports.useMemo(() => filter === "全部" ? posts : posts.filter((p) => p.mood === filter), [posts, filter]);
  const toggle = (id, key) => {
    setPosts((ps) => ps.map((p) => {
      if (p.id !== id) return p;
      const on = !p[key];
      const field = key === "resonated" ? "resonate" : "hugs";
      return {
        ...p,
        [key]: on,
        [field]: p[field] + (on ? 1 : -1)
      };
    }));
  };
  const publish = () => {
    if (!draftText.trim()) return;
    const aliases = [{
      a: "迷路的星星",
      e: "⭐"
    }, {
      a: "雨天的伞",
      e: "☂️"
    }, {
      a: "走神兔",
      e: "🐰"
    }, {
      a: "微醺月亮",
      e: "🌙"
    }];
    const pick = aliases[Math.floor(Math.random() * aliases.length)];
    const newPost = {
      id: "p" + Date.now(),
      alias: pick.a,
      emoji: pick.e,
      time: "刚刚",
      mood: draftMood,
      text: draftText.trim(),
      resonate: 0,
      hugs: 0,
      comments: []
    };
    setPosts((ps) => [newPost, ...ps]);
    setDraftText("");
    setComposing(false);
  };
  const startChat = (p) => {
    setActivePost(null);
    setChatWith(p);
    setChatStage("requested");
    window.setTimeout(() => setChatStage("accepted"), 1800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,#a78bfa_18%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/explore", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " 发现"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trees, { className: "h-3.5 w-3.5" }),
        " 匿名树洞"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto w-full max-w-2xl px-5 pb-32 pt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold tracking-tight", children: [
          "说出口的秘密",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "总会被人接住"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "所有人都是匿名身份,直到你们决定揭晓彼此。" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex gap-2 overflow-x-auto pb-1", children: MOODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(m), className: `shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition ${filter === m ? "border-foreground bg-foreground text-background" : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"}`, children: m }, m)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-3", children: list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "rounded-3xl border border-border bg-surface/60 p-5 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full bg-background text-xl ring-1 ring-border", children: p.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: p.alias }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
              p.time,
              " · #",
              p.mood
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground", children: "匿名" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 whitespace-pre-wrap text-[15px] leading-relaxed", children: p.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggle(p.id, "resonated"), className: `inline-flex items-center gap-1 rounded-full border px-3 py-1.5 transition ${p.resonated ? "border-[#c4b5fd]/40 bg-[#a78bfa]/15 text-[#c4b5fd]" : "border-border bg-background/40 text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            " 共鸣 ",
            p.resonate
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggle(p.id, "hugged"), className: `inline-flex items-center gap-1 rounded-full border px-3 py-1.5 transition ${p.hugged ? "border-coral/40 bg-coral/15 text-coral" : "border-border bg-background/40 text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-3.5 w-3.5 ${p.hugged ? "fill-current" : ""}` }),
            " 抱抱 ",
            p.hugs
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActivePost(p), className: "inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-3 py-1.5 text-muted-foreground hover:text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
            " 评论 ",
            p.comments.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startChat(p), className: "rounded-full bg-gradient-to-r from-[#a78bfa] to-coral px-3 py-1.5 text-[11px] font-semibold text-background", children: "匿名聊聊" })
        ] })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setComposing(true), className: "fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a78bfa] to-coral px-5 py-3.5 text-sm font-semibold text-background shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trees, { className: "h-4 w-4" }),
      " 发布树洞"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: composing && /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { onClose: () => setComposing(false), title: "把心事丢进树洞", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: MOODS.filter((m) => m !== "全部").map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDraftMood(m), className: `rounded-full border px-3 py-1 text-xs ${draftMood === m ? "border-[#c4b5fd] bg-[#a78bfa]/20 text-[#c4b5fd]" : "border-border bg-background/40 text-muted-foreground"}`, children: [
        "#",
        m
      ] }, m)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: draftText, onChange: (e) => setDraftText(e.target.value), maxLength: 500, placeholder: "树洞里的话不会被你的好友看到,只会飘到陌生人的耳边…", className: "mt-3 h-40 w-full resize-none rounded-2xl border border-border bg-background/40 p-4 text-sm outline-none focus:border-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex items-center justify-between text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        draftText.length,
        "/500 · 匿名发布"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: publish, disabled: !draftText.trim(), className: "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a78bfa] to-coral py-3 text-sm font-semibold text-background disabled:opacity-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
        " 让它飘出去"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activePost && /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { onClose: () => setActivePost(null), title: `${activePost.alias} 的树洞`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 whitespace-pre-wrap text-[15px] leading-relaxed", children: activePost.text }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-3", children: [
        activePost.comments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "还没有人评论,来当第一个接住 TA 的人。" }),
        activePost.comments.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-background text-base ring-1 ring-border", children: c.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.alias }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: c.text })
          ] })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => startChat(activePost), className: "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a78bfa] to-coral py-3 text-sm font-semibold text-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
        " 发起匿名聊天"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: chatWith && /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { onClose: () => setChatWith(null), title: "匿名聊天", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnonymousChat, { post: chatWith, stage: chatStage, setStage: setChatStage }) }) })
  ] });
}
function Sheet({
  children,
  onClose,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      y: "100%"
    }, animate: {
      y: 0
    }, exit: {
      y: "100%"
    }, transition: {
      type: "spring",
      damping: 26,
      stiffness: 240
    }, className: "fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-background p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      children
    ] })
  ] });
}
function AnonymousChat({
  post,
  stage,
  setStage
}) {
  const [meAgree, setMeAgree] = reactExports.useState(false);
  const [taAgree, setTaAgree] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([{
    from: "ta",
    text: "嗨,谢谢你愿意来听我说话…"
  }]);
  const [input, setInput] = reactExports.useState("");
  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, {
      from: "me",
      text: input.trim()
    }]);
    setInput("");
    window.setTimeout(() => {
      const replies = ["嗯,我懂这种感觉。", "其实你不是一个人。", "今天的你已经很厉害了。"];
      setMessages((m) => [...m, {
        from: "ta",
        text: replies[Math.floor(Math.random() * replies.length)]
      }]);
    }, 1200);
  };
  const tryReveal = () => {
    setMeAgree(true);
    window.setTimeout(() => {
      setTaAgree(true);
      setStage("revealed");
    }, 1500);
  };
  if (stage === "requested") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-background text-2xl ring-1 ring-border", children: post.emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
        "已向 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: post.alias }),
        " 发送聊天邀请…"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { className: "h-2 w-2 rounded-full bg-coral", animate: {
          opacity: [0.3, 1, 0.3]
        }, transition: {
          duration: 1.2,
          repeat: Infinity
        } }),
        "等待对方接受"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border bg-surface/60 px-3 py-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-[#c4b5fd]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "你正在与 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: stage === "revealed" ? "text-foreground" : "", children: stage === "revealed" ? "苏雨桐" : post.alias }),
        " 匿名聊天"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-64 space-y-2 overflow-y-auto rounded-2xl bg-surface/30 p-3", children: messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.from === "me" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.from === "me" ? "bg-coral text-background" : "bg-background border border-border"}`, children: m.text }) }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(), placeholder: "说点什么…", className: "flex-1 rounded-full border border-border bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: send, className: "grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-[#a78bfa] to-coral text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
    ] }),
    stage !== "revealed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-dashed border-border bg-surface/40 p-4 text-center text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: "聊得来?可以解锁真实身份" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "双方都同意后,匿名聊天将转为正常聊天,昵称与头像会公开。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border px-3 py-2 ${meAgree ? "border-mint/50 bg-mint/10 text-mint" : "border-border text-muted-foreground"}`, children: [
          "我 ",
          meAgree ? "同意" : "未同意"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border px-3 py-2 ${taAgree ? "border-mint/50 bg-mint/10 text-mint" : "border-border text-muted-foreground"}`, children: [
          "TA ",
          taAgree ? "同意" : "等待中"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: tryReveal, disabled: meAgree, className: "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground py-2.5 text-sm font-semibold text-background disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-4 w-4" }),
        " ",
        meAgree ? "已请求公开" : "我同意公开身份"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-mint/40 bg-mint/10 p-4 text-center text-xs text-mint", children: "🎉 双方已公开身份,这段对话已转为正常聊天。" })
  ] });
}
export {
  TreeholePage as component
};
