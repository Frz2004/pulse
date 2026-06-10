import { getSbtiRewardMeta } from "@/lib/sbti/rewards";
import { getSbtiTypeImageUrl } from "@/lib/sbti/images";

type Props = {
  code: string;
  size?: "sm" | "md" | "lg";
  showNameplate?: boolean;
  className?: string;
};

const SIZE = {
  sm: { wrap: "h-20 w-20", char: "text-2xl", badge: "text-[9px] px-1.5 py-0.5", img: "size-8" },
  md: { wrap: "h-28 w-28", char: "text-3xl", badge: "text-[10px] px-2 py-0.5", img: "size-10" },
  lg: { wrap: "h-36 w-36", char: "text-4xl", badge: "text-xs px-2.5 py-1", img: "size-14" },
} as const;

/** 人格限定小人 + 专属铭牌，用于主页装饰 */
export function SbtiCharacter({ code, size = "md", showNameplate = true, className = "" }: Props) {
  const meta = getSbtiRewardMeta(code);
  if (!meta) return null;
  const s = SIZE[size];
  const imgUrl = getSbtiTypeImageUrl(code);

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div className="relative">
        <div className={`absolute inset-0 -m-1 rounded-[22px] bg-gradient-to-br ${meta.outfit.gradient} blur-md opacity-70`} />
        <div
          className={`relative grid ${s.wrap} place-items-center rounded-[20px] bg-gradient-to-br ${meta.outfit.gradient} shadow-lg ring-2 ${meta.outfit.accent}`}
        >
          <div className="relative flex flex-col items-center">
            <span className={`${s.char} drop-shadow`} aria-hidden>
              {meta.outfit.accessory}
            </span>
            <div className="mt-0.5 grid size-10 place-items-center rounded-xl bg-background/30 backdrop-blur-sm overflow-hidden">
              <img
                src={imgUrl}
                alt={meta.cn}
                className={`${s.img} object-cover`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-background/90 text-sm shadow border border-border">
            ✦
          </span>
        </div>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/95 border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground shadow">
          {meta.outfit.label}
        </span>
      </div>
      {showNameplate && (
        <div className={`rounded-full bg-gradient-to-r ${meta.outfit.gradient} ${s.badge} font-semibold text-background shadow`}>
          {meta.nameplate}
        </div>
      )}
    </div>
  );
}
