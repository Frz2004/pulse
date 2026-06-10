import { i as createLucideIcon } from "./router-qNgQXy3C.js";
import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType } from "./types-DNG0tEns.js";
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
const listContests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ebe698321039fb63f9e4896421b5fc0693f3962ca37fec2335a840e6aa568459"));
const getContest = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("d1d346b14618a036c3731a3fe9677679113b39a3457e94fa3b25123723923660"));
const ContestInput = objectType({
  title: stringType().min(2).max(80),
  summary: stringType().min(2).max(160),
  description: stringType().max(2e3).optional().nullable(),
  cover: stringType().url().optional().nullable(),
  category: stringType().min(1).max(40).default("general"),
  location: stringType().max(80).optional().nullable(),
  prize: stringType().max(120).optional().nullable(),
  organizer: stringType().max(80).optional().nullable(),
  contact: stringType().max(120).optional().nullable(),
  register_url: stringType().url().optional().nullable(),
  starts_at: stringType().optional().nullable(),
  ends_at: stringType().optional().nullable(),
  deadline: stringType().optional().nullable()
});
const createContest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => ContestInput.parse(input)).handler(createSsrRpc("13f55d4bf34e9dc4170a252e7f786cba7569650330f0db45696effcd07fc0fcd"));
const vsBrush = "/assets/vs-brush-C0DvGHn4.png";
export {
  Calendar as C,
  createContest as c,
  getContest as g,
  listContests as l,
  vsBrush as v
};
