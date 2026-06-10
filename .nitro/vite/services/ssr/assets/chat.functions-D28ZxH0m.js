import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { s as supabaseAdmin } from "./client.server-CIpsZVxu.js";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "./types-DNG0tEns.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const listConversations_createServerFn_handler = createServerRpc({
  id: "0dd2c20b33382e0b96b9386b18a546d72bb512185924a8966dd76680167d3c90",
  name: "listConversations",
  filename: "src/lib/chat.functions.ts"
}, (opts) => listConversations.__executeServer(opts));
const listConversations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listConversations_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: blockRows
  } = await supabase.from("blocks").select("blocker_id, blocked_id").or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);
  const blockedSet = new Set((blockRows ?? []).map((b) => b.blocker_id === userId ? b.blocked_id : b.blocker_id));
  const {
    data: convs,
    error
  } = await supabase.from("conversations").select("id, user_a, user_b, source, last_message, last_message_at, created_at").or(`user_a.eq.${userId},user_b.eq.${userId}`).order("last_message_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  const visibleConvs = (convs ?? []).filter((c) => {
    const partnerId = c.user_a === userId ? c.user_b : c.user_a;
    return !blockedSet.has(partnerId);
  });
  const partnerIds = Array.from(new Set(visibleConvs.map((c) => c.user_a === userId ? c.user_b : c.user_a)));
  const profilesMap = /* @__PURE__ */ new Map();
  if (partnerIds.length) {
    const {
      data: profs
    } = await supabase.from("profiles").select("id, nickname, photos, main_idx").in("id", partnerIds);
    (profs ?? []).forEach((p) => profilesMap.set(p.id, p));
  }
  const convIds = visibleConvs.map((c) => c.id);
  const unreadMap = /* @__PURE__ */ new Map();
  if (convIds.length) {
    const {
      data: unreadRows
    } = await supabase.from("messages").select("conversation_id").in("conversation_id", convIds).is("read_at", null).neq("sender_id", userId);
    (unreadRows ?? []).forEach((r) => {
      unreadMap.set(r.conversation_id, (unreadMap.get(r.conversation_id) ?? 0) + 1);
    });
  }
  return {
    conversations: visibleConvs.map((c) => {
      const partnerId = c.user_a === userId ? c.user_b : c.user_a;
      const p = profilesMap.get(partnerId);
      const photos = Array.isArray(p?.photos) ? p.photos : [];
      return {
        id: c.id,
        partnerId,
        partnerName: p?.nickname || "Pulse 用户",
        partnerAvatar: photos[p?.main_idx ?? 0] || photos[0] || null,
        source: c.source,
        lastMessage: c.last_message,
        lastMessageAt: c.last_message_at,
        unread: unreadMap.get(c.id) ?? 0
      };
    })
  };
});
const getConversation_createServerFn_handler = createServerRpc({
  id: "da1aad61dcc8d005620d36d755091c11966e643eef886b2f2a190860280db654",
  name: "getConversation",
  filename: "src/lib/chat.functions.ts"
}, (opts) => getConversation.__executeServer(opts));
const getConversation = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getConversation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: conv,
    error
  } = await supabase.from("conversations").select("id, user_a, user_b, source, created_at").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!conv) throw new Error("会话不存在");
  const partnerId = conv.user_a === userId ? conv.user_b : conv.user_a;
  const {
    data: prof
  } = await supabase.from("profiles").select("id, nickname, photos, main_idx, city").eq("id", partnerId).maybeSingle();
  const photos = Array.isArray(prof?.photos) ? prof.photos : [];
  const {
    data: msgs
  } = await supabase.from("messages").select("id, sender_id, content, created_at, read_at").eq("conversation_id", data.id).order("created_at", {
    ascending: true
  }).limit(200);
  const msgIds = (msgs ?? []).map((m) => m.id);
  const attachmentsByMsg = /* @__PURE__ */ new Map();
  if (msgIds.length) {
    const {
      data: atts
    } = await supabase.from("message_attachments").select("message_id, kind, url, width, height").in("message_id", msgIds);
    const pathsToSign = (atts ?? []).filter((a) => !a.url.startsWith("http")).map((a) => a.url);
    const signedMap = /* @__PURE__ */ new Map();
    if (pathsToSign.length) {
      const {
        data: signed
      } = await supabase.storage.from("media").createSignedUrls(pathsToSign, 60 * 60);
      (signed ?? []).forEach((s) => {
        if (s.path && s.signedUrl) signedMap.set(s.path, s.signedUrl);
      });
    }
    (atts ?? []).forEach((a) => {
      const url = a.url.startsWith("http") ? a.url : signedMap.get(a.url) ?? a.url;
      attachmentsByMsg.set(a.message_id, {
        kind: a.kind,
        url,
        width: a.width,
        height: a.height
      });
    });
  }
  return {
    id: conv.id,
    source: conv.source,
    me: userId,
    partner: {
      id: partnerId,
      name: prof?.nickname || "Pulse 用户",
      avatar: photos[prof?.main_idx ?? 0] || photos[0] || null,
      city: prof?.city || null
    },
    messages: (msgs ?? []).map((m) => ({
      id: m.id,
      senderId: m.sender_id,
      content: m.content,
      createdAt: m.created_at,
      readAt: m.read_at,
      attachment: attachmentsByMsg.get(m.id) ?? null
    }))
  };
});
const sendMessage_createServerFn_handler = createServerRpc({
  id: "4f34919086f2a4130097c5da5423c36b625cea14ed1b142c70bfe1b53f9fd398",
  name: "sendMessage",
  filename: "src/lib/chat.functions.ts"
}, (opts) => sendMessage.__executeServer(opts));
const sendMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid(),
  content: stringType().min(1).max(2e3)
}).parse(input)).handler(sendMessage_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: msg,
    error
  } = await supabase.from("messages").insert({
    conversation_id: data.conversationId,
    sender_id: userId,
    content: data.content
  }).select("id, sender_id, content, created_at").single();
  if (error) throw new Error(error.message);
  return {
    message: msg
  };
});
const sendImageMessage_createServerFn_handler = createServerRpc({
  id: "49b25fcc787f3b1ceb5912e3a796fead3bb367b57fb85d2988767f84f58cfdef",
  name: "sendImageMessage",
  filename: "src/lib/chat.functions.ts"
}, (opts) => sendImageMessage.__executeServer(opts));
const sendImageMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid(),
  storagePath: stringType().min(1).max(500),
  width: numberType().int().positive().max(1e4).optional(),
  height: numberType().int().positive().max(1e4).optional()
}).parse(input)).handler(sendImageMessage_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (!data.storagePath.startsWith(`${userId}/`)) {
    throw new Error("Invalid storage path");
  }
  const {
    data: msg,
    error
  } = await supabase.from("messages").insert({
    conversation_id: data.conversationId,
    sender_id: userId,
    content: "[图片]"
  }).select("id").single();
  if (error) throw new Error(error.message);
  const {
    error: attErr
  } = await supabase.from("message_attachments").insert({
    message_id: msg.id,
    kind: "image",
    url: data.storagePath,
    width: data.width ?? null,
    height: data.height ?? null
  });
  if (attErr) throw new Error(attErr.message);
  return {
    id: msg.id
  };
});
const deleteConversation_createServerFn_handler = createServerRpc({
  id: "44b338201030bcba65791dea226c6f1b4fe8fd093bcb16e536c1f85297743df9",
  name: "deleteConversation",
  filename: "src/lib/chat.functions.ts"
}, (opts) => deleteConversation.__executeServer(opts));
const deleteConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid()
}).parse(input)).handler(deleteConversation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: conv
  } = await supabase.from("conversations").select("id, user_a, user_b").eq("id", data.conversationId).maybeSingle();
  if (!conv) throw new Error("会话不存在");
  if (conv.user_a !== userId && conv.user_b !== userId) {
    throw new Error("无权删除该会话");
  }
  const {
    error
  } = await supabase.from("conversations").delete().eq("id", data.conversationId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const startConversation_createServerFn_handler = createServerRpc({
  id: "ec5e2b13bb92cbb6fc73b8979986bae73650c214880300c0b687b60455555e0d",
  name: "startConversation",
  filename: "src/lib/chat.functions.ts"
}, (opts) => startConversation.__executeServer(opts));
const startConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  partnerId: stringType().uuid(),
  source: enumType(["match", "voice", "video", "treehole"]).default("match")
}).parse(input)).handler(startConversation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.partnerId === userId) throw new Error("不能和自己开始对话");
  const {
    data: blockRow
  } = await supabase.from("blocks").select("blocker_id").or(`and(blocker_id.eq.${userId},blocked_id.eq.${data.partnerId}),and(blocker_id.eq.${data.partnerId},blocked_id.eq.${userId})`).limit(1).maybeSingle();
  if (blockRow) throw new Error("无法发起对话：你们之间存在拉黑关系");
  const {
    data: priv
  } = await supabaseAdmin.from("profiles_privacy").select("allow_messages").eq("id", data.partnerId).maybeSingle();
  const allow = priv?.allow_messages ?? "everyone";
  if (allow === "none") throw new Error("对方已关闭新消息");
  if (allow === "matches") {
    const a = userId < data.partnerId ? userId : data.partnerId;
    const b = userId < data.partnerId ? data.partnerId : userId;
    const {
      data: m
    } = await supabase.from("matches").select("id").eq("user_a", a).eq("user_b", b).maybeSingle();
    if (!m) throw new Error("对方仅允许互相喜欢的人发消息");
  }
  const {
    data: convId,
    error
  } = await supabase.rpc("start_conversation", {
    partner_id: data.partnerId,
    source: data.source
  });
  if (error) throw new Error(error.message);
  return {
    id: convId
  };
});
const markConversationRead_createServerFn_handler = createServerRpc({
  id: "2216d629e02d38a41f65adec08148687e7cc80295a49818869b39ba5b4e64e87",
  name: "markConversationRead",
  filename: "src/lib/chat.functions.ts"
}, (opts) => markConversationRead.__executeServer(opts));
const markConversationRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  conversationId: stringType().uuid()
}).parse(input)).handler(markConversationRead_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error,
    count
  } = await supabase.from("messages").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    count: "exact"
  }).eq("conversation_id", data.conversationId).neq("sender_id", userId).is("read_at", null);
  if (error) throw new Error(error.message);
  return {
    marked: count ?? 0
  };
});
const searchUsersByNickname_createServerFn_handler = createServerRpc({
  id: "3ec4ac79d997a30d58e6f3ffc29f57101ab58ae3303aa0c2ddcee95133c185a0",
  name: "searchUsersByNickname",
  filename: "src/lib/chat.functions.ts"
}, (opts) => searchUsersByNickname.__executeServer(opts));
const searchUsersByNickname = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  q: stringType().trim().min(1).max(40)
}).parse(input)).handler(searchUsersByNickname_createServerFn_handler, async ({
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
  } = await supabase.from("profiles").select("id, nickname, photos, main_idx, city, signature").eq("onboarded", true).ilike("nickname", `%${data.q}%`).limit(30);
  if (error) throw new Error(error.message);
  const candidateIds = (rows ?? []).map((r) => r.id).filter((id) => id !== userId);
  const [{
    data: privRows
  }, {
    data: blockRows
  }] = await Promise.all([candidateIds.length ? supabaseAdmin.from("profiles_privacy").select("id, searchable, hide_city").in("id", candidateIds) : Promise.resolve({
    data: []
  }), supabase.from("blocks").select("blocker_id, blocked_id").or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)]);
  const privMap = /* @__PURE__ */ new Map();
  (privRows ?? []).forEach((p) => privMap.set(p.id, p));
  const blocked = new Set((blockRows ?? []).map((b) => b.blocker_id === userId ? b.blocked_id : b.blocker_id));
  const users = (rows ?? []).filter((r) => r.id !== userId).filter((r) => {
    if (blocked.has(r.id)) return false;
    const p = privMap.get(r.id);
    return p ? p.searchable : true;
  }).map((r) => {
    const photos = Array.isArray(r.photos) ? r.photos : [];
    const p = privMap.get(r.id);
    return {
      id: r.id,
      nickname: r.nickname ?? "Pulse 用户",
      city: p?.hide_city ? null : r.city ?? null,
      signature: r.signature ?? null,
      avatar: photos[r.main_idx ?? 0] || photos[0] || null
    };
  });
  return {
    users
  };
});
const lookupUserById_createServerFn_handler = createServerRpc({
  id: "da20d258cf6c5030ad7768cd1f26a5e55b01744e63eb20205ae62e3bc83fb8f3",
  name: "lookupUserById",
  filename: "src/lib/chat.functions.ts"
}, (opts) => lookupUserById.__executeServer(opts));
const lookupUserById = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(lookupUserById_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.id === userId) throw new Error("这是你自己的二维码");
  const {
    data: row,
    error
  } = await supabase.from("profiles").select("id, nickname, photos, main_idx, city, signature, onboarded").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || !row.onboarded) throw new Error("用户不存在或未完成资料");
  const photos = Array.isArray(row.photos) ? row.photos : [];
  return {
    user: {
      id: row.id,
      nickname: row.nickname ?? "Pulse 用户",
      city: row.city ?? null,
      signature: row.signature ?? null,
      avatar: photos[row.main_idx ?? 0] || photos[0] || null
    }
  };
});
export {
  deleteConversation_createServerFn_handler,
  getConversation_createServerFn_handler,
  listConversations_createServerFn_handler,
  lookupUserById_createServerFn_handler,
  markConversationRead_createServerFn_handler,
  searchUsersByNickname_createServerFn_handler,
  sendImageMessage_createServerFn_handler,
  sendMessage_createServerFn_handler,
  startConversation_createServerFn_handler
};
