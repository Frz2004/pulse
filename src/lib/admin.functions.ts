import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** 内部校验:必须是 admin */
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("没有管理员权限");
}

/** 检查当前用户是否 admin(给前端 gate 用,不抛异常) */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

/** 首次申领管理员:全表无 admin 时,允许当前登录用户成为首位管理员 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) > 0) throw new Error("管理员已存在,请联系现有管理员授权");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** 概览统计 */
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const countOf = async (table: string, filter?: (q: any) => any) => {
      let q: any = (supabase as any).from(table).select("*", { count: "exact", head: true });
      if (filter) q = filter(q);
      const { count } = await q;
      return count ?? 0;
    };

    const sinceToday = new Date();
    sinceToday.setHours(0, 0, 0, 0);

    const [users, messages, msgsToday, posts, treehole, reports, openFlags, calls] = await Promise.all([
      countOf("profiles"),
      countOf("messages"),
      countOf("messages", (q) => q.gte("created_at", sinceToday.toISOString())),
      countOf("community_posts"),
      countOf("treehole_posts"),
      countOf("reports", (q) => q.eq("status", "pending")),
      countOf("content_flags", (q) => q.eq("status", "open")),
      countOf("call_sessions"),
    ]);

    return {
      stats: {
        users, messages, messagesToday: msgsToday, posts, treehole,
        pendingReports: reports, openFlags, calls,
      },
    };
  });

/** 可视化图表数据 */
export const getAdminCharts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const DAYS = 14;
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (DAYS - 1));
    const sinceISO = since.toISOString();

    const fetchDates = async (table: string, col: string = "created_at") => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select(col)
        .gte(col, sinceISO)
        .limit(5000);
      if (error) throw new Error(error.message);
      return (data ?? []).map((r: any) => r[col] as string);
    };

    const [uDates, mDates, pDates, tDates, cDates] = await Promise.all([
      fetchDates("profiles"),
      fetchDates("messages"),
      fetchDates("community_posts"),
      fetchDates("treehole_posts"),
      fetchDates("call_sessions", "started_at"),
    ]);

    // 构造每日序列
    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const series: Record<string, { date: string; users: number; messages: number; posts: number; treehole: number; calls: number }> = {};
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const k = dayKey(d);
      series[k] = { date: k.slice(5), users: 0, messages: 0, posts: 0, treehole: 0, calls: 0 };
    }
    const bump = (arr: string[], key: keyof (typeof series)[string]) => {
      for (const ts of arr) {
        const k = ts.slice(0, 10);
        if (series[k]) (series[k][key] as number) += 1;
      }
    };
    bump(uDates, "users");
    bump(mDates, "messages");
    bump(pDates, "posts");
    bump(tDates, "treehole");
    bump(cDates, "calls");
    const daily = Object.values(series);

    // 内容分布
    const contentMix = [
      { name: "聊天消息", value: mDates.length },
      { name: "社区帖子", value: pDates.length },
      { name: "匿名树洞", value: tDates.length },
      { name: "语音/视频", value: cDates.length },
    ];

    // 风险等级分布
    const { data: flagRows } = await (supabase as any)
      .from("content_flags")
      .select("severity, status")
      .limit(2000);
    const sevMap: Record<string, number> = { low: 0, medium: 0, high: 0 };
    let openFlags = 0;
    let resolvedFlags = 0;
    for (const r of flagRows ?? []) {
      const s = (r.severity ?? "low") as string;
      sevMap[s] = (sevMap[s] ?? 0) + 1;
      if (r.status === "open") openFlags += 1; else resolvedFlags += 1;
    }
    const riskBars = [
      { level: "低危", count: sevMap.low ?? 0 },
      { level: "中危", count: sevMap.medium ?? 0 },
      { level: "高危", count: sevMap.high ?? 0 },
    ];

    // 举报状态
    const { data: reportRows } = await (supabase as any)
      .from("reports")
      .select("status")
      .limit(2000);
    const rMap: Record<string, number> = {};
    for (const r of reportRows ?? []) rMap[r.status] = (rMap[r.status] ?? 0) + 1;
    const reportPie = [
      { name: "待处理", value: rMap["pending"] ?? 0 },
      { name: "已处理", value: rMap["resolved"] ?? 0 },
      { name: "已驳回", value: rMap["dismissed"] ?? 0 },
    ];

    return { daily, contentMix, riskBars, reportPie, flagStatus: { open: openFlags, resolved: resolvedFlags } };
  });

/** 用户列表 */
export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(30),
      offset: z.number().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    let q = supabase
      .from("profiles")
      .select("id, nickname, gender, city, photos, main_idx, onboarded, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.search) q = q.ilike("nickname", `%${data.search}%`);
    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);
    return { users: rows ?? [], total: count ?? 0 };
  });

/** 消息列表(含附件,默认按时间倒序) */
export const adminListMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      search: z.string().optional(),
      userId: z.string().uuid().optional(),
      hasMedia: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    let q = supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at, read_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.search) q = q.ilike("content", `%${data.search}%`);
    if (data.userId) q = q.eq("sender_id", data.userId);
    const { data: msgs, count, error } = await q;
    if (error) throw new Error(error.message);

    const ids = (msgs ?? []).map((m) => m.id);
    const senderIds = Array.from(new Set((msgs ?? []).map((m) => m.sender_id)));

    const [{ data: atts }, { data: profs }] = await Promise.all([
      ids.length
        ? supabase.from("message_attachments").select("*").in("message_id", ids)
        : Promise.resolve({ data: [] as any[] }),
      senderIds.length
        ? supabase.from("profiles").select("id, nickname, photos, main_idx").in("id", senderIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const attMap = new Map<string, any[]>();
    (atts ?? []).forEach((a: any) => {
      const arr = attMap.get(a.message_id) ?? [];
      arr.push(a);
      attMap.set(a.message_id, arr);
    });
    const profMap = new Map<string, any>();
    (profs ?? []).forEach((p: any) => profMap.set(p.id, p));

    let merged = (msgs ?? []).map((m) => {
      const attachments = attMap.get(m.id) ?? [];
      const p = profMap.get(m.sender_id);
      const photos = Array.isArray(p?.photos) ? p.photos : [];
      return {
        ...m,
        attachments,
        sender: {
          id: m.sender_id,
          nickname: p?.nickname || "未知用户",
          avatar: photos[p?.main_idx ?? 0] || photos[0] || null,
        },
      };
    });
    if (data.hasMedia) merged = merged.filter((m) => m.attachments.length > 0);

    return { messages: merged, total: count ?? 0 };
  });

/** 举报列表 */
export const adminListReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { reports: data ?? [] };
  });

/** 更新举报状态 */
export const adminUpdateReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "reviewing", "resolved", "rejected"]),
      resolutionNote: z.string().trim().max(500).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "resolved" || data.status === "rejected") {
      patch.resolved_at = new Date().toISOString();
      patch.resolved_by = userId;
    }
    if (data.resolutionNote !== undefined) patch.resolution_note = data.resolutionNote || null;
    const { error } = await supabase
      .from("reports")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabase.from("moderation_actions").insert({
      admin_id: userId, target_type: "report", target_id: data.id,
      action: `update_status:${data.status}`,
      note: data.resolutionNote ?? null,
    } as never);
    return { ok: true };
  });

/** 管理员:申诉列表 */
export const adminListAppeals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("appeals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { appeals: data ?? [] };
  });

/** 管理员:处理申诉 */
export const adminResolveAppeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "reviewing", "accepted", "rejected"]),
      resolutionNote: z.string().trim().max(500).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "accepted" || data.status === "rejected") {
      patch.resolved_at = new Date().toISOString();
      patch.resolved_by = userId;
    }
    if (data.resolutionNote !== undefined) patch.resolution_note = data.resolutionNote || null;
    const { error } = await supabase
      .from("appeals")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabase.from("moderation_actions").insert({
      admin_id: userId, target_type: "appeal", target_id: data.id,
      action: `appeal:${data.status}`,
      note: data.resolutionNote ?? null,
    } as never);
    return { ok: true };
  });

/** 树洞列表 */
export const adminListTreehole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("treehole_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { posts: data ?? [] };
  });

