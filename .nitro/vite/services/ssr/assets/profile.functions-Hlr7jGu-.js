import { c as createSsrRpc } from "./createSsrRpc-DIcQTQ8d.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
const saveProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("cbcc924041242dd11e1ad5000167f6d3fdcc014f84f3fe5dca969bb9361d5d65"));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479"));
export {
  getMyProfile as g,
  saveProfile as s
};
