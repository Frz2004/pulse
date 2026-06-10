import { N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { L as Link, a as ChevronLeft } from "./router-qNgQXy3C.js";
function Header({ title, subtitle, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-3 px-5 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-coral to-sun text-background", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-semibold leading-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: subtitle })
    ] })
  ] }) });
}
function EmptyState({ icon, text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid place-items-center rounded-2xl border border-dashed border-border bg-surface/30 px-6 py-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 grid h-12 w-12 place-items-center rounded-full bg-surface/60 text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: text })
  ] });
}
export {
  EmptyState as E,
  Header as H
};
