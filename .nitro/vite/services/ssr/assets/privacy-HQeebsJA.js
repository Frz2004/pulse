import { k as createServerFn, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { H as useNavigate, I as useQueryClient, F as toast, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { u as useMutation } from "./useMutation-Dm5qlno2.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, b as booleanType, e as enumType } from "./types-DNG0tEns.js";
import { L as Lock } from "./lock-BXO1VJd6.js";
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
const getMyPrivacy = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("8297925ca9e19496ed63f9cb1bc9f6c84e46139c12af016bb3b8a4f86002dfa2"));
const updateMyPrivacy = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  searchable: booleanType().optional(),
  allow_messages: enumType(["everyone", "matches", "none"]).optional(),
  hide_city: booleanType().optional(),
  hide_distance: booleanType().optional()
}).parse(input)).handler(createSsrRpc("48a75f03e17b5d977c59148c52aed4c94f6726032730a77a755a837e6d731292"));
function PrivacyPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchFn = useServerFn(getMyPrivacy);
  const updateFn = useServerFn(updateMyPrivacy);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["my-privacy"],
    queryFn: () => fetchFn()
  });
  const mut = useMutation({
    mutationFn: (patch) => updateFn({
      data: patch
    }),
    onSuccess: () => {
      toast.success("已更新");
      qc.invalidateQueries({
        queryKey: ["my-privacy"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "更新失败")
  });
  const s = data?.settings;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/me"
      }), className: "grid h-9 w-9 place-items-center rounded-full hover:bg-surface/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
        " 隐私与可见性"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto w-full max-w-md px-4 pb-16 pt-4", children: isLoading || !s ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "发现 & 搜索", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "允许他人通过昵称搜到我", desc: "关闭后将不在添加好友的搜索结果中出现", value: s.searchable, onChange: (v) => mut.mutate({
        searchable: v
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "谁能给我发消息", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChoiceRow, { value: s.allow_messages, options: [{
        v: "everyone",
        label: "所有人"
      }, {
        v: "matches",
        label: "仅互相喜欢"
      }, {
        v: "none",
        label: "暂不接受"
      }], onChange: (v) => mut.mutate({
        allow_messages: v
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "资料展示", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "隐藏我的城市", desc: "在他人查看你时不显示城市信息", value: s.hide_city, onChange: (v) => mut.mutate({
          hide_city: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "隐藏我与他人的距离", desc: "在雷达和卡片中不展示距离", value: s.hide_distance, onChange: (v) => mut.mutate({
          hide_distance: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 pt-2 text-[11px] text-muted-foreground", children: "更改会立即生效。已建立的聊天不会受影响。" })
    ] }) })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "px-1 pb-1.5 text-xs font-medium text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-surface/60 divide-y divide-border", children })
  ] });
}
function ToggleRow({
  label,
  desc,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: label }),
      desc && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[11px] text-muted-foreground", children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "switch", "aria-checked": value, onClick: () => onChange(!value), className: `relative h-6 w-11 shrink-0 rounded-full transition ${value ? "bg-coral" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${value ? "left-[22px]" : "left-0.5"}` }) })
  ] });
}
function ChoiceRow({
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(o.v), className: `rounded-xl px-2 py-2 text-xs transition ${value === o.v ? "bg-coral text-background shadow-sm" : "border border-border bg-background/40 text-muted-foreground hover:text-foreground"}`, children: o.label }, o.v)) }) });
}
export {
  PrivacyPage as component
};
