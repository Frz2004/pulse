import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { s as supabaseAdmin } from "./client.server-CIpsZVxu.js";
import { o as objectType, n as numberType, s as stringType, b as booleanType, e as enumType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
async function assertAdmin(supabase, userId) {
  const {
    data,
    error
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("没有管理员权限");
}
const checkIsAdmin_createServerFn_handler = createServerRpc({
  id: "d7ab752d5c5280d2ee84a9875749b1cba0d95c7bbe892baa67e4f3368bfac36c",
  name: "checkIsAdmin",
  filename: "src/lib/admin.functions.ts"
}, (opts) => checkIsAdmin.__executeServer(opts));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(checkIsAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  return {
    isAdmin: !!data
  };
});
const claimFirstAdmin_createServerFn_handler = createServerRpc({
  id: "d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c",
  name: "claimFirstAdmin",
  filename: "src/lib/admin.functions.ts"
}, (opts) => claimFirstAdmin.__executeServer(opts));
const claimFirstAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(claimFirstAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    count,
    error: cErr
  } = await supabaseAdmin.from("user_roles").select("user_id", {
    count: "exact",
    head: true
  }).eq("role", "admin");
  if (cErr) throw new Error(cErr.message);
  if ((count ?? 0) > 0) throw new Error("管理员已存在,请联系现有管理员授权");
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: userId,
    role: "admin"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getAdminStats_createServerFn_handler = createServerRpc({
  id: "4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d",
  name: "getAdminStats",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminStats.__executeServer(opts));
const getAdminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAdminStats_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const countOf = async (table, filter) => {
    let q = supabase.from(table).select("*", {
      count: "exact",
      head: true
    });
    if (filter) q = filter(q);
    const {
      count
    } = await q;
    return count ?? 0;
  };
  const sinceToday = /* @__PURE__ */ new Date();
  sinceToday.setHours(0, 0, 0, 0);
  const [users, messages, msgsToday, posts, treehole, reports, openFlags, calls] = await Promise.all([countOf("profiles"), countOf("messages"), countOf("messages", (q) => q.gte("created_at", sinceToday.toISOString())), countOf("community_posts"), countOf("treehole_posts"), countOf("reports", (q) => q.eq("status", "pending")), countOf("content_flags", (q) => q.eq("status", "open")), countOf("call_sessions")]);
  return {
    stats: {
      users,
      messages,
      messagesToday: msgsToday,
      posts,
      treehole,
      pendingReports: reports,
      openFlags,
      calls
    }
  };
});
const getAdminCharts_createServerFn_handler = createServerRpc({
  id: "9dccd18395564ea0743c536c4cc958af5dd4394c605225c42b0c82c42637320d",
  name: "getAdminCharts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminCharts.__executeServer(opts));
const getAdminCharts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAdminCharts_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const DAYS = 14;
  const since = /* @__PURE__ */ new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (DAYS - 1));
  const sinceISO = since.toISOString();
  const fetchDates = async (table, col = "created_at") => {
    const {
      data,
      error
    } = await supabase.from(table).select(col).gte(col, sinceISO).limit(5e3);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r[col]);
  };
  const [uDates, mDates, pDates, tDates, cDates] = await Promise.all([fetchDates("profiles"), fetchDates("messages"), fetchDates("community_posts"), fetchDates("treehole_posts"), fetchDates("call_sessions", "started_at")]);
  const dayKey = (d) => d.toISOString().slice(0, 10);
  const series = {};
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const k = dayKey(d);
    series[k] = {
      date: k.slice(5),
      users: 0,
      messages: 0,
      posts: 0,
      treehole: 0,
      calls: 0
    };
  }
  const bump = (arr, key) => {
    for (const ts of arr) {
      const k = ts.slice(0, 10);
      if (series[k]) series[k][key] += 1;
    }
  };
  bump(uDates, "users");
  bump(mDates, "messages");
  bump(pDates, "posts");
  bump(tDates, "treehole");
  bump(cDates, "calls");
  const daily = Object.values(series);
  const contentMix = [{
    name: "聊天消息",
    value: mDates.length
  }, {
    name: "社区帖子",
    value: pDates.length
  }, {
    name: "匿名树洞",
    value: tDates.length
  }, {
    name: "语音/视频",
    value: cDates.length
  }];
  const {
    data: flagRows
  } = await supabase.from("content_flags").select("severity, status").limit(2e3);
  const sevMap = {
    low: 0,
    medium: 0,
    high: 0
  };
  let openFlags = 0;
  let resolvedFlags = 0;
  for (const r of flagRows ?? []) {
    const s = r.severity ?? "low";
    sevMap[s] = (sevMap[s] ?? 0) + 1;
    if (r.status === "open") openFlags += 1;
    else resolvedFlags += 1;
  }
  const riskBars = [{
    level: "低危",
    count: sevMap.low ?? 0
  }, {
    level: "中危",
    count: sevMap.medium ?? 0
  }, {
    level: "高危",
    count: sevMap.high ?? 0
  }];
  const {
    data: reportRows
  } = await supabase.from("reports").select("status").limit(2e3);
  const rMap = {};
  for (const r of reportRows ?? []) rMap[r.status] = (rMap[r.status] ?? 0) + 1;
  const reportPie = [{
    name: "待处理",
    value: rMap["pending"] ?? 0
  }, {
    name: "已处理",
    value: rMap["resolved"] ?? 0
  }, {
    name: "已驳回",
    value: rMap["dismissed"] ?? 0
  }];
  return {
    daily,
    contentMix,
    riskBars,
    reportPie,
    flagStatus: {
      open: openFlags,
      resolved: resolvedFlags
    }
  };
});
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
  name: "adminListUsers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  search: stringType().optional(),
  limit: numberType().min(1).max(100).default(30),
  offset: numberType().min(0).default(0)
}).parse(i)).handler(adminListUsers_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  let q = supabase.from("profiles").select("id, nickname, gender, city, photos, main_idx, onboarded, created_at", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (data.search) q = q.ilike("nickname", `%${data.search}%`);
  const {
    data: rows,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    users: rows ?? [],
    total: count ?? 0
  };
});
const adminListMessages_createServerFn_handler = createServerRpc({
  id: "a93dcca664db7845b2d7a9b6c8f0b0f7cb52a62972f962422ce68f8dd2e3fd1e",
  name: "adminListMessages",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListMessages.__executeServer(opts));
const adminListMessages = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  search: stringType().optional(),
  userId: stringType().uuid().optional(),
  hasMedia: booleanType().optional(),
  limit: numberType().min(1).max(100).default(50),
  offset: numberType().min(0).default(0)
}).parse(i)).handler(adminListMessages_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  let q = supabase.from("messages").select("id, conversation_id, sender_id, content, created_at, read_at", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (data.search) q = q.ilike("content", `%${data.search}%`);
  if (data.userId) q = q.eq("sender_id", data.userId);
  const {
    data: msgs,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const ids = (msgs ?? []).map((m) => m.id);
  const senderIds = Array.from(new Set((msgs ?? []).map((m) => m.sender_id)));
  const [{
    data: atts
  }, {
    data: profs
  }] = await Promise.all([ids.length ? supabase.from("message_attachments").select("*").in("message_id", ids) : Promise.resolve({
    data: []
  }), senderIds.length ? supabase.from("profiles").select("id, nickname, photos, main_idx").in("id", senderIds) : Promise.resolve({
    data: []
  })]);
  const attMap = /* @__PURE__ */ new Map();
  (atts ?? []).forEach((a) => {
    const arr = attMap.get(a.message_id) ?? [];
    arr.push(a);
    attMap.set(a.message_id, arr);
  });
  const profMap = /* @__PURE__ */ new Map();
  (profs ?? []).forEach((p) => profMap.set(p.id, p));
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
        avatar: photos[p?.main_idx ?? 0] || photos[0] || null
      }
    };
  });
  if (data.hasMedia) merged = merged.filter((m) => m.attachments.length > 0);
  return {
    messages: merged,
    total: count ?? 0
  };
});
const adminListReports_createServerFn_handler = createServerRpc({
  id: "4331efd96cf8818a0aa9d7d502d9086b7c2de6e0db941a88fa49b3ef6326520f",
  name: "adminListReports",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListReports.__executeServer(opts));
const adminListReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListReports_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data,
    error
  } = await supabase.from("reports").select("*").order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    reports: data ?? []
  };
});
const adminUpdateReport_createServerFn_handler = createServerRpc({
  id: "82b932a4bbceefc207d98a1e554969002f9f38c966059bb6c5089c67cec1366b",
  name: "adminUpdateReport",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateReport.__executeServer(opts));
const adminUpdateReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  status: enumType(["pending", "reviewing", "resolved", "rejected"]),
  resolutionNote: stringType().trim().max(500).optional()
}).parse(i)).handler(adminUpdateReport_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const patch = {
    status: data.status
  };
  if (data.status === "resolved" || data.status === "rejected") {
    patch.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    patch.resolved_by = userId;
  }
  if (data.resolutionNote !== void 0) patch.resolution_note = data.resolutionNote || null;
  const {
    error
  } = await supabase.from("reports").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabase.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "report",
    target_id: data.id,
    action: `update_status:${data.status}`,
    note: data.resolutionNote ?? null
  });
  return {
    ok: true
  };
});
const adminListAppeals_createServerFn_handler = createServerRpc({
  id: "503b8bc8b7d5a7dd729fb52ea4aa5167f9e31c6e84366131dae55e07e0852c27",
  name: "adminListAppeals",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListAppeals.__executeServer(opts));
const adminListAppeals = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListAppeals_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data,
    error
  } = await supabase.from("appeals").select("*").order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    appeals: data ?? []
  };
});
const adminResolveAppeal_createServerFn_handler = createServerRpc({
  id: "6f34134e479719429f90cb7427509ad3abffe6d06afc9504f1cc9d8243b54f72",
  name: "adminResolveAppeal",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminResolveAppeal.__executeServer(opts));
const adminResolveAppeal = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  status: enumType(["pending", "reviewing", "accepted", "rejected"]),
  resolutionNote: stringType().trim().max(500).optional()
}).parse(i)).handler(adminResolveAppeal_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const patch = {
    status: data.status
  };
  if (data.status === "accepted" || data.status === "rejected") {
    patch.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    patch.resolved_by = userId;
  }
  if (data.resolutionNote !== void 0) patch.resolution_note = data.resolutionNote || null;
  const {
    error
  } = await supabase.from("appeals").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabase.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "appeal",
    target_id: data.id,
    action: `appeal:${data.status}`,
    note: data.resolutionNote ?? null
  });
  return {
    ok: true
  };
});
const adminListTreehole_createServerFn_handler = createServerRpc({
  id: "a428f341f8b2cc051cfaec4048759d305176a17d163293e4b55ac0b327129133",
  name: "adminListTreehole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListTreehole.__executeServer(opts));
const adminListTreehole = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListTreehole_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data,
    error
  } = await supabase.from("treehole_posts").select("*").order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    posts: data ?? []
  };
});
const adminListPosts_createServerFn_handler = createServerRpc({
  id: "c36083dfd2f49d453c7629b8a868d6b2b5a7c9fc0ff160379cfd2d3adcba24b4",
  name: "adminListPosts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListPosts.__executeServer(opts));
const adminListPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  status: enumType(["all", "pending", "approved", "rejected", "removed"]).default("pending")
}).parse(i ?? {})).handler(adminListPosts_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  let q = supabase.from("community_posts").select("id, author_id, title, content, category, hot, likes_count, comments_count, created_at, status, auto_flag_reason, review_note, reviewed_at").order("created_at", {
    ascending: false
  }).limit(100);
  if (data.status !== "all") q = q.eq("status", data.status);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const ids = (rows ?? []).map((r) => r.id);
  let reportCount = /* @__PURE__ */ new Map();
  if (ids.length > 0) {
    const {
      data: rep
    } = await supabaseAdmin.from("reports").select("target_id, status").eq("target_type", "post").in("target_id", ids);
    (rep ?? []).forEach((r) => {
      if (r.status === "pending") {
        reportCount.set(r.target_id, (reportCount.get(r.target_id) ?? 0) + 1);
      }
    });
  }
  return {
    posts: (rows ?? []).map((r) => ({
      ...r,
      reports_pending: reportCount.get(r.id) ?? 0
    }))
  };
});
const adminDeleteMessage_createServerFn_handler = createServerRpc({
  id: "8eec2cf3796c533b3105ae32ffff41f9d081738ea9252d35057f78d72160727a",
  name: "adminDeleteMessage",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteMessage.__executeServer(opts));
const adminDeleteMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(adminDeleteMessage_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabase.from("messages").update({
    content: "[已被管理员删除]"
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabase.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "message",
    target_id: data.id,
    action: "soft_delete"
  });
  return {
    ok: true
  };
});
const adminFlagContent_createServerFn_handler = createServerRpc({
  id: "95d2c94a1b72a91bc32865dcd90a9853c7f2912871dd1db0daf8d523d2f223fb",
  name: "adminFlagContent",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminFlagContent.__executeServer(opts));
const adminFlagContent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  targetType: enumType(["message", "post", "treehole", "profile"]),
  targetId: stringType().uuid(),
  reason: stringType().min(1).max(200),
  severity: enumType(["low", "medium", "high", "critical"]).default("medium")
}).parse(i)).handler(adminFlagContent_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabase.from("content_flags").insert({
    target_type: data.targetType,
    target_id: data.targetId,
    reason: data.reason,
    severity: data.severity,
    source: "user"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListPhotoQueue_createServerFn_handler = createServerRpc({
  id: "1e2e998358b42e2b889d59121ac8c1967d9d791af2471153436b6916130871ce",
  name: "adminListPhotoQueue",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListPhotoQueue.__executeServer(opts));
const adminListPhotoQueue = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  onlyFlagged: booleanType().default(false),
  limit: numberType().min(1).max(100).default(40)
}).parse(i)).handler(adminListPhotoQueue_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: profs,
    error
  } = await supabase.from("profiles").select("id, nickname, gender, city, photos, main_idx, created_at").order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (error) throw new Error(error.message);
  const items = [];
  for (const p of profs ?? []) {
    const photos = Array.isArray(p.photos) ? p.photos : [];
    photos.forEach((url, idx) => {
      items.push({
        profileId: p.id,
        nickname: p.nickname,
        gender: p.gender,
        city: p.city,
        idx,
        isMain: (p.main_idx ?? 0) === idx,
        url
      });
    });
  }
  const {
    data: actions
  } = await supabaseAdmin.from("moderation_actions").select("target_id, action, note").eq("target_type", "profile_photo").limit(2e3);
  const decided = /* @__PURE__ */ new Map();
  (actions ?? []).forEach((a) => {
    const key = `${a.target_id}:${a.note}`;
    decided.set(key, a.action);
  });
  const decorated = items.map((it) => ({
    ...it,
    decision: decided.get(`${it.profileId}:${it.idx}`) ?? "pending"
  }));
  const queue = data.onlyFlagged ? decorated.filter((x) => x.decision === "pending") : decorated;
  return {
    items: queue
  };
});
const adminReviewPhoto_createServerFn_handler = createServerRpc({
  id: "dae041045842da23f2ca6c77078aee1645e843a164459376040be62ad3cddc41",
  name: "adminReviewPhoto",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminReviewPhoto.__executeServer(opts));
const adminReviewPhoto = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  profileId: stringType().uuid(),
  idx: numberType().int().min(0).max(20),
  action: enumType(["approve", "reject"]),
  reason: stringType().max(200).optional()
}).parse(i)).handler(adminReviewPhoto_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  if (data.action === "reject") {
    const {
      data: prof,
      error: pErr
    } = await supabaseAdmin.from("profiles").select("photos, main_idx").eq("id", data.profileId).single();
    if (pErr) throw new Error(pErr.message);
    const photos = Array.isArray(prof?.photos) ? prof.photos : [];
    const next = photos.filter((_, i) => i !== data.idx);
    let mainIdx = prof?.main_idx ?? 0;
    if (mainIdx >= next.length) mainIdx = 0;
    const {
      error: uErr
    } = await supabaseAdmin.from("profiles").update({
      photos: next,
      main_idx: mainIdx
    }).eq("id", data.profileId);
    if (uErr) throw new Error(uErr.message);
    await supabaseAdmin.from("content_flags").insert({
      target_type: "profile",
      target_id: data.profileId,
      reason: data.reason || "照片不合规",
      severity: "medium",
      source: "admin",
      status: "resolved"
    });
  }
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "profile_photo",
    target_id: data.profileId,
    action: data.action,
    note: String(data.idx)
  });
  return {
    ok: true
  };
});
const adminReviewPost_createServerFn_handler = createServerRpc({
  id: "119414dcb29c95680653e5a6beb2ddd3de892aef3c3ef25e6e200449f5549625",
  name: "adminReviewPost",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminReviewPost.__executeServer(opts));
const adminReviewPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "reject", "remove"]),
  reason: stringType().max(200).optional()
}).parse(i)).handler(adminReviewPost_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  if (data.action === "remove") {
    const {
      error
    } = await supabaseAdmin.from("community_posts").update({
      status: "removed",
      review_note: data.reason ?? null,
      reviewed_by: userId,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("content_flags").insert({
      target_type: "post",
      target_id: data.id,
      reason: data.reason || "已被管理员移除",
      severity: "high",
      source: "admin",
      status: "resolved"
    });
  } else if (data.action === "reject") {
    const {
      error
    } = await supabaseAdmin.from("community_posts").update({
      status: "rejected",
      review_note: data.reason ?? null,
      reviewed_by: userId,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("community_posts").update({
      status: "approved",
      review_note: data.reason ?? null,
      reviewed_by: userId,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("reports").update({
      status: "rejected",
      resolution_note: "审核后帖子已通过",
      resolved_by: userId,
      resolved_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("target_type", "post").eq("target_id", data.id).eq("status", "pending");
  }
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "post",
    target_id: data.id,
    action: data.action,
    note: data.reason ?? null
  });
  return {
    ok: true
  };
});
const adminReviewTreehole_createServerFn_handler = createServerRpc({
  id: "1aed95df6b6af963118ad54d2ccb90a4ac55bb92c1c2748b51f6d121ec7988ae",
  name: "adminReviewTreehole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminReviewTreehole.__executeServer(opts));
const adminReviewTreehole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "remove"]),
  reason: stringType().max(200).optional()
}).parse(i)).handler(adminReviewTreehole_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  if (data.action === "remove") {
    const {
      error
    } = await supabaseAdmin.from("treehole_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("content_flags").insert({
      target_type: "treehole",
      target_id: data.id,
      reason: data.reason || "已被管理员移除",
      severity: "high",
      source: "admin",
      status: "resolved"
    });
  }
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "treehole",
    target_id: data.id,
    action: data.action,
    note: data.reason ?? null
  });
  return {
    ok: true
  };
});
const adminModerationSummary_createServerFn_handler = createServerRpc({
  id: "7bffdc7e93f457b86e645c6ca18c73e04a91fdba4e724c1af025d4f5236e08e7",
  name: "adminModerationSummary",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminModerationSummary.__executeServer(opts));
const adminModerationSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminModerationSummary_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const countOf = async (table, filter) => {
    let q = supabase.from(table).select("*", {
      count: "exact",
      head: true
    });
    if (filter) q = filter(q);
    const {
      count
    } = await q;
    return count ?? 0;
  };
  const [posts, treehole, flagsOpen, reportsPending] = await Promise.all([countOf("community_posts", (q) => q.eq("status", "pending")), countOf("treehole_posts"), countOf("content_flags", (q) => q.eq("status", "open")), countOf("reports", (q) => q.eq("status", "pending"))]);
  return {
    posts,
    treehole,
    flagsOpen,
    reportsPending
  };
});
const ROLE_ENUM = ["admin", "moderator", "user"];
const adminListRoleMembers_createServerFn_handler = createServerRpc({
  id: "d24d6f32f2e0dc985b2aa9efe4157246f5eff1369828647e5b4e82f335b2b9b2",
  name: "adminListRoleMembers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListRoleMembers.__executeServer(opts));
const adminListRoleMembers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  search: stringType().max(200).optional(),
  onlyStaff: booleanType().default(false),
  limit: numberType().min(1).max(100).default(50)
}).parse(i)).handler(adminListRoleMembers_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: roleRows,
    error: rErr
  } = await supabaseAdmin.from("user_roles").select("user_id, role, created_at");
  if (rErr) throw new Error(rErr.message);
  const roleMap = /* @__PURE__ */ new Map();
  (roleRows ?? []).forEach((r) => {
    const arr = roleMap.get(r.user_id) ?? [];
    arr.push({
      role: r.role,
      created_at: r.created_at
    });
    roleMap.set(r.user_id, arr);
  });
  let candidateIds = null;
  if (data.onlyStaff) {
    candidateIds = Array.from(roleMap.keys());
    if (candidateIds.length === 0) return {
      members: []
    };
  }
  let q = supabaseAdmin.from("profiles").select("id, nickname, photos, main_idx, city, created_at").order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (candidateIds) q = q.in("id", candidateIds);
  if (data.search) q = q.ilike("nickname", `%${data.search}%`);
  const {
    data: profs,
    error: pErr
  } = await q;
  if (pErr) throw new Error(pErr.message);
  const members = await Promise.all((profs ?? []).map(async (p) => {
    let email = null;
    try {
      const {
        data: u
      } = await supabaseAdmin.auth.admin.getUserById(p.id);
      email = u?.user?.email ?? null;
    } catch {
    }
    const photos = Array.isArray(p.photos) ? p.photos : [];
    return {
      id: p.id,
      nickname: p.nickname,
      email,
      city: p.city,
      avatar: photos[p.main_idx ?? 0] || photos[0] || null,
      created_at: p.created_at,
      roles: (roleMap.get(p.id) ?? []).map((r) => r.role)
    };
  }));
  return {
    members
  };
});
const adminFindUser_createServerFn_handler = createServerRpc({
  id: "fdacaff674bd1bcf368040e69a0ce75718324233bfef1c2ec7e783c7f5f01d2b",
  name: "adminFindUser",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminFindUser.__executeServer(opts));
const adminFindUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  query: stringType().min(1).max(200)
}).parse(i)).handler(adminFindUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const q = data.query.trim();
  if (q.includes("@")) {
    const {
      data: list
    } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200
    });
    const u = list?.users?.find((x) => (x.email || "").toLowerCase() === q.toLowerCase());
    if (!u) return {
      users: []
    };
    const {
      data: prof
    } = await supabaseAdmin.from("profiles").select("id, nickname, photos, main_idx").eq("id", u.id).maybeSingle();
    const photos = Array.isArray(prof?.photos) ? prof.photos : [];
    return {
      users: [{
        id: u.id,
        email: u.email,
        nickname: prof?.nickname ?? u.email,
        avatar: photos[prof?.main_idx ?? 0] || photos[0] || null
      }]
    };
  }
  const {
    data: profs
  } = await supabaseAdmin.from("profiles").select("id, nickname, photos, main_idx").ilike("nickname", `%${q}%`).limit(20);
  return {
    users: (profs ?? []).map((p) => {
      const photos = Array.isArray(p.photos) ? p.photos : [];
      return {
        id: p.id,
        email: null,
        nickname: p.nickname,
        avatar: photos[p.main_idx ?? 0] || photos[0] || null
      };
    })
  };
});
const adminAssignRole_createServerFn_handler = createServerRpc({
  id: "c39f0463c9489f3f30a5c28a63c3c970343ad9d21cfd932473b2525683655898",
  name: "adminAssignRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminAssignRole.__executeServer(opts));
const adminAssignRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  targetUserId: stringType().uuid(),
  role: enumType(ROLE_ENUM)
}).parse(i)).handler(adminAssignRole_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: data.targetUserId,
    role: data.role
  });
  if (error && !/duplicate key/i.test(error.message)) throw new Error(error.message);
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "user_role",
    target_id: data.targetUserId,
    action: `grant:${data.role}`
  });
  return {
    ok: true
  };
});
const adminRevokeRole_createServerFn_handler = createServerRpc({
  id: "5077ffafbd2ba356c8d8550157ab422eb3cc2656d284675d3dba0760c3f12469",
  name: "adminRevokeRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminRevokeRole.__executeServer(opts));
const adminRevokeRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  targetUserId: stringType().uuid(),
  role: enumType(ROLE_ENUM)
}).parse(i)).handler(adminRevokeRole_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  if (data.role === "admin") {
    const {
      count
    } = await supabaseAdmin.from("user_roles").select("user_id", {
      count: "exact",
      head: true
    }).eq("role", "admin");
    if ((count ?? 0) <= 1) throw new Error("不能移除最后一位管理员");
    if (data.targetUserId === userId) ;
  }
  const {
    error
  } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.targetUserId).eq("role", data.role);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "user_role",
    target_id: data.targetUserId,
    action: `revoke:${data.role}`
  });
  return {
    ok: true
  };
});
const adminListShortVideos_createServerFn_handler = createServerRpc({
  id: "935d0ce790fb56cdc7b095bc64e37722f6a9a0fe9a89c163d8a3c255edb49999",
  name: "adminListShortVideos",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListShortVideos.__executeServer(opts));
const adminListShortVideos = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  status: enumType(["all", "published", "removed"]).default("all"),
  limit: numberType().int().min(1).max(100).default(50),
  offset: numberType().int().min(0).default(0)
}).parse(i)).handler(adminListShortVideos_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  let q = supabaseAdmin.from("short_videos").select("*", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (data.status !== "all") q = q.eq("status", data.status);
  const {
    data: rows,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const authorIds = Array.from(new Set((rows ?? []).map((r) => String(r.author_id))));
  const {
    data: profs
  } = authorIds.length ? await supabaseAdmin.from("profiles").select("id,nickname,photos,main_idx").in("id", authorIds) : {
    data: []
  };
  const map = new Map((profs ?? []).map((p) => [p.id, p]));
  const videos = (rows ?? []).map((r) => ({
    ...r,
    author: map.get(r.author_id) ?? null
  }));
  return {
    videos,
    total: count ?? 0
  };
});
const adminReviewShortVideo_createServerFn_handler = createServerRpc({
  id: "8b4f5a341f6ab6645eaa8345109db44a8917a4c7c2fe4bf00a3c80a169b0a50d",
  name: "adminReviewShortVideo",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminReviewShortVideo.__executeServer(opts));
const adminReviewShortVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  action: enumType(["remove", "restore", "delete"]),
  reason: stringType().max(200).optional()
}).parse(i)).handler(adminReviewShortVideo_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  if (data.action === "delete") {
    const {
      error
    } = await supabaseAdmin.from("short_videos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const next = data.action === "remove" ? "removed" : "published";
    const {
      error
    } = await supabaseAdmin.from("short_videos").update({
      status: next
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
  }
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "video",
    target_id: data.id,
    action: data.action,
    note: data.reason ?? null
  });
  if (data.action !== "restore") {
    await supabaseAdmin.from("content_flags").insert({
      target_type: "video",
      target_id: data.id,
      reason: data.reason || `管理员${data.action === "delete" ? "删除" : "下架"}`,
      severity: "high",
      source: "admin",
      status: "resolved"
    });
  }
  return {
    ok: true
  };
});
const adminListVideoComments_createServerFn_handler = createServerRpc({
  id: "565ea1ab7ea92b90c9db88ec05a771cb41b408bdecc7474cacfa6f8cbf3b1cbc",
  name: "adminListVideoComments",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListVideoComments.__executeServer(opts));
const adminListVideoComments = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  videoId: stringType().uuid().optional(),
  limit: numberType().int().min(1).max(100).default(50),
  offset: numberType().int().min(0).default(0)
}).parse(i)).handler(adminListVideoComments_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  let q = supabaseAdmin.from("short_video_comments").select("*", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (data.videoId) q = q.eq("video_id", data.videoId);
  const {
    data: rows,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((rows ?? []).map((r) => String(r.author_id))));
  const {
    data: profs
  } = ids.length ? await supabaseAdmin.from("profiles").select("id,nickname").in("id", ids) : {
    data: []
  };
  const map = new Map((profs ?? []).map((p) => [p.id, p]));
  const comments = (rows ?? []).map((r) => ({
    ...r,
    author: map.get(r.author_id) ?? null
  }));
  return {
    comments,
    total: count ?? 0
  };
});
const adminDeleteVideoComment_createServerFn_handler = createServerRpc({
  id: "2644ce596e550e5621ec538fed7794095c60e09730d72aa6392e089f5b305ffd",
  name: "adminDeleteVideoComment",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteVideoComment.__executeServer(opts));
const adminDeleteVideoComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  reason: stringType().max(200).optional()
}).parse(i)).handler(adminDeleteVideoComment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabaseAdmin.from("short_video_comments").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "video_comment",
    target_id: data.id,
    action: "delete",
    note: data.reason ?? null
  });
  return {
    ok: true
  };
});
const adminWalletOverview_createServerFn_handler = createServerRpc({
  id: "baa292361bfdba24ba0c4901c496f8c94d5f9e91847bf79d726379e7737adacb",
  name: "adminWalletOverview",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminWalletOverview.__executeServer(opts));
const adminWalletOverview = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminWalletOverview_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: walletAgg
  } = await supabaseAdmin.from("wallets").select("coins,pro_until");
  const totalCoins = (walletAgg ?? []).reduce((s, w) => s + (w.coins || 0), 0);
  const now = Date.now();
  const proActive = (walletAgg ?? []).filter((w) => w.pro_until && new Date(w.pro_until).getTime() > now).length;
  const sumByKind = async (kind) => {
    const {
      data
    } = await supabaseAdmin.from("wallet_ledger").select("delta").eq("kind", kind);
    return (data ?? []).reduce((s, r) => s + (r.delta || 0), 0);
  };
  const [topupSum, proSum, giftSentSum, giftRecvSum] = await Promise.all([sumByKind("topup"), sumByKind("pro_sub"), sumByKind("gift_sent"), sumByKind("gift_received")]);
  const {
    count: giftCount
  } = await supabaseAdmin.from("gift_transactions").select("*", {
    count: "exact",
    head: true
  });
  return {
    totalCoins,
    proActive,
    walletsCount: walletAgg?.length ?? 0,
    topupTotal: topupSum,
    proRevenue: -proSum,
    // negative deltas
    giftSentTotal: -giftSentSum,
    giftReceivedTotal: giftRecvSum,
    giftCount: giftCount ?? 0
  };
});
const adminListGifts_createServerFn_handler = createServerRpc({
  id: "311fd6a9a0fbbe441dba5a9eaab60e08bd09cc0bf4235df9dcbae951c8417ed6",
  name: "adminListGifts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListGifts.__executeServer(opts));
const adminListGifts = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  limit: numberType().int().min(1).max(100).default(50),
  offset: numberType().int().min(0).default(0)
}).parse(i)).handler(adminListGifts_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: rows,
    count,
    error
  } = await supabaseAdmin.from("gift_transactions").select("*", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((rows ?? []).flatMap((r) => [String(r.sender_id), String(r.receiver_id)])));
  const {
    data: profs
  } = ids.length ? await supabaseAdmin.from("profiles").select("id,nickname").in("id", ids) : {
    data: []
  };
  const map = new Map((profs ?? []).map((p) => [p.id, p.nickname]));
  const gifts = (rows ?? []).map((r) => ({
    ...r,
    sender_name: map.get(r.sender_id) || "—",
    receiver_name: map.get(r.receiver_id) || "—"
  }));
  return {
    gifts,
    total: count ?? 0
  };
});
const adminListLedger_createServerFn_handler = createServerRpc({
  id: "d4b5558af355f21b9276fd72b33cb2079738589aeda483b6069f96b4015f2f80",
  name: "adminListLedger",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListLedger.__executeServer(opts));
const adminListLedger = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  kind: enumType(["all", "topup", "pro_sub", "gift_sent", "gift_received"]).default("all"),
  limit: numberType().int().min(1).max(100).default(50),
  offset: numberType().int().min(0).default(0)
}).parse(i)).handler(adminListLedger_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  let q = supabaseAdmin.from("wallet_ledger").select("*", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (data.kind !== "all") q = q.eq("kind", data.kind);
  const {
    data: rows,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((rows ?? []).map((r) => String(r.user_id))));
  const {
    data: profs
  } = ids.length ? await supabaseAdmin.from("profiles").select("id,nickname").in("id", ids) : {
    data: []
  };
  const map = new Map((profs ?? []).map((p) => [p.id, p.nickname]));
  const ledger = (rows ?? []).map((r) => ({
    ...r,
    nickname: map.get(r.user_id) || "—"
  }));
  return {
    ledger,
    total: count ?? 0
  };
});
export {
  adminAssignRole_createServerFn_handler,
  adminDeleteMessage_createServerFn_handler,
  adminDeleteVideoComment_createServerFn_handler,
  adminFindUser_createServerFn_handler,
  adminFlagContent_createServerFn_handler,
  adminListAppeals_createServerFn_handler,
  adminListGifts_createServerFn_handler,
  adminListLedger_createServerFn_handler,
  adminListMessages_createServerFn_handler,
  adminListPhotoQueue_createServerFn_handler,
  adminListPosts_createServerFn_handler,
  adminListReports_createServerFn_handler,
  adminListRoleMembers_createServerFn_handler,
  adminListShortVideos_createServerFn_handler,
  adminListTreehole_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminListVideoComments_createServerFn_handler,
  adminModerationSummary_createServerFn_handler,
  adminResolveAppeal_createServerFn_handler,
  adminReviewPhoto_createServerFn_handler,
  adminReviewPost_createServerFn_handler,
  adminReviewShortVideo_createServerFn_handler,
  adminReviewTreehole_createServerFn_handler,
  adminRevokeRole_createServerFn_handler,
  adminUpdateReport_createServerFn_handler,
  adminWalletOverview_createServerFn_handler,
  checkIsAdmin_createServerFn_handler,
  claimFirstAdmin_createServerFn_handler,
  getAdminCharts_createServerFn_handler,
  getAdminStats_createServerFn_handler
};
