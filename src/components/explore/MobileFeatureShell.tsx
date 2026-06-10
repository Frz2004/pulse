import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav, type BottomNavActive } from "@/components/BottomNav";

type Props = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  backTo?: string;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
  showBottomNav?: boolean;
  bottomNavActive?: BottomNavActive;
  footerPad?: boolean;
};

/** 发现 / 小游戏等移动端功能页统一外壳 */
export function MobileFeatureShell({
  title,
  subtitle,
  icon: Icon,
  backTo,
  onBack,
  backLabel = "返回",
  children,
  showBottomNav = false,
  bottomNavActive = "explore",
  footerPad = false,
}: Props) {
  return (
    <div className={`mobile-page bg-background text-foreground overflow-x-hidden ${footerPad || showBottomNav ? "pb-[84px]" : "pb-6"}`}>
      <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute top-10 -left-20 size-[420px] rounded-full bg-mint/20 blur-[120px]" />
      <div className="absolute top-32 -right-24 size-[360px] rounded-full bg-coral/15 blur-[100px]" />

      <header className="relative sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-between px-4">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {backLabel}
            </button>
          ) : backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
          ) : (
            <span className="w-16" />
          )}
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-4 text-mint" />}
            <div className="text-right">
              <span className="font-display font-bold text-sm block">{title}</span>
              {subtitle && <span className="text-[10px] text-muted-foreground">{subtitle}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[430px] px-4 pt-6">{children}</main>
      {showBottomNav && <BottomNav active={bottomNavActive} />}
    </div>
  );
}

type FeatureCardProps = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  badge?: string;
  tags?: string[];
};

export function FeatureHubCard({ to, title, description, icon: Icon, gradient, badge, tags }: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group block rounded-3xl border border-border bg-surface/60 p-5 ios-card hover:border-coral/30 transition tap-scale"
    >
      <div className="flex items-start gap-4">
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-background shadow-lg`}>
          <Icon className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            {badge && (
              <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-semibold text-coral border border-coral/25">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-border bg-background/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
