import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { G as GIFT_CATALOG } from "./wallet-CHCcGQf8.js";
import { o as objectType, n as numberType, e as enumType, s as stringType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const getMyWallet_createServerFn_handler = createServerRpc({
  id: "350f5a32c4d4e75fb92a5d3e86f1d4a377b70a50e7167b6228da6903c9665510",
  name: "getMyWallet",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => getMyWallet.__executeServer(opts));
const getMyWallet = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyWallet_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data
  } = await supabase.from("wallets").select("coins, pro_until, updated_at").eq("id", userId).maybeSingle();
  return {
    coins: data?.coins ?? 0,
    proUntil: data?.pro_until ?? null,
    updatedAt: data?.updated_at ?? null
  };
});
const getMyLedger_createServerFn_handler = createServerRpc({
  id: "1e1e4d880ebac856ce8640f25e1c285add82a89468ef6faa7528f02ab3df3a95",
  name: "getMyLedger",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => getMyLedger.__executeServer(opts));
const getMyLedger = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyLedger_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("wallet_ledger").select("id, delta, kind, balance_after, ref, created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return {
    entries: data ?? []
  };
});
const topUpCoins_createServerFn_handler = createServerRpc({
  id: "72b16813f27f16f3ee91883cd4044a074132ecbec0c0a97ab0d4d1763b9f10f8",
  name: "topUpCoins",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => topUpCoins.__executeServer(opts));
const topUpCoins = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  amount: numberType().int().min(1).max(1e5)
}).parse(input)).handler(topUpCoins_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: newBal,
    error
  } = await supabase.rpc("wallet_topup", {
    _amount: data.amount,
    _ref: {
      source: "in_app_test"
    }
  });
  if (error) throw new Error(error.message);
  return {
    coins: newBal
  };
});
const buyProPlan_createServerFn_handler = createServerRpc({
  id: "d32af5b29fa9547a858cf5c444226226eec8d7866c1200f038252b2d2566949e",
  name: "buyProPlan",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => buyProPlan.__executeServer(opts));
const buyProPlan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  plan: enumType(["month", "quarter", "year"])
}).parse(input)).handler(buyProPlan_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: until,
    error
  } = await supabase.rpc("wallet_buy_pro", {
    _plan: data.plan
  });
  if (error) throw new Error(error.message);
  return {
    proUntil: until
  };
});
const sendGift_createServerFn_handler = createServerRpc({
  id: "bf43e8ef26386f2b12f3f6026773ac5fd52b9a6b0ad0aedb66b6450ebde575d8",
  name: "sendGift",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => sendGift.__executeServer(opts));
const sendGift = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  receiverId: stringType().uuid(),
  giftCode: stringType().min(1).max(32),
  message: stringType().max(200).optional(),
  conversationId: stringType().uuid().optional()
}).parse(input)).handler(sendGift_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const gift = GIFT_CATALOG.find((g) => g.code === data.giftCode);
  if (!gift) throw new Error("未知礼物");
  const {
    data: giftId,
    error
  } = await supabase.rpc("wallet_send_gift", {
    _receiver_id: data.receiverId,
    _gift_code: gift.code,
    _coins: gift.coins,
    _message: data.message ?? "",
    _conv_id: data.conversationId ?? null
  });
  if (error) {
    if (/wallets_coins_check|coins.*>=.*0/.test(error.message)) {
      throw new Error("心动币不足，请先充值");
    }
    throw new Error(error.message);
  }
  return {
    giftId
  };
});
const listGiftsForConversation_createServerFn_handler = createServerRpc({
  id: "b7ede67654ac7bc4ef6e29da2305f7bafea762db47f762413b7f13b4fe671c35",
  name: "listGiftsForConversation",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => listGiftsForConversation.__executeServer(opts));
const listGiftsForConversation = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid()
}).parse(input)).handler(listGiftsForConversation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("gift_transactions").select("id, sender_id, receiver_id, gift_code, coins, message, created_at").eq("conversation_id", data.conversationId).order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  const safe = (rows ?? []).filter((r) => r.sender_id === userId || r.receiver_id === userId);
  return {
    gifts: safe
  };
});
export {
  buyProPlan_createServerFn_handler,
  getMyLedger_createServerFn_handler,
  getMyWallet_createServerFn_handler,
  listGiftsForConversation_createServerFn_handler,
  sendGift_createServerFn_handler,
  topUpCoins_createServerFn_handler
};
