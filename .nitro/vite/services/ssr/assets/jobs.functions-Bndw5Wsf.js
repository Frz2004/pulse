import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, a as arrayType, e as enumType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const listJobs_createServerFn_handler = createServerRpc({
  id: "0f6b44b459f0f5a7154aecdbd6de5f39fc93825d0d32caf19f26936089e5a107",
  name: "listJobs",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => listJobs.__executeServer(opts));
const listJobs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  category: stringType().optional()
}).parse(input ?? {})).handler(listJobs_createServerFn_handler, async ({
  data,
  context
}) => {
  let q = context.supabase.from("jobs").select("id,author_id,title,summary,description,category,location,salary,tags,status,expires_at,created_at").order("created_at", {
    ascending: false
  }).limit(60);
  if (data.category && data.category !== "all") q = q.eq("category", data.category);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    jobs: rows ?? []
  };
});
const getJobContact_createServerFn_handler = createServerRpc({
  id: "0ca75b8d48f4822632237ac98fef9bae31c7d4d6e26e2fd50bc70c9ab5bbfed6",
  name: "getJobContact",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => getJobContact.__executeServer(opts));
const getJobContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getJobContact_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: row,
    error
  } = await context.supabase.from("jobs").select("contact").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    contact: row?.contact ?? null
  };
});
const JobInput = objectType({
  title: stringType().min(2).max(80),
  summary: stringType().min(2).max(160),
  description: stringType().max(2e3).optional().nullable(),
  category: enumType(["parttime", "intern", "fulltime", "freelance", "collab"]).default("parttime"),
  location: stringType().max(80).optional().nullable(),
  salary: stringType().max(60).optional().nullable(),
  contact: stringType().min(1).max(120),
  tags: arrayType(stringType().min(1).max(20)).max(8).default([]),
  expires_at: stringType().optional().nullable()
});
const createJob_createServerFn_handler = createServerRpc({
  id: "ab0e7c09b47d7ada2f8e5674d2a34621a0be302c11db7c58ae029c8e93152a4c",
  name: "createJob",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => createJob.__executeServer(opts));
const createJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => JobInput.parse(input)).handler(createJob_createServerFn_handler, async ({
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
  } = await supabase.from("jobs").insert({
    ...data,
    author_id: userId
  }).select("*").single();
  if (error) throw new Error(error.message);
  return {
    job: row
  };
});
export {
  createJob_createServerFn_handler,
  getJobContact_createServerFn_handler,
  listJobs_createServerFn_handler
};
