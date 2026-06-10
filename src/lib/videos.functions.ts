import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** 客户端先把视频/封面上传到 `short-videos` 桶的 `<uid>/...` 目录,再调本接口写库。 */
export const publishShortVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        videoUrl: z.string().url().max(2000),
        coverUrl: z.string().url().max(2000).optional(),
        caption: z.string().max(300).default(""),
        durationSec: z.number().int().min(1).max(180).optional(),
        width: z.number().int().min(1).max(8000).optional(),
        height: z.number().int().min(1).max(8000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // 安全:URL 必须来自当前用户自己的目录
    if (!data.videoUrl.includes(`/short-videos/${userId}/`)) {
      throw new Error("视频地址不属于你");
    }
    const { data: row, error } = await supabase
      .from("short_videos")
      .insert({
        author_id: userId,
        video_url: data.videoUrl,
        cover_url: data.coverUrl ?? null,
        caption: data.caption,
        duration_sec: data.durationSec ?? null,
        width: data.width ?? null,
        height: data.height ?? null,
      } as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (row as any).id };
  });

export type ShortVideoFeedItem = {
  id: string;
  author_id: string;
  video_url: string;
  cover_url: string | null;
  caption: string;
  duration_sec: number | null;
  likes_count: number;
  views_count: number;
  created_at: string;
  liked_by_me: boolean;
  comments_count: number;
  author: {
    id: string;
    nickname: string;
    avatar: string | null;
    city: string | null;
  };
};

export const listShortVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        scope: z.enum(["all", "mine", "author"]).default("all"),
        authorId: z.string().uuid().optional(),
        limit: z.number().int().min(1).max(50).default(20),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ items: ShortVideoFeedItem[] }> => {
    const { supabase, userId } = context;
    let q = supabase
      .from("short_videos")
      .select("id, author_id, video_url, cover_url, caption, duration_sec, likes_count, views_count, comments_count, created_at, status")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.scope === "mine") q = q.eq("author_id", userId);
    if (data.scope === "author" && data.authorId) q = q.eq("author_id", data.authorId);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const list = (rows ?? []) as any[];
    if (!list.length) return { items: [] };

    const authorIds = Array.from(new Set(list.map((r) => r.author_id)));
    const [{ data: profs }, { data: myLikes }] = await Promise.all([
      supabase.from("profiles").select("id, nickname, photos, main_idx, city").in("id", authorIds),
      supabase
        .from("short_video_likes")
        .select("video_id")
        .eq("user_id", userId)
        .in("video_id", list.map((r) => r.id)),
    ]);
    const profMap = new Map<string, any>();
    (profs ?? []).forEach((p: any) => profMap.set(p.id, p));
    const likedSet = new Set((myLikes ?? []).map((r: any) => r.video_id));

    return {
      items: list.map((r) => {
        const p = profMap.get(r.author_id);
        const photos = Array.isArray(p?.photos) ? (p.photos as string[]) : [];
        return {
          id: r.id,
          author_id: r.author_id,
          video_url: r.video_url,
          cover_url: r.cover_url,
          caption: r.caption ?? "",
          duration_sec: r.duration_sec,
          likes_count: r.likes_count,
          views_count: r.views_count,
          comments_count: r.comments_count ?? 0,
          created_at: r.created_at,
          liked_by_me: likedSet.has(r.id),
          author: {
            id: r.author_id,
            nickname: p?.nickname ?? "Pulse 用户",
            avatar: photos[p?.main_idx ?? 0] || photos[0] || null,
            city: p?.city ?? null,
          },
        };
      }),
    };
  });

export const toggleVideoLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ videoId: z.string().uuid(), like: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.like) {
      const { error } = await supabase
        .from("short_video_likes")
        .insert({ video_id: data.videoId, user_id: userId } as never);
      if (error && !String(error.message).includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("short_video_likes")
        .delete()
        .eq("video_id", data.videoId)
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteShortVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("short_videos")
      .delete()
      .eq("id", data.id)
      .eq("author_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ===== 语音名片 ===== */

export const saveVoiceCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        url: z.string().url().max(2000),
        durationSec: z.number().int().min(1).max(60),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (!data.url.includes(`/voice-cards/${userId}/`)) {
      throw new Error("语音地址不属于你");
    }
    const { error } = await supabase
      .from("profiles")
      .update({ voice_card_url: data.url, voice_card_duration: data.durationSec } as never)
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteVoiceCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({ voice_card_url: null, voice_card_duration: null } as never)
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ===== 短视频评论 ===== */

export type ShortVideoComment = {
  id: string;
  video_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author_nickname: string | null;
  author_avatar: string | null;
};

export const listVideoComments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ videoId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ comments: ShortVideoComment[] }> => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("short_video_comments")
      .select("id, video_id, author_id, content, created_at")
      .eq("video_id", data.videoId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((rows ?? []).map((r: any) => r.author_id as string)));
    const profMap = new Map<string, any>();
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, nickname, photos, main_idx")
        .in("id", ids);
      (profs ?? []).forEach((p: any) => profMap.set(p.id, p));
    }
    return {
      comments: (rows ?? []).map((r: any) => {
        const p = profMap.get(r.author_id);
        const photos = Array.isArray(p?.photos) ? (p.photos as string[]) : [];
        return {
          id: r.id,
          video_id: r.video_id,
          author_id: r.author_id,
          content: r.content,
          created_at: r.created_at,
          author_nickname: p?.nickname ?? null,
          author_avatar: photos[p?.main_idx ?? 0] || photos[0] || null,
        };
      }),
    };
  });

export const addVideoComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        videoId: z.string().uuid(),
        content: z.string().trim().min(1).max(500),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("short_video_comments")
      .insert({ video_id: data.videoId, author_id: userId, content: data.content } as never)
      .select("id, video_id, author_id, content, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { comment: row };
  });

export const deleteVideoComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("short_video_comments")
      .delete()
      .eq("id", data.id)
      .eq("author_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });