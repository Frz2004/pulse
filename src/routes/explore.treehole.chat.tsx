import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Flag, Ban, Send, Loader2 } from "lucide-react";
import { MobileFeatureShell } from "@/components/explore/MobileFeatureShell";
import { useServerFn } from "@tanstack/react-start";
import { decideTreeholeReveal, listTreeholeChatMessages, requestTreeholeReveal, sendTreeholeChatMessage } from "@/lib/treehole.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/explore/treehole/chat")({
  validateSearch: (search: Record<string, unknown>) => ({
    chatId: typeof search.chatId === "string" ? search.chatId : "",
    peer: typeof search.peer === "string" ? search.peer : "匿名对象",
  }),
  head: () => ({ meta: [{ title: "匿名聊天 · Pulse" }] }),
  component: TreeholeChatPage,
});

function TreeholeChatPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const chatId = search.chatId;
  const peer = search.peer;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [revealRequested, setRevealRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useServerFn(listTreeholeChatMessages);
  const sendFn = useServerFn(sendTreeholeChatMessage);
  const revealFn = useServerFn(requestTreeholeReveal);
  const decideFn = useServerFn(decideTreeholeReveal);

  useEffect(() => {
    if (!chatId) return;
    fetchMessages({ data: { chatId } }).then((res: any) => setMessages(res.messages ?? []));
  }, [chatId]);

  const send = async () => {
    if (!chatId || !input.trim()) return;
    setLoading(true);
    try {
      await sendFn({ data: { chatId, content: input.trim() } });
      setInput("");
      const res = await fetchMessages({ data: { chatId } });
      setMessages(res.messages ?? []);
    } finally {
      setLoading(false);
    }
  };

  const requestReveal = async () => {
    try {
      await revealFn({ data: { chatId } });
      setRevealRequested(true);
      toast.success("已发送揭开身份请求");
    } catch (e: any) {
      toast.error(e?.message || "申请失败");
    }
  };

  const decideReveal = async (accept: boolean) => {
    try {
      await decideFn({ data: { chatId, accept } });
      toast.success(accept ? "已同意" : "已暂时匿名");
      if (accept) navigate({ to: "/messages" });
    } catch (e: any) {
      toast.error(e?.message || "操作失败");
    }
  };

  return (
    <MobileFeatureShell title="匿名聊天" subtitle={`与 ${peer} 的匿名对话`} icon={ArrowLeft} backTo="/explore/treehole" backLabel="返回" footerPad>
      <div className="space-y-3 pb-28">
        <div className="rounded-2xl bg-surface/70 p-3 text-xs text-muted-foreground">当前为匿名聊天，请谨慎透露个人隐私。</div>
        <div className="space-y-2">
          {messages.map((m) => <div key={m.id} className={`flex ${m.senderId ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.senderId ? "bg-[#95ec69]" : "bg-white border border-border"}`}>{m.content}</div></div>)}
          {revealRequested && <div className="rounded-2xl bg-sun/10 p-3 text-sm">🎉 你们已正式认识！</div>}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] border-t border-black/5 bg-[#f7f7f7]/95 p-3 backdrop-blur-xl">
        <div className="mb-2 flex gap-2 text-xs overflow-x-auto pb-1">
          <button onClick={requestReveal} className="rounded-full border border-border px-3 py-1.5">申请揭开身份</button>
          <button onClick={() => decideReveal(true)} className="rounded-full border border-border px-3 py-1.5">同意</button>
          <button onClick={() => decideReveal(false)} className="rounded-full border border-border px-3 py-1.5">暂时匿名</button>
          <button className="rounded-full border border-border px-3 py-1.5"><Flag className="inline size-3.5" /> 举报</button>
          <button className="rounded-full border border-border px-3 py-1.5"><Ban className="inline size-3.5" /> 拉黑</button>
        </div>
        <div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 rounded-2xl border border-border bg-white px-3 py-2 text-sm outline-none" placeholder="说点什么..." /><button disabled={loading} onClick={send} className="rounded-2xl bg-[#07c160] px-4 py-2 text-sm font-semibold text-white">{loading ? <Loader2 className="inline size-4 animate-spin" /> : <Send className="inline size-4" />} 发送</button></div>
      </div>
    </MobileFeatureShell>
  );
}
