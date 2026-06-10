import { k as createServerFn, X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { I as useQueryClient, F as toast, B as Briefcase } from "./router-qNgQXy3C.js";
import { u as useMutation } from "./useMutation-Dm5qlno2.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, a as arrayType, e as enumType } from "./types-DNG0tEns.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { H as Header, E as EmptyState } from "./SectionChrome-DkmxgeOa.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
import { C as Coins } from "./coins-Ctq2HWCO.js";
import { P as Phone } from "./phone-b6RDMCGO.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-C8UrIk37.js";
import "./index-m6JgwYlt.js";
import "./users-DxsiCKVk.js";
import "./message-circle-DLgZCMdI.js";
const listJobs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  category: stringType().optional()
}).parse(input ?? {})).handler(createSsrRpc("0f6b44b459f0f5a7154aecdbd6de5f39fc93825d0d32caf19f26936089e5a107"));
const getJobContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0ca75b8d48f4822632237ac98fef9bae31c7d4d6e26e2fd50bc70c9ab5bbfed6"));
const JobInput = objectType({
  title: stringType().min(2).max(80),
  summary: stringType().min(2).max(160),
  description: stringType().max(2e3).optional().nullable(),
  category: enumType(["parttime", "intern", "fulltime", "freelance", "collab"]).default("parttime"),
  location: stringType().max(80).optional().nullable(),
  salary: stringType().max(60).optional().nullable(),
  contact: stringType().min(1).max(120),
  tags: arrayType(stringType().min(1).max(20)).max(8).default([]),
  expires_at: stringType().optional().nullable()
});
const createJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => JobInput.parse(input)).handler(createSsrRpc("ab0e7c09b47d7ada2f8e5674d2a34621a0be302c11db7c58ae029c8e93152a4c"));
const CATS = [{
  k: "all",
  label: "全部"
}, {
  k: "parttime",
  label: "兼职"
}, {
  k: "intern",
  label: "实习"
}, {
  k: "fulltime",
  label: "全职"
}, {
  k: "freelance",
  label: "私活"
}, {
  k: "collab",
  label: "合作"
}];
function JobsPage() {
  const fetchList = useServerFn(listJobs);
  const createFn = useServerFn(createJob);
  const qc = useQueryClient();
  const [cat, setCat] = reactExports.useState("all");
  const [open, setOpen] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["jobs", cat],
    queryFn: () => fetchList({
      data: {
        category: cat
      }
    })
  });
  const create = useMutation({
    mutationFn: (p) => createFn({
      data: p
    }),
    onSuccess: () => {
      toast.success("发布成功");
      setOpen(false);
      qc.invalidateQueries({
        queryKey: ["jobs"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "发布失败")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "实习与工作", subtitle: "兼职/实习/合作 一站搞定", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 mt-3 flex gap-2 overflow-x-auto pb-1", children: CATS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCat(c.k), className: `shrink-0 rounded-full border px-3 py-1.5 text-xs ${cat === c.k ? "border-mint bg-mint text-background" : "border-border bg-surface/60 text-muted-foreground"}`, children: c.label }, c.k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "加载中…" }),
        !isLoading && (data?.jobs ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-6 w-6" }), text: "还没有发布需求,做第一个发布者吧" }),
        (data?.jobs ?? []).map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(JobCard, { j }, j.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "fixed bottom-24 right-5 z-20 flex items-center gap-2 rounded-full bg-gradient-to-br from-mint to-brand px-5 py-3 text-sm font-semibold text-background shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      " 发布需求"
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(Compose, { onClose: () => setOpen(false), onSubmit: (v) => create.mutate(v), submitting: create.isPending }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "explore" })
  ] });
}
function JobCard({
  j
}) {
  const fetchContact = useServerFn(getJobContact);
  const [contact, setContact] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const reveal = async () => {
    if (contact || loading) return;
    setLoading(true);
    try {
      const r = await fetchContact({
        data: {
          id: j.id
        }
      });
      setContact(r.contact);
    } catch (e) {
      toast.error(e?.message ?? "获取联系方式失败");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-display text-base font-semibold", children: j.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: j.summary })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-mint/15 px-2 py-0.5 text-[10px] text-mint", children: j.category })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
      j.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
        j.location
      ] }),
      j.salary && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-coral", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-3 w-3" }),
        j.salary
      ] }),
      contact ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
        contact
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: reveal, disabled: loading, className: "inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-mint hover:bg-mint/10 disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
        loading ? "加载中…" : "查看联系方式"
      ] })
    ] }),
    Array.isArray(j.tags) && j.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: j.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground", children: [
      "#",
      t
    ] }, t)) })
  ] });
}
const ipt = "w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus:border-mint";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs text-muted-foreground", children: label }),
    children
  ] });
}
function Compose({
  onClose,
  onSubmit,
  submitting
}) {
  const [v, setV] = reactExports.useState({
    title: "",
    summary: "",
    description: "",
    category: "parttime",
    location: "",
    salary: "",
    contact: "",
    tagsText: ""
  });
  const upd = (k) => (e) => setV((s) => ({
    ...s,
    [k]: e.target.value
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40 flex items-end bg-black/50 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "发布实习/工作" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "标题", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.title, onChange: upd("title"), placeholder: "例如:周末活动摄影助理" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "一句话摘要", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.summary, onChange: upd("summary"), maxLength: 160 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "详细描述", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, className: ipt, value: v.description, onChange: upd("description") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "类型", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: ipt, value: v.category, onChange: upd("category"), children: CATS.filter((c) => c.k !== "all").map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.k, children: c.label }, c.k)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "地点/远程", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.location, onChange: upd("location") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "薪资", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.salary, onChange: upd("salary"), placeholder: "如 150元/天" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "联系方式", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.contact, onChange: upd("contact"), placeholder: "微信/电话" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "标签 (逗号分隔)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: v.tagsText, onChange: upd("tagsText"), placeholder: "如 设计,周末,急" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "flex-1 rounded-xl border border-border py-3 text-sm", children: "取消" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submitting || !v.title || !v.summary || !v.contact, onClick: () => onSubmit({
        title: v.title,
        summary: v.summary,
        description: v.description || null,
        category: v.category,
        location: v.location || null,
        salary: v.salary || null,
        contact: v.contact,
        tags: v.tagsText.split(/[,，]/).map((t) => t.trim()).filter(Boolean).slice(0, 8)
      }), className: "flex-1 rounded-xl bg-mint py-3 text-sm font-semibold text-background disabled:opacity-50", children: submitting ? "发布中…" : "发布" })
    ] })
  ] }) });
}
export {
  JobsPage as component
};
