import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Flag, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reportContent, blockUser } from "@/lib/moderation.functions";

export type ReportTargetType =
  | "user"
  | "post"
  | "treehole"
  | "message"
  | "comment"
  | "video"
  | "video_comment";

const REASONS: { value: string; label: string }[] = [
  { value: "spam", label: "垃圾广告 / 营销刷屏" },
  { value: "harassment", label: "骚扰 / 辱骂攻击" },
  { value: "nudity", label: "色情低俗 / 露骨内容" },
  { value: "hate", label: "歧视 / 仇恨言论" },
  { value: "violence", label: "暴力 / 血腥" },
  { value: "scam", label: "诈骗 / 引流" },
  { value: "underage", label: "未成年相关风险" },
  { value: "self_harm", label: "自残 / 自杀相关" },
  { value: "other", label: "其他(请补充说明)" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  authorId?: string | null; // optional: enable "拉黑作者"
};

/** 统一的举报抽屉。可选附带"同时拉黑作者"。 */
export function ReportSheet({ open, onClose, targetType, targetId, authorId }: Props) {
  const [reason, setReason] = useState<string>("spam");
  const [detail, setDetail] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [busy, setBusy] = useState(false);
  const report = useServerFn(reportContent);
  const block = useServerFn(blockUser);

  if (!open) return null;

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await report({
        data: {
          targetType,
          targetId,
          reason: reason as any,
          detail: detail.trim() || undefined,
        },
      });
      if (alsoBlock && authorId) {
        try { await block({ data: { targetId: authorId } }); } catch {}
      }
      toast.success("举报已提交,我们会尽快核实");
      onClose();
      setDetail("");
      setAlsoBlock(false);
    } catch (e: any) {
      toast.error(e?.message ?? "举报失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl border-t border-border bg-surface p-5 text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <Flag className="h-5 w-5 text-coral" /> 举报
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-muted/40">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">请选择最贴近的原因,审核人员将在 24 小时内处理。</p>

        <div className="mt-4 grid grid-cols-1 gap-2">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left text-sm transition ${
                reason === r.value
                  ? "border-coral bg-coral/10 text-foreground"
                  : "border-border/70 bg-muted/20 text-muted-foreground"
              }`}
            >
              <span>{r.label}</span>
              <span className={`h-3 w-3 rounded-full border ${reason === r.value ? "border-coral bg-coral" : "border-border"}`} />
            </button>
          ))}
        </div>

        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value.slice(0, 500))}
          placeholder="补充说明(选填,最多 500 字)"
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-border/60 bg-muted/20 p-3 text-sm outline-none focus:border-coral"
        />

        {authorId && (
          <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="h-4 w-4 accent-coral"
            />
            同时拉黑该用户,以后不再看到 Ta 的内容
          </label>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun py-3 text-sm font-semibold text-background disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} 提交举报
        </button>
      </div>
    </div>
  );
}