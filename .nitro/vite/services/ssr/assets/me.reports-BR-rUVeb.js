import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { H as useNavigate, A as ArrowLeft, L as Link, I as useQueryClient, F as toast } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { u as useMutation } from "./useMutation-Dm5qlno2.js";
import { a as listMyReports, l as listMyAppeals, s as submitAppeal } from "./moderation.functions-CMFeqhrQ.js";
import { F as Flag } from "./flag-g1fA_T7D.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
import { S as ShieldCheck } from "./shield-check-DHXh-Xe0.js";
import { X } from "./x-C9W7T09B.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
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
const REPORT_STATUS = {
  pending: {
    label: "待处理",
    color: "bg-muted/40 text-muted-foreground"
  },
  reviewing: {
    label: "审核中",
    color: "bg-sun/20 text-sun"
  },
  resolved: {
    label: "已处理",
    color: "bg-mint/20 text-mint"
  },
  rejected: {
    label: "驳回",
    color: "bg-rose-500/20 text-rose-300"
  }
};
const APPEAL_STATUS = {
  pending: {
    label: "待受理",
    color: "bg-muted/40 text-muted-foreground"
  },
  reviewing: {
    label: "审核中",
    color: "bg-sun/20 text-sun"
  },
  accepted: {
    label: "已通过",
    color: "bg-mint/20 text-mint"
  },
  rejected: {
    label: "未通过",
    color: "bg-rose-500/20 text-rose-300"
  }
};
const REASON_LABEL = {
  spam: "垃圾广告",
  harassment: "骚扰辱骂",
  nudity: "色情低俗",
  hate: "歧视仇恨",
  violence: "暴力血腥",
  scam: "诈骗引流",
  underage: "未成年风险",
  self_harm: "自残自杀",
  other: "其他"
};
function MyReportsPage() {
  const nav = useNavigate();
  const [tab, setTab] = reactExports.useState("reports");
  const [appealFor, setAppealFor] = reactExports.useState(null);
  const [newAppealOpen, setNewAppealOpen] = reactExports.useState(false);
  const reportsFn = useServerFn(listMyReports);
  const appealsFn = useServerFn(listMyAppeals);
  const reportsQ = useQuery({
    queryKey: ["my-reports"],
    queryFn: () => reportsFn()
  });
  const appealsQ = useQuery({
    queryKey: ["my-appeals"],
    queryFn: () => appealsFn()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-background pb-24 text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-14 max-w-3xl items-center gap-3 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
          to: "/me"
        }), className: "grid size-9 place-items-center rounded-full hover:bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 text-base font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "size-4 text-coral" }),
          " 我的举报与申诉"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setAppealFor(null);
          setNewAppealOpen(true);
        }, className: "ml-auto flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1.5 text-xs font-medium text-coral hover:bg-coral/25", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
          " 新建申诉"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-3xl gap-2 px-4 pb-3", children: ["reports", "appeals"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(k), className: `rounded-full px-4 py-1.5 text-xs font-medium transition ${tab === k ? "bg-foreground text-background" : "bg-muted/30 text-muted-foreground"}`, children: k === "reports" ? `我的举报 ${reportsQ.data?.reports.length ?? ""}` : `我的申诉 ${appealsQ.data?.appeals.length ?? ""}` }, k)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl space-y-3 px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-surface/40 p-3 text-xs text-muted-foreground", children: "我们会在 24 小时内核实你的举报;如对处理结果有异议,可以在右上角提交申诉,审核人员会重新评估。" }),
      tab === "reports" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        reportsQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "加载中…" }),
        !reportsQ.isLoading && (reportsQ.data?.reports ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: "你还没有提交过举报" }),
        (reportsQ.data?.reports ?? []).map((r) => {
          const st = REPORT_STATUS[r.status] ?? REPORT_STATUS.pending;
          const canAppeal = r.status === "rejected";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted/40 px-1.5 py-0.5 text-[10px]", children: r.target_type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: REASON_LABEL[r.reason] ?? r.reason }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(r.created_at).toLocaleString() })
                ] }),
                r.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: r.detail })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${st.color}`, children: st.label })
            ] }),
            r.resolution_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl bg-muted/20 p-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "审核反馈:" }),
              " ",
              r.resolution_note
            ] }),
            canAppeal && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setAppealFor({
                reportId: r.id,
                targetType: r.target_type,
                targetId: r.target_id
              });
              setNewAppealOpen(true);
            }, className: "mt-3 inline-flex items-center gap-1.5 rounded-full border border-coral/40 px-3 py-1.5 text-xs text-coral hover:bg-coral/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5" }),
              " 对结果申诉"
            ] })
          ] }, r.id);
        })
      ] }),
      tab === "appeals" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        appealsQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "加载中…" }),
        !appealsQ.isLoading && (appealsQ.data?.appeals ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: "你还没有提交过申诉" }),
        (appealsQ.data?.appeals ?? []).map((a) => {
          const st = APPEAL_STATUS[a.status] ?? APPEAL_STATUS.pending;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted/40 px-1.5 py-0.5 text-[10px]", children: APPEAL_KIND_LABEL[a.kind] ?? a.kind }),
                  a.target_type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.target_type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(a.created_at).toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm", children: a.reason })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${st.color}`, children: st.label })
            ] }),
            a.resolution_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl bg-muted/20 p-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "审核回复:" }),
              " ",
              a.resolution_note
            ] })
          ] }, a.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 text-center text-[11px] text-muted-foreground", children: [
        "需要查看通知?",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/notifications", className: "text-coral hover:underline", children: "前往通知中心" })
      ] })
    ] }),
    newAppealOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(AppealSheet, { initial: appealFor, onClose: () => {
      setNewAppealOpen(false);
      setAppealFor(null);
    }, onDone: () => {
      setTab("appeals");
    } })
  ] });
}
const APPEAL_KIND_LABEL = {
  report_rejected: "举报被驳回",
  content_removed: "内容被处理",
  account_action: "账号处置",
  other: "其他"
};
function AppealSheet({
  initial,
  onClose,
  onDone
}) {
  const qc = useQueryClient();
  const submit = useServerFn(submitAppeal);
  const [kind, setKind] = reactExports.useState(initial ? "report_rejected" : "content_removed");
  const [reason, setReason] = reactExports.useState("");
  const mut = useMutation({
    mutationFn: () => submit({
      data: {
        kind,
        reason: reason.trim(),
        targetType: initial?.targetType,
        targetId: initial?.targetId,
        relatedReportId: initial?.reportId
      }
    }),
    onSuccess: () => {
      toast.success("申诉已提交,我们会尽快回复");
      qc.invalidateQueries({
        queryKey: ["my-appeals"]
      });
      onDone();
      onClose();
    },
    onError: (e) => toast.error(e?.message ?? "提交失败")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] grid place-items-end bg-black/60 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-t-3xl border-t border-border bg-surface p-5 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-display text-lg font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-mint" }),
        " 提交申诉"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "grid h-9 w-9 place-items-center rounded-full bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "请客观说明申诉理由,审核人员会基于事实和社区规则重新评估。恶意刷申诉可能影响账号信用。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 gap-2", children: Object.keys(APPEAL_KIND_LABEL).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setKind(k), className: `rounded-2xl border px-3 py-2 text-xs transition ${kind === k ? "border-mint bg-mint/10 text-foreground" : "border-border/70 bg-muted/20 text-muted-foreground"}`, children: APPEAL_KIND_LABEL[k] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: reason, onChange: (e) => setReason(e.target.value.slice(0, 1e3)), placeholder: "请详细说明你的理由,至少 10 个字(最多 1000 字)", rows: 5, className: "mt-3 w-full resize-none rounded-2xl border border-border/60 bg-muted/20 p-3 text-sm outline-none focus:border-mint" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-right text-[10px] text-muted-foreground", children: [
      reason.length,
      "/1000"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => mut.mutate(), disabled: mut.isPending || reason.trim().length < 10, className: "mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mint to-brand py-3 text-sm font-semibold text-background disabled:opacity-60", children: [
      mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " 提交申诉"
    ] })
  ] }) });
}
export {
  MyReportsPage as component
};
