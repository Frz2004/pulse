import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const saveProfile_createServerFn_handler = createServerRpc({
  id: "cbcc924041242dd11e1ad5000167f6d3fdcc014f84f3fe5dca969bb9361d5d65",
  name: "saveProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => saveProfile.__executeServer(opts));
const saveProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(saveProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const payload = {
    id: userId,
    nickname: data.nickname || null,
    gender: data.gender || null,
    birthday: data.birthday || null,
    city: data.city || null,
    hometown: data.hometown || null,
    height: data.height || null,
    education: data.education || null,
    job: data.job || null,
    school: data.school || null,
    photos: data.photos ?? [],
    main_idx: data.mainIdx ?? 0,
    video_intro: data.videoIntro || null,
    signature: data.signature || null,
    intro: data.intro || null,
    status: data.status || null,
    interests: data.interests ?? [],
    personality: data.personality ?? [],
    mbti: data.mbti || null,
    zodiac: data.zodiac || null,
    smoke: data.smoke || null,
    drink: data.drink || null,
    sleep: data.sleep || null,
    diet: data.diet || null,
    pet: data.pet || null,
    intent: data.intent ?? [],
    relationship: data.relationship || null,
    ideal_type: data.idealType || null,
    age_range: data.ageRange ?? null,
    distance: data.distance || null,
    icebreaker: data.icebreaker || null,
    verify_real: Boolean(data.verifyReal),
    verify_student: Boolean(data.verifyStudent),
    onboarded: true
  };
  const {
    error
  } = await supabase.from("profiles").upsert(payload, {
    onConflict: "id"
  });
  if (error) throw new Error(error.message);
  const phone = data.phone || null;
  if (phone) {
    const {
      error: pErr
    } = await supabase.from("profiles_private").upsert({
      id: userId,
      phone
    }, {
      onConflict: "id"
    });
    if (pErr) throw new Error(pErr.message);
  }
  return {
    ok: true
  };
});
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479",
  name: "getMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    profile: data
  };
});
export {
  getMyProfile_createServerFn_handler,
  saveProfile_createServerFn_handler
};
