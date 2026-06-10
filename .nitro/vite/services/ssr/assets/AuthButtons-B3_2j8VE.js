import { N as jsxRuntimeExports, X as reactExports } from "./server-ChSCHK5Z.js";
import { L as Link } from "./router-qNgQXy3C.js";
import { s as supabase } from "./client-C8UrIk37.js";
const sizeMap = {
  ghost: "px-7 py-2.5",
  coral: "px-7 py-2.5"
};
function NeonInner({ variant, children }) {
  if (variant === "ghost") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-[10px] border-2 border-[#7F77DD] transition-colors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative font-semibold tracking-wide text-sm text-[#7F77DD] inline-flex items-center gap-2", children })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-[10px] bg-[#E54848]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative font-semibold tracking-wide text-sm text-white inline-flex items-center gap-2", children })
  ] });
}
const baseCls = "group relative inline-flex items-center cursor-pointer transition-all duration-300 active:scale-95";
const hoverCls = {
  ghost: "",
  coral: ""
};
function neonButtonClass(variant = "ghost", extra = "") {
  return `${baseCls} ${sizeMap[variant]} ${hoverCls[variant]} ${extra}`;
}
const NeonButton = reactExports.forwardRef(
  ({ variant = "ghost", className = "", children, ...rest }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ref, className: neonButtonClass(variant, className), ...rest, children: /* @__PURE__ */ jsxRuntimeExports.jsx(NeonInner, { variant, children }) })
);
NeonButton.displayName = "NeonButton";
function AuthButtons() {
  const [user, setUser] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let active = true;
    const load = async (uid) => {
      const { data } = await supabase.from("profiles").select("photos, main_idx, nickname").eq("id", uid).maybeSingle();
      if (!active) return;
      const photos = Array.isArray(data?.photos) ? data.photos : [];
      const idx = data?.main_idx ?? 0;
      setUser({ id: uid, avatar: photos[idx] ?? photos[0] ?? null, name: data?.nickname ?? null });
    };
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) load(data.session.user.id);
      else setUser(null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) load(session.user.id);
      else setUser(null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  if (user) {
    const initial = (user.name ?? "我").slice(0, 1).toUpperCase();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/me",
        "aria-label": "个人主页",
        className: "group relative inline-flex h-11 w-11 items-center justify-center rounded-full overflow-hidden border-2 border-[#7F77DD]/60 bg-gradient-to-br from-[#E54848] to-[#7F77DD] text-white font-semibold transition hover:scale-105",
        children: user.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar, alt: "头像", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: initial })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/auth",
        search: { mode: "login", redirect: "/discover" },
        className: neonButtonClass("ghost"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(NeonInner, { variant: "ghost", children: "登录" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/auth",
        search: { mode: "signup", redirect: "/onboarding" },
        className: neonButtonClass("coral"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(NeonInner, { variant: "coral", children: "注册" })
      }
    )
  ] });
}
export {
  AuthButtons as A,
  NeonButton as N,
  NeonInner as a,
  neonButtonClass as n
};
