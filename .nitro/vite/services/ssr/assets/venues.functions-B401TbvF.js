import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, n as numberType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const listVenues_createServerFn_handler = createServerRpc({
  id: "a699a0a22ecf0998ad99b7595bc01f9a725ca6de5c8f07cabf8d30e63c2f0b5e",
  name: "listVenues",
  filename: "src/lib/venues.functions.ts"
}, (opts) => listVenues.__executeServer(opts));
const listVenues = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listVenues_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("venues").select("*").eq("active", true).order("created_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    venues: data ?? []
  };
});
const listMyBookings_createServerFn_handler = createServerRpc({
  id: "97cee43405113fa441cb9db759874e86733e0c903b2e5e42e151286032ab11bc",
  name: "listMyBookings",
  filename: "src/lib/venues.functions.ts"
}, (opts) => listMyBookings.__executeServer(opts));
const listMyBookings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyBookings_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("venue_bookings").select("*, venues(name)").eq("user_id", userId).order("starts_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  const rows = (data ?? []).map((r) => ({
    ...r,
    venue_name: r.venues?.name ?? null
  }));
  return {
    bookings: rows
  };
});
const listVenueBookings_createServerFn_handler = createServerRpc({
  id: "157792d120bf076cc4e3f9daef8a4e14bd032dca53e17271a333ecf5ae906a43",
  name: "listVenueBookings",
  filename: "src/lib/venues.functions.ts"
}, (opts) => listVenueBookings.__executeServer(opts));
const listVenueBookings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  venue_id: stringType().uuid()
}).parse(input)).handler(listVenueBookings_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: rows,
    error
  } = await context.supabase.from("venue_bookings").select("starts_at, ends_at, status").eq("venue_id", data.venue_id).in("status", ["pending", "approved"]).gte("ends_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    slots: rows ?? []
  };
});
const BookingInput = objectType({
  venue_id: stringType().uuid(),
  starts_at: stringType().min(1),
  ends_at: stringType().min(1),
  purpose: stringType().min(2).max(200),
  attendees: numberType().int().min(1).max(500).default(1),
  contact: stringType().max(120).optional().nullable()
}).refine((v) => new Date(v.ends_at).getTime() > new Date(v.starts_at).getTime(), {
  message: "结束时间必须晚于开始时间",
  path: ["ends_at"]
});
const createBooking_createServerFn_handler = createServerRpc({
  id: "f8657cab28fa92f0330a835503a063511cf7237a2c96fe4f00c44fa223498323",
  name: "createBooking",
  filename: "src/lib/venues.functions.ts"
}, (opts) => createBooking.__executeServer(opts));
const createBooking = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => BookingInput.parse(input)).handler(createBooking_createServerFn_handler, async ({
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
  } = await supabase.from("venue_bookings").insert({
    ...data,
    user_id: userId
  }).select("*").single();
  if (error) throw new Error(error.message);
  return {
    booking: row
  };
});
const cancelBooking_createServerFn_handler = createServerRpc({
  id: "a36736d035f299f267d7aa22a140224ff781c871fb35d4e1d73e1bb3a1faab37",
  name: "cancelBooking",
  filename: "src/lib/venues.functions.ts"
}, (opts) => cancelBooking.__executeServer(opts));
const cancelBooking = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(cancelBooking_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("venue_bookings").update({
    status: "cancelled"
  }).eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  cancelBooking_createServerFn_handler,
  createBooking_createServerFn_handler,
  listMyBookings_createServerFn_handler,
  listVenueBookings_createServerFn_handler,
  listVenues_createServerFn_handler
};
