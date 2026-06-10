import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, H as useNavigate, I as useQueryClient, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { l as listMyNotifications, m as markAllRead, a as markRead } from "./notifications.functions-frUCq8AG.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { B as Bell } from "./bell-DcgN1dsG.js";
import { C as CheckCheck } from "./check-check-kjAX3s8O.js";
import { F as Film } from "./film-Cy3u2ISU.js";
import { G as Gift } from "./gift-DA16lxDn.js";
import { U as UserPlus } from "./user-plus-BFbiOZ_5.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { M as MessageSquare } from "./message-square-Bk7lMpAm.js";
import { F as Flag } from "./flag-g1fA_T7D.js";
import { S as ShieldCheck } from "./shield-check-DHXh-Xe0.js";
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
const __iconNode = [
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
      key: "emmmcr"
    }
  ],
  ["path", { d: "M7 10v12", key: "1qc93n" }]
];
const ThumbsUp = createLucideIcon("thumbs-up", __iconNode);
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  return new Date(iso).toLocaleDateString();
}
const TYPE_META = {
  message: {
    icon: MessageSquare,
    color: "text-mint",
    label: "新消息"
  },
  like: {
    icon: Heart,
    color: "text-coral",
    label: "新喜欢"
  },
  match: {
    icon: Sparkles,
    color: "text-sun",
    label: "成功配对"
  },
  comment: {
    icon: MessageCircle,
    color: "text-brand",
    label: "新评论"
  },
  post_like: {
    icon: ThumbsUp,
    color: "text-coral",
    label: "动态被赞"
  },
  follow: {
    icon: UserPlus,
    color: "text-mint",
    label: "新粉丝"
  },
  gift: {
    icon: Gift,
    color: "text-sun",
    label: "收到礼物"
  },
  video_like: {
    icon: Film,
    color: "text-coral",
    label: "短视频被赞"
  }
};
TYPE_META.report_resolved = {
  icon: Flag,
  color: "text-coral",
  label: "举报有结果"
};
TYPE_META.appeal_resolved = {
  icon: ShieldCheck,
  color: "text-mint",
  label: "申诉有结果"
};
TYPE_META.post_reviewed = {
  icon: ShieldCheck,
  color: "text-sun",
  label: "动态审核结果"
};
function describe(n) {
  const p = n.payload || {};
  switch (n.type) {
    case "message":
      return {
        title: `${p.sender_name ?? "有人"} 给你发了消息`,
        body: p.preview ?? "",
        to: {
          to: "/chat",
          search: {
            id: p.conversation_id
          }
        }
      };
    case "like":
      return {
        title: `${p.swiper_name ?? "有人"} 喜欢了你`,
        body: "去发现页看看吧",
        to: {
          to: "/discover"
        }
      };
    case "match":
      return {
        title: `你和 ${p.other_name ?? "Ta"} 互相喜欢！`,
        body: "现在可以开始聊天了",
        to: {
          to: "/messages"
        }
      };
    case "comment":
      return {
        title: `${p.commenter_name ?? "有人"} 评论了你的动态`,
        body: p.preview ?? "",
        to: {
          to: "/community"
        }
      };
    case "post_like":
      return {
        title: `${p.liker_name ?? "有人"} 赞了你的动态`,
        body: p.post_title ?? "",
        to: {
          to: "/community"
        }
      };
    case "follow":
      return {
        title: `${p.follower_name ?? "有人"} 关注了你`,
        body: "",
        to: {
          to: "/me"
        }
      };
    case "gift":
      return {
        title: `${p.sender_name ?? "有人"} 送了你一份礼物`,
        body: p.message || `+${Math.max(Math.floor((p.coins ?? 0) * 0.6), 1)} 心动币已到账`,
        to: {
          to: "/wallet"
        }
      };
    case "video_like":
      return {
        title: `有人赞了你的短视频`,
        body: "去看看是谁吧",
        to: {
          to: "/videos"
        }
      };
    case "report_resolved":
      return {
        title: p.status === "resolved" ? "举报已处理" : "举报未通过",
        body: p.note || (p.status === "resolved" ? "感谢你帮助维护社区" : "如有异议可在我的举报中申诉"),
        to: {
          to: "/me/reports"
        }
      };
    case "appeal_resolved":
      return {
        title: p.status === "accepted" ? "申诉已通过" : "申诉未通过",
        body: p.note || "",
        to: {
          to: "/me/reports"
        }
      };
    case "post_reviewed": {
      const map = {
        approved: "你的动态已通过审核",
        rejected: "你的动态未通过审核",
        removed: "你的动态已被移除"
      };
      return {
        title: map[p.status] ?? "动态审核更新",
        body: (p.post_title ? `《${p.post_title}》 ` : "") + (p.note || ""),
        to: {
          to: "/community"
        }
      };
    }
    default:
      return {
        title: n.type,
        body: ""
      };
  }
}
function NotificationsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listMyNotifications);
  const markAll = useServerFn(markAllRead);
  const markOne = useServerFn(markRead);
  const q = useQuery({
    queryKey: ["notifications"],
    queryFn: () => list()
  });
  reactExports.useEffect(() => {
    const ch = supabase.channel("notif-page").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "notifications"
    }, () => {
      qc.invalidateQueries({
        queryKey: ["notifications"]
      });
      qc.invalidateQueries({
        queryKey: ["notifications-unread"]
      });
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [qc]);
  const items = q.data?.notifications ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-background pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 backdrop-blur-xl bg-background/85 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 h-14 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
        to: "/me"
      }), className: "size-9 rounded-full hover:bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-base font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
        " 通知"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        await markAll();
        qc.invalidateQueries({
          queryKey: ["notifications"]
        });
        qc.invalidateQueries({
          queryKey: ["notifications-unread"]
        });
      }, className: "ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "size-3.5" }),
        " 全部已读"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 py-4 space-y-2", children: [
      q.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-8 text-center", children: "加载中…" }),
      !q.isLoading && items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center text-muted-foreground text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-10 mx-auto mb-3 opacity-30" }),
        "还没有通知"
      ] }),
      items.map((n) => {
        const meta = TYPE_META[n.type] ?? {
          icon: Bell,
          color: "text-muted-foreground",
          label: n.type
        };
        const Icon = meta.icon;
        const d = describe(n);
        const unread = !n.read_at;
        const handleClick = async () => {
          if (unread) await markOne({
            data: {
              id: n.id
            }
          });
          qc.invalidateQueries({
            queryKey: ["notifications"]
          });
          qc.invalidateQueries({
            queryKey: ["notifications-unread"]
          });
          if (d.to) nav(d.to);
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleClick, className: `w-full text-left flex gap-3 p-3 rounded-2xl border ${unread ? "bg-card border-coral/30" : "bg-card/40 border-border"} hover:bg-card transition`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-10 rounded-full bg-muted/40 flex items-center justify-center ${meta.color} shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: d.title }),
              unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-coral shrink-0" })
            ] }),
            d.body && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-muted-foreground mt-0.5 line-clamp-2", children: d.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-[10px] text-muted-foreground/70 mt-1", children: [
              meta.label,
              " · ",
              timeAgo(n.created_at)
            ] })
          ] })
        ] }, n.id);
      })
    ] })
  ] });
}
export {
  NotificationsPage as component
};
