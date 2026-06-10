import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Campus = {
  id: string;
  slug: string;
  name: string;
  location: string | null;
  description: string | null;
  created_at: string;
};

export type CampusInvite = {
  id: string;
  code: string;
  campus_id: string;
  inviter_id: string;
  max_uses: number;
  uses: number;
  expires_at: string | null;
  status: string;
  created_at: string;
};

/** Campuses the current user has joined. */
export const listMyCampuses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: memberships, error } = await supabase
      .from("campus_memberships")
      .select("campus_id, joined_at")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    const ids = (memberships ?? []).map((m: any) => m.campus_id);
    if (ids.length === 0) return { campuses: [] as Campus[] };
    const { data: rows, error: e2 } = await supabase
      .from("campuses")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: true });
    if (e2) throw new Error(e2.message);
    return { campuses: (rows ?? []) as Campus[] };
  });

/** All campuses (used for "discover new campus" flow). */
export const listAllCampuses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("campuses")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { campuses: (data ?? []) as Campus[] };
  });

export const redeemCampusInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ code: z.string().trim().min(4).max(32) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: campusId, error } = await supabase.rpc("redeem_campus_invite", {
      p_code: data.code.toUpperCase(),
    });
    if (error) {
      const msg = error.message || "";
      if (msg.includes("INVITE_NOT_FOUND")) throw new Error("邀请码不存在");
      if (msg.includes("INVITE_REVOKED")) throw new Error("邀请码已被撤销");
      if (msg.includes("INVITE_EXPIRED")) throw new Error("邀请码已过期");
      if (msg.includes("INVITE_USED_UP")) throw new Error("邀请码使用次数已用完");
      throw new Error(msg || "邀请码无效");
    }
    return { campus_id: campusId as string };
  });

export const createCampusInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        campus_id: z.string().uuid(),
        // Each invite is single-use; accept any client value but ignore it.
        max_uses: z.number().int().optional().default(1),
        expires_in_hours: z.number().int().min(1).max(24 * 60).default(168),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: row, error } = await supabase.rpc("create_campus_invite", {
      p_campus_id: data.campus_id,
      p_max_uses: 1,
      p_expires_in_hours: data.expires_in_hours,
    });
    if (error) {
      if ((error.message || "").includes("NOT_A_MEMBER")) throw new Error("你还不是该园区的成员");
      throw new Error(error.message || "生成失败");
    }
    return { invite: row as CampusInvite };
  });

export const listMyCampusInvites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { campus_id: string }) =>
    z.object({ campus_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("campus_invites")
      .select("*")
      .eq("campus_id", data.campus_id)
      .eq("inviter_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { invites: (rows ?? []) as CampusInvite[] };
  });

/** Search profiles by nickname to invite into a campus.
 *  Excludes the current user and existing members of the campus. */
export const searchInviteCandidates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        campus_id: z.string().uuid(),
        q: z.string().trim().max(40).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Existing campus members to exclude.
    const { data: members } = await supabase
      .from("campus_memberships")
      .select("user_id")
      .eq("campus_id", data.campus_id);
    const memberIds = new Set<string>((members ?? []).map((m: any) => m.user_id));
    memberIds.add(userId);

    let query = supabase
      .from("profiles")
      .select("id, nickname, photos, main_idx, city")
      .eq("onboarded", true)
      .limit(30);
    if (data.q) query = query.ilike("nickname", `%${data.q}%`);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const users = (rows ?? [])
      .filter((r: any) => !memberIds.has(r.id))
      .map((r: any) => {
        const photos = Array.isArray(r.photos) ? (r.photos as string[]) : [];
        return {
          id: r.id as string,
          nickname: (r.nickname as string | null) ?? null,
          city: (r.city as string | null) ?? null,
          avatar: photos[r.main_idx ?? 0] || photos[0] || null,
        };
      });
    return { users };
  });

/** Generate a campus invite and DM it to each selected recipient.
 *  Uses one shared code (sized to recipients) so they each click their own message. */
export const inviteUsersToCampus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        campus_id: z.string().uuid(),
        recipient_ids: z.array(z.string().uuid()).min(1).max(20),
        expires_in_hours: z.number().int().min(1).max(24 * 60).default(168),
        note: z.string().trim().max(200).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Campus name for the message body.
    const { data: campus } = await supabase
      .from("campuses")
      .select("name")
      .eq("id", data.campus_id)
      .maybeSingle();
    const campusName = (campus?.name as string | undefined) ?? "我的园区";

    // Each invite is single-use, so mint one dedicated code per recipient.
    // p_revoke_existing=false keeps the inviter's personal active code intact.
    let firstInvite: CampusInvite | null = null;
    const results: { recipient_id: string; ok: boolean; error?: string }[] = [];
    for (const rid of data.recipient_ids) {
      if (rid === userId) {
        results.push({ recipient_id: rid, ok: false, error: "不能邀请自己" });
        continue;
      }
      try {
        const { data: invite, error: invErr } = await supabase.rpc("create_campus_invite", {
          p_campus_id: data.campus_id,
          p_max_uses: 1,
          p_expires_in_hours: data.expires_in_hours,
          p_revoke_existing: false,
        });
        if (invErr) throw invErr;
        const code = (invite as CampusInvite).code;
        if (!firstInvite) firstInvite = invite as CampusInvite;

        const body = [
          `📮 邀请你加入「${campusName}」社区`,
          `专属邀请码：${code}（仅你可用一次）`,
          data.note ? `\n${data.note}` : "",
          `\n在「社区」页输入邀请码即可加入。`,
        ]
          .filter(Boolean)
          .join("\n");

        const { data: convId, error: convErr } = await supabase.rpc("start_conversation", {
          partner_id: rid,
          source: "match",
        });
        if (convErr) throw convErr;
        const { error: msgErr } = await supabase.from("messages").insert({
          conversation_id: convId as string,
          sender_id: userId,
          content: body,
        });
        if (msgErr) throw msgErr;
        results.push({ recipient_id: rid, ok: true });
      } catch (e: any) {
        results.push({ recipient_id: rid, ok: false, error: e?.message ?? "发送失败" });
      }
    }

    return {
      invite: firstInvite as CampusInvite,
      sent: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      results,
    };
  });

// ---------------- admin ----------------

export const adminListCampuses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("campuses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = (data ?? []).map((c: any) => c.id);
    let counts = new Map<string, number>();
    if (ids.length > 0) {
      const { data: members } = await supabase
        .from("campus_memberships")
        .select("campus_id")
        .in("campus_id", ids);
      for (const m of members ?? []) {
        counts.set((m as any).campus_id, (counts.get((m as any).campus_id) ?? 0) + 1);
      }
    }
    return {
      campuses: (data ?? []).map((c: any) => ({
        ...c,
        member_count: counts.get(c.id) ?? 0,
      })) as (Campus & { member_count: number })[],
    };
  });

export const adminCreateCampus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        slug: z.string().trim().min(2).max(40).regex(/^[a-z0-9-]+$/),
        name: z.string().trim().min(1).max(80),
        location: z.string().trim().max(80).optional(),
        description: z.string().trim().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("无权限");
    const { data: row, error } = await supabase
      .from("campuses")
      .insert({
        slug: data.slug,
        name: data.name,
        location: data.location ?? null,
        description: data.description ?? null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { campus: row as Campus };
  });

export const adminListCampusInvites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { campus_id: string }) =>
    z.object({ campus_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("campus_invites")
      .select("*")
      .eq("campus_id", data.campus_id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { invites: (rows ?? []) as CampusInvite[] };
  });