import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { I as useQueryClient, F as toast, T as Trophy, L as Link } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { u as useMutation } from "./useMutation-Dm5qlno2.js";
import { l as listContests, c as createContest, v as vsBrush, C as Calendar } from "./vs-brush-C8hgVoja.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { H as Header, E as EmptyState } from "./SectionChrome-DkmxgeOa.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
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
const CATS = [{
  k: "all",
  label: "全部"
}, {
  k: "basketball",
  label: "篮球"
}, {
  k: "football",
  label: "足球"
}, {
  k: "badminton",
  label: "羽毛球"
}, {
  k: "tennis",
  label: "网球"
}, {
  k: "track_field",
  label: "田径运动会"
}, {
  k: "academic",
  label: "学术竞赛"
}];
function ContestsPage() {
  const fetchList = useServerFn(listContests);
  const createFn = useServerFn(createContest);
  const qc = useQueryClient();
  const [cat, setCat] = reactExports.useState("all");
  const [open, setOpen] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["contests"],
    queryFn: () => fetchList()
  });
  const list = (data?.contests ?? []).filter((c) => cat === "all" || c.category === cat);
  const create = useMutation({
    mutationFn: (payload) => createFn({
      data: payload
    }),
    onSuccess: () => {
      toast.success("发布成功");
      setOpen(false);
      qc.invalidateQueries({
        queryKey: ["contests"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "发布失败")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "比赛公告", subtitle: "找到你的下一个高光时刻", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 mt-3 flex gap-2 overflow-x-auto pb-1", children: CATS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCat(c.k), className: `shrink-0 rounded-full border px-3 py-1.5 text-xs ${cat === c.k ? "border-coral bg-coral text-background" : "border-border bg-surface/60 text-muted-foreground"}`, children: c.label }, c.k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "加载中…" }),
        !isLoading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-6 w-6" }), text: "还没有比赛公告,做第一个发布者吧" }),
        list.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContestCard, { c }, c.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "fixed bottom-24 right-5 z-20 flex items-center gap-2 rounded-full bg-gradient-to-br from-coral to-sun px-5 py-3 text-sm font-semibold text-background shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      " 发布比赛"
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(ComposeSheet, { onClose: () => setOpen(false), onSubmit: (v) => create.mutate(v), submitting: create.isPending }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "explore" })
  ] });
}
function ContestCard({
  c
}) {
  const vsMatch = c.title.match(/^(.+?)\s*(?:vs|VS|对|对阵)\s*(.+)$/);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contests/$contestId", params: {
    contestId: c.id
  }, className: "block overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur transition hover:-translate-y-0.5 hover:border-coral/50 hover:shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 bg-gradient-to-br from-coral/40 via-sun/20 to-mint/20", children: [
      c.cover && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.cover, alt: "", className: "absolute inset-0 h-full w-full object-cover opacity-90" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground", children: c.category })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      vsMatch ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold leading-snug", children: vsMatch[1] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: vsBrush, alt: "VS", className: "h-12 w-12 drop-shadow-[0_4px_10px_rgba(255,90,40,0.5)] transition-transform group-hover:scale-110" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold leading-snug", children: vsMatch[2] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: c.title }),
      c.summary && !vsMatch && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: c.summary }),
      vsMatch && c.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-xs text-muted-foreground", children: c.summary }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
        c.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
          c.location
        ] }),
        c.deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          "截止 ",
          fmt(c.deadline)
        ] }),
        c.prize && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          c.prize
        ] })
      ] })
    ] })
  ] });
}
function ComposeSheet({
  onClose,
  onSubmit,
  submitting
}) {
  const [v, setV] = reactExports.useState({
    title: "",
    summary: "",
    description: "",
    category: "basketball",
    location: "",
    prize: "",
    organizer: "",
    contact: "",
    register_url: "",
    deadline: ""
  });
  const upd = (k) => (e) => setV((s) => ({
    ...s,
    [k]: e.target.value
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40 flex items-end bg-black/50 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "发布比赛公告" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "标题", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.title, onChange: upd("title"), placeholder: "例如:第三届校园编程马拉松" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "一句话简介", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.summary, onChange: upd("summary"), maxLength: 160 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "详细介绍", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, className: ipt, value: v.description, onChange: upd("description") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "分类", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: ipt, value: v.category, onChange: upd("category"), children: CATS.filter((c) => c.k !== "all").map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.k, children: c.label }, c.k)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "地点", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.location, onChange: upd("location") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "奖品/奖金", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.prize, onChange: upd("prize") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "主办方", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.organizer, onChange: upd("organizer") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "联系方式", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.contact, onChange: upd("contact") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "截止日期", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", className: ipt, value: v.deadline, onChange: upd("deadline") }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "报名链接 (可选)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.register_url, onChange: upd("register_url"), placeholder: "https://" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "flex-1 rounded-xl border border-border py-3 text-sm", children: "取消" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submitting || !v.title || !v.summary, onClick: () => onSubmit({
        ...v,
        deadline: v.deadline ? new Date(v.deadline).toISOString() : null,
        description: v.description || null,
        location: v.location || null,
        prize: v.prize || null,
        organizer: v.organizer || null,
        contact: v.contact || null,
        register_url: v.register_url || null
      }), className: "flex-1 rounded-xl bg-coral py-3 text-sm font-semibold text-background disabled:opacity-50", children: submitting ? "发布中…" : "发布" })
    ] })
  ] }) });
}
const ipt = "w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus:border-coral";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs text-muted-foreground", children: label }),
    children
  ] });
}
function fmt(s) {
  try {
    return new Date(s).toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit"
    });
  } catch {
    return s;
  }
}
export {
  ContestsPage as component
};
