import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { F as toast } from "./router-qNgQXy3C.js";
import { r as reportContent, b as blockUser } from "./moderation.functions-CMFeqhrQ.js";
import { F as Flag } from "./flag-g1fA_T7D.js";
import { X } from "./x-C9W7T09B.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
const REASONS = [
  { value: "spam", label: "垃圾广告 / 营销刷屏" },
  { value: "harassment", label: "骚扰 / 辱骂攻击" },
  { value: "nudity", label: "色情低俗 / 露骨内容" },
  { value: "hate", label: "歧视 / 仇恨言论" },
  { value: "violence", label: "暴力 / 血腥" },
  { value: "scam", label: "诈骗 / 引流" },
  { value: "underage", label: "未成年相关风险" },
  { value: "self_harm", label: "自残 / 自杀相关" },
  { value: "other", label: "其他(请补充说明)" }
];
function ReportSheet({ open, onClose, targetType, targetId, authorId }) {
  const [reason, setReason] = reactExports.useState("spam");
  const [detail, setDetail] = reactExports.useState("");
  const [alsoBlock, setAlsoBlock] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const report = useServerFn(reportContent);
  const block = useServerFn(blockUser);
  if (!open) return null;
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await report({
        data: {
          targetType,
          targetId,
          reason,
          detail: detail.trim() || void 0
        }
      });
      if (alsoBlock && authorId) {
        try {
          await block({ data: { targetId: authorId } });
        } catch {
        }
      }
      toast.success("举报已提交,我们会尽快核实");
      onClose();
      setDetail("");
      setAlsoBlock(false);
    } catch (e) {
      toast.error(e?.message ?? "举报失败");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] grid place-items-end bg-black/60 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full max-w-md rounded-t-3xl border-t border-border bg-surface p-5 text-foreground shadow-2xl",
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-display text-lg font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-5 w-5 text-coral" }),
            " 举报"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "grid h-9 w-9 place-items-center rounded-full bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "请选择最贴近的原因,审核人员将在 24 小时内处理。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-1 gap-2", children: REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setReason(r.value),
            className: `flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left text-sm transition ${reason === r.value ? "border-coral bg-coral/10 text-foreground" : "border-border/70 bg-muted/20 text-muted-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-3 w-3 rounded-full border ${reason === r.value ? "border-coral bg-coral" : "border-border"}` })
            ]
          },
          r.value
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: detail,
            onChange: (e) => setDetail(e.target.value.slice(0, 500)),
            placeholder: "补充说明(选填,最多 500 字)",
            rows: 3,
            className: "mt-3 w-full resize-none rounded-2xl border border-border/60 bg-muted/20 p-3 text-sm outline-none focus:border-coral"
          }
        ),
        authorId && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: alsoBlock,
              onChange: (e) => setAlsoBlock(e.target.checked),
              className: "h-4 w-4 accent-coral"
            }
          ),
          "同时拉黑该用户,以后不再看到 Ta 的内容"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: submit,
            disabled: busy,
            className: "mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun py-3 text-sm font-semibold text-background disabled:opacity-60",
            children: [
              busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
              " 提交举报"
            ]
          }
        )
      ]
    }
  ) });
}
export {
  ReportSheet as R
};
