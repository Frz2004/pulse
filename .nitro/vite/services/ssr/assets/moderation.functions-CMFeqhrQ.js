import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, e as enumType } from "./types-DNG0tEns.js";
const blockUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("317c0bb72a5c7d02315704313fe4104f6244df46215848624d42b7fdef97acb0"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("28832a9d19988eaf7c9dc986aa75d3996f7457a63eac7b738eb4c07e5f9030a4"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4446411309b54d0fcfc3bc879f82a04ca37315fc1aa98187a52d1a68700f0043"));
const REPORT_REASONS = ["spam", "harassment", "nudity", "hate", "violence", "scam", "underage", "self_harm", "other"];
const TARGET_TYPES = ["user", "post", "treehole", "message", "comment", "video", "video_comment"];
const reportContent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetType: enumType(TARGET_TYPES),
  targetId: stringType().uuid(),
  reason: enumType(REPORT_REASONS),
  detail: stringType().trim().max(500).optional()
}).parse(input)).handler(createSsrRpc("33b17a4e5c111f180c6e7b39be5b74289ae7778a58aee551a586bb9bc989e7dc"));
const listMyReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("19ed63984c25bb167a4ad41449b85f2f8a33c6f40bfae3dcc06a63d0d35bdf31"));
const APPEAL_KINDS = ["report_rejected", "content_removed", "account_action", "other"];
const submitAppeal = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  kind: enumType(APPEAL_KINDS),
  reason: stringType().trim().min(10, "请至少说明 10 个字").max(1e3),
  targetType: enumType(TARGET_TYPES).optional(),
  targetId: stringType().uuid().optional(),
  relatedReportId: stringType().uuid().optional()
}).parse(input)).handler(createSsrRpc("4aedfe860675f6a69fb24294a255115879a34735bd97809398800d8a4dba2e31"));
const listMyAppeals = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a752fcc17af5b6a0e87950ab20172f67752f29b1bf3faa80a2d5473138eecfb1"));
export {
  listMyReports as a,
  blockUser as b,
  listMyAppeals as l,
  reportContent as r,
  submitAppeal as s
};
