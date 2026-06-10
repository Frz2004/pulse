import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PrivacySettings = {
  searchable: boolean;
  allow_messages: "everyone" | "matches" | "none";
  hide_city: boolean;
  hide_distance: boolean;
};

const DEFAULTS: PrivacySettings = {
  searchable: true,
  allow_messages: "everyone",
  hide_city: false,
  hide_distance: false,
};

export const getMyPrivacy = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("profiles_privacy")
      .select("searchable, allow_messages, hide_city, hide_distance")
      .eq("id", userId)
      .maybeSingle();
    return { settings: (data as PrivacySettings | null) ?? DEFAULTS };
  });

export const updateMyPrivacy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        searchable: z.boolean().optional(),
        allow_messages: z.enum(["everyone", "matches", "none"]).optional(),
        hide_city: z.boolean().optional(),
        hide_distance: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles_privacy")
      .upsert({ id: userId, ...data }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });