import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType } from "./types-DNG0tEns.js";
const listMyNotifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("acdc1590236f0839542f983a97a7193af437f8125c921a77e6feea3b73ccec73"));
const getUnreadCount = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7a8d8a8062bc44cd915da21e8e341e8e8ca1e6e7506033d99b11c684fc5bcadb"));
const markAllRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2951bd39fcb59a048407113c481b15fd695e4a9d3e2f43e52a2e7ab107a2cb63"));
const markRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("e2ecc1f68f57dddaa680d1e56f33529318876089d71b0ecb31c21490b3f96daf"));
export {
  markRead as a,
  getUnreadCount as g,
  listMyNotifications as l,
  markAllRead as m
};
