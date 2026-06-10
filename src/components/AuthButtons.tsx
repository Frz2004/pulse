import { Link } from "@tanstack/react-router";
import { forwardRef, useEffect, useState, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/** 统一霓虹机能风按钮：玻璃描边（ghost） + 珊瑚红硬投影（coral）。
 *  作为 <button> 使用；如需 <Link>，用 NeonLinkButton。 */
export type NeonVariant = "ghost" | "coral";

const sizeMap: Record<NeonVariant, string> = {
  ghost: "px-7 py-2.5",
  coral: "px-7 py-2.5",
};

export function NeonInner({ variant, children }: { variant: NeonVariant; children: ReactNode }) {
  if (variant === "ghost") {
    return (
      <>
        <span className="absolute inset-0 rounded-[10px] border-2 border-[#7F77DD] transition-colors" />
        <span className="relative font-semibold tracking-wide text-sm text-[#7F77DD] inline-flex items-center gap-2">{children}</span>
      </>
    );
  }
  return (
    <>
      <span className="absolute inset-0 rounded-[10px] bg-[#E54848]" />
      <span className="relative font-semibold tracking-wide text-sm text-white inline-flex items-center gap-2">{children}</span>
    </>
  );
}

const baseCls = "group relative inline-flex items-center cursor-pointer transition-all duration-300 active:scale-95";
const hoverCls: Record<NeonVariant, string> = {
  ghost: "",
  coral: "",
};

export function neonButtonClass(variant: NeonVariant = "ghost", extra = "") {
  return `${baseCls} ${sizeMap[variant]} ${hoverCls[variant]} ${extra}`;
}

export const NeonButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button"> & { variant?: NeonVariant }>(
  ({ variant = "ghost", className = "", children, ...rest }, ref) => (
    <button ref={ref} className={neonButtonClass(variant, className)} {...rest}>
      <NeonInner variant={variant}>{children}</NeonInner>
    </button>
  ),
);
NeonButton.displayName = "NeonButton";

export function AuthButtons() {
  const [user, setUser] = useState<{ id: string; avatar?: string | null; name?: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async (uid: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("photos, main_idx, nickname")
        .eq("id", uid)
        .maybeSingle();
      if (!active) return;
      const photos = Array.isArray(data?.photos) ? (data!.photos as string[]) : [];
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
    return (
      <Link
        to="/me"
        aria-label="个人主页"
        className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full overflow-hidden border-2 border-[#7F77DD]/60 bg-gradient-to-br from-[#E54848] to-[#7F77DD] text-white font-semibold transition hover:scale-105"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="头像" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm">{initial}</span>
        )}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <Link
        to="/auth"
        search={{ mode: "login", redirect: "/discover" }}
        className={neonButtonClass("ghost")}
      >
        <NeonInner variant="ghost">登录</NeonInner>
      </Link>
      <Link
        to="/auth"
        search={{ mode: "signup", redirect: "/onboarding" }}
        className={neonButtonClass("coral")}
      >
        <NeonInner variant="coral">注册</NeonInner>
      </Link>
    </div>
  );
}