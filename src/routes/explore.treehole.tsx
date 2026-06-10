import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, Plus, Search, ShieldAlert, Sparkles, ThumbsUp, UserRound, Loader2, Send, Flag, Ban, ArrowLeft, MoreHorizontal, Image as ImageIcon, Smile } from "lucide-react";
import { MobileFeatureShell } from "@/components/explore/MobileFeatureShell";
import { useServerFn } from "@tanstack/react-start";
import {
  addTreeholeLike,
  addTreeholeCommentLike,
  createTreeholeChat,
  createTreeholeComment,
  createTreeholePost,
  decideTreeholeReveal,
  listTreeholeComments,
  listTreeholePosts,
  listTreeholeChatMessages,
  reportTreeholeComment,
  requestTreeholeReveal,
  sendTreeholeChatMessage,
} from "@/lib/treehole.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PostType = "最新" | "吐槽" | "提问";

type TreeholePost = { id: string; authorId: string; nickname: string; avatar: string; time: string; type: PostType; content: string; imageUrl?: string | null; imageUrls?: string[]; tags: string[]; likes: number; comments: number; views: number };
type TreeholeComment = { id: string; nickname: string; content: string; likes: number; time: string; parentCommentId?: string | null; visibleToAuthorOnly?: boolean };
type ChatMessage = { id: string; senderId: string; senderName: string; content: string; createdAt: string };
const COMMENT_PRESETS = ["抱抱你", "有被安慰到", "太真实了", "我也一样", "先照顾自己", "说得很好"];


export const Route = createFileRoute("/explore/treehole")({
  head: () => ({ meta: [{ title: "匿名树洞 · Pulse" }] }),
  component: TreeholePage,
});

function TreeholePage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const [tab, setTab] = useState<PostType | "全部">("全部");
  const [query, setQuery] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [selected, setSelected] = useState<TreeholePost | null>(null);
  const [comments, setComments] = useState<TreeholeComment[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentReplyTo, setCommentReplyTo] = useState<TreeholeComment | null>(null);
  const [commentReported, setCommentReported] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [revealRequested, setRevealRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postLikeIds, setPostLikeIds] = useState<string[]>([]);
  const [commentLikeIds, setCommentLikeIds] = useState<string[]>([]);
  const [postPreviewImage, setPostPreviewImage] = useState<string | null>(null);

  const fetchPosts = useServerFn(listTreeholePosts);
  const fetchComments = useServerFn(listTreeholeComments);
  const createPostFn = useServerFn(createTreeholePost);
  const likeFn = useServerFn(addTreeholeLike);
  const commentFn = useServerFn(createTreeholeComment);
  const createChatFn = useServerFn(createTreeholeChat);
  const fetchChatMessages = useServerFn(listTreeholeChatMessages);
  const sendChatFn = useServerFn(sendTreeholeChatMessage);
  const revealFn = useServerFn(requestTreeholeReveal);
  const decideRevealFn = useServerFn(decideTreeholeReveal);

  if (pathname !== "/explore/treehole") return <Outlet />;

  const { data, refetch } = useQueryShim(async () => fetchPosts({ data: { category: tab, q: query || undefined } }), [tab, query]);
  const posts = data?.posts ?? [];

  useEffect(() => {
    if (!selected) return;
    fetchComments({ data: { postId: selected.id } }).then((res: any) => setComments(res.comments ?? []));
  }, [selected, fetchComments]);

  useEffect(() => {
    if (!chatId) return;
    fetchChatMessages({ data: { chatId } }).then((res: any) => setChatMessages(res.messages ?? []));
  }, [chatId, fetchChatMessages]);

  const filtered = useMemo(() => posts.filter((p: TreeholePost) => (tab === "全部" ? true : p.type === tab) && (query ? (p.content + p.tags.join(" ")).includes(query) : true)), [posts, query, tab]);


  const openPost = async (post: TreeholePost) => {
    setSelected(post);
    const res = await fetchComments({ data: { postId: post.id } });
    setComments(res.comments ?? []);
  };

  const visibleComments = useMemo(() => {
    return comments.filter((c) => {
      if (!c.visibleToAuthorOnly) return true;
      return selected ? true : false;
    });
  }, [comments, selected]);

  const doLike = async (postId: string) => {
    if (postLikeIds.includes(postId)) return;
    setPostLikeIds((v) => [...v, postId]);
    await likeFn({ data: { postId } });
    await refetch();
  };

  const doComment = async () => {
    if (!selected || !commentDraft.trim()) return;
    await commentFn({ data: { postId: selected.id, content: commentDraft.trim(), parentCommentId: commentReplyTo?.id ?? undefined } });
    setCommentDraft("");
    setCommentReplyTo(null);
    const res = await fetchComments({ data: { postId: selected.id } });
    setComments(res.comments ?? []);
    await refetch();
  };

  const doPublish = async (payload: { content: string; tags: string[]; category: PostType; contentType: "text" | "image" | "emoji" | "topic"; imageUrl?: string }) => {
    await createPostFn({ data: { content: payload.content, imageUrl: payload.imageUrl, tags: payload.tags, category: payload.category, allowComments: true, anonymousDisplay: true, contentType: payload.contentType } });
    await refetch();
    setPublishOpen(false);
    toast.success("树洞已发布，等待广场展示");
  };

  const startAnonymousChat = async (post: TreeholePost) => {
    setLoading(true);
    try {
      const res = await createChatFn({ data: { postId: post.id, authorId: post.authorId } });
      navigate({ to: "/explore/treehole/chat", search: { chatId: res.id, peer: post.nickname } });
    } catch (e: any) { toast.error(e?.message || "匿名聊聊失败"); } finally { setLoading(false); }
  };

  const sendChat = async () => {
    if (!chatId || !chatInput.trim()) return;
    await sendChatFn({ data: { chatId, content: chatInput.trim() } });
    setChatInput("");
    const msg = await fetchChatMessages({ data: { chatId } });
    setChatMessages(msg.messages ?? []);
  };

  const replyToComment = (c: TreeholeComment) => {
    setCommentReplyTo(c);
    setCommentDraft(`回复 @${c.nickname} `);
  };

  const likeComment = async (commentId: string) => {
    if (commentLikeIds.includes(commentId)) return;
    setCommentLikeIds((v) => [...v, commentId]);
    await addTreeholeCommentLike({ data: { commentId } });
    if (selected) {
      const res = await fetchComments({ data: { postId: selected.id } });
      setComments(res.comments ?? []);
    }
  };

  const reportComment = async (commentId: string) => {
    const reason = window.prompt("请输入举报原因（例如：骚扰、广告、辱骂）");
    if (!reason?.trim()) return;
    await reportTreeholeComment({ data: { commentId, reason: reason.trim() } });
    setCommentReported(commentId);
    toast.success("已提交举报");
  };

  return (
    <MobileFeatureShell title="匿名树洞" subtitle="匿名表达 · 情绪释放" icon={Sparkles} backTo="/explore" backLabel="发现" showBottomNav bottomNavActive="explore" footerPad>
      <section className="space-y-5 pb-6">
        <div className="rounded-3xl border border-coral/20 bg-gradient-to-br from-coral/10 via-sun/10 to-mint/10 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldAlert className="size-3.5 text-coral" />匿名发布，内容审核通过后展示</div>
          <h1 className="mt-2 font-display text-2xl font-bold">树洞广场</h1>
          <p className="mt-2 text-sm text-muted-foreground">在这里你可以吐槽、提问、发图片和话题标签，匿名表达自己的真实情绪。</p>
          <button onClick={() => setPublishOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun px-4 py-2.5 text-sm font-semibold text-background shadow-lg"><Plus className="size-4" /> 发布树洞</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">{["全部", "最新", "吐槽", "提问"].map((item) => <button key={item} onClick={() => setTab(item as any)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${tab === item ? "bg-foreground text-background" : "bg-surface text-muted-foreground"}`}>{item}</button>)}</div>
        <label className="flex items-center gap-2 rounded-2xl border border-border bg-surface/70 px-3 py-2 text-sm"><Search className="size-4 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索树洞内容或标签" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60" /></label>
        <div className="space-y-3">
          {filtered.map((post) => (
            <article key={post.id} className="rounded-3xl border border-border bg-surface/70 p-4 ios-card">
              <div className="flex items-start gap-3">
                <button onClick={() => openPost(post)} className={`grid size-11 place-items-center rounded-2xl bg-gradient-to-br ${post.avatar} text-background`}><UserRound className="size-5" /></button>
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-display font-semibold">{post.nickname}</span><span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] text-coral">{post.type}</span></div><p className="mt-1 text-[11px] text-muted-foreground">{post.time}</p></div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{post.content}</p>
              {Array.isArray(post.imageUrls) && post.imageUrls.length > 0 ? (
                post.imageUrls.length === 1 ? (
                  <button type="button" onClick={() => setPostPreviewImage(post.imageUrls?.[0] ?? null)} className="mt-3 block w-full overflow-hidden rounded-2xl">
                    <img src={post.imageUrls[0]} alt="treehole" className="h-56 w-full object-cover" />
                  </button>
                ) : (
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {post.imageUrls.slice(0, 9).map((url) => (
                      <button key={url} type="button" onClick={() => setPostPreviewImage(url)} className="overflow-hidden rounded-xl">
                        <img src={url} alt="treehole" className="aspect-square w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )
              ) : post.imageUrl ? (
                <button type="button" onClick={() => setPostPreviewImage(post.imageUrl ?? null)} className="mt-3 block w-full overflow-hidden rounded-2xl">
                  <img src={post.imageUrl} alt="treehole" className="h-56 w-full object-cover" />
                </button>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-1.5">{post.tags.map((t) => <span key={t} className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">#{t}</span>)}</div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <button onClick={() => doLike(post.id)} className="inline-flex items-center gap-1.5"><ThumbsUp className="size-4" /> {post.likes}</button>
                <button onClick={() => openPost(post)} className="inline-flex items-center gap-1.5"><MessageCircle className="size-4" /> {post.comments}</button>
                <button disabled={loading} onClick={() => startAnonymousChat(post)} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs">{loading ? <Loader2 className="size-3.5 animate-spin" /> : null} 匿名聊聊</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {publishOpen && (<PublishModal onClose={() => setPublishOpen(false)} onPublish={doPublish} />)}
      {selected && (<CommentsModal post={selected} comments={visibleComments} commentDraft={commentDraft} setCommentDraft={setCommentDraft} commentReplyTo={commentReplyTo} onReply={replyToComment} onLike={likeComment} onReport={reportComment} commentLikeIds={commentLikeIds} commentReported={commentReported} onClose={() => setSelected(null)} onComment={doComment} />)}
      {postPreviewImage && <div className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4" onClick={() => setPostPreviewImage(null)}><img src={postPreviewImage} alt="preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" /></div>}

    </MobileFeatureShell>
  );
}

function PublishModal({ onClose, onPublish }: { onClose: () => void; onPublish: (payload: { content: string; tags: string[]; category: PostType; contentType: "text" | "image" | "emoji" | "topic"; imageUrl?: string }) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<PostType>("最新");
  const [contentType, setContentType] = useState<"text" | "image" | "emoji" | "topic">("text");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const emojiBar = ["😊", "😭", "🥲", "😡", "🤍", "✨", "🌙", "🍀"];

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const handleFiles = async (files?: FileList | null) => {
    const arr = Array.from(files ?? []);
    if (arr.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const localPreviews = arr.slice(0, 9).map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...localPreviews].slice(0, 9));

    const uploaded: string[] = [];
    const limited = arr.slice(0, 9);
    for (let i = 0; i < limited.length; i += 1) {
      const file = limited[i];
      const path = `treehole/${Date.now()}-${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("treehole-media").upload(path, file, { upsert: false });
      if (error) { toast.error(error.message || "图片上传失败"); continue; }
      const { data } = supabase.storage.from("treehole-media").getPublicUrl(path);
      uploaded.push(data.publicUrl);
      setUploadProgress(Math.round(((i + 1) / limited.length) * 100));
    }

    if (uploaded.length > 0) {
      setImageUrls((prev) => [...prev, ...uploaded].slice(0, 9));
      setContentType("image");
    }

    setUploading(false);
  };

  const removeImage = (url: string) => {
    const idx = previewUrls.indexOf(url);
    if (idx >= 0) URL.revokeObjectURL(url);
    setPreviewUrls((prev) => prev.filter((u) => u !== url));
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const doPublish = () => {
    if (uploading) {
      toast.error("图片正在上传，请稍后再发布");
      return;
    }
    if (previewUrls.length > 0 && imageUrls.length === 0) {
      toast.error("图片还没上传完成，请稍后再试");
      return;
    }
    return onPublish({ content: content.trim(), tags: tags.split(/\s+/).map((t) => t.replace(/^#+/, "").trim()).filter(Boolean), category, contentType, imageUrl: imageUrls[0] ?? undefined, imageUrls });
  };

  return (<div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl overflow-hidden"><div className="mx-auto flex h-full w-full max-w-[430px] flex-col p-4 pt-6 overflow-hidden"><div className="mb-4 flex items-center justify-between shrink-0"><button onClick={onClose} className="rounded-full border border-border px-3 py-1.5 text-sm">取消</button><div className="font-display text-lg font-semibold">发布树洞</div><button disabled={uploading} onClick={doPublish} className="rounded-full bg-coral px-3 py-1.5 text-sm font-semibold text-background disabled:opacity-60">{uploading ? `上传中 ${uploadProgress}%` : "发布"}</button></div><div className="flex-1 overflow-y-auto overscroll-contain space-y-3 rounded-3xl border border-border bg-surface p-4"><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下你的树洞内容..." className="h-28 w-full resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60" />{uploading && <div className="rounded-2xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">正在上传图片 {uploadProgress}%</div>}{previewUrls.length > 0 && <div className={previewUrls.length === 1 ? "mt-1" : "grid grid-cols-3 gap-1.5"}>{previewUrls.map((url) => <button key={url} type="button" onClick={() => setPreviewImage(url)} className="relative overflow-hidden rounded-2xl"><img src={url} alt="treehole upload" className={previewUrls.length === 1 ? "h-40 w-full object-cover" : "aspect-square w-full object-cover"} /><span onClick={(e) => { e.stopPropagation(); removeImage(url); }} className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">删除</span></button>)}</div>}<div className="flex items-center gap-2"><label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"><ImageIcon className="size-3.5" /> 多图上传<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} /></label><div className="flex gap-1 overflow-x-auto">{emojiBar.map((emoji) => <button key={emoji} onClick={() => { setContent((v) => `${v}${emoji}`); setContentType("emoji"); }} className="rounded-full border border-border px-2 py-1 text-xs">{emoji}</button>)}</div></div><input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="内容标签（如：#感情 #职场）" className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none" /><select value={category} onChange={(e) => setCategory(e.target.value as PostType)} className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none"><option>最新</option><option>吐槽</option><option>提问</option></select><div className="flex items-center gap-2 text-xs text-muted-foreground"><Smile className="size-3.5" /> 当前类型：{contentType}</div></div></div>{previewImage && <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setPublishPreviewImage(null)}><img src={publishPreviewImage} alt="preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" /></div>}</div>);
}

function CommentsModal({ post, comments, commentDraft, setCommentDraft, commentReplyTo, onReply, onLike, onReport, commentLikeIds, commentReported, onClose, onComment }: { post: TreeholePost; comments: TreeholeComment[]; commentDraft: string; setCommentDraft: (v: string) => void; commentReplyTo: TreeholeComment | null; onReply: (c: TreeholeComment) => void; onLike: (id: string) => Promise<void>; onReport: (id: string) => Promise<void>; commentLikeIds: string[]; commentReported: string | null; onClose: () => void; onComment: () => Promise<void> }) {
  return (<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"><div className="mx-auto flex h-full w-full max-w-[430px] items-end"><div className="w-full rounded-t-3xl bg-background p-4 shadow-2xl"><div className="flex items-center justify-between"><div><div className="font-display font-semibold">{post.nickname}</div><div className="text-xs text-muted-foreground">匿名评论</div></div><button onClick={onClose} className="rounded-full border border-border px-3 py-1.5 text-sm">关闭</button></div><p className="mt-3 text-sm text-foreground">{post.content}</p><div className="mt-4 space-y-2 max-h-56 overflow-y-auto">{comments.map((c) => <div key={c.id} className="rounded-2xl bg-surface p-3 text-sm"><div className="flex items-center justify-between text-xs text-muted-foreground"><div className="flex items-center gap-2"><span>{c.nickname} · {c.time}</span>{c.visibleToAuthorOnly && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] text-brand">仅作者可见</span>}</div><div className="flex gap-2"><button onClick={() => onReply(c)} className="rounded-full px-2 py-0.5 hover:bg-black/5">回复</button><button onClick={() => onLike(c.id)} className="rounded-full px-2 py-0.5 hover:bg-black/5">{commentLikeIds.includes(c.id) ? "已赞" : `赞 ${c.likes}`}</button><button onClick={() => onReport(c.id)} className="rounded-full px-2 py-0.5 hover:bg-black/5">举报</button></div></div><div className="mt-1">{c.content}</div>{commentReported === c.id && <div className="mt-2 text-[11px] text-coral">已举报</div>}</div>)}</div>{commentReplyTo && <div className="mt-2 text-xs text-muted-foreground">正在回复：{commentReplyTo.nickname}</div>}<div className="mt-3 flex gap-2"><input value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="写下匿名评论..." className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none" /><button onClick={onComment} className="rounded-2xl bg-coral px-4 py-2 text-sm font-semibold text-background">发送</button></div></div></div></div>);
}



function useQueryShim<T>(fn: () => Promise<T>, deps: any[]) {
  const [data, setData] = useState<T | null>(null);
  const refetch = async () => { const res = await fn(); setData(res); return { data: res }; };
  useEffect(() => { refetch(); }, deps);
  return { data, refetch } as any;
}