/** 社区帖子列表 */
export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { status?: string } | undefined) =>
    z.object({
      status: z.enum(["all", "pending", "approved", "rejected", "removed"]).default("pending"),
    }).parse(i ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    let q = supabase
      .from("community_posts")
      .select("id, author_id, title, content, category, hot, likes_count, comments_count, created_at, status, auto_flag_reason, review_note, reviewed_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    // 同时查询每个帖子的待处理举报数
    const ids = (rows ?? []).map((r: any) => r.id);
    let reportCount = new Map<string, number>();
    if (ids.length > 0) {
      const { data: rep } = await supabaseAdmin
        .from("reports")
        .select("target_id, status")
        .eq("target_type", "post")
        .in("target_id", ids);
      (rep ?? []).forEach((r: any) => {
        if (r.status === "pending") {
          reportCount.set(r.target_id, (reportCount.get(r.target_id) ?? 0) + 1);
        }
      });
    }
    return {
      posts: (rows ?? []).map((r: any) => ({ ...r, reports_pending: reportCount.get(r.id) ?? 0 })),
    };
  });

/** 删除消息(管理员) */
export const adminDeleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    // 默认 messages 表没开 DELETE 策略,通过更新 content 软删除
    const { error } = await supabase
      .from("messages")
      .update({ content: "[已被管理员删除]" } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabase.from("moderation_actions").insert({
      admin_id: userId, target_type: "message", target_id: data.id, action: "soft_delete",
    } as never);
    return { ok: true };
  });

/** 添加内容标记 */
export const adminFlagContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      targetType: z.enum(["message", "post", "treehole", "profile"]),
      targetId: z.string().uuid(),
      reason: z.string().min(1).max(200),
      severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("content_flags").insert({
      target_type: data.targetType, target_id: data.targetId,
      reason: data.reason, severity: data.severity, source: "user",
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ==================== 审核模块 ==================== */

/** 审核队列:用户照片(头像 + 相册) */
export const adminListPhotoQueue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      onlyFlagged: z.boolean().default(false),
      limit: z.number().min(1).max(100).default(40),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const { data: profs, error } = await supabase
      .from("profiles")
      .select("id, nickname, gender, city, photos, main_idx, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);

    const items: any[] = [];
    for (const p of profs ?? []) {
      const photos = Array.isArray(p.photos) ? (p.photos as string[]) : [];
      photos.forEach((url, idx) => {
        items.push({
          profileId: p.id,
          nickname: p.nickname,
          gender: p.gender,
          city: p.city,
          idx,
          isMain: (p.main_idx ?? 0) === idx,
          url,
        });
      });
    }

    // 已审核记录
    const { data: actions } = await supabaseAdmin
      .from("moderation_actions")
      .select("target_id, action, note")
      .eq("target_type", "profile_photo")
      .limit(2000);
    const decided = new Map<string, string>();
    (actions ?? []).forEach((a: any) => {
      const key = `${a.target_id}:${a.note}`;
      decided.set(key, a.action);
    });

    const decorated = items.map((it) => ({
      ...it,
      decision: decided.get(`${it.profileId}:${it.idx}`) ?? "pending",
    }));
    const queue = data.onlyFlagged ? decorated.filter((x) => x.decision === "pending") : decorated;
    return { items: queue };
  });

/** 通过/拒绝某张用户照片;拒绝会从 profile.photos 中移除该照片 */
export const adminReviewPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      profileId: z.string().uuid(),
      idx: z.number().int().min(0).max(20),
      action: z.enum(["approve", "reject"]),
      reason: z.string().max(200).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    if (data.action === "reject") {
      const { data: prof, error: pErr } = await supabaseAdmin
        .from("profiles")
        .select("photos, main_idx")
        .eq("id", data.profileId)
        .single();
      if (pErr) throw new Error(pErr.message);
      const photos = Array.isArray(prof?.photos) ? (prof!.photos as string[]) : [];
      const next = photos.filter((_, i) => i !== data.idx);
      let mainIdx = prof?.main_idx ?? 0;
      if (mainIdx >= next.length) mainIdx = 0;
      const { error: uErr } = await supabaseAdmin
        .from("profiles")
        .update({ photos: next, main_idx: mainIdx } as never)
        .eq("id", data.profileId);
      if (uErr) throw new Error(uErr.message);

      await supabaseAdmin.from("content_flags").insert({
        target_type: "profile", target_id: data.profileId,
        reason: data.reason || "照片不合规", severity: "medium", source: "admin", status: "resolved",
      } as never);
    }

    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "profile_photo", target_id: data.profileId,
      action: data.action, note: String(data.idx),
    } as never);
    return { ok: true };
  });

