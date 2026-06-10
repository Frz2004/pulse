import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, e as Route, H as useNavigate, L as Link, A as ArrowLeft, F as toast, G as track, E as Events } from "./router-qNgQXy3C.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { P as Phone } from "./phone-b6RDMCGO.js";
import { K as KeyRound } from "./key-round-Dq6Iq0Wd.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./types-DNG0tEns.js";
import "./index-m6JgwYlt.js";
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState(search.mode);
  const [tab, setTab] = reactExports.useState("email");
  const [loading, setLoading] = reactExports.useState(null);
  const routeAfterLogin = async (userId) => {
    let target = search.redirect;
    if (userId) {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (data) target = "/admin";
    }
    navigate({
      to: target
    });
  };
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) routeAfterLogin(data.session.user.id);
    });
  }, []);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const handleEmail = async () => {
    if (!email.includes("@") || password.length < 6) {
      toast.error("请填写有效邮箱和至少 6 位密码");
      return;
    }
    setLoading("email");
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`
          }
        });
        if (error) throw error;
        track(Events.SignUp, {
          method: "email"
        });
        toast.success("注册成功，请前往邮箱完成验证后再登录");
        setMode("login");
      } else {
        const {
          data,
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        track(Events.SignIn, {
          method: "email"
        });
        toast.success("登录成功");
        await routeAfterLogin(data.user?.id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "操作失败");
    } finally {
      setLoading(null);
    }
  };
  const [phone, setPhone] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [otpSent, setOtpSent] = reactExports.useState(false);
  const fullPhone = () => `+86${phone}`;
  const sendOtp = async () => {
    if (phone.length !== 11) {
      toast.error("请输入 11 位手机号");
      return;
    }
    setLoading("sendOtp");
    try {
      const {
        error
      } = await supabase.auth.signInWithOtp({
        phone: fullPhone()
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success("验证码已发送");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "发送失败，请确认短信服务已配置");
    } finally {
      setLoading(null);
    }
  };
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("请输入 6 位验证码");
      return;
    }
    setLoading("verifyOtp");
    try {
      const {
        data,
        error
      } = await supabase.auth.verifyOtp({
        phone: fullPhone(),
        token: otp,
        type: "sms"
      });
      if (error) throw error;
      track(Events.SignIn, {
        method: "phone_otp"
      });
      toast.success("登录成功");
      await routeAfterLogin(data.user?.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "验证失败");
    } finally {
      setLoading(null);
    }
  };
  const handleGoogle = async () => {
    setLoading("google");
    try {
      track(Events.SignIn, {
        method: "google",
        stage: "started"
      });
      const redirectTo = `${window.location.origin}/auth?redirect=${encodeURIComponent(search.redirect)}`;
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo
        }
      });
      if (error) throw error;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Google 登录失败");
      setLoading(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -left-20 size-[420px] rounded-full bg-coral/25 blur-[140px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 -right-20 size-[380px] rounded-full bg-mint/20 blur-[140px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-sun/15 blur-[160px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "relative z-10 mx-auto w-full max-w-md px-6 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " 返回"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 flex-1 mx-auto w-full max-w-md px-6 pt-10 pb-10 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto size-16 rounded-3xl bg-gradient-to-br from-coral via-sun to-mint flex items-center justify-center glow-coral mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-7 text-background fill-background" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold tracking-tight", children: [
          mode === "login" ? "欢迎回来" : "加入 ",
          mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display italic text-coral", children: "Pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: mode === "login" ? "登录继续遇见同频的人" : "30 秒开启你的心动之旅" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGoogle, disabled: loading !== null, className: "w-full h-12 rounded-2xl bg-white text-[#1f1f1f] font-semibold flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.99] transition disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
          loading === "google" ? "正在跳转 Google…" : `使用 Google ${mode === "login" ? "登录" : "注册"}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toast.info("微信登录正在接入中，敬请期待"), disabled: loading !== null, className: "w-full h-12 rounded-2xl bg-[#07C160]/90 text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#07C160] active:scale-[0.99] transition disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WeChatIcon, {}),
          "使用微信",
          mode === "login" ? "登录" : "注册",
          "（即将开放）"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
        "或使用账号",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 p-1 rounded-2xl bg-surface/60 border border-border mb-5", children: ["email", "phone"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t), className: `flex-1 h-9 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1.5 ${tab === t ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: [
        t === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }),
        t === "email" ? "邮箱密码" : "手机号"
      ] }, t)) }),
      tab === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "邮箱地址", autoComplete: "email", className: "w-full h-12 px-4 rounded-2xl border border-border bg-surface/60 text-sm focus:outline-none focus:border-coral/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: mode === "signup" ? "设置至少 6 位密码" : "密码", autoComplete: mode === "signup" ? "new-password" : "current-password", className: "w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-surface/60 text-sm focus:outline-none focus:border-coral/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleEmail, disabled: loading !== null, className: "w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold glow-coral disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2", children: [
          loading === "email" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          mode === "login" ? "登录" : "注册账号"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-12 items-center px-3 rounded-2xl border border-border bg-surface/60 text-sm", children: "+86" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)), placeholder: "请输入手机号", inputMode: "numeric", className: "flex-1 h-12 px-4 rounded-2xl border border-border bg-surface/60 text-sm focus:outline-none focus:border-coral/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)), placeholder: "6 位短信验证码", inputMode: "numeric", className: "flex-1 h-12 px-4 rounded-2xl border border-border bg-surface/60 text-sm focus:outline-none focus:border-coral/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: sendOtp, disabled: phone.length !== 11 || loading !== null, className: "h-12 px-4 rounded-2xl border border-coral/40 text-coral text-sm font-medium disabled:opacity-50", children: loading === "sendOtp" ? "发送中…" : otpSent ? "重新发送" : "获取验证码" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: verifyOtp, disabled: otp.length !== 6 || loading !== null, className: "w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold glow-coral disabled:opacity-40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2", children: [
          loading === "verifyOtp" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          "手机号",
          mode === "login" ? "登录" : "注册"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center text-sm text-muted-foreground", children: mode === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "还没有账号？",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("signup"), className: "text-coral font-medium ml-1", children: "立即注册" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "已有账号？",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("login"), className: "text-coral font-medium ml-1", children: "直接登录" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-[11px] text-muted-foreground leading-relaxed", children: [
        "继续即代表同意 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "underline", children: "《用户协议》" }),
        " 与 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "underline", children: "《隐私政策》" })
      ] })
    ] })
  ] });
}
function WeChatIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "size-5", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8.7 2C4.5 2 1 4.9 1 8.5c0 2 1.1 3.8 2.9 5L3 16l2.6-1.4c.7.2 1.5.3 2.3.4-.1-.4-.2-.9-.2-1.4 0-3.5 3.3-6.3 7.4-6.3h.7C15 4.1 12.2 2 8.7 2zm-2.6 4a.9.9 0 110 1.8.9.9 0 010-1.8zm5.2 0a.9.9 0 110 1.8.9.9 0 010-1.8zM15.5 9c-3.6 0-6.5 2.4-6.5 5.4 0 3 2.9 5.4 6.5 5.4.7 0 1.4-.1 2-.3l2.2 1.2-.6-2c1.5-1 2.4-2.6 2.4-4.3 0-3-2.9-5.4-6-5.4zm-2 3.2a.7.7 0 110 1.4.7.7 0 010-1.4zm4 0a.7.7 0 110 1.4.7.7 0 010-1.4z" }) });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "size-5", "aria-hidden": true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 22c2.7 0 5-.9 6.7-2.5l-3.3-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0012 22z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M6.4 13.9a6 6 0 010-3.8V7.5H3a10 10 0 000 9l3.4-2.6z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003 7.5l3.4 2.6C7.2 7.7 9.4 5.9 12 5.9z" })
  ] });
}
export {
  AuthPage as component
};
