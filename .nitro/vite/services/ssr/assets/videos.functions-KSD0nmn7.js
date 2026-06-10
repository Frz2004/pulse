import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, n as numberType, s as stringType, e as enumType, b as booleanType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const publishShortVideo_createServerFn_handler = createServerRpc({
  id: "e26d94357764e438aa6e248bd6c5b3be0a3e6d8c017bf5032758d954acafb9ae",
  name: "publishShortVideo",
  filename: "src/lib/videos.functions.ts"
}, (opts) => publishShortVideo.__executeServer(opts));
const publishShortVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoUrl: stringType().url().max(2e3),
  coverUrl: stringType().url().max(2e3).optional(),
  caption: stringType().max(300).default(""),
  durationSec: numberType().int().min(1).max(180).optional(),
  width: numberType().int().min(1).max(8e3).optional(),
  height: numberType().int().min(1).max(8e3).optional()
}).parse(input)).handler(publishShortVideo_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (!data.videoUrl.includes(`/short-videos/${userId}/`)) {
    throw new Error("视频地址不属于你");
  }
  const {
    data: row,
    error
  } = await supabase.from("short_videos").insert({
    author_id: userId,
    video_url: data.videoUrl,
    cover_url: data.coverUrl ?? null,
    caption: data.caption,
    duration_sec: data.durationSec ?? null,
    width: data.width ?? null,
    height: data.height ?? null
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    id: row.id
  };
});
const listShortVideos_createServerFn_handler = createServerRpc({
  id: "124682a6cf9aa9bf6c626c6cec44f226927b5afaa5723286edf93c8ae780caff",
  name: "listShortVideos",
  filename: "src/lib/videos.functions.ts"
}, (opts) => listShortVideos.__executeServer(opts));
const listShortVideos = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  scope: enumType(["all", "mine", "author"]).default("all"),
  authorId: stringType().uuid().optional(),
  limit: numberType().int().min(1).max(50).default(20)
}).parse(input)).handler(listShortVideos_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  let q = supabase.from("short_videos").select("id, author_id, video_url, cover_url, caption, duration_sec, likes_count, views_count, comments_count, created_at, status").eq("status", "published").order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (data.scope === "mine") q = q.eq("author_id", userId);
  if (data.scope === "author" && data.authorId) q = q.eq("author_id", data.authorId);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const list = rows ?? [];
  if (!list.length) return {
    items: []
  };
  const authorIds = Array.from(new Set(list.map((r) => r.author_id)));
  const [{
    data: profs
  }, {
    data: myLikes
  }] = await Promise.all([supabase.from("profiles").select("id, nickname, photos, main_idx, city").in("id", authorIds), supabase.from("short_video_likes").select("video_id").eq("user_id", userId).in("video_id", list.map((r) => r.id))]);
  const profMap = /* @__PURE__ */ new Map();
  (profs ?? []).forEach((p) => profMap.set(p.id, p));
  const likedSet = new Set((myLikes ?? []).map((r) => r.video_id));
  return {
    items: list.map((r) => {
      const p = profMap.get(r.author_id);
      const photos = Array.isArray(p?.photos) ? p.photos : [];
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
          city: p?.city ?? null
        }
      };
    })
  };
});
const toggleVideoLike_createServerFn_handler = createServerRpc({
  id: "25302a5de44d78f4ac5535b5cacf485d4d497c8e5c132a3adddedde7d75d2a63",
  name: "toggleVideoLike",
  filename: "src/lib/videos.functions.ts"
}, (opts) => toggleVideoLike.__executeServer(opts));
const toggleVideoLike = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoId: stringType().uuid(),
  like: booleanType()
}).parse(input)).handler(toggleVideoLike_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.like) {
    const {
      error
    } = await supabase.from("short_video_likes").insert({
      video_id: data.videoId,
      user_id: userId
    });
    if (error && !String(error.message).includes("duplicate")) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabase.from("short_video_likes").delete().eq("video_id", data.videoId).eq("user_id", userId);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteShortVideo_createServerFn_handler = createServerRpc({
  id: "2c94ede19fa96b7dbc64dd150768e56846fb9c461e0b2978b63b0dde7fe97eab",
  name: "deleteShortVideo",
  filename: "src/lib/videos.functions.ts"
}, (opts) => deleteShortVideo.__executeServer(opts));
const deleteShortVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(deleteShortVideo_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("short_videos").delete().eq("id", data.id).eq("author_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const saveVoiceCard_createServerFn_handler = createServerRpc({
  id: "ef35fe4f45e91bf1636759ae32143fbc52eff09f219728bcd233abc2f90a1a8e",
  name: "saveVoiceCard",
  filename: "src/lib/videos.functions.ts"
}, (opts) => saveVoiceCard.__executeServer(opts));
const saveVoiceCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  url: stringType().url().max(2e3),
  durationSec: numberType().int().min(1).max(60)
}).parse(input)).handler(saveVoiceCard_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (!data.url.includes(`/voice-cards/${userId}/`)) {
    throw new Error("语音地址不属于你");
  }
  const {
    error
  } = await supabase.from("profiles").update({
    voice_card_url: data.url,
    voice_card_duration: data.durationSec
  }).eq("id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteVoiceCard_createServerFn_handler = createServerRpc({
  id: "ad4e74911bc5b242e7ee437e57148e5c0c404bf146d183030fdd630d85f65ccf",
  name: "deleteVoiceCard",
  filename: "src/lib/videos.functions.ts"
}, (opts) => deleteVoiceCard.__executeServer(opts));
const deleteVoiceCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(deleteVoiceCard_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("profiles").update({
    voice_card_url: null,
    voice_card_duration: null
  }).eq("id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listVideoComments_createServerFn_handler = createServerRpc({
  id: "eefc8c6ba353c83fca5498693298ace0d25f440f972d8137da7241ea108b6761",
  name: "listVideoComments",
  filename: "src/lib/videos.functions.ts"
}, (opts) => listVideoComments.__executeServer(opts));
const listVideoComments = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoId: stringType().uuid()
}).parse(input)).handler(listVideoComments_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("short_video_comments").select("id, video_id, author_id, content, created_at").eq("video_id", data.videoId).order("created_at", {
    ascending: true
  }).limit(200);
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((rows ?? []).map((r) => r.author_id)));
  const profMap = /* @__PURE__ */ new Map();
  if (ids.length) {
    const {
      data: profs
    } = await supabase.from("profiles").select("id, nickname, photos, main_idx").in("id", ids);
    (profs ?? []).forEach((p) => profMap.set(p.id, p));
  }
  return {
    comments: (rows ?? []).map((r) => {
      const p = profMap.get(r.author_id);
      const photos = Array.isArray(p?.photos) ? p.photos : [];
      return {
        id: r.id,
        video_id: r.video_id,
        author_id: r.author_id,
        content: r.content,
        created_at: r.created_at,
        author_nickname: p?.nickname ?? null,
        author_avatar: photos[p?.main_idx ?? 0] || photos[0] || null
      };
    })
  };
});
const addVideoComment_createServerFn_handler = createServerRpc({
  id: "9ab731f728a2412770f0617bd99d879bd60e73b7f23ca7173ff2388b4344753e",
  name: "addVideoComment",
  filename: "src/lib/videos.functions.ts"
}, (opts) => addVideoComment.__executeServer(opts));
const addVideoComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoId: stringType().uuid(),
  content: stringType().trim().min(1).max(500)
}).parse(input)).handler(addVideoComment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: row,
    error
  } = await supabase.from("short_video_comments").insert({
    video_id: data.videoId,
    author_id: userId,
    content: data.content
  }).select("id, video_id, author_id, content, created_at").single();
  if (error) throw new Error(error.message);
  return {
    comment: row
  };
});
const deleteVideoComment_createServerFn_handler = createServerRpc({
  id: "980dd6028b980c3cfe44be71cc9f72df43d346327552f12c87c864f5ff8f4539",
  name: "deleteVideoComment",
  filename: "src/lib/videos.functions.ts"
}, (opts) => deleteVideoComment.__executeServer(opts));
const deleteVideoComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(deleteVideoComment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("short_video_comments").delete().eq("id", data.id).eq("author_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  addVideoComment_createServerFn_handler,
  deleteShortVideo_createServerFn_handler,
  deleteVideoComment_createServerFn_handler,
  deleteVoiceCard_createServerFn_handler,
  listShortVideos_createServerFn_handler,
  listVideoComments_createServerFn_handler,
  publishShortVideo_createServerFn_handler,
  saveVoiceCard_createServerFn_handler,
  toggleVideoLike_createServerFn_handler
};