/** 审核:社区帖子(支持删除 + 标记) */
export const adminReviewPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      action: z.enum(["approve", "reject", "remove"]),
      reason: z.string().max(200).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    if (data.action === "remove") {
      const { error } = await supabaseAdmin
        .from("community_posts")
        .update({
          status: "removed",
          review_note: data.reason ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      await supabaseAdmin.from("content_flags").insert({
        target_type: "post", target_id: data.id,
        reason: data.reason || "已被管理员移除", severity: "high", source: "admin", status: "resolved",
      } as never);
    } else if (data.action === "reject") {
      const { error } = await supabaseAdmin
        .from("community_posts")
        .update({
          status: "rejected",
          review_note: data.reason ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      // approve
      const { error } = await supabaseAdmin
        .from("community_posts")
        .update({
          status: "approved",
          review_note: data.reason ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      // 同步关闭相关举报
      await supabaseAdmin
        .from("reports")
        .update({
          status: "rejected",
          resolution_note: "审核后帖子已通过",
          resolved_by: userId,
          resolved_at: new Date().toISOString(),
        } as never)
        .eq("target_type", "post")
        .eq("target_id", data.id)
        .eq("status", "pending");
    }
    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "post", target_id: data.id, action: data.action, note: data.reason ?? null,
    } as never);
    return { ok: true };
  });

/** 审核:树洞帖子 */
export const adminReviewTreehole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      action: z.enum(["approve", "remove"]),
      reason: z.string().max(200).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    if (data.action === "remove") {
      const { error } = await supabaseAdmin.from("treehole_posts").delete().eq("id", data.id);
      if (error) throw new Error(error.message);
      await supabaseAdmin.from("content_flags").insert({
        target_type: "treehole", target_id: data.id,
        reason: data.reason || "已被管理员移除", severity: "high", source: "admin", status: "resolved",
      } as never);
    }
    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "treehole", target_id: data.id, action: data.action, note: data.reason ?? null,
    } as never);
    return { ok: true };
  });

/** 审核队列汇总数据(给审核 tab 顶部) */
export const adminModerationSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const countOf = async (table: string, filter?: (q: any) => any) => {
      let q: any = (supabase as any).from(table).select("*", { count: "exact", head: true });
      if (filter) q = filter(q);
      const { count } = await q;
      return count ?? 0;
    };
    const [posts, treehole, flagsOpen, reportsPending] = await Promise.all([
      countOf("community_posts", (q) => q.eq("status", "pending")),
      countOf("treehole_posts"),
      countOf("content_flags", (q) => q.eq("status", "open")),
      countOf("reports", (q) => q.eq("status", "pending")),
    ]);
    return { posts, treehole, flagsOpen, reportsPending };
  });

/* ==================== 角色权限管理 ==================== */

const ROLE_ENUM = ["admin", "moderator", "user"] as const;

/** 列出员工/角色:支持邮箱/昵称搜索,返回 profile + 角色 + 邮箱 */
export const adminListRoleMembers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      search: z.string().max(200).optional(),
      onlyStaff: z.boolean().default(false),
      limit: z.number().min(1).max(100).default(50),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    // 拉取角色映射
    const { data: roleRows, error: rErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at");
    if (rErr) throw new Error(rErr.message);
    const roleMap = new Map<string, { role: string; created_at: string }[]>();
    (roleRows ?? []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push({ role: r.role, created_at: r.created_at });
      roleMap.set(r.user_id, arr);
    });

    // 候选用户:onlyStaff 则只取已有角色的用户
    let candidateIds: string[] | null = null;
    if (data.onlyStaff) {
      candidateIds = Array.from(roleMap.keys());
      if (candidateIds.length === 0) return { members: [] };
    }

    let q = supabaseAdmin
      .from("profiles")
      .select("id, nickname, photos, main_idx, city, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (candidateIds) q = q.in("id", candidateIds);
    if (data.search) q = q.ilike("nickname", `%${data.search}%`);
    const { data: profs, error: pErr } = await q;
    if (pErr) throw new Error(pErr.message);

    // 邮箱:逐个查 auth.admin.getUserById(限量,避免 listUsers 全表扫)
    const members = await Promise.all(
      (profs ?? []).map(async (p: any) => {
        let email: string | null = null;
        try {
          const { data: u } = await supabaseAdmin.auth.admin.getUserById(p.id);
          email = u?.user?.email ?? null;
        } catch {}
        const photos = Array.isArray(p.photos) ? p.photos : [];
        return {
          id: p.id,
          nickname: p.nickname,
          email,
          city: p.city,
          avatar: photos[p.main_idx ?? 0] || photos[0] || null,
          created_at: p.created_at,
          roles: (roleMap.get(p.id) ?? []).map((r) => r.role),
        };
      }),
    );
    return { members };
  });

