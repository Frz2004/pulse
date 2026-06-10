import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { e as enumType, o as objectType, s as stringType, u as unionType, l as literalType, a as arrayType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const CATEGORY = enumType(["second", "vent", "ask"]);
const COVER_BY_CATEGORY = {
  second: "from-mint/40 via-mint/10 to-transparent",
  vent: "from-coral/40 via-coral/10 to-transparent",
  ask: "from-sun/40 via-sun/10 to-transparent"
};
const listCommunityPosts_createServerFn_handler = createServerRpc({
  id: "c4ac17859b6dcb66dca3f7d10d5c5c504816abc4808849a193d293bcb5f90550",
  name: "listCommunityPosts",
  filename: "src/lib/community.functions.ts"
}, (opts) => listCommunityPosts.__executeServer(opts));
const listCommunityPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  category: unionType([CATEGORY, literalType("all")]).optional(),
  campus_id: stringType().uuid().optional()
}).parse(input ?? {})).handler(listCommunityPosts_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  let query = supabase.from("community_posts").select("*").order("created_at", {
    ascending: false
  }).limit(60);
  if (data.category && data.category !== "all") query = query.eq("category", data.category);
  if (data.campus_id) query = query.eq("campus_id", data.campus_id);
  const {
    data: rows,
    error
  } = await query;
  if (error) throw new Error(error.message);
  const ids = (rows ?? []).map((r) => r.id);
  let likedSet = /* @__PURE__ */ new Set();
  if (ids.length > 0) {
    const {
      data: likes
    } = await supabase.from("community_post_likes").select("post_id").eq("user_id", userId).in("post_id", ids);
    likedSet = new Set((likes ?? []).map((l) => l.post_id));
  }
  const authorIds = Array.from(new Set((rows ?? []).map((r) => r.author_id)));
  let authorMap = /* @__PURE__ */ new Map();
  if (authorIds.length > 0) {
    const {
      data: profs
    } = await supabase.from("profiles").select("id, nickname, photos, main_idx").in("id", authorIds);
    for (const p of profs ?? []) {
      const photos = Array.isArray(p.photos) ? p.photos : [];
      const idx = p.main_idx ?? 0;
      authorMap.set(p.id, {
        nickname: p.nickname ?? null,
        avatar: photos[idx] ?? photos[0] ?? null
      });
    }
  }
  return {
    posts: (rows ?? []).map((r) => ({
      id: r.id,
      author_id: r.author_id,
      campus_id: r.campus_id,
      category: r.category,
      title: r.title,
      content: r.content,
      cover: r.cover,
      tags: Array.isArray(r.tags) ? r.tags : [],
      location: r.location,
      likes_count: r.likes_count,
      comments_count: r.comments_count,
      hot: r.hot,
      created_at: r.created_at,
      liked_by_me: likedSet.has(r.id),
      media: Array.isArray(r.media) ? r.media : [],
      author_nickname: authorMap.get(r.author_id)?.nickname ?? null,
      author_avatar: authorMap.get(r.author_id)?.avatar ?? null,
      status: r.status ?? "approved",
      review_note: r.review_note ?? null,
      auto_flag_reason: r.auto_flag_reason ?? null
    }))
  };
});
const createCommunityPost_createServerFn_handler = createServerRpc({
  id: "6142a0706f7116286937c964079522c3e9b06a18f8d353be57cba5fe165ed4a2",
  name: "createCommunityPost",
  filename: "src/lib/community.functions.ts"
}, (opts) => createCommunityPost.__executeServer(opts));
const createCommunityPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  category: CATEGORY,
  title: stringType().trim().min(1).max(120),
  content: stringType().trim().min(1).max(2e3),
  tags: arrayType(stringType().trim().min(1).max(20)).max(6).optional(),
  location: stringType().min(1).max(120),
  media: arrayType(objectType({
    url: stringType().url().max(500),
    type: enumType(["image", "video"])
  })).max(9).optional()
}).parse(input)).handler(createCommunityPost_createServerFn_handler, async ({
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
  } = await supabase.from("community_posts").insert({
    author_id: userId,
    campus_id: data.campus_id,
    category: data.category,
    title: data.title,
    content: data.content,
    cover: COVER_BY_CATEGORY[data.category],
    tags: data.tags ?? [],
    location: data.location,
    media: data.media ?? []
  }).select("id, status, auto_flag_reason").single();
  if (error) throw new Error(error.message);
  return {
    post: row,
    pending: row?.status === "pending"
  };
});
const toggleCommunityLike_createServerFn_handler = createServerRpc({
  id: "0258cb088229b364277c379c5224ed305a1468f57516f608c9f64327042046fa",
  name: "toggleCommunityLike",
  filename: "src/lib/community.functions.ts"
}, (opts) => toggleCommunityLike.__executeServer(opts));
const toggleCommunityLike = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid()
}).parse(input)).handler(toggleCommunityLike_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: existing
  } = await supabase.from("community_post_likes").select("post_id").eq("post_id", data.post_id).eq("user_id", userId).maybeSingle();
  if (existing) {
    const {
      error: error2
    } = await supabase.from("community_post_likes").delete().eq("post_id", data.post_id).eq("user_id", userId);
    if (error2) throw new Error(error2.message);
    return {
      liked: false
    };
  }
  const {
    error
  } = await supabase.from("community_post_likes").insert({
    post_id: data.post_id,
    user_id: userId
  });
  if (error) throw new Error(error.message);
  return {
    liked: true
  };
});
const deleteCommunityPost_createServerFn_handler = createServerRpc({
  id: "31a2a44eae1b60317fd1082df6a3e447bb365254295208ea5a439c5860e6074d",
  name: "deleteCommunityPost",
  filename: "src/lib/community.functions.ts"
}, (opts) => deleteCommunityPost.__executeServer(opts));
const deleteCommunityPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid()
}).parse(input)).handler(deleteCommunityPost_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("community_posts").delete().eq("id", data.post_id).eq("author_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listCommunityComments_createServerFn_handler = createServerRpc({
  id: "9cae02d59ec4c2a8fee89a9ceacd621697f61ec6cb65a432a3d55fee82b0f216",
  name: "listCommunityComments",
  filename: "src/lib/community.functions.ts"
}, (opts) => listCommunityComments.__executeServer(opts));
const listCommunityComments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid()
}).parse(input)).handler(listCommunityComments_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("community_comments").select("id, post_id, author_id, content, created_at").eq("post_id", data.post_id).order("created_at", {
    ascending: true
  }).limit(200);
  if (error) throw new Error(error.message);
  const authorIds = Array.from(new Set((rows ?? []).map((r) => r.author_id)));
  let profMap = /* @__PURE__ */ new Map();
  if (authorIds.length > 0) {
    const {
      data: profiles
    } = await supabase.from("profiles").select("id, nickname, photos, main_idx").in("id", authorIds);
    for (const p of profiles ?? []) {
      const photos = Array.isArray(p.photos) ? p.photos : [];
      const idx = p.main_idx ?? 0;
      profMap.set(p.id, {
        nickname: p.nickname ?? null,
        avatar: photos[idx] ?? photos[0] ?? null
      });
    }
  }
  return {
    comments: (rows ?? []).map((r) => ({
      id: r.id,
      post_id: r.post_id,
      author_id: r.author_id,
      content: r.content,
      created_at: r.created_at,
      author_nickname: profMap.get(r.author_id)?.nickname ?? null,
      author_avatar: profMap.get(r.author_id)?.avatar ?? null
    }))
  };
});
const addCommunityComment_createServerFn_handler = createServerRpc({
  id: "8be7bdcbf8abe255128d6469273f7d6b0c60720a9be99938a2fba96ac4d53369",
  name: "addCommunityComment",
  filename: "src/lib/community.functions.ts"
}, (opts) => addCommunityComment.__executeServer(opts));
const addCommunityComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid(),
  content: stringType().trim().min(1).max(500)
}).parse(input)).handler(addCommunityComment_createServerFn_handler, async ({
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
  } = await supabase.from("community_comments").insert({
    post_id: data.post_id,
    author_id: userId,
    content: data.content
  }).select("id, post_id, author_id, content, created_at").single();
  if (error) throw new Error(error.message);
  const {
    data: profile
  } = await supabase.from("profiles").select("nickname, photos, main_idx").eq("id", userId).maybeSingle();
  const photos = Array.isArray(profile?.photos) ? profile.photos : [];
  const idx = profile?.main_idx ?? 0;
  return {
    comment: {
      id: row.id,
      post_id: row.post_id,
      author_id: row.author_id,
      content: row.content,
      created_at: row.created_at,
      author_nickname: profile?.nickname ?? null,
      author_avatar: photos[idx] ?? photos[0] ?? null
    }
  };
});
const deleteCommunityComment_createServerFn_handler = createServerRpc({
  id: "0aecda8560cfb76a7931c81a74cbdeec8587397083e11325b632ecd418375e67",
  name: "deleteCommunityComment",
  filename: "src/lib/community.functions.ts"
}, (opts) => deleteCommunityComment.__executeServer(opts));
const deleteCommunityComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  comment_id: stringType().uuid()
}).parse(input)).handler(deleteCommunityComment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("community_comments").delete().eq("id", data.comment_id).eq("author_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  addCommunityComment_createServerFn_handler,
  createCommunityPost_createServerFn_handler,
  deleteCommunityComment_createServerFn_handler,
  deleteCommunityPost_createServerFn_handler,
  listCommunityComments_createServerFn_handler,
  listCommunityPosts_createServerFn_handler,
  toggleCommunityLike_createServerFn_handler
};
