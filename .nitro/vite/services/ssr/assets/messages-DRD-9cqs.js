import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { L as Link } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { l as listConversations } from "./chat.functions-fgDNj0vd.js";
import { g as getUnreadCount } from "./notifications.functions-frUCq8AG.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { F as Flame } from "./flame-lI1Os8Ee.js";
import { B as Bell } from "./bell-DcgN1dsG.js";
import { U as UserPlus } from "./user-plus-BFbiOZ_5.js";
import { S as Search } from "./search-B_wn2j3V.js";
import { M as MessageSquare } from "./message-square-Bk7lMpAm.js";
import { G as Ghost } from "./ghost-D3bn_ySd.js";
import { V as Video } from "./video-BqXgI5MD.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./types-DNG0tEns.js";
import "./auth-middleware-Y8f4GSpx.js";
import "./index-m6JgwYlt.js";
import "./users-DxsiCKVk.js";
import "./message-circle-DLgZCMdI.js";
import "./plus-Bydlo4jQ.js";
const SOURCE_META = {
  match: {
    label: "匹配",
    icon: Heart,
    color: "text-coral"
  },
  voice: {
    label: "语音破冰",
    icon: Mic,
    color: "text-mint"
  },
  video: {
    label: "视频破冰",
    icon: Video,
    color: "text-sun"
  },
  treehole: {
    label: "树洞",
    icon: Ghost,
    color: "text-brand"
  }
};
function timeAgo(iso) {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  return new Date(iso).toLocaleDateString();
}
function MessagesPage() {
  const [authed, setAuthed] = reactExports.useState(null);
  const [keyword, setKeyword] = reactExports.useState("");
  reactExports.useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({
      data: data2
    }) => {
      if (alive) setAuthed(!!data2.session);
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const fetchList = useServerFn(listConversations);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchList(),
    enabled: authed === true,
    refetchOnWindowFocus: true
  });
  const fetchUnread = useServerFn(getUnreadCount);
  const unreadQ = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => fetchUnread(),
    enabled: authed === true,
    refetchOnWindowFocus: true
  });
  const notifUnread = unreadQ.data?.count ?? 0;
  reactExports.useEffect(() => {
    if (authed !== true) return;
    const channel = supabase.channel("messages-list").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages"
    }, () => {
      refetch();
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "conversations"
    }, () => {
      refetch();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authed, refetch]);
  const list = (data?.conversations ?? []).filter((c) => keyword ? (c.partnerName + (c.lastMessage ?? "")).toLowerCase().includes(keyword.toLowerCase()) : true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-md items-center gap-3 px-5 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-coral to-sun text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold tracking-tight", children: "消息" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/notifications", "aria-label": "通知", className: "relative mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/70 hover:bg-surface", onClick: () => {
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {
            });
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-foreground" }),
          notifUnread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 grid min-w-[16px] place-items-center rounded-full bg-coral px-1 text-[10px] font-semibold text-background", children: notifUnread > 99 ? "99+" : notifUnread })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/add-friend", className: "inline-flex items-center gap-1 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-foreground hover:bg-surface", "aria-label": "添加好友", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5 text-coral" }),
          " 加好友"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-md px-5 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: keyword, onChange: (e) => setKeyword(e.target.value), placeholder: "搜索昵称或聊天内容", className: "flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto w-full max-w-md px-3 pb-28 pt-2", children: [
      authed === false && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-2 mt-8 rounded-2xl border border-border bg-surface/70 p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-coral/15 text-coral", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "登录后查看你的消息" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
            mode: "login"
          }, className: "rounded-[10px] border border-brand/40 px-4 py-2.5 text-sm text-brand", children: "登录" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
            mode: "signup"
          }, className: "rounded-[10px] bg-coral px-4 py-2.5 text-sm font-semibold text-background", children: "注册" })
        ] })
      ] }),
      authed === true && isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 px-2", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 animate-pulse rounded-2xl bg-surface/50" }, i)) }),
      authed === true && !isLoading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-2 mt-8 rounded-3xl border border-dashed border-border bg-surface/40 p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-coral/30 to-sun/30 text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-lg font-semibold", children: "还没有对话" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "去滑卡、语音破冰，遇见同频的人" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/discover", className: "rounded-[10px] bg-coral px-4 py-2 text-sm font-semibold text-background", children: "开始滑卡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", className: "rounded-[10px] border border-border px-4 py-2 text-sm text-foreground", children: "去发现" })
        ] })
      ] }),
      authed === true && list.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: list.map((c) => {
        const meta = SOURCE_META[c.source] || SOURCE_META.match;
        const Icon = meta.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/chat", search: {
          conv: c.id,
          name: c.partnerName,
          from: c.source
        }, className: "flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-surface/60", children: [
          c.partnerAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.partnerAvatar, alt: c.partnerName, className: "h-12 w-12 rounded-2xl object-cover ring-1 ring-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-coral to-sun font-display text-lg text-background", children: c.partnerName.slice(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-display text-base font-semibold", children: c.partnerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-0.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] ${meta.color}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-2.5 w-2.5" }),
                " ",
                meta.label
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `truncate text-xs ${c.unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`, children: c.lastMessage || "开始你们的第一句话…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: timeAgo(c.lastMessageAt) }),
            c.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid min-w-[18px] place-items-center rounded-full bg-coral px-1.5 text-[10px] font-semibold text-background", children: c.unread > 99 ? "99+" : c.unread })
          ] })
        ] }) }, c.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "messages" })
  ] });
}
export {
  MessagesPage as component
};