/** 通过邮箱/昵称查找用户(给授权弹窗用) */
export const adminFindUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ query: z.string().min(1).max(200) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const q = data.query.trim();
    // 尝试邮箱
    if (q.includes("@")) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const u = list?.users?.find((x) => (x.email || "").toLowerCase() === q.toLowerCase());
      if (!u) return { users: [] };
      const { data: prof } = await supabaseAdmin
        .from("profiles").select("id, nickname, photos, main_idx").eq("id", u.id).maybeSingle();
      const photos = Array.isArray(prof?.photos) ? (prof!.photos as string[]) : [];
      return {
        users: [{
          id: u.id, email: u.email, nickname: prof?.nickname ?? u.email,
          avatar: photos[prof?.main_idx ?? 0] || photos[0] || null,
        }],
      };
    }
    // 否则按昵称
    const { data: profs } = await supabaseAdmin
      .from("profiles").select("id, nickname, photos, main_idx").ilike("nickname", `%${q}%`).limit(20);
    return {
      users: (profs ?? []).map((p: any) => {
        const photos = Array.isArray(p.photos) ? p.photos : [];
        return { id: p.id, email: null, nickname: p.nickname, avatar: photos[p.main_idx ?? 0] || photos[0] || null };
      }),
    };
  });

/** 授予角色 */
export const adminAssignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      targetUserId: z.string().uuid(),
      role: z.enum(ROLE_ENUM),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.targetUserId, role: data.role } as never);
    if (error && !/duplicate key/i.test(error.message)) throw new Error(error.message);
    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "user_role", target_id: data.targetUserId,
      action: `grant:${data.role}`,
    } as never);
    return { ok: true };
  });

/** 撤销角色 */
export const adminRevokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      targetUserId: z.string().uuid(),
      role: z.enum(ROLE_ENUM),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    // 防止移除最后一个 admin
    if (data.role === "admin") {
      const { count } = await supabaseAdmin
        .from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "admin");
      if ((count ?? 0) <= 1) throw new Error("不能移除最后一位管理员");
      if (data.targetUserId === userId) {
        // 允许移除自己,只要还有其他管理员
      }
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.targetUserId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "user_role", target_id: data.targetUserId,
      action: `revoke:${data.role}`,
    } as never);
    return { ok: true };
  });

/* ==================== 短视频 / 评论审核 ==================== */

export const adminListShortVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      status: z.enum(["all", "published", "removed"]).default("all"),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    let q: any = supabaseAdmin
      .from("short_videos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);
    const authorIds: string[] = Array.from(new Set((rows ?? []).map((r: any) => String(r.author_id))));
    const { data: profs } = authorIds.length
      ? await supabaseAdmin.from("profiles").select("id,nickname,photos,main_idx").in("id", authorIds)
      : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
    const videos = (rows ?? []).map((r: any) => ({ ...r, author: map.get(r.author_id) ?? null }));
    return { videos, total: count ?? 0 };
  });

