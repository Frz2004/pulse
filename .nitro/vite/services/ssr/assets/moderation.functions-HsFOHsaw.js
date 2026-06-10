import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, e as enumType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const blockUser_createServerFn_handler = createServerRpc({
  id: "317c0bb72a5c7d02315704313fe4104f6244df46215848624d42b7fdef97acb0",
  name: "blockUser",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => blockUser.__executeServer(opts));
const blockUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetId: stringType().uuid()
}).parse(input)).handler(blockUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.targetId === userId) throw new Error("不能拉黑自己");
  const {
    error
  } = await supabase.from("blocks").upsert({
    blocker_id: userId,
    blocked_id: data.targetId
  }, {
    onConflict: "blocker_id,blocked_id",
    ignoreDuplicates: true
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const unblockUser_createServerFn_handler = createServerRpc({
  id: "28832a9d19988eaf7c9dc986aa75d3996f7457a63eac7b738eb4c07e5f9030a4",
  name: "unblockUser",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => unblockUser.__executeServer(opts));
const unblockUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetId: stringType().uuid()
}).parse(input)).handler(unblockUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("blocks").delete().eq("blocker_id", userId).eq("blocked_id", data.targetId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listBlocks_createServerFn_handler = createServerRpc({
  id: "4446411309b54d0fcfc3bc879f82a04ca37315fc1aa98187a52d1a68700f0043",
  name: "listBlocks",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => listBlocks.__executeServer(opts));
const listBlocks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listBlocks_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("blocks").select("blocked_id, created_at").eq("blocker_id", userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    blocked: (data ?? []).map((r) => r.blocked_id)
  };
});
const REPORT_REASONS = ["spam", "harassment", "nudity", "hate", "violence", "scam", "underage", "self_harm", "other"];
const TARGET_TYPES = ["user", "post", "treehole", "message", "comment", "video", "video_comment"];
const reportContent_createServerFn_handler = createServerRpc({
  id: "33b17a4e5c111f180c6e7b39be5b74289ae7778a58aee551a586bb9bc989e7dc",
  name: "reportContent",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => reportContent.__executeServer(opts));
const reportContent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetType: enumType(TARGET_TYPES),
  targetId: stringType().uuid(),
  reason: enumType(REPORT_REASONS),
  detail: stringType().trim().max(500).optional()
}).parse(input)).handler(reportContent_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("reports").insert({
    reporter_id: userId,
    target_type: data.targetType,
    target_id: data.targetId,
    reason: data.reason,
    detail: data.detail ?? null
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listMyReports_createServerFn_handler = createServerRpc({
  id: "19ed63984c25bb167a4ad41449b85f2f8a33c6f40bfae3dcc06a63d0d35bdf31",
  name: "listMyReports",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => listMyReports.__executeServer(opts));
const listMyReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyReports_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("reports").select("id,target_type,target_id,reason,detail,status,resolution_note,resolved_at,created_at").eq("reporter_id", userId).order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    reports: data ?? []
  };
});
const APPEAL_KINDS = ["report_rejected", "content_removed", "account_action", "other"];
const submitAppeal_createServerFn_handler = createServerRpc({
  id: "4aedfe860675f6a69fb24294a255115879a34735bd97809398800d8a4dba2e31",
  name: "submitAppeal",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => submitAppeal.__executeServer(opts));
const submitAppeal = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  kind: enumType(APPEAL_KINDS),
  reason: stringType().trim().min(10, "请至少说明 10 个字").max(1e3),
  targetType: enumType(TARGET_TYPES).optional(),
  targetId: stringType().uuid().optional(),
  relatedReportId: stringType().uuid().optional()
}).parse(input)).handler(submitAppeal_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.relatedReportId) {
    const {
      data: existing
    } = await supabase.from("appeals").select("id").eq("user_id", userId).eq("related_report_id", data.relatedReportId).in("status", ["pending", "reviewing"]).limit(1);
    if (existing && existing.length > 0) {
      throw new Error("该举报已有正在处理的申诉,请耐心等待");
    }
  }
  const {
    data: row,
    error
  } = await supabase.from("appeals").insert({
    user_id: userId,
    kind: data.kind,
    reason: data.reason,
    target_type: data.targetType ?? null,
    target_id: data.targetId ?? null,
    related_report_id: data.relatedReportId ?? null
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    id: row?.id
  };
});
const listMyAppeals_createServerFn_handler = createServerRpc({
  id: "a752fcc17af5b6a0e87950ab20172f67752f29b1bf3faa80a2d5473138eecfb1",
  name: "listMyAppeals",
  filename: "src/lib/moderation.functions.ts"
}, (opts) => listMyAppeals.__executeServer(opts));
const listMyAppeals = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyAppeals_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("appeals").select("id,kind,target_type,target_id,related_report_id,reason,status,resolution_note,resolved_at,created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    appeals: data ?? []
  };
});
export {
  blockUser_createServerFn_handler,
  listBlocks_createServerFn_handler,
  listMyAppeals_createServerFn_handler,
  listMyReports_createServerFn_handler,
  reportContent_createServerFn_handler,
  submitAppeal_createServerFn_handler,
  unblockUser_createServerFn_handler
};
