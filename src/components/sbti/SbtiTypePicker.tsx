import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ALL_SELECTABLE_SBTI_TYPES, getSbtiRewardMeta } from "@/lib/sbti/rewards";
import { getSbtiTypeImageUrl } from "@/lib/sbti/images";

type Props = {
  selected?: string | null;
  onSelect: (code: string) => void;
};

export function SbtiTypePicker({ selected, onSelect }: Props) {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return ALL_SELECTABLE_SBTI_TYPES;
    return ALL_SELECTABLE_SBTI_TYPES.filter((t) => {
      const meta = getSbtiRewardMeta(t.code);
      return (
        t.code.toLowerCase().includes(q) ||
        t.cn.includes(q) ||
        meta?.keywords.some((k) => k.includes(q))
      );
    });
  }, [keyword]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索人格代号或称号…"
          className="w-full rounded-2xl border border-border bg-surface/60 py-3 pl-10 pr-4 text-sm outline-none focus:border-mint/50"
        />
      </div>
      <p className="text-xs text-muted-foreground">共 {ALL_SELECTABLE_SBTI_TYPES.length} 种人格，点选其一解锁限定装扮</p>
      <div className="grid grid-cols-2 gap-2.5 max-h-[52vh] overflow-y-auto pr-1">
        {filtered.map((t) => {
          const meta = getSbtiRewardMeta(t.code);
          const active = selected === t.code;
          return (
            <button
              key={t.code}
              type="button"
              onClick={() => onSelect(t.code)}
              className={`rounded-2xl border p-3 text-left transition tap-scale ${
                active
                  ? "border-mint bg-mint/10 ring-1 ring-mint/40"
                  : "border-border bg-surface/50 hover:border-mint/30 hover:bg-surface/80"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-border bg-background/50">
                  <img
                    src={getSbtiTypeImageUrl(t.code)}
                    alt={t.cn}
                    className="size-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-mint">{t.code}</p>
                  <p className="truncate text-xs font-medium">{t.cn}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {meta?.keywords.slice(0, 2).map((k) => (
                      <span key={k} className="rounded-full bg-background/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
