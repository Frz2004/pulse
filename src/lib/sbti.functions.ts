import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const saveInput = z.object({
  sbtiType: z.string().min(1).max(32),
  sbtiVisibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  source: z.enum(["known", "external_test", "internal_quiz"]).optional(),
});

/** 保存用户选定的人格类型到资料 */
export const saveSbtiSelection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => saveInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const payload = {
      id: userId,
      sbti_type: data.sbtiType,
      sbti_visibility: data.sbtiVisibility ?? "PUBLIC",
      sbti_updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("profiles").upsert(payload as never, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true as const, sbtiType: data.sbtiType };
  });

/** 读取当前用户 SBTI 资料（未登录时前端走 localStorage） */
export const getMySbtiProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("sbti_type, sbti_visibility, sbti_updated_at, nickname")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { profile: data };
  });