export const adminReviewShortVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      action: z.enum(["remove", "restore", "delete"]),
      reason: z.string().max(200).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    if (data.action === "delete") {
      const { error } = await supabaseAdmin.from("short_videos").delete().eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const next = data.action === "remove" ? "removed" : "published";
      const { error } = await supabaseAdmin.from("short_videos").update({ status: next } as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    }
    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "video", target_id: data.id, action: data.action, note: data.reason ?? null,
    } as never);
    if (data.action !== "restore") {
      await supabaseAdmin.from("content_flags").insert({
        target_type: "video", target_id: data.id,
        reason: data.reason || `管理员${data.action === "delete" ? "删除" : "下架"}`,
        severity: "high", source: "admin", status: "resolved",
      } as never);
    }
    return { ok: true };
  });

export const adminListVideoComments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      videoId: z.string().uuid().optional(),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    let q: any = supabaseAdmin
      .from("short_video_comments")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.videoId) q = q.eq("video_id", data.videoId);
    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);
    const ids: string[] = Array.from(new Set((rows ?? []).map((r: any) => String(r.author_id))));
    const { data: profs } = ids.length
      ? await supabaseAdmin.from("profiles").select("id,nickname").in("id", ids)
      : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
    const comments = (rows ?? []).map((r: any) => ({ ...r, author: map.get(r.author_id) ?? null }));
    return { comments, total: count ?? 0 };
  });

export const adminDeleteVideoComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid(), reason: z.string().max(200).optional() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabaseAdmin.from("short_video_comments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("moderation_actions").insert({
      admin_id: userId, target_type: "video_comment", target_id: data.id, action: "delete", note: data.reason ?? null,
    } as never);
    return { ok: true };
  });

/* ==================== 钱包 / 礼物 审计 ==================== */

export const adminWalletOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const { data: walletAgg } = await supabaseAdmin.from("wallets").select("coins,pro_until");
    const totalCoins = (walletAgg ?? []).reduce((s, w: any) => s + (w.coins || 0), 0);
    const now = Date.now();
    const proActive = (walletAgg ?? []).filter((w: any) => w.pro_until && new Date(w.pro_until).getTime() > now).length;

    const sumByKind = async (kind: string) => {
      const { data } = await supabaseAdmin.from("wallet_ledger").select("delta").eq("kind", kind);
      return (data ?? []).reduce((s, r: any) => s + (r.delta || 0), 0);
    };
    const [topupSum, proSum, giftSentSum, giftRecvSum] = await Promise.all([
      sumByKind("topup"),
      sumByKind("pro_sub"),
      sumByKind("gift_sent"),
      sumByKind("gift_received"),
    ]);

    const { count: giftCount } = await supabaseAdmin
      .from("gift_transactions")
      .select("*", { count: "exact", head: true });

    return {
      totalCoins,
      proActive,
      walletsCount: walletAgg?.length ?? 0,
      topupTotal: topupSum,
      proRevenue: -proSum, // negative deltas
      giftSentTotal: -giftSentSum,
      giftReceivedTotal: giftRecvSum,
      giftCount: giftCount ?? 0,
    };
  });

export const adminListGifts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data: rows, count, error } = await supabaseAdmin
      .from("gift_transactions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (error) throw new Error(error.message);
    const ids: string[] = Array.from(new Set((rows ?? []).flatMap((r: any) => [String(r.sender_id), String(r.receiver_id)])));
    const { data: profs } = ids.length
      ? await supabaseAdmin.from("profiles").select("id,nickname").in("id", ids)
      : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.id, p.nickname]));
    const gifts = (rows ?? []).map((r: any) => ({
      ...r,
      sender_name: map.get(r.sender_id) || "—",
      receiver_name: map.get(r.receiver_id) || "—",
    }));
    return { gifts, total: count ?? 0 };
  });

export const adminListLedger = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      kind: z.enum(["all", "topup", "pro_sub", "gift_sent", "gift_received"]).default("all"),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    let q: any = supabaseAdmin
      .from("wallet_ledger")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.kind !== "all") q = q.eq("kind", data.kind);
    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);
    const ids: string[] = Array.from(new Set((rows ?? []).map((r: any) => String(r.user_id))));
    const { data: profs } = ids.length
      ? await supabaseAdmin.from("profiles").select("id,nickname").in("id", ids)
      : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.id, p.nickname]));
    const ledger = (rows ?? []).map((r: any) => ({ ...r, nickname: map.get(r.user_id) || "—" }));
    return { ledger, total: count ?? 0 };
  });