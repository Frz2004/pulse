import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  nickname: z.string().trim().min(1, "请填写昵称").max(30),
  gender: z.string().trim().min(1, "请选择性别"),
  birthday: z.string().trim().min(1, "请选择出生日期"),
  city: z.string().trim().min(1, "请选择所在城市"),
  hometown: z.string().trim().max(40).optional().nullable(),
  height: z.string().trim().max(20).optional().nullable(),
  job: z.string().trim().max(40).optional().nullable(),
  education: z.string().trim().max(40).optional().nullable(),
  school: z.string().trim().max(80).optional().nullable(),
  signature: z.string().trim().min(1, "请填写个性签名").max(150, "个性签名不能超过 150 字"),
  intro: z.string().trim().max(1000).optional().nullable(),
  status: z.string().trim().max(80).optional().nullable(),
  interests: z.array(z.string().trim().min(1).max(20)).max(15, "兴趣最多 15 个").default([]),
  personality: z.array(z.string().trim().min(1).max(20)).max(8, "性格标签最多 8 个").default([]),
  mbti: z.string().trim().max(10).optional().nullable(),
  sbtiType: z.string().trim().max(10).optional().nullable(),
  sbtiVisibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  zodiac: z.string().trim().max(12).optional().nullable(),
  smoke: z.string().trim().min(1, "请选择是否抽烟"),
  drink: z.string().trim().min(1, "请选择是否喝酒"),
  sleep: z.string().trim().max(40).optional().nullable(),
  diet: z.string().trim().max(40).optional().nullable(),
  pet: z.string().trim().max(40).optional().nullable(),
  health: z.string().trim().max(120).optional().nullable(),
  intent: z.array(z.string().trim().min(1).max(30)).default([]),
  relationship: z.string().trim().max(30).optional().nullable(),
  sexualOrientation: z.string().trim().max(30).optional().nullable(),
  idealType: z.string().trim().max(300).optional().nullable(),
  ageRange: z.any().optional().nullable(),
  distance: z.string().trim().max(40).optional().nullable(),
  icebreaker: z.string().trim().max(300).optional().nullable(),
  phone: z.string().trim().min(1, "请填写手机号完成手机认证").max(30),
  phoneVerified: z.boolean().default(true),
  verifyReal: z.boolean().default(false),
  verifyStudent: z.boolean().default(false),
  photos: z.any().optional(),
  mainIdx: z.number().optional(),
  videoIntro: z.string().optional().nullable(),
});

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Record<string, unknown>) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const payload: Record<string, unknown> = {
      id: userId,
      nickname: data.nickname,
      gender: data.gender,
      birthday: data.birthday,
      city: data.city,
      hometown: data.hometown || null,
      height: data.height || null,
      education: data.education || null,
      job: data.job || null,
      school: data.school || null,
      photos: data.photos ?? [],
      main_idx: data.mainIdx ?? 0,
      video_intro: data.videoIntro || null,
      signature: data.signature,
      intro: data.intro || null,
      status: data.status || null,
      interests: data.interests ?? [],
      personality: data.personality ?? [],
      mbti: data.mbti || null,
      zodiac: data.zodiac || null,
      smoke: data.smoke,
      drink: data.drink,
      sleep: data.sleep || null,
      diet: data.diet || null,
      pet: data.pet || null,
      health: data.health || null,
      intent: data.intent ?? [],
      relationship: data.relationship || null,
      sexual_orientation: data.sexualOrientation || null,
      ideal_type: data.idealType || null,
      age_range: data.ageRange ?? null,
      distance: data.distance || null,
      icebreaker: data.icebreaker || null,
      phone_verified: data.phoneVerified,
      verify_real: data.verifyReal,
      verify_student: data.verifyStudent,
      onboarded: true,
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload as never, { onConflict: "id" });

    if (error) throw new Error(error.message);

    const { error: pErr } = await supabase
      .from("profiles_private")
      .upsert({ id: userId, phone: data.phone, phone_verified: data.phoneVerified } as never, { onConflict: "id" });
    if (pErr) throw new Error(pErr.message);

    return { ok: true };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);

    const { data: privateProfile, error: privateError } = await supabase
      .from("profiles_private")
      .select("phone, phone_verified")
      .eq("id", userId)
      .maybeSingle();
    if (privateError) throw new Error(privateError.message);

    return { profile: data ? { ...data, phone: privateProfile?.phone ?? "", phone_verified: privateProfile?.phone_verified ?? data.phone_verified ?? false } : data };
  });

export const listDiscoverCandidates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: me, error: meErr } = await supabase
      .from("profiles")
      .select("id, sbti_type, interests")
      .eq("id", userId)
      .maybeSingle();
    if (meErr) throw new Error(meErr.message);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, nickname, birthday, city, signature, intro, interests, sbti_type, photos, main_idx")
      .neq("id", userId)
      .eq("onboarded", true)
      .limit(50);
    if (error) throw new Error(error.message);

    return { me, candidates: data ?? [] };
  });