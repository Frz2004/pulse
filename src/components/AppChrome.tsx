import { useRouterState, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";

// Routes that should NOT show the global back button (primary tabs + auth flows + landing)
const PRIMARY_ROUTES = ["/", "/community", "/explore", "/messages", "/me"];
const HIDE_BACK_PREFIXES = ["/auth", "/onboarding"];

function shouldHideBack(pathname: string) {
  if (PRIMARY_ROUTES.includes(pathname)) return true;
  return HIDE_BACK_PREFIXES.some((p) => pathname.startsWith(p));
}

export function GlobalBackButton() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  if (shouldHideBack(path)) return null;
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.history.back();
        else router.navigate({ to: "/" });
      }}
      aria-label="返回上一页"
      className="fixed left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/72 text-foreground shadow-lg backdrop-blur-2xl transition hover:scale-105 active:scale-95"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

const THEME_KEY = "pulse-theme";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到白昼模式" : "切换到夜间模式"}
      title={theme === "dark" ? "白昼模式" : "夜间模式"}
      className="fixed right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/72 text-foreground shadow-lg backdrop-blur-2xl transition hover:scale-105 active:scale-95"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}