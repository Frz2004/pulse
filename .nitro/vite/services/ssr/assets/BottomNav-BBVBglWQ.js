import { N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, H as useNavigate, L as Link } from "./router-qNgQXy3C.js";
import { U as Users } from "./users-DxsiCKVk.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ]
];
const Compass = createLucideIcon("compass", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function BottomNav({
  active,
  onCompose
}) {
  const nav = useNavigate();
  const items = [
    { key: "community", to: "/community", icon: Users, label: "社区" },
    { key: "explore", to: "/explore", icon: Compass, label: "发现" },
    { type: "compose" },
    { key: "messages", to: "/messages", icon: MessageCircle, label: "消息" },
    { key: "me", to: "/me", icon: User, label: "我的" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-30 backdrop-blur-xl bg-background/85 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl grid grid-cols-5 h-16 items-center", children: items.map((it) => {
    if ("type" in it && it.type === "compose") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            if (onCompose) onCompose();
            else nav({ to: "/community", search: { compose: 1 } });
          },
          "aria-label": "发布内容",
          className: "flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-12 rounded-full bg-gradient-to-br from-coral to-sun text-background shadow-lg glow-coral flex items-center justify-center active:scale-95 transition -mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-6" }) })
        },
        "compose"
      );
    }
    const isActive = it.key === active;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: it.to,
        className: `flex flex-col items-center justify-center gap-0.5 text-[10px] ${isActive ? "text-coral" : "text-muted-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "size-5" }),
          it.label
        ]
      },
      it.key
    );
  }) }) });
}
export {
  BottomNav as B,
  User as U
};
