import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, n as numberType, s as stringType, e as enumType, b as booleanType } from "./types-DNG0tEns.js";
const publishShortVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoUrl: stringType().url().max(2e3),
  coverUrl: stringType().url().max(2e3).optional(),
  caption: stringType().max(300).default(""),
  durationSec: numberType().int().min(1).max(180).optional(),
  width: numberType().int().min(1).max(8e3).optional(),
  height: numberType().int().min(1).max(8e3).optional()
}).parse(input)).handler(createSsrRpc("e26d94357764e438aa6e248bd6c5b3be0a3e6d8c017bf5032758d954acafb9ae"));
const listShortVideos = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  scope: enumType(["all", "mine", "author"]).default("all"),
  authorId: stringType().uuid().optional(),
  limit: numberType().int().min(1).max(50).default(20)
}).parse(input)).handler(createSsrRpc("124682a6cf9aa9bf6c626c6cec44f226927b5afaa5723286edf93c8ae780caff"));
const toggleVideoLike = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoId: stringType().uuid(),
  like: booleanType()
}).parse(input)).handler(createSsrRpc("25302a5de44d78f4ac5535b5cacf485d4d497c8e5c132a3adddedde7d75d2a63"));
const deleteShortVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("2c94ede19fa96b7dbc64dd150768e56846fb9c461e0b2978b63b0dde7fe97eab"));
const saveVoiceCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  url: stringType().url().max(2e3),
  durationSec: numberType().int().min(1).max(60)
}).parse(input)).handler(createSsrRpc("ef35fe4f45e91bf1636759ae32143fbc52eff09f219728bcd233abc2f90a1a8e"));
const deleteVoiceCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ad4e74911bc5b242e7ee437e57148e5c0c404bf146d183030fdd630d85f65ccf"));
const listVideoComments = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("eefc8c6ba353c83fca5498693298ace0d25f440f972d8137da7241ea108b6761"));
const addVideoComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  videoId: stringType().uuid(),
  content: stringType().trim().min(1).max(500)
}).parse(input)).handler(createSsrRpc("9ab731f728a2412770f0617bd99d879bd60e73b7f23ca7173ff2388b4344753e"));
const deleteVideoComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("980dd6028b980c3cfe44be71cc9f72df43d346327552f12c87c864f5ff8f4539"));
export {
  addVideoComment as a,
  deleteVideoComment as b,
  deleteVoiceCard as c,
  deleteShortVideo as d,
  listVideoComments as e,
  listShortVideos as l,
  publishShortVideo as p,
  saveVoiceCard as s,
  toggleVideoLike as t
};
