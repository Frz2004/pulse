import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, n as numberType, a as arrayType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const listMyCampuses_createServerFn_handler = createServerRpc({
  id: "19ce8540b180c5dff1e42d978bd444974bdb8b275370bb9673704242c12dc629",
  name: "listMyCampuses",
  filename: "src/lib/campus.functions.ts"
}, (opts) => listMyCampuses.__executeServer(opts));
const listMyCampuses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyCampuses_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: memberships,
    error
  } = await supabase.from("campus_memberships").select("campus_id, joined_at").eq("user_id", userId);
  if (error) throw new Error(error.message);
  const ids = (memberships ?? []).map((m) => m.campus_id);
  if (ids.length === 0) return {
    campuses: []
  };
  const {
    data: rows,
    error: e2
  } = await supabase.from("campuses").select("*").in("id", ids).order("created_at", {
    ascending: true
  });
  if (e2) throw new Error(e2.message);
  return {
    campuses: rows ?? []
  };
});
const listAllCampuses_createServerFn_handler = createServerRpc({
  id: "a69e85686846c9cb122ffe368b5eeb9c423f00a1cc0704ee601c73c715aa0ef1",
  name: "listAllCampuses",
  filename: "src/lib/campus.functions.ts"
}, (opts) => listAllCampuses.__executeServer(opts));
const listAllCampuses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAllCampuses_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("campuses").select("*").order("created_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    campuses: data ?? []
  };
});
const redeemCampusInvite_createServerFn_handler = createServerRpc({
  id: "b51bea6ec4ca6a2f853bb9451bd0f86ebd850bdb9b7047788764f4767c7f5af7",
  name: "redeemCampusInvite",
  filename: "src/lib/campus.functions.ts"
}, (opts) => redeemCampusInvite.__executeServer(opts));
const redeemCampusInvite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  code: stringType().trim().min(4).max(32)
}).parse(input)).handler(redeemCampusInvite_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: campusId,
    error
  } = await supabase.rpc("redeem_campus_invite", {
    p_code: data.code.toUpperCase()
  });
  if (error) {
    const msg = error.message || "";
    if (msg.includes("INVITE_NOT_FOUND")) throw new Error("邀请码不存在");
    if (msg.includes("INVITE_REVOKED")) throw new Error("邀请码已被撤销");
    if (msg.includes("INVITE_EXPIRED")) throw new Error("邀请码已过期");
    if (msg.includes("INVITE_USED_UP")) throw new Error("邀请码使用次数已用完");
    throw new Error(msg || "邀请码无效");
  }
  return {
    campus_id: campusId
  };
});
const createCampusInvite_createServerFn_handler = createServerRpc({
  id: "c889b6c538383cc22133c2901801c1109c685f75c90d4c76d3908633634e9ba2",
  name: "createCampusInvite",
  filename: "src/lib/campus.functions.ts"
}, (opts) => createCampusInvite.__executeServer(opts));
const createCampusInvite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  // Each invite is single-use; accept any client value but ignore it.
  max_uses: numberType().int().optional().default(1),
  expires_in_hours: numberType().int().min(1).max(24 * 60).default(168)
}).parse(input)).handler(createCampusInvite_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: row,
    error
  } = await supabase.rpc("create_campus_invite", {
    p_campus_id: data.campus_id,
    p_max_uses: 1,
    p_expires_in_hours: data.expires_in_hours
  });
  if (error) {
    if ((error.message || "").includes("NOT_A_MEMBER")) throw new Error("你还不是该园区的成员");
    throw new Error(error.message || "生成失败");
  }
  return {
    invite: row
  };
});
const listMyCampusInvites_createServerFn_handler = createServerRpc({
  id: "4a0d0937e6d7ac77cea5bcf9c83f3f5fe863d1e56626a11cc01abd90a60254eb",
  name: "listMyCampusInvites",
  filename: "src/lib/campus.functions.ts"
}, (opts) => listMyCampusInvites.__executeServer(opts));
const listMyCampusInvites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid()
}).parse(input)).handler(listMyCampusInvites_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("campus_invites").select("*").eq("campus_id", data.campus_id).eq("inviter_id", userId).order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return {
    invites: rows ?? []
  };
});
const searchInviteCandidates_createServerFn_handler = createServerRpc({
  id: "9d432d0cdfaea97caf7e6107c50e9ea4644a027926eb58ec259e47c012d19fc7",
  name: "searchInviteCandidates",
  filename: "src/lib/campus.functions.ts"
}, (opts) => searchInviteCandidates.__executeServer(opts));
const searchInviteCandidates = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  q: stringType().trim().max(40).optional().default("")
}).parse(input)).handler(searchInviteCandidates_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: members
  } = await supabase.from("campus_memberships").select("user_id").eq("campus_id", data.campus_id);
  const memberIds = new Set((members ?? []).map((m) => m.user_id));
  memberIds.add(userId);
  let query = supabase.from("profiles").select("id, nickname, photos, main_idx, city").eq("onboarded", true).limit(30);
  if (data.q) query = query.ilike("nickname", `%${data.q}%`);
  const {
    data: rows,
    error
  } = await query;
  if (error) throw new Error(error.message);
  const users = (rows ?? []).filter((r) => !memberIds.has(r.id)).map((r) => {
    const photos = Array.isArray(r.photos) ? r.photos : [];
    return {
      id: r.id,
      nickname: r.nickname ?? null,
      city: r.city ?? null,
      avatar: photos[r.main_idx ?? 0] || photos[0] || null
    };
  });
  return {
    users
  };
});
const inviteUsersToCampus_createServerFn_handler = createServerRpc({
  id: "7a839684b3e3f2b73632cb7fe1aee482859d1ee72b2f734b57a7a4b39860c147",
  name: "inviteUsersToCampus",
  filename: "src/lib/campus.functions.ts"
}, (opts) => inviteUsersToCampus.__executeServer(opts));
const inviteUsersToCampus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  recipient_ids: arrayType(stringType().uuid()).min(1).max(20),
  expires_in_hours: numberType().int().min(1).max(24 * 60).default(168),
  note: stringType().trim().max(200).optional().default("")
}).parse(input)).handler(inviteUsersToCampus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: campus
  } = await supabase.from("campuses").select("name").eq("id", data.campus_id).maybeSingle();
  const campusName = campus?.name ?? "我的园区";
  let firstInvite = null;
  const results = [];
  for (const rid of data.recipient_ids) {
    if (rid === userId) {
      results.push({
        recipient_id: rid,
        ok: false,
        error: "不能邀请自己"
      });
      continue;
    }
    try {
      const {
        data: invite,
        error: invErr
      } = await supabase.rpc("create_campus_invite", {
        p_campus_id: data.campus_id,
        p_max_uses: 1,
        p_expires_in_hours: data.expires_in_hours,
        p_revoke_existing: false
      });
      if (invErr) throw invErr;
      const code = invite.code;
      if (!firstInvite) firstInvite = invite;
      const body = [`📮 邀请你加入「${campusName}」社区`, `专属邀请码：${code}（仅你可用一次）`, data.note ? `
${data.note}` : "", `
在「社区」页输入邀请码即可加入。`].filter(Boolean).join("\n");
      const {
        data: convId,
        error: convErr
      } = await supabase.rpc("start_conversation", {
        partner_id: rid,
        source: "match"
      });
      if (convErr) throw convErr;
      const {
        error: msgErr
      } = await supabase.from("messages").insert({
        conversation_id: convId,
        sender_id: userId,
        content: body
      });
      if (msgErr) throw msgErr;
      results.push({
        recipient_id: rid,
        ok: true
      });
    } catch (e) {
      results.push({
        recipient_id: rid,
        ok: false,
        error: e?.message ?? "发送失败"
      });
    }
  }
  return {
    invite: firstInvite,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results
  };
});
const adminListCampuses_createServerFn_handler = createServerRpc({
  id: "7f9a09a86aea7595f9737230bddb7c7a19cb70f2d362402b6cdf49add6fa37f6",
  name: "adminListCampuses",
  filename: "src/lib/campus.functions.ts"
}, (opts) => adminListCampuses.__executeServer(opts));
const adminListCampuses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListCampuses_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("campuses").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  const ids = (data ?? []).map((c) => c.id);
  let counts = /* @__PURE__ */ new Map();
  if (ids.length > 0) {
    const {
      data: members
    } = await supabase.from("campus_memberships").select("campus_id").in("campus_id", ids);
    for (const m of members ?? []) {
      counts.set(m.campus_id, (counts.get(m.campus_id) ?? 0) + 1);
    }
  }
  return {
    campuses: (data ?? []).map((c) => ({
      ...c,
      member_count: counts.get(c.id) ?? 0
    }))
  };
});
const adminCreateCampus_createServerFn_handler = createServerRpc({
  id: "6c8369ec245be4c4fd47b27be4df5b980ff28cd382ed3f5ee88c3a6c360361d4",
  name: "adminCreateCampus",
  filename: "src/lib/campus.functions.ts"
}, (opts) => adminCreateCampus.__executeServer(opts));
const adminCreateCampus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  slug: stringType().trim().min(2).max(40).regex(/^[a-z0-9-]+$/),
  name: stringType().trim().min(1).max(80),
  location: stringType().trim().max(80).optional(),
  description: stringType().trim().max(300).optional()
}).parse(input)).handler(adminCreateCampus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: role
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!role) throw new Error("无权限");
  const {
    data: row,
    error
  } = await supabase.from("campuses").insert({
    slug: data.slug,
    name: data.name,
    location: data.location ?? null,
    description: data.description ?? null
  }).select("*").single();
  if (error) throw new Error(error.message);
  return {
    campus: row
  };
});
const adminListCampusInvites_createServerFn_handler = createServerRpc({
  id: "0cf4b9d1ae59b200b80f983dc2e9f27f2e943f8f503b082963752aa1159d9520",
  name: "adminListCampusInvites",
  filename: "src/lib/campus.functions.ts"
}, (opts) => adminListCampusInvites.__executeServer(opts));
const adminListCampusInvites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid()
}).parse(input)).handler(adminListCampusInvites_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("campus_invites").select("*").eq("campus_id", data.campus_id).order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    invites: rows ?? []
  };
});
export {
  adminCreateCampus_createServerFn_handler,
  adminListCampusInvites_createServerFn_handler,
  adminListCampuses_createServerFn_handler,
  createCampusInvite_createServerFn_handler,
  inviteUsersToCampus_createServerFn_handler,
  listAllCampuses_createServerFn_handler,
  listMyCampusInvites_createServerFn_handler,
  listMyCampuses_createServerFn_handler,
  redeemCampusInvite_createServerFn_handler,
  searchInviteCandidates_createServerFn_handler
};
