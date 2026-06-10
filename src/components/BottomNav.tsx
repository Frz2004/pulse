import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, MessageCircle, Plus, User, Users } from "lucide-react";

export type BottomNavActive = "community" | "explore" | "games" | "me" | "messages";

/**
 * Unified mobile bottom navigation for the matching-first app flow.
 * The center "+" keeps an optional local action, otherwise it sends users
 * to onboarding so they can quickly improve their profile quality.
 */
export function BottomNav({
  active,
  onCompose,
}: {
  active: BottomNavActive;
  onCompose?: () => void;
}) {
  const nav = useNavigate();
  const items = [
    { key: "community", to: "/discover", icon: Users, label: "匹配" },
    { key: "explore", to: "/explore", icon: Compass, label: "发现" },
    { type: "compose" as const },
    { key: "messages", to: "/messages", icon: MessageCircle, label: "消息" },
    { key: "me", to: "/me", icon: User, label: "我的" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/82 backdrop-blur-2xl safe-bottom supports-[backdrop-filter]:bg-background/68">
      <div className="mx-auto grid h-[68px] max-w-[430px] grid-cols-5 items-center px-2">
        {items.map((it) => {
          if ("type" in it && it.type === "compose") {
            return (
              <button
                key="compose"
                onClick={() => {
                  if (onCompose) onCompose();
                  else nav({ to: "/onboarding" });
                }}
                aria-label="完善资料"
                className="flex min-h-[56px] items-center justify-center tap-scale"
              >
                <span className="size-12 rounded-full bg-gradient-to-br from-coral to-sun text-background shadow-lg glow-coral flex items-center justify-center active:scale-95 transition -mt-4">
                  <Plus className="size-6" />
                </span>
              </button>
            );
          }
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => nav({ to: it.to })}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] tap-scale ${
                isActive ? "text-coral" : "text-muted-foreground"
              }`}
              aria-label={it.label}
            >
              <it.icon className="size-5" />
              {it.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}