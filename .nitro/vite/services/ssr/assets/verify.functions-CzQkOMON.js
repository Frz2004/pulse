import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { s as supabaseAdmin } from "./client.server-CIpsZVxu.js";
import { e as enumType, o as objectType, s as stringType, n as numberType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const KindEnum = enumType(["real", "student"]);
const submitVerification_createServerFn_handler = createServerRpc({
  id: "981a18cb368f514076f36938aada05cf7234e85865afe6a747760d3a977aad00",
  name: "submitVerification",
  filename: "src/lib/verify.functions.ts"
}, (opts) => submitVerification.__executeServer(opts));
const submitVerification = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  kind: KindEnum,
  storagePath: stringType().min(1).max(500),
  extra: stringType().max(200).optional()
}).parse(input)).handler(submitVerification_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (!data.storagePath.startsWith(`${userId}/`)) {
    throw new Error("Invalid storage path");
  }
  await supabase.from("verifications").delete().eq("user_id", userId).eq("kind", data.kind).eq("status", "pending");
  const {
    data: approved
  } = await supabase.from("verifications").select("id").eq("user_id", userId).eq("kind", data.kind).eq("status", "approved").maybeSingle();
  if (approved) throw new Error("你已通过该项认证，无需重复提交");
  const {
    error
  } = await supabase.from("verifications").insert({
    user_id: userId,
    kind: data.kind,
    evidence_url: data.storagePath,
    evidence_extra: data.extra ?? null,
    status: "pending"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getMyVerifications_createServerFn_handler = createServerRpc({
  id: "640f041e09e5842286c507dd70e4ced939962ebbe2f048bc97e715bb254e78e1",
  name: "getMyVerifications",
  filename: "src/lib/verify.functions.ts"
}, (opts) => getMyVerifications.__executeServer(opts));
const getMyVerifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyVerifications_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("verifications").select("id, kind, status, review_note, created_at, reviewed_at").eq("user_id", userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  const latest = {};
  for (const row of data ?? []) {
    if (!latest[row.kind]) latest[row.kind] = row;
  }
  return {
    real: latest.real ?? null,
    student: latest.student ?? null
  };
});
const adminListVerifications_createServerFn_handler = createServerRpc({
  id: "43da3025891a4dd0d71564ef2e020c62071e479fe78cd76a119334083fa26e6f",
  name: "adminListVerifications",
  filename: "src/lib/verify.functions.ts"
}, (opts) => adminListVerifications.__executeServer(opts));
const adminListVerifications = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  status: enumType(["pending", "approved", "rejected", "all"]).default("pending"),
  limit: numberType().int().min(1).max(100).default(50)
}).parse(input)).handler(adminListVerifications_createServerFn_handler, async ({
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
  if (!role) throw new Error("没有管理员权限");
  let q = supabaseAdmin.from("verifications").select("id, user_id, kind, evidence_url, evidence_extra, status, review_note, created_at, reviewed_at").order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (data.status !== "all") q = q.eq("status", data.status);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id)));
  const {
    data: profs
  } = userIds.length ? await supabaseAdmin.from("profiles").select("id, nickname, photos, main_idx, city").in("id", userIds) : {
    data: []
  };
  const profMap = /* @__PURE__ */ new Map();
  (profs ?? []).forEach((p) => profMap.set(p.id, p));
  const paths = (rows ?? []).map((r) => r.evidence_url).filter((u) => !u.startsWith("http"));
  const signedMap = /* @__PURE__ */ new Map();
  if (paths.length) {
    const {
      data: signed
    } = await supabaseAdmin.storage.from("media").createSignedUrls(paths, 60 * 60);
    (signed ?? []).forEach((s) => {
      if (s.path && s.signedUrl) signedMap.set(s.path, s.signedUrl);
    });
  }
  return {
    items: (rows ?? []).map((r) => {
      const p = profMap.get(r.user_id);
      const photos = Array.isArray(p?.photos) ? p.photos : [];
      return {
        ...r,
        evidence_url: r.evidence_url.startsWith("http") ? r.evidence_url : signedMap.get(r.evidence_url) ?? r.evidence_url,
        user: {
          id: r.user_id,
          nickname: p?.nickname ?? "Pulse 用户",
          city: p?.city ?? null,
          avatar: photos[p?.main_idx ?? 0] || photos[0] || null
        }
      };
    })
  };
});
const adminReviewVerification_createServerFn_handler = createServerRpc({
  id: "1ed5ed63d5ef8a1f837c907e7d41757ce2ae99830a1f1d4d0ec9dc70135bbaa8",
  name: "adminReviewVerification",
  filename: "src/lib/verify.functions.ts"
}, (opts) => adminReviewVerification.__executeServer(opts));
const adminReviewVerification = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "reject"]),
  note: stringType().max(200).optional()
}).parse(input)).handler(adminReviewVerification_createServerFn_handler, async ({
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
  if (!role) throw new Error("没有管理员权限");
  const {
    data: rec,
    error: rErr
  } = await supabaseAdmin.from("verifications").select("id, user_id, kind, status").eq("id", data.id).maybeSingle();
  if (rErr) throw new Error(rErr.message);
  if (!rec) throw new Error("申请不存在");
  if (rec.status !== "pending") throw new Error("该申请已被处理");
  const next = data.action === "approve" ? "approved" : "rejected";
  const {
    error: uErr
  } = await supabaseAdmin.from("verifications").update({
    status: next,
    review_note: data.note ?? null,
    reviewed_by: userId,
    reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (uErr) throw new Error(uErr.message);
  if (data.action === "approve") {
    const col = rec.kind === "real" ? "verify_real" : "verify_student";
    const {
      error: pErr
    } = await supabaseAdmin.from("profiles").update({
      [col]: true
    }).eq("id", rec.user_id);
    if (pErr) throw new Error(pErr.message);
  }
  await supabaseAdmin.from("moderation_actions").insert({
    admin_id: userId,
    target_type: "verification",
    target_id: data.id,
    action: data.action,
    note: data.note ?? null
  });
  return {
    ok: true
  };
});
export {
  adminListVerifications_createServerFn_handler,
  adminReviewVerification_createServerFn_handler,
  getMyVerifications_createServerFn_handler,
  submitVerification_createServerFn_handler
};
