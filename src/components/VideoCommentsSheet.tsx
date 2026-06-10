import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Send, Loader2, Trash2, Flag } from "lucide-react";
import { toast } from "sonner";
import { listVideoComments, addVideoComment, deleteVideoComment } from "@/lib/videos.functions";
import { ReportSheet } from "@/components/ReportSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  me: string | null;
  onCountChange?: (delta: number) => void;
};

export function VideoCommentsSheet({ open, onClose, videoId, me, onCountChange }: Props) {
  const list = useServerFn(listVideoComments);
  const add = useServerFn(addVideoComment);
  const del = useServerFn(deleteVideoComment);
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["video-comments", videoId],
    queryFn: () => list({ data: { videoId } }),
    enabled: open,
  });

  const onSend = async () => {
    const c = draft.trim();
    if (!c || sending) return;
    setSending(true);
    try {
      await add({ data: { videoId, content: c } });
      setDraft("");
      onCountChange?.(1);
      qc.invalidateQueries({ queryKey: ["video-comments", videoId] });
    } catch (e: any) {
      toast.error(e?.message ?? "发送失败");
    } finally {
      setSending(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("删除这条评论?")) return;
    try {
      await del({ data: { id } });
      onCountChange?.(-1);
      qc.invalidateQueries({ queryKey: ["video-comments", videoId] });
    } catch (e: any) {
      toast.error(e?.message ?? "删除失败");
    }
  };

  if (!open) return null;

  const comments = data?.comments ?? [];

  return (
    <>
      <div className="fixed inset-0 z-[90] grid place-items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div
          className="flex h-[72dvh] w-full max-w-md flex-col rounded-t-3xl border-t border-border bg-surface text-foreground shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <div className="font-display text-base font-semibold">{comments.length} 条评论</div>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted/40">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {isLoading && <div className="grid h-32 place-items-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>}
            {!isLoading && comments.length === 0 && (
              <div className="grid h-40 place-items-center text-sm text-muted-foreground">还没有评论,快来抢沙发</div>
            )}
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-coral to-sun text-sm font-semibold text-background">
                    {c.author_avatar ? <img src={c.author_avatar} alt="" className="h-full w-full object-cover" /> : (c.author_nickname?.slice(0, 1) ?? "P")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{c.author_nickname ?? "Pulse 用户"}</span>
                      <span>{new Date(c.created_at).toLocaleString("zh-CN", { hour12: false })}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground/90">{c.content}</p>
                    <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground">
                      {me === c.author_id ? (
                        <button onClick={() => onDelete(c.id)} className="flex items-center gap-1 hover:text-coral">
                          <Trash2 className="h-3 w-3" /> 删除
                        </button>
                      ) : (
                        <button onClick={() => setReportId(c.id)} className="flex items-center gap-1 hover:text-coral">
                          <Flag className="h-3 w-3" /> 举报
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border/60 bg-surface px-3 py-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, 500))}
                onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
                placeholder="说点什么……"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={onSend}
                disabled={!draft.trim() || sending}
                className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-coral to-sun text-background disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {reportId && (
        <ReportSheet
          open
          onClose={() => setReportId(null)}
          targetType="video_comment"
          targetId={reportId}
        />
      )}
    </>
  );
}