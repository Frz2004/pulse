import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Trophy, Briefcase, CalendarDays, Radio,
  ChevronRight, ChevronLeft, LayoutGrid,
} from "lucide-react";

const HIDDEN_ROUTES = ["/auth", "/onboarding", "/admin"];

const ITEMS = [
  { to: "/contests", label: "比赛公告", icon: Trophy, hue: "from-coral to-sun" },
  { to: "/jobs", label: "实习与工作", icon: Briefcase, hue: "from-mint to-brand" },
  { to: "/venues", label: "场地预约", icon: CalendarDays, hue: "from-sun to-coral" },
  { to: "/radar", label: "附近的人", icon: Radio, hue: "from-mint to-sun" },
];

export function SideRail() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [path]);

  if (HIDDEN_ROUTES.some((p) => path.startsWith(p))) return null;
  if (path === "/" || path === "") return null; // landing page keeps its own hero
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) return null;

  return (
    <>
      {/* Collapsed handle */}
      <button
        onClick={() => setOpen(true)}
        aria-label="打开功能栏"
        className={`fixed left-0 top-1/2 z-30 -translate-y-1/2 ${open ? "pointer-events-none opacity-0" : "opacity-100"} transition-opacity duration-200`}
      >
        <div className="flex items-center gap-1 rounded-r-2xl border border-l-0 border-border bg-gradient-to-br from-coral/90 to-sun/90 py-3 pl-1.5 pr-2 text-background shadow-lg">
          <ChevronRight className="h-4 w-4" />
          <LayoutGrid className="h-4 w-4" />
        </div>
      </button>

      {/* Drawer overlay */}
      {open && (
        <button
          aria-label="关闭"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 max-w-[82vw] transform border-r border-border bg-background/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-hidden={!open}
      >
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-coral via-sun/80 to-mint/70">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-background/20 blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-xl font-semibold text-background">Pulse 校园</p>
            <p className="text-[11px] text-background/80">让校园生活更高效一些 ✨</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/30 text-background"
            aria-label="收起"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto p-3">
          {ITEMS.map((it) => {
            const active = path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${active ? "border-coral/60 bg-coral/10" : "border-transparent hover:bg-surface/70"}`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${it.hue} text-background shadow`}>
                  <it.icon className="h-4 w-4" />
                </span>
                <span className={`flex-1 text-sm ${active ? "font-semibold text-foreground" : "text-foreground/90"}`}>{it.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </Link>
            );
          })}
        </nav>

      </aside>
    </>
  );
}