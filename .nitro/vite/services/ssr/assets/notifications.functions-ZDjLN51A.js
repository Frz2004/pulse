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
const listMyNotifications_createServerFn_handler = createServerRpc({
  id: "acdc1590236f0839542f983a97a7193af437f8125c921a77e6feea3b73ccec73",
  name: "listMyNotifications",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => listMyNotifications.__executeServer(opts));
const listMyNotifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyNotifications_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("notifications").select("id, type, payload, read_at, created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    notifications: data ?? []
  };
});
const getUnreadCount_createServerFn_handler = createServerRpc({
  id: "7a8d8a8062bc44cd915da21e8e341e8e8ca1e6e7506033d99b11c684fc5bcadb",
  name: "getUnreadCount",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => getUnreadCount.__executeServer(opts));
const getUnreadCount = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getUnreadCount_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    count,
    error
  } = await supabase.from("notifications").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).is("read_at", null);
  if (error) throw new Error(error.message);
  return {
    count: count ?? 0
  };
});
const markAllRead_createServerFn_handler = createServerRpc({
  id: "2951bd39fcb59a048407113c481b15fd695e4a9d3e2f43e52a2e7ab107a2cb63",
  name: "markAllRead",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => markAllRead.__executeServer(opts));
const markAllRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(markAllRead_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("notifications").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId).is("read_at", null);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const markRead_createServerFn_handler = createServerRpc({
  id: "e2ecc1f68f57dddaa680d1e56f33529318876089d71b0ecb31c21490b3f96daf",
  name: "markRead",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => markRead.__executeServer(opts));
const markRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(markRead_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("notifications").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getUnreadCount_createServerFn_handler,
  listMyNotifications_createServerFn_handler,
  markAllRead_createServerFn_handler,
  markRead_createServerFn_handler
};
