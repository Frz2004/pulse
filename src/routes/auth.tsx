import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { track, Events } from "@/lib/analytics";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode as string) === "signup" ? "signup" : "login",
    redirect: (s.redirect as string) || "/discover",
  }),
  component: AuthPage,
});

type AuthMode = "email" | "phone" | "wechat";

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(search.mode);
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const routeAfterLogin = async (userId: string | undefined) => {
    let target = search.redirect;
    if (userId) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (roleData) target = "/admin";

      const demoMode = typeof window !== "undefined" && localStorage.getItem("pulse_demo_mode") === "true";
      if (demoMode) {
        target = "/onboarding";
      } else {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, nickname, signature, onboarded")
          .eq("id", userId)
          .maybeSingle();

        const isProfileComplete = !!(profileData?.onboarded || (profileData?.nickname && profileData?.signature));
        if (!isProfileComplete && !roleData) target = "/onboarding";
      }
    }
    navigate({ to: target });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeAfterLogin(data.session.user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureProfile = async (userId: string, fallbackNickname?: string) => {
    const name = fallbackNickname?.trim() || email.split("@")[0] || "Pulse 用户";
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          nickname: name,
          onboarded: false,
          status: "active",
        },
        { onConflict: "id" },
      );

    if (error) {
      const message = error.message || "";
      if (message.includes("profiles") || message.includes("schema cache")) {
        toast.warning("账号已创建，但 Supabase 还没有 profiles 表，请先执行建表 SQL");
        return;
      }
      throw error;
    }
  };

  const handleEmailAuth = async () => {
    const mail = email.trim().toLowerCase();
    const pwd = password.trim();
    if (!/^\S+@\S+\.\S+$/.test(mail)) {
      toast.error("请输入正确的邮箱地址");
      return;
    }
    if (pwd.length < 6) {
      toast.error("密码至少 6 位");
      return;
    }
    if (mode === "signup" && nickname.trim().length < 1) {
      toast.error("请输入昵称");
      return;
    }

    setLoading("email");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: mail,
          password: pwd,
          options: {
            data: {
              nickname: nickname.trim(),
            },
          },
        });
        if (error) throw error;
        if (data.user) await ensureProfile(data.user.id, nickname);
        track(Events.SignUp, { method: "email" });
        toast.success(data.session ? "注册成功" : "注册成功，请按 Supabase 邮件设置完成验证");
        await routeAfterLogin(data.user?.id);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: mail, password: pwd });
        if (error) throw error;
        if (data.user) await ensureProfile(data.user.id);
        track(Events.SignIn, { method: "email" });
        toast.success("登录成功");
        await routeAfterLogin(data.user?.id);
      }
      try {
        localStorage.removeItem("pulse_demo_mode");
        localStorage.setItem("pulse_first_login_done", "true");
      } catch {}
    } catch (e: any) {
      toast.error(e?.message || (mode === "signup" ? "注册失败" : "登录失败"));
    } finally {
      setLoading(null);
    }
  };

  const handleWeChat = async () => {
    toast.info("微信登录暂未开通，请使用邮箱密码或手机号验证码登录");
  };

  const handleDemoLogin = async () => {
    try {
      localStorage.removeItem("pulse_profile");
      localStorage.removeItem("pulse_my_sbti");
      localStorage.setItem("pulse_demo_mode", "true");
      localStorage.setItem("pulse_first_login_done", "true");
      localStorage.setItem("pulse_profile_completed", "false");
      toast.success("演示账号已登录，正在进入资料完善");
      navigate({ to: "/onboarding", replace: true });
    } catch {
      toast.error("演示登录失败，请重试");
    }
  };

  const sendOtp = async () => {
    const normalizedPhone = phone.trim().replace(/\D/g, "");
    if (normalizedPhone.length !== 11) {
      toast.error("请输入 11 位手机号");
      return;
    }
    setLoading("sendOtp");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+86${normalizedPhone}`,
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success("验证码已发送，请查收短信");
    } catch (e: unknown) {
      toast.error("验证码发送失败，请稍后重试");
    } finally {
      setLoading(null);
    }
  };

  const verifyOtp = async () => {
    const normalizedPhone = phone.trim().replace(/\D/g, "");
    const token = otp.trim();
    if (normalizedPhone.length !== 11) {
      toast.error("请输入 11 位手机号");
      return;
    }
    if (token.length !== 6) {
      toast.error("请输入 6 位验证码");
      return;
    }
    setLoading("verifyOtp");
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+86${normalizedPhone}`,
        token,
        type: "sms",
      });
      if (error) throw error;
      track(Events.SignIn, { method: "phone_otp" });
      toast.success(mode === "signup" ? "注册成功" : "登录成功");
      try {
        localStorage.setItem("pulse_first_login_done", "true");
      } catch {}
      await routeAfterLogin(data.user?.id);
    } catch (e: unknown) {
      toast.error("验证码错误或已过期，请重新发送后再试");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mobile-page relative flex flex-col overflow-hidden bg-background text-foreground">
      <div className="absolute -left-20 -top-32 size-[420px] rounded-full bg-coral/25 blur-[140px]" />
      <div className="absolute right-[-5rem] top-40 size-[380px] rounded-full bg-mint/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-sun/15 blur-[160px]" />

      <header className="relative z-10 mx-auto w-full max-w-[430px] px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-4" /> 返回
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[430px] flex-1 flex-col px-4 pb-8 pt-8">
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-coral via-sun to-mint glow-coral">
            <Heart className="size-7 fill-background text-background" />
          </div>
          <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
            {mode === "login" ? "欢迎回来" : "加入 "}
            {mode === "signup" && <span className="font-serif-display italic text-coral">Pulse</span>}
          </h1>
        </div>

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          选择登录方式
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-surface/60 p-1 mb-5">
          <button
            type="button"
            onClick={() => setAuthMode("email")}
            className={`flex h-9 items-center justify-center rounded-xl text-sm font-medium transition ${
              authMode === "email" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            邮箱
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("phone")}
            className={`flex h-9 items-center justify-center rounded-xl text-sm font-medium transition ${
              authMode === "phone" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            手机
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("wechat")}
            className={`flex h-9 items-center justify-center rounded-xl text-sm font-medium transition ${
              authMode === "wechat" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            微信
          </button>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex h-9 items-center justify-center rounded-xl text-sm font-medium transition text-muted-foreground hover:text-foreground"
          >
            演示
          </button>
        </div>

        {authMode === "email" ? (
          <div className="space-y-3">
            {mode === "signup" && (
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 24))}
                placeholder="设置昵称"
                className="h-12 w-full rounded-2xl border border-border bg-surface/60 px-4 text-sm focus:border-coral/50 focus:outline-none"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱地址"
              type="email"
              autoComplete="email"
              className="h-12 w-full rounded-2xl border border-border bg-surface/60 px-4 text-sm focus:border-coral/50 focus:outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码（至少 6 位）"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="h-12 w-full rounded-2xl border border-border bg-surface/60 px-4 text-sm focus:border-coral/50 focus:outline-none"
            />
            <button
              onClick={handleEmailAuth}
              disabled={loading !== null}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
            >
              {loading === "email" && <Loader2 className="size-4 animate-spin" />}
              {mode === "signup" ? "注册并写入 Supabase" : "登录"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              注册后会在 Supabase Authentication 生成用户，并在 profiles 表创建资料记录。
            </p>
          </div>
        ) : authMode === "wechat" ? (
          <div className="space-y-3">
            <button
              onClick={handleWeChat}
              disabled={loading !== null}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#07C160]/90 font-semibold text-white transition hover:bg-[#07C160] active:scale-[0.99] disabled:opacity-60"
            >
              {loading === "wechat" ? <Loader2 className="size-4 animate-spin" /> : <Heart className="size-5" />}
              微信暂未开通，请使用手机号验证码登录
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="inline-flex h-12 items-center rounded-2xl border border-border bg-surface/60 px-3 text-sm">+86</div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入手机号"
                inputMode="numeric"
                className="h-12 flex-1 rounded-2xl border border-border bg-surface/60 px-4 text-sm focus:border-coral/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                type="text"
                placeholder="6 位验证码"
                inputMode="numeric"
                className="h-12 flex-1 rounded-2xl border border-border bg-surface/60 px-4 text-sm focus:border-coral/50 focus:outline-none"
              />
              <button
                onClick={sendOtp}
                disabled={loading !== null}
                className="h-12 rounded-2xl border border-coral/40 px-4 text-sm font-medium text-coral disabled:opacity-50"
              >
                {loading === "sendOtp" ? "发送中…" : otpSent ? "重新发送" : "发送验证码"}
              </button>
            </div>
            <button
              onClick={verifyOtp}
              disabled={loading !== null}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
            >
              {loading === "verifyOtp" && <Loader2 className="size-4 animate-spin" />}
              验证并登录
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              还没有账号？
              <button onClick={() => setMode("signup")} className="ml-1 font-medium text-coral">
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账号？
              <button onClick={() => setMode("login")} className="ml-1 font-medium text-coral">
                直接登录
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          继续即代表同意 <a className="underline">《用户协议》</a> 与 <a className="underline">《隐私政策》</a>
        </p>
      </main>
    </div>
  );
}

function WeChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M8.7 2C4.5 2 1 4.9 1 8.5c0 2 1.1 3.8 2.9 5L3 16l2.6-1.4c.7.2 1.5.3 2.3.4-.1-.4-.2-.9-.2-1.4 0-3.5 3.3-6.3 7.4-6.3h.7C15 4.1 12.2 2 8.7 2zm-2.6 4a.9.9 0 110 1.8.9.9 0 010-1.8zm5.2 0a.9.9 0 110 1.8.9.9 0 010-1.8zM15.5 9c-3.6 0-6.5 2.4-6.5 5.4 0 3 2.9 5.4 6.5 5.4.7 0 1.4-.1 2-.3l2.2 1.2-.6-2c1.5-1 2.4-2.6 2.4-4.3 0-3-2.9-5.4-6-5.4zm-2 3.2a.7.7 0 110 1.4.7.7 0 010-1.4zm4 0a.7.7 0 110 1.4.7.7 0 010-1.4z" />
    </svg>
  );
}
