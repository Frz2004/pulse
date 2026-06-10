import { i as createLucideIcon } from "./router-qNgQXy3C.js";
import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "./types-DNG0tEns.js";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
const KindEnum = enumType(["real", "student"]);
const submitVerification = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  kind: KindEnum,
  storagePath: stringType().min(1).max(500),
  extra: stringType().max(200).optional()
}).parse(input)).handler(createSsrRpc("981a18cb368f514076f36938aada05cf7234e85865afe6a747760d3a977aad00"));
const getMyVerifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("640f041e09e5842286c507dd70e4ced939962ebbe2f048bc97e715bb254e78e1"));
const adminListVerifications = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  status: enumType(["pending", "approved", "rejected", "all"]).default("pending"),
  limit: numberType().int().min(1).max(100).default(50)
}).parse(input)).handler(createSsrRpc("43da3025891a4dd0d71564ef2e020c62071e479fe78cd76a119334083fa26e6f"));
const adminReviewVerification = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "reject"]),
  note: stringType().max(200).optional()
}).parse(input)).handler(createSsrRpc("1ed5ed63d5ef8a1f837c907e7d41757ce2ae99830a1f1d4d0ec9dc70135bbaa8"));
export {
  CircleCheck as C,
  CircleX as a,
  adminListVerifications as b,
  adminReviewVerification as c,
  getMyVerifications as g,
  submitVerification as s
};
