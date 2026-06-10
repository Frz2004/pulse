import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, b as booleanType, e as enumType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const DEFAULTS = {
  searchable: true,
  allow_messages: "everyone",
  hide_city: false,
  hide_distance: false
};
const getMyPrivacy_createServerFn_handler = createServerRpc({
  id: "8297925ca9e19496ed63f9cb1bc9f6c84e46139c12af016bb3b8a4f86002dfa2",
  name: "getMyPrivacy",
  filename: "src/lib/privacy.functions.ts"
}, (opts) => getMyPrivacy.__executeServer(opts));
const getMyPrivacy = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyPrivacy_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data
  } = await supabase.from("profiles_privacy").select("searchable, allow_messages, hide_city, hide_distance").eq("id", userId).maybeSingle();
  return {
    settings: data ?? DEFAULTS
  };
});
const updateMyPrivacy_createServerFn_handler = createServerRpc({
  id: "48a75f03e17b5d977c59148c52aed4c94f6726032730a77a755a837e6d731292",
  name: "updateMyPrivacy",
  filename: "src/lib/privacy.functions.ts"
}, (opts) => updateMyPrivacy.__executeServer(opts));
const updateMyPrivacy = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  searchable: booleanType().optional(),
  allow_messages: enumType(["everyone", "matches", "none"]).optional(),
  hide_city: booleanType().optional(),
  hide_distance: booleanType().optional()
}).parse(input)).handler(updateMyPrivacy_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("profiles_privacy").upsert({
    id: userId,
    ...data
  }, {
    onConflict: "id"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getMyPrivacy_createServerFn_handler,
  updateMyPrivacy_createServerFn_handler
};
