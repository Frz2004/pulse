import { k as createServerFn, X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { C as CalendarDays, I as useQueryClient, F as toast } from "./router-qNgQXy3C.js";
import { u as useMutation } from "./useMutation-Dm5qlno2.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, n as numberType } from "./types-DNG0tEns.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { H as Header, E as EmptyState } from "./SectionChrome-DkmxgeOa.js";
import { U as Users } from "./users-DxsiCKVk.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
import { C as Clock } from "./clock-BGJF3hqR.js";
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
import "./message-circle-DLgZCMdI.js";
import "./plus-Bydlo4jQ.js";
const listVenues = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a699a0a22ecf0998ad99b7595bc01f9a725ca6de5c8f07cabf8d30e63c2f0b5e"));
const listMyBookings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("97cee43405113fa441cb9db759874e86733e0c903b2e5e42e151286032ab11bc"));
const listVenueBookings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  venue_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("157792d120bf076cc4e3f9daef8a4e14bd032dca53e17271a333ecf5ae906a43"));
const BookingInput = objectType({
  venue_id: stringType().uuid(),
  starts_at: stringType().min(1),
  ends_at: stringType().min(1),
  purpose: stringType().min(2).max(200),
  attendees: numberType().int().min(1).max(500).default(1),
  contact: stringType().max(120).optional().nullable()
}).refine((v) => new Date(v.ends_at).getTime() > new Date(v.starts_at).getTime(), {
  message: "结束时间必须晚于开始时间",
  path: ["ends_at"]
});
const createBooking = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => BookingInput.parse(input)).handler(createSsrRpc("f8657cab28fa92f0330a835503a063511cf7237a2c96fe4f00c44fa223498323"));
const cancelBooking = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("a36736d035f299f267d7aa22a140224ff781c871fb35d4e1d73e1bb3a1faab37"));
function VenuesPage() {
  const fetchVenues = useServerFn(listVenues);
  const fetchMine = useServerFn(listMyBookings);
  const [picked, setPicked] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("all");
  const venues = useQuery({
    queryKey: ["venues"],
    queryFn: () => fetchVenues()
  });
  const mine = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetchMine(),
    enabled: tab === "mine"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "场地预约", subtitle: "校园资源,一键搞定", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 inline-flex rounded-full border border-border bg-surface/60 p-1 text-xs", children: ["all", "mine"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `rounded-full px-4 py-1.5 ${tab === t ? "bg-coral text-background" : "text-muted-foreground"}`, children: t === "all" ? "全部场地" : "我的预约" }, t)) }),
      tab === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
        (venues.data?.venues ?? []).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPicked(v), className: "overflow-hidden rounded-2xl border border-border bg-surface/70 p-4 text-left backdrop-blur transition hover:border-coral", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-coral/15 px-2 py-0.5 text-[10px] text-coral", children: v.category }),
            v.capacity && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
              v.capacity,
              "人"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-base font-semibold", children: v.name }),
          v.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground", children: v.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
            v.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              v.location
            ] }),
            v.open_hours && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              v.open_hours
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs font-medium text-coral", children: "立即预约 →" })
        ] }, v.id)),
        venues.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "加载中…" })
      ] }),
      tab === "mine" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        mine.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "加载中…" }),
        !mine.isLoading && (mine.data?.bookings ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-6 w-6" }), text: "还没有预约,去全部场地看看吧" }),
        (mine.data?.bookings ?? []).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(MyBookingCard, { b, onCancel: () => mine.refetch() }, b.id))
      ] })
    ] }),
    picked && /* @__PURE__ */ jsxRuntimeExports.jsx(BookSheet, { venue: picked, onClose: () => setPicked(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "explore" })
  ] });
}
function MyBookingCard({
  b,
  onCancel
}) {
  const cancelFn = useServerFn(cancelBooking);
  const m = useMutation({
    mutationFn: () => cancelFn({
      data: {
        id: b.id
      }
    }),
    onSuccess: () => {
      toast.success("已取消");
      onCancel();
    },
    onError: (e) => toast.error(e?.message ?? "操作失败")
  });
  const colors = {
    pending: "bg-sun/15 text-sun",
    approved: "bg-mint/15 text-mint",
    rejected: "bg-destructive/15 text-destructive",
    cancelled: "bg-muted text-muted-foreground"
  };
  const labels = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已驳回",
    cancelled: "已取消"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-display text-base font-semibold", children: b.venue_name ?? "场地" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
          "用途:",
          b.purpose
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] ${colors[b.status]}`, children: labels[b.status] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[11px] text-muted-foreground", children: [
      fmtTime(b.starts_at),
      " – ",
      fmtTime(b.ends_at),
      " · ",
      b.attendees,
      " 人"
    ] }),
    b.review_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
      "备注: ",
      b.review_note
    ] }),
    (b.status === "pending" || b.status === "approved") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => m.mutate(), disabled: m.isPending, className: "mt-3 text-xs text-destructive", children: "取消预约" })
  ] });
}
function BookSheet({
  venue,
  onClose
}) {
  const createFn = useServerFn(createBooking);
  const fetchSlots = useServerFn(listVenueBookings);
  const qc = useQueryClient();
  const [starts, setStarts] = reactExports.useState("");
  const [ends, setEnds] = reactExports.useState("");
  const [purpose, setPurpose] = reactExports.useState("");
  const [attendees, setAttendees] = reactExports.useState(1);
  const [contact, setContact] = reactExports.useState("");
  const slots = useQuery({
    queryKey: ["venue-slots", venue.id],
    queryFn: () => fetchSlots({
      data: {
        venue_id: venue.id
      }
    })
  });
  const m = useMutation({
    mutationFn: () => createFn({
      data: {
        venue_id: venue.id,
        starts_at: new Date(starts).toISOString(),
        ends_at: new Date(ends).toISOString(),
        purpose,
        attendees,
        contact: contact || null
      }
    }),
    onSuccess: () => {
      toast.success("预约已提交,等待审核");
      qc.invalidateQueries({
        queryKey: ["my-bookings"]
      });
      onClose();
    },
    onError: (e) => toast.error(e?.message ?? "预约失败")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40 flex items-end bg-black/50 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: venue.name }),
        venue.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
          venue.location,
          " · ",
          venue.open_hours
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "grid h-8 w-8 place-items-center rounded-full border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    (slots.data?.slots ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-surface/60 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "已被占用的时段:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 space-y-0.5 text-[11px]", children: (slots.data?.slots ?? []).slice(0, 6).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        fmtTime(s.starts_at),
        " – ",
        fmtTime(s.ends_at)
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "开始时间", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", className: ipt, value: starts, onChange: (e) => setStarts(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "结束时间", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", className: ipt, value: ends, onChange: (e) => setEnds(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "使用人数", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, className: ipt, value: attendees, onChange: (e) => setAttendees(parseInt(e.target.value) || 1) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "用途", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: purpose, onChange: (e) => setPurpose(e.target.value), placeholder: "如:小组讨论 / 社团排练" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "联系方式 (可选)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: ipt, value: contact, onChange: (e) => setContact(e.target.value), placeholder: "微信/电话" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: m.isPending || !starts || !ends || !purpose, onClick: () => m.mutate(), className: "mt-5 w-full rounded-xl bg-coral py-3 text-sm font-semibold text-background disabled:opacity-50", children: m.isPending ? "提交中…" : "提交预约" })
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
function fmtTime(s) {
  try {
    return new Date(s).toLocaleString("zh-CN", {
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
  VenuesPage as component
};
