import type { SbtiRewardMeta } from "@/lib/sbti/rewards";
import { SbtiCharacter } from "./SbtiCharacter";

type Props = {
  meta: SbtiRewardMeta;
  inviteCode: string;
  nickname?: string;
  id?: string;
};

/** 可分享 / 保存的人格海报卡片 */
export function SbtiPosterCard({ meta, inviteCode, nickname, id = "sbti-poster-card" }: Props) {
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 text-white shadow-2xl"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-coral/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-36 rounded-full bg-mint/25 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Pulse · SBTI</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{meta.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75 line-clamp-2">{meta.intro}</p>
        </div>
        <SbtiCharacter code={meta.code} size="sm" showNameplate={false} />
      </div>

      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {meta.keywords.map((k) => (
          <span key={k} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] backdrop-blur">
            #{k}
          </span>
        ))}
      </div>

      <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-white/50">专属铭牌</p>
            <p className="font-display text-lg font-semibold text-sun">{meta.nameplate}</p>
            <p className="mt-1 text-xs text-white/60">限定装扮 · {meta.outfit.label}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/50">邀请码</p>
            <p className="font-mono text-lg font-bold tracking-wider text-mint">{inviteCode}</p>
          </div>
        </div>
        {nickname && (
          <p className="mt-3 text-xs text-white/45">来自 {nickname} 的分享 · 测完双方得奖励</p>
        )}
      </div>

      <p className="relative mt-4 text-center text-[10px] text-white/35">扫码或打开链接 · 遇见同频的人</p>
    </div>
  );
}
