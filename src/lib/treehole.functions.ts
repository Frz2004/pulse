import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const anonymousNames = ["小熊", "星星", "橘子", "月亮", "小鹿", "泡泡", "云朵", "花花", "西瓜", "小猫", "小鱼", "小兔"];
const anonymousAvatars = ["from-coral to-sun", "from-mint to-brand", "from-sun to-coral", "from-brand to-mint", "from-violet to-coral"];

function pick<T>(items: T[]) { return items[Math.floor(Math.random() * items.length)]; }
function anonName() { return `匿名${pick(anonymousNames)}`; }
function anonAvatar() { return pick(anonymousAvatars); }

export const listTreeholePosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ category: z.enum(["全部", "最新", "吐槽", "提问"]).default("全部"), q: z.string().trim().max(80).optional() }).parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: rows, error } = await supabaseAdmin
      .from("treehole_posts")
      .select("id, anonymous_name, anonymous_avatar, content, image_url, content_type, content_tags, category, likes_count, comments_count, views_count, created_at, author_id")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    const posts = (rows ?? [])
      .filter((r: any) => data.category === "全部" ? true : r.category === data.category)
      .filter((r: any) => data.q ? (`${r.content} ${r.anonymous_name} ${(r.content_tags ?? []).join(" ")}`).includes(data.q!) : true)
      .map((r: any) => ({
        id: r.id,
        authorId: r.author_id,
        nickname: r.anonymous_name,
        avatar: r.anonymous_avatar,
        time: new Date(r.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        type: r.category,
        content: r.content,
        imageUrl: r.image_url ?? null,
        imageUrls: [] as string[],
        tags: Array.isArray(r.content_tags) ? r.content_tags : [],
        likes: r.likes_count ?? 0,
        comments: r.comments_count ?? 0,
        views: r.views_count ?? 0,
      }));

    const postIds = posts.map((p) => p.id);
    if (postIds.length > 0) {
      const { data: attachments, error: attachmentsError } = await supabaseAdmin
        .from("treehole_post_attachments")
        .select("post_id, file_url, sort_order")
        .in("post_id", postIds)
        .order("sort_order", { ascending: true });
      if (attachmentsError) throw attachmentsError;

      const urlsByPost = new Map<string, string[]>();
      for (const item of attachments ?? []) {
        const list = urlsByPost.get((item as any).post_id) ?? [];
        list.push((item as any).file_url);
        urlsByPost.set((item as any).post_id, list);
      }
      for (const post of posts) {
        post.imageUrls = urlsByPost.get(post.id) ?? (post.imageUrl ? [post.imageUrl] : []);
      }
    }

    void Promise.all(posts.map((p) => supabaseAdmin.from("treehole_views").upsert({ post_id: p.id, user_id: userId }, { onConflict: "post_id,user_id" }).then(() => null, () => null)));
    return { posts };
  });

export const createTreeholePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ content: z.string().trim().min(1).max(2000), imageUrl: z.string().url().optional(), imageUrls: z.array(z.string().url()).max(9).default([]), tags: z.array(z.string().trim().min(1).max(20)).max(6).default([]), category: z.enum(["最新", "吐槽", "提问"]).default("最新"), allowComments: z.boolean().default(true), anonymousDisplay: z.boolean().default(true), contentType: z.enum(["text", "image", "emoji", "topic"]).default("text") }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: post, error } = await supabaseAdmin.from("treehole_posts").insert({
      author_id: userId,
      anonymous_name: anonName(),
      anonymous_avatar: anonAvatar(),
      content: data.content,
      image_url: data.imageUrls[0] ?? data.imageUrl ?? null,
      content_type: data.contentType,
      content_tags: data.tags,
      category: data.category,
      allow_comments: data.allowComments,
      anonymous_display: data.anonymousDisplay,
      status: "approved",
    }).select("id").single();
    if (error) throw error;

    if (data.imageUrls.length > 0) {
      const { error: attachmentsError } = await supabaseAdmin
        .from("treehole_post_attachments")
        .insert(data.imageUrls.map((url, index) => ({
          post_id: post.id,
          file_url: url,
          file_type: "image",
          sort_order: index,
        })));
      if (attachmentsError) throw attachmentsError;
    }

    return { id: post.id as string };
  });

export const addTreeholeLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ postId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin.from("treehole_likes").upsert({ post_id: data.postId, user_id: userId }, { onConflict: "post_id,user_id" });
    if (error) throw error;
    return { ok: true };
  });

export const listTreeholeComments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ postId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: post, error: postError } = await supabaseAdmin
      .from("treehole_posts")
      .select("author_id")
      .eq("id", data.postId)
      .single();
    if (postError) throw postError;

    const { data: rows, error } = await supabaseAdmin
      .from("treehole_comments")
      .select("id, author_id, anonymous_name, content, likes_count, created_at, parent_comment_id, visible_to_author_only")
      .eq("post_id", data.postId)
      .order("created_at", { ascending: true });
    if (error) throw error;

    const isPostAuthor = post?.author_id === userId;
    const visibleRows = (rows ?? []).filter((r: any) => {
      if (!r.visible_to_author_only) return true;
      return isPostAuthor || r.author_id === userId;
    });

    return {
      comments: visibleRows.map((r: any) => ({
        id: r.id,
        nickname: r.anonymous_name,
        content: r.content,
        likes: r.likes_count ?? 0,
        time: new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        parentCommentId: r.parent_comment_id,
        visibleToAuthorOnly: r.visible_to_author_only,
      })),
    };
  });

