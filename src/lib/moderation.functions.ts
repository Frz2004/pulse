import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const reportTargetTypes = [
  "user",
  "post",
  "treehole",
  "message",
  "comment",
  "video",
  "video_comment",
] as const;

/**
 * 统一举报入口（供 ReportSheet 等通用举报组件调用）。
 * 落到 reports 表，管理员在后台「举报中心」统一处理。
 */
export const reportContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        targetType: z.enum(reportTargetTypes),
        targetId: z.string().min(1),
        reason: z.string().trim().min(1).max(50),
        detail: z.string().trim().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin.from("reports").insert({
      reporter_id: userId,
      target_type: data.targetType,
      target_id: data.targetId,
      reason: data.reason,
      detail: data.detail?.trim() || null,
      status: "pending",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * 拉黑用户：将目标用户加入黑名单，双向内容互不可见由查询侧过滤。
 */
export const blockUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ targetId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    if (data.targetId === userId) throw new Error("不能拉黑自己");
    const { error } = await supabaseAdmin
      .from("blocks")
      .upsert(
        { blocker_id: userId, blocked_id: data.targetId },
        { onConflict: "blocker_id,blocked_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
