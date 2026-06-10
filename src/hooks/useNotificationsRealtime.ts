import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Subscribes to the current user's `notifications` row inserts.
 * - Invalidates the `notifications` and `notifications-unread` query keys.
 * - Shows a sonner toast.
 * - Fires a browser Notification (if permission granted) when the page is hidden.
 */
export function useNotificationsRealtime() {
  const qc = useQueryClient();
  const userIdRef = useRef<string | null>(null);
  const setupIdRef = useRef(0);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let alive = true;

    const teardownChannel = () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };

    const setup = async (nextUserId?: string | null) => {
      const setupId = ++setupIdRef.current;
      const userId = nextUserId ?? (await supabase.auth.getSession()).data.session?.user.id ?? null;
      if (!alive || !userId) return;
      if (userId === userIdRef.current && channel) return;
      teardownChannel();
      if (!alive || setupId !== setupIdRef.current) return;

      userIdRef.current = userId;

      channel = supabase
        .channel(`notif-rt-${userId}-${setupId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
          (payload) => {
            qc.invalidateQueries({ queryKey: ["notifications"] });
            qc.invalidateQueries({ queryKey: ["notifications-unread"] });
            const n: any = payload.new;
            const title = previewTitle(n);
            toast(title, { description: previewBody(n) });
            if (typeof window !== "undefined" && "Notification" in window && document.hidden && Notification.permission === "granted") {
              try { new Notification("Pulse · " + title, { body: previewBody(n), tag: n.id }); } catch {}
            }
          },
        )
        .subscribe();
    };
    setup();

    const onAuth = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user.id !== userIdRef.current) {
        teardownChannel();
        userIdRef.current = null;
        setup(session?.user.id ?? null);
      }
    });

    return () => {
      alive = false;
      onAuth.data.subscription.unsubscribe();
      teardownChannel();
    };
  }, [qc]);
}

function previewTitle(n: any): string {
  const p = n.payload || {};
  switch (n.type) {
    case "message": return `${p.sender_name ?? "有人"} 给你发了消息`;
    case "like": return `${p.swiper_name ?? "有人"} 喜欢了你`;
    case "match": return `你和 ${p.other_name ?? "Ta"} 互相喜欢！`;
    case "comment": return `${p.commenter_name ?? "有人"} 评论了你的动态`;
    case "post_like": return `${p.liker_name ?? "有人"} 赞了你的动态`;
    case "follow": return `${p.follower_name ?? "有人"} 关注了你`;
    case "gift": return `${p.sender_name ?? "有人"} 送了你 ${p.gift_code ?? "一份礼物"}`;
    case "video_like": return `有人赞了你的短视频`;
    default: return "新通知";
  }
}
function previewBody(n: any): string {
  const p = n.payload || {};
  return p.preview || p.post_title || "";
}