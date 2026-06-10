import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const listContests_createServerFn_handler = createServerRpc({
  id: "ebe698321039fb63f9e4896421b5fc0693f3962ca37fec2335a840e6aa568459",
  name: "listContests",
  filename: "src/lib/contests.functions.ts"
}, (opts) => listContests.__executeServer(opts));
const listContests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listContests_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("contests").select("id,author_id,title,summary,description,cover,category,location,prize,organizer,register_url,starts_at,ends_at,deadline,status,hot,created_at").order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return {
    contests: data ?? []
  };
});
const getContest_createServerFn_handler = createServerRpc({
  id: "d1d346b14618a036c3731a3fe9677679113b39a3457e94fa3b25123723923660",
  name: "getContest",
  filename: "src/lib/contests.functions.ts"
}, (opts) => getContest.__executeServer(opts));
const getContest = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getContest_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: row,
    error
  } = await context.supabase.from("contests").select("*").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    contest: row
  };
});
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
const createContest_createServerFn_handler = createServerRpc({
  id: "13f55d4bf34e9dc4170a252e7f786cba7569650330f0db45696effcd07fc0fcd",
  name: "createContest",
  filename: "src/lib/contests.functions.ts"
}, (opts) => createContest.__executeServer(opts));
const createContest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => ContestInput.parse(input)).handler(createContest_createServerFn_handler, async ({
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
  } = await supabase.from("contests").insert({
    ...data,
    author_id: userId
  }).select("*").single();
  if (error) throw new Error(error.message);
  return {
    contest: row
  };
});
export {
  createContest_createServerFn_handler,
  getContest_createServerFn_handler,
  listContests_createServerFn_handler
};
