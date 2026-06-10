import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, I as useQueryClient, F as toast, H as useNavigate, L as Link, A as ArrowLeft } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { e as listVideoComments, a as addVideoComment, b as deleteVideoComment, l as listShortVideos, t as toggleVideoLike, d as deleteShortVideo } from "./videos.functions-C_p_A1F_.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { R as ReportSheet } from "./ReportSheet-DEeFGpIz.js";
import { X } from "./x-C9W7T09B.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import { T as Trash2 } from "./trash-2-CcSJJm4y.js";
import { F as Flag } from "./flag-g1fA_T7D.js";
import { S as Send } from "./send-Dhkts5hY.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
import { P as Play } from "./play-vbVkUnKJ.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { V as Volume2 } from "./volume-2-DOJQY1ut.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./types-DNG0tEns.js";
import "./auth-middleware-Y8f4GSpx.js";
import "./index-m6JgwYlt.js";
import "./moderation.functions-CMFeqhrQ.js";
const __iconNode$1 = [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
];
const Music2 = createLucideIcon("music-2", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode);
function VideoCommentsSheet({ open, onClose, videoId, me, onCountChange }) {
  const list = useServerFn(listVideoComments);
  const add = useServerFn(addVideoComment);
  const del = useServerFn(deleteVideoComment);
  const qc = useQueryClient();
  const [draft, setDraft] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const [reportId, setReportId] = reactExports.useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ["video-comments", videoId],
    queryFn: () => list({ data: { videoId } }),
    enabled: open
  });
  const onSend = async () => {
    const c = draft.trim();
    if (!c || sending) return;
    setSending(true);
    try {
      await add({ data: { videoId, content: c } });
      setDraft("");
      onCountChange?.(1);
      qc.invalidateQueries({ queryKey: ["video-comments", videoId] });
    } catch (e) {
      toast.error(e?.message ?? "发送失败");
    } finally {
      setSending(false);
    }
  };
  const onDelete = async (id) => {
    if (!confirm("删除这条评论?")) return;
    try {
      await del({ data: { id } });
      onCountChange?.(-1);
      qc.invalidateQueries({ queryKey: ["video-comments", videoId] });
    } catch (e) {
      toast.error(e?.message ?? "删除失败");
    }
  };
  if (!open) return null;
  const comments = data?.comments ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[90] grid place-items-end bg-black/60 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex h-[72dvh] w-full max-w-md flex-col rounded-t-3xl border-t border-border bg-surface text-foreground shadow-2xl",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/60 px-5 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-semibold", children: [
              comments.length,
              " 条评论"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "grid h-8 w-8 place-items-center rounded-full bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-32 place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) }),
            !isLoading && comments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-40 place-items-center text-sm text-muted-foreground", children: "还没有评论,快来抢沙发" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: comments.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-coral to-sun text-sm font-semibold text-background", children: c.author_avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.author_avatar, alt: "", className: "h-full w-full object-cover" }) : c.author_nickname?.slice(0, 1) ?? "P" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: c.author_nickname ?? "Pulse 用户" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(c.created_at).toLocaleString("zh-CN", { hour12: false }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-foreground/90", children: c.content }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex gap-3 text-[11px] text-muted-foreground", children: me === c.author_id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onDelete(c.id), className: "flex items-center gap-1 hover:text-coral", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                  " 删除"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReportId(c.id), className: "flex items-center gap-1 hover:text-coral", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3 w-3" }),
                  " 举报"
                ] }) })
              ] })
            ] }, c.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 bg-surface px-3 py-3", style: { paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: draft,
                onChange: (e) => setDraft(e.target.value.slice(0, 500)),
                onKeyDown: (e) => {
                  if (e.key === "Enter") onSend();
                },
                placeholder: "说点什么……",
                className: "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onSend,
                disabled: !draft.trim() || sending,
                className: "grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-coral to-sun text-background disabled:opacity-50",
                children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ]
      }
    ) }),
    reportId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReportSheet,
      {
        open: true,
        onClose: () => setReportId(null),
        targetType: "video_comment",
        targetId: reportId
      }
    )
  ] });
}
function VideosPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({
      data: data2
    }) => {
      if (!alive) return;
      setAuthed(!!data2.session);
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const list = useServerFn(listShortVideos);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["short-videos"],
    queryFn: () => list({
      data: {
        scope: "all",
        limit: 20
      }
    }),
    enabled: authed === true
  });
  if (authed === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center pt-32 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 max-w-sm rounded-3xl border border-border bg-surface/70 p-8 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: "登录后才能看短视频" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
        mode: "login"
      }, className: "mt-4 inline-block rounded-full bg-coral px-6 py-2.5 text-sm font-semibold text-background", children: "去登录" })
    ] }) }) });
  }
  const items = data?.items ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/community"
      }), className: "pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none text-sm font-semibold text-white drop-shadow", children: "短视频" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/videos/upload", className: "pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-coral to-sun text-background shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }) })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-white/70", children: "加载中…" }),
    !isLoading && items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "mx-auto h-12 w-12 text-coral" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-2xl font-semibold text-white", children: "还没有人发布短视频" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-white/60", children: "来做第一个分享 30 秒生活的人吧" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/videos/upload", className: "mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-coral to-sun px-5 py-2.5 text-sm font-semibold text-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " 发布短视频"
      ] })
    ] }) }),
    items.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCard, { v }, v.id))
  ] }) });
}
function VideoCard({
  v
}) {
  const videoRef = reactExports.useRef(null);
  const cardRef = reactExports.useRef(null);
  const [playing, setPlaying] = reactExports.useState(false);
  const [muted, setMuted] = reactExports.useState(true);
  const [liked, setLiked] = reactExports.useState(v.liked_by_me);
  const [likes, setLikes] = reactExports.useState(v.likes_count);
  const [comments, setComments] = reactExports.useState(v.comments_count);
  const [openComments, setOpenComments] = reactExports.useState(false);
  const [openReport, setOpenReport] = reactExports.useState(false);
  const qc = useQueryClient();
  const like = useServerFn(toggleVideoLike);
  const remove = useServerFn(deleteShortVideo);
  const [me, setMe] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => setMe(data.session?.user.id ?? null));
  }, []);
  reactExports.useEffect(() => {
    const el = cardRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio > 0.7) {
        vid.play().then(() => setPlaying(true)).catch(() => {
        });
      } else {
        vid.pause();
        setPlaying(false);
      }
    }, {
      threshold: [0, 0.7, 1]
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  };
  const onLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    try {
      await like({
        data: {
          videoId: v.id,
          like: next
        }
      });
    } catch (e) {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
      toast.error(e?.message ?? "操作失败");
    }
  };
  const onDelete = async () => {
    if (!confirm("确认删除这条短视频?")) return;
    try {
      await remove({
        data: {
          id: v.id
        }
      });
      toast.success("已删除");
      qc.invalidateQueries({
        queryKey: ["short-videos"]
      });
    } catch (e) {
      toast.error(e?.message ?? "删除失败");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: cardRef, className: "relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRef, src: v.video_url, poster: v.cover_url ?? void 0, loop: true, playsInline: true, muted, onClick: togglePlay, className: "absolute inset-0 h-full w-full object-cover" }),
    !playing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: togglePlay, className: "absolute inset-0 grid place-items-center bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-16 w-16 text-white/90 drop-shadow-lg" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/30 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-28 right-3 flex flex-col items-center gap-5 text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/me", className: "grid h-12 w-12 place-items-center overflow-hidden rounded-full border-2 border-white/80 bg-gradient-to-br from-coral to-sun font-display text-lg", children: v.author.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.author.avatar, alt: "", className: "h-full w-full object-cover" }) : v.author.nickname?.slice(0, 1) ?? "P" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onLike, className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-9 w-9 ${liked ? "fill-coral text-coral" : ""}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs tabular-nums", children: likes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center", onClick: () => setOpenComments(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-9 w-9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs tabular-nums", children: comments })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMuted((m) => !m), className: "flex flex-col items-center", children: [
        muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-7 w-7" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-7 w-7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: muted ? "静音" : "声音" })
      ] }),
      me === v.author_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onDelete, className: "flex flex-col items-center text-white/70", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "删除" })
      ] }),
      me && me !== v.author_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenReport(true), className: "flex flex-col items-center text-white/70", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "举报" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 px-4 pb-8 text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-semibold", children: [
        "@",
        v.author.nickname,
        v.author.city ? ` · ${v.author.city}` : ""
      ] }),
      v.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-3 text-sm text-white/90", children: v.caption })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCommentsSheet, { open: openComments, onClose: () => setOpenComments(false), videoId: v.id, me, onCountChange: (d) => setComments((n) => Math.max(0, n + d)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReportSheet, { open: openReport, onClose: () => setOpenReport(false), targetType: "video", targetId: v.id, authorId: v.author_id })
  ] });
}
function Shell({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground", children });
}
export {
  VideosPage as component
};
