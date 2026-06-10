import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const saveInput = z.object({
  result: z.record(z.unknown()),
  imageUrl: z.string().url().optional().nullable(),
});

export const savePalmReading = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => saveInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("palm_readings").insert({
      user_id: userId,
      result: data.result as never,
      image_url: data.imageUrl ?? null,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
