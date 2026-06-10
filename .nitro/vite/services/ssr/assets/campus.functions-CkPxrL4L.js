import { i as createLucideIcon } from "./router-qNgQXy3C.js";
import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, n as numberType, a as arrayType } from "./types-DNG0tEns.js";
const __iconNode = [
  ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
  ["path", { d: "M18 5v16", key: "1ethyx" }],
  ["path", { d: "m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6", key: "zywc2d" }],
  [
    "path",
    {
      d: "m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11",
      key: "1d4ql0"
    }
  ],
  ["path", { d: "M6 5v16", key: "1sn0nx" }],
  ["circle", { cx: "12", cy: "9", r: "2", key: "1092wv" }]
];
const School = createLucideIcon("school", __iconNode);
const listMyCampuses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("19ce8540b180c5dff1e42d978bd444974bdb8b275370bb9673704242c12dc629"));
const listAllCampuses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a69e85686846c9cb122ffe368b5eeb9c423f00a1cc0704ee601c73c715aa0ef1"));
const redeemCampusInvite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  code: stringType().trim().min(4).max(32)
}).parse(input)).handler(createSsrRpc("b51bea6ec4ca6a2f853bb9451bd0f86ebd850bdb9b7047788764f4767c7f5af7"));
const createCampusInvite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  // Each invite is single-use; accept any client value but ignore it.
  max_uses: numberType().int().optional().default(1),
  expires_in_hours: numberType().int().min(1).max(24 * 60).default(168)
}).parse(input)).handler(createSsrRpc("c889b6c538383cc22133c2901801c1109c685f75c90d4c76d3908633634e9ba2"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("4a0d0937e6d7ac77cea5bcf9c83f3f5fe863d1e56626a11cc01abd90a60254eb"));
const searchInviteCandidates = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  q: stringType().trim().max(40).optional().default("")
}).parse(input)).handler(createSsrRpc("9d432d0cdfaea97caf7e6107c50e9ea4644a027926eb58ec259e47c012d19fc7"));
const inviteUsersToCampus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  recipient_ids: arrayType(stringType().uuid()).min(1).max(20),
  expires_in_hours: numberType().int().min(1).max(24 * 60).default(168),
  note: stringType().trim().max(200).optional().default("")
}).parse(input)).handler(createSsrRpc("7a839684b3e3f2b73632cb7fe1aee482859d1ee72b2f734b57a7a4b39860c147"));
const adminListCampuses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7f9a09a86aea7595f9737230bddb7c7a19cb70f2d362402b6cdf49add6fa37f6"));
const adminCreateCampus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  slug: stringType().trim().min(2).max(40).regex(/^[a-z0-9-]+$/),
  name: stringType().trim().min(1).max(80),
  location: stringType().trim().max(80).optional(),
  description: stringType().trim().max(300).optional()
}).parse(input)).handler(createSsrRpc("6c8369ec245be4c4fd47b27be4df5b980ff28cd382ed3f5ee88c3a6c360361d4"));
const adminListCampusInvites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0cf4b9d1ae59b200b80f983dc2e9f27f2e943f8f503b082963752aa1159d9520"));
export {
  School as S,
  adminCreateCampus as a,
  adminListCampusInvites as b,
  adminListCampuses as c,
  createCampusInvite as d,
  listMyCampuses as e,
  inviteUsersToCampus as i,
  listAllCampuses as l,
  redeemCampusInvite as r,
  searchInviteCandidates as s
};