export const createTreeholeComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ postId: z.string().uuid(), content: z.string().trim().min(1).max(1000), parentCommentId: z.string().uuid().optional(), visibleToAuthorOnly: z.boolean().default(false) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin.from("treehole_comments").insert({ post_id: data.postId, author_id: userId, anonymous_name: anonName(), content: data.content, parent_comment_id: data.parentCommentId ?? null, visible_to_author_only: data.visibleToAuthorOnly });
    if (error) throw error;
    return { ok: true };
  });

export const addTreeholeCommentLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ commentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin.from("treehole_likes").upsert({ comment_id: data.commentId, user_id: userId }, { onConflict: "comment_id,user_id" });
    if (error) throw error;
    return { ok: true };
  });

export const reportTreeholeComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ commentId: z.string().uuid(), reason: z.string().trim().min(1).max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin.from("treehole_reports").insert({ reporter_id: userId, target_type: "comment", target_id: data.commentId, reason: data.reason, status: "pending" });
    if (error) throw error;
    return { ok: true };
  });

export const createTreeholeChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ postId: z.string().uuid(), authorId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: chat, error } = await supabaseAdmin.from("treehole_chats").insert({ post_id: data.postId, requester_id: userId, author_id: data.authorId, requester_anonymous_name: anonName(), author_anonymous_name: anonName(), status: "active", reveal_status: "anonymous" }).select("id").single();
    if (error) throw error;
    return { id: chat.id as string };
  });

export const listTreeholeChatMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ chatId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await supabaseAdmin.from("treehole_chat_messages").select("id, sender_id, sender_anonymous_name, content, content_type, created_at, read_at").eq("chat_id", data.chatId).order("created_at", { ascending: true });
    if (error) throw error;
    return { messages: (rows ?? []).map((r: any) => ({ id: r.id, senderId: r.sender_id, senderName: r.sender_anonymous_name, content: r.content, contentType: r.content_type, createdAt: r.created_at, readAt: r.read_at })) };
  });

export const sendTreeholeChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ chatId: z.string().uuid(), content: z.string().trim().min(1).max(2000) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: chat, error: chatErr } = await supabaseAdmin.from("treehole_chats").select("id, requester_id, author_id, total_message_count").eq("id", data.chatId).single();
    if (chatErr) throw chatErr;
    const { error } = await supabaseAdmin.from("treehole_chat_messages").insert({ chat_id: data.chatId, sender_id: userId, sender_anonymous_name: anonName(), content: data.content, content_type: "text" });
    if (error) throw error;
    await supabaseAdmin.from("treehole_chats").update({ total_message_count: (chat.total_message_count ?? 0) + 1 }).eq("id", data.chatId);
    return { ok: true };
  });

export const requestTreeholeReveal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ chatId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: chat, error } = await supabaseAdmin.from("treehole_chats").select("id, requester_id, author_id, total_message_count, requester_accept_reveal, author_accept_reveal, reveal_status").eq("id", data.chatId).single();
    if (error) throw error;
    if ((chat.total_message_count ?? 0) < 30) throw new Error("消息数未达到揭开身份条件");
    const targetId = userId === chat.requester_id ? chat.author_id : chat.requester_id;
    const { error: upErr } = await supabaseAdmin.from("treehole_reveal_requests").upsert({ chat_id: data.chatId, requester_id: userId, target_id: targetId, requester_accept: true, status: "pending" }, { onConflict: "chat_id,requester_id,target_id" });
    if (upErr) throw upErr;
    return { ok: true };
  });

export const decideTreeholeReveal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ chatId: z.string().uuid(), accept: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: chat, error } = await supabaseAdmin.from("treehole_chats").select("id, requester_id, author_id").eq("id", data.chatId).single();
    if (error) throw error;
    const isRequester = userId === chat.requester_id;
    const fields = isRequester ? { requester_accept_reveal: data.accept } : { author_accept_reveal: data.accept };
    const { error: updErr } = await supabaseAdmin.from("treehole_chats").update(fields).eq("id", data.chatId);
    if (updErr) throw updErr;
    const { data: updated } = await supabaseAdmin.from("treehole_chats").select("requester_accept_reveal, author_accept_reveal").eq("id", data.chatId).single();
    if (updated?.requester_accept_reveal && updated?.author_accept_reveal) {
      await supabaseAdmin.from("treehole_chats").update({ reveal_status: "revealed", status: "revealed", ended_at: new Date().toISOString() }).eq("id", data.chatId);
    }
    return { ok: true };
  });
