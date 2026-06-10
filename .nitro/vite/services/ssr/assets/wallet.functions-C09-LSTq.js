import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, n as numberType, e as enumType, s as stringType } from "./types-DNG0tEns.js";
const getMyWallet = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("350f5a32c4d4e75fb92a5d3e86f1d4a377b70a50e7167b6228da6903c9665510"));
const getMyLedger = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("1e1e4d880ebac856ce8640f25e1c285add82a89468ef6faa7528f02ab3df3a95"));
const topUpCoins = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  amount: numberType().int().min(1).max(1e5)
}).parse(input)).handler(createSsrRpc("72b16813f27f16f3ee91883cd4044a074132ecbec0c0a97ab0d4d1763b9f10f8"));
const buyProPlan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  plan: enumType(["month", "quarter", "year"])
}).parse(input)).handler(createSsrRpc("d32af5b29fa9547a858cf5c444226226eec8d7866c1200f038252b2d2566949e"));
const sendGift = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  receiverId: stringType().uuid(),
  giftCode: stringType().min(1).max(32),
  message: stringType().max(200).optional(),
  conversationId: stringType().uuid().optional()
}).parse(input)).handler(createSsrRpc("bf43e8ef26386f2b12f3f6026773ac5fd52b9a6b0ad0aedb66b6450ebde575d8"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("b7ede67654ac7bc4ef6e29da2305f7bafea762db47f762413b7f13b4fe671c35"));
export {
  getMyWallet as a,
  buyProPlan as b,
  getMyLedger as g,
  sendGift as s,
  topUpCoins as t
};
