import { aa as useRouter, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, g as Route, A as ArrowLeft, L as Link, T as Trophy } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { g as getContest, v as vsBrush, C as Calendar } from "./vs-brush-C8hgVoja.js";
import { U as User, B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
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
import "./auth-middleware-Y8f4GSpx.js";
import "./users-DxsiCKVk.js";
import "./message-circle-DLgZCMdI.js";
import "./plus-Bydlo4jQ.js";
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function ContestDetailPage() {
  const {
    contestId
  } = Route.useParams();
  const router = useRouter();
  const fetch = useServerFn(getContest);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["contest", contestId],
    queryFn: () => fetch({
      data: {
        id: contestId
      }
    })
  });
  const c = data?.contest;
  const vsMatch = c?.title.match(/^(.+?)\s*(?:vs|VS|对|对阵)\s*(.+)$/);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.history.back(), className: "rounded-full p-1.5 hover:bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base font-semibold", children: "比赛详情" })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-8 text-sm text-muted-foreground", children: "加载中…" }),
    !isLoading && !c && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-12 text-center text-sm text-muted-foreground", children: [
      "公告不存在或已被删除。",
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contests", className: "text-coral", children: "返回列表" }) })
    ] }),
    c && /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto max-w-3xl px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-3 h-44 overflow-hidden rounded-3xl bg-gradient-to-br from-coral/40 via-sun/20 to-mint/20", children: [
        c.cover && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.cover, alt: "", className: "absolute inset-0 h-full w-full object-cover opacity-90" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-4 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium", children: c.category })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        vsMatch ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold leading-tight", children: vsMatch[1] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: vsBrush, alt: "VS", className: "h-16 w-16 drop-shadow-[0_6px_14px_rgba(255,90,40,0.55)]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold leading-tight", children: vsMatch[2] }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: c.title }),
        c.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-sm text-muted-foreground", children: c.summary })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3", children: [
        c.location && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }), label: "地点", value: c.location }),
        c.starts_at && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }), label: "开始时间", value: fmtFull(c.starts_at) }),
        c.deadline && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }), label: "报名截止", value: fmtFull(c.deadline) }),
        c.prize && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }), label: "奖品", value: c.prize }),
        c.organizer && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-4 w-4" }), label: "主办方", value: c.organizer }),
        c.contact && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }), label: "联系方式", value: c.contact })
      ] }),
      c.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 rounded-2xl border border-border bg-surface/60 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 font-display text-sm font-semibold", children: "详细介绍" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm leading-relaxed text-foreground/90", children: c.description })
      ] }),
      c.register_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.register_url, target: "_blank", rel: "noreferrer", className: "mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-coral to-sun py-3.5 font-display text-sm font-semibold text-background shadow-lg shadow-coral/30", children: [
        "立即报名 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "explore" })
  ] });
}
function InfoTile({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm font-medium", children: value })
  ] });
}
function fmtFull(s) {
  try {
    return new Date(s).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return s;
  }
}
export {
  ContestDetailPage as component
};
