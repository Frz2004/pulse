import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "./types-DNG0tEns.js";
const listConversations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("0dd2c20b33382e0b96b9386b18a546d72bb512185924a8966dd76680167d3c90"));
const getConversation = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("da1aad61dcc8d005620d36d755091c11966e643eef886b2f2a190860280db654"));
const sendMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid(),
  content: stringType().min(1).max(2e3)
}).parse(input)).handler(createSsrRpc("4f34919086f2a4130097c5da5423c36b625cea14ed1b142c70bfe1b53f9fd398"));
const sendImageMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid(),
  storagePath: stringType().min(1).max(500),
  width: numberType().int().positive().max(1e4).optional(),
  height: numberType().int().positive().max(1e4).optional()
}).parse(input)).handler(createSsrRpc("49b25fcc787f3b1ceb5912e3a796fead3bb367b57fb85d2988767f84f58cfdef"));
const deleteConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("44b338201030bcba65791dea226c6f1b4fe8fd093bcb16e536c1f85297743df9"));
const startConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  partnerId: stringType().uuid(),
  source: enumType(["match", "voice", "video", "treehole"]).default("match")
}).parse(input)).handler(createSsrRpc("ec5e2b13bb92cbb6fc73b8979986bae73650c214880300c0b687b60455555e0d"));
const markConversationRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("2216d629e02d38a41f65adec08148687e7cc80295a49818869b39ba5b4e64e87"));
const searchUsersByNickname = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  q: stringType().trim().min(1).max(40)
}).parse(input)).handler(createSsrRpc("3ec4ac79d997a30d58e6f3ffc29f57101ab58ae3303aa0c2ddcee95133c185a0"));
const lookupUserById = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("da20d258cf6c5030ad7768cd1f26a5e55b01744e63eb20205ae62e3bc83fb8f3"));
export {
  lookupUserById as a,
  sendImageMessage as b,
  sendMessage as c,
  deleteConversation as d,
  startConversation as e,
  getConversation as g,
  listConversations as l,
  markConversationRead as m,
  searchUsersByNickname as s
};
