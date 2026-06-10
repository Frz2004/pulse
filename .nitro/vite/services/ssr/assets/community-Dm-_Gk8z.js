import { k as createServerFn, X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, L as Link, c as Route, I as useQueryClient, G as track, E as Events, F as toast } from "./router-qNgQXy3C.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { u as useMutation } from "./useMutation-Dm5qlno2.js";
import { B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { R as ReportSheet } from "./ReportSheet-DEeFGpIz.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { o as objectType, s as stringType, u as unionType, l as literalType, e as enumType, a as arrayType } from "./types-DNG0tEns.js";
import { e as listMyCampuses, l as listAllCampuses, S as School, r as redeemCampusInvite, d as createCampusInvite, s as searchInviteCandidates, i as inviteUsersToCampus } from "./campus.functions-CkPxrL4L.js";
import { K as KeyRound } from "./key-round-Dq6Iq0Wd.js";
import { M as MessageSquare } from "./message-square-Bk7lMpAm.js";
import { F as Flame } from "./flame-lI1Os8Ee.js";
import { T as TrendingUp } from "./trending-up-CEOfA5Mw.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { X } from "./x-C9W7T09B.js";
import { U as UserPlus } from "./user-plus-BFbiOZ_5.js";
import { S as Search } from "./search-B_wn2j3V.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import { C as Check } from "./check-DKEi7gus.js";
import { S as Send } from "./send-Dhkts5hY.js";
import { C as Copy } from "./copy-BYk6C3Ka.js";
import { I as Image } from "./image-2OWq2Uqv.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
import { F as Flag } from "./flag-g1fA_T7D.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
import "./users-DxsiCKVk.js";
import "./moderation.functions-CMFeqhrQ.js";
const __iconNode$3 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$3);
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
const CATEGORY = enumType(["second", "vent", "ask"]);
const listCommunityPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  category: unionType([CATEGORY, literalType("all")]).optional(),
  campus_id: stringType().uuid().optional()
}).parse(input ?? {})).handler(createSsrRpc("c4ac17859b6dcb66dca3f7d10d5c5c504816abc4808849a193d293bcb5f90550"));
const createCommunityPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  campus_id: stringType().uuid(),
  category: CATEGORY,
  title: stringType().trim().min(1).max(120),
  content: stringType().trim().min(1).max(2e3),
  tags: arrayType(stringType().trim().min(1).max(20)).max(6).optional(),
  location: stringType().min(1).max(120),
  media: arrayType(objectType({
    url: stringType().url().max(500),
    type: enumType(["image", "video"])
  })).max(9).optional()
}).parse(input)).handler(createSsrRpc("6142a0706f7116286937c964079522c3e9b06a18f8d353be57cba5fe165ed4a2"));
const toggleCommunityLike = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0258cb088229b364277c379c5224ed305a1468f57516f608c9f64327042046fa"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("31a2a44eae1b60317fd1082df6a3e447bb365254295208ea5a439c5860e6074d"));
const listCommunityComments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("9cae02d59ec4c2a8fee89a9ceacd621697f61ec6cb65a432a3d55fee82b0f216"));
const addCommunityComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  post_id: stringType().uuid(),
  content: stringType().trim().min(1).max(500)
}).parse(input)).handler(createSsrRpc("8be7bdcbf8abe255128d6469273f7d6b0c60720a9be99938a2fba96ac4d53369"));
const deleteCommunityComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  comment_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0aecda8560cfb76a7931c81a74cbdeec8587397083e11325b632ecd418375e67"));
const CATEGORY_META = {
  second: {
    label: "二手闲置",
    color: "bg-mint/20 text-mint border-mint/30",
    icon: ShoppingBag
  },
  vent: {
    label: "吐槽日常",
    color: "bg-coral/20 text-coral border-coral/30",
    icon: MessageSquare
  },
  ask: {
    label: "发帖求助",
    color: "bg-sun/20 text-sun border-sun/30",
    icon: CircleQuestionMark
  }
};
const TAB_META = {
  all: {
    label: "全部",
    icon: Tag
  },
  second: {
    label: "二手闲置",
    icon: ShoppingBag
  },
  vent: {
    label: "吐槽日常",
    icon: MessageSquare
  },
  ask: {
    label: "发帖求助",
    icon: CircleQuestionMark
  }
};
function heightFor(id) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return n % 3 === 0 ? "tall" : n % 3 === 1 ? "mid" : "short";
}
function CommunityPage() {
  const [authed, setAuthed] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [roleReady, setRoleReady] = reactExports.useState(false);
  const [userId, setUserId] = reactExports.useState(null);
  const authRunRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    let mounted = true;
    const syncAuth = async (uid) => {
      const runId = ++authRunRef.current;
      if (!mounted) return;
      setAuthed(!!uid);
      setUserId(uid ?? null);
      setIsAdmin(false);
      if (!uid) {
        setRoleReady(true);
        return;
      }
      setRoleReady(false);
      try {
        const {
          data,
          error
        } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
        if (error) throw error;
        if (mounted && runId === authRunRef.current) setIsAdmin(!!data);
      } catch (error) {
        console.warn("检查社区权限失败，已按普通用户继续加载", error);
        if (mounted && runId === authRunRef.current) setIsAdmin(false);
      } finally {
        if (mounted && runId === authRunRef.current) setRoleReady(true);
      }
    };
    supabase.auth.getSession().then(({
      data
    }) => syncAuth(data.session?.user.id)).catch(() => syncAuth(void 0));
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, s) => {
      window.setTimeout(() => void syncAuth(s?.user.id), 0);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const myCampusesFn = useServerFn(listMyCampuses);
  const allCampusesFn = useServerFn(listAllCampuses);
  const {
    data: campusData,
    isPending: campusPending,
    isError: campusIsError,
    error: campusError,
    refetch: refetchCampuses
  } = useQuery({
    queryKey: ["my-campuses", userId, isAdmin],
    queryFn: () => isAdmin ? allCampusesFn() : myCampusesFn(),
    enabled: authed === true && roleReady,
    placeholderData: (previousData) => previousData,
    retry: 2
  });
  const myCampuses = campusData?.campuses ?? [];
  if (authed === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "size-12 mx-auto text-coral" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "登录后加入校园社区" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "每个学校/园区都是一个独立的同频圈子，登录后用邀请码加入。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "inline-block h-11 px-6 rounded-full bg-coral text-background font-semibold leading-[44px]", children: "去登录" })
    ] }) });
  }
  if (authed === null || authed === true && (!roleReady || campusPending)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CommunityBootSkeleton, {});
  }
  if (campusIsError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "size-12 mx-auto text-coral" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "社区加载失败" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: campusError?.message || "网络开小差了，请重试。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => refetchCampuses(), className: "inline-block h-11 px-6 rounded-full bg-coral text-background font-semibold", children: "重新加载" })
    ] }) });
  }
  if (myCampuses.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(JoinCampusGate, { onJoined: () => refetchCampuses() });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CampusFeed, { campuses: myCampuses });
}
function CampusFeed({
  campuses
}) {
  const [campus, setCampus] = reactExports.useState(campuses[0]);
  const [activeCat, setActiveCat] = reactExports.useState("all");
  const [campusOpen, setCampusOpen] = reactExports.useState(false);
  const [inviteOpen, setInviteOpen] = reactExports.useState(false);
  const [composeOpen, setComposeOpen] = reactExports.useState(false);
  const [joinOpen, setJoinOpen] = reactExports.useState(false);
  const [activePostId, setActivePostId] = reactExports.useState(null);
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  reactExports.useEffect(() => {
    if (search.compose === 1) {
      setComposeOpen(true);
      nav({
        search: {},
        replace: true
      });
    }
  }, [search.compose, nav]);
  const listFn = useServerFn(listCommunityPosts);
  const likeFn = useServerFn(toggleCommunityLike);
  const qc = useQueryClient();
  const queryKey = ["community-posts", campus.id, activeCat];
  const {
    data,
    isLoading
  } = useQuery({
    queryKey,
    queryFn: () => listFn({
      data: {
        category: activeCat,
        campus_id: campus.id
      }
    })
  });
  const posts = data?.posts ?? [];
  const hotRank = reactExports.useMemo(() => [...posts].sort((a, b) => b.hot - a.hot).slice(0, 5), [posts]);
  const activePost = reactExports.useMemo(() => activePostId ? posts.find((p) => p.id === activePostId) ?? null : null, [activePostId, posts]);
  const likeMut = useMutation({
    mutationFn: (post_id) => {
      track(Events.PostLiked, {
        post_id
      });
      return likeFn({
        data: {
          post_id
        }
      });
    },
    onMutate: async (post_id) => {
      await qc.cancelQueries({
        queryKey
      });
      const prev = qc.getQueryData(queryKey);
      if (prev) {
        qc.setQueryData(queryKey, {
          posts: prev.posts.map((p) => p.id === post_id ? {
            ...p,
            liked_by_me: !p.liked_by_me,
            likes_count: p.likes_count + (p.liked_by_me ? -1 : 1)
          } : p)
        });
      }
      return {
        prev
      };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(queryKey, ctx.prev)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 backdrop-blur-2xl bg-background/70 border-b border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCampusOpen(true), className: "group flex items-center gap-2.5 min-w-0 pr-3 pl-1.5 py-1.5 rounded-2xl bg-gradient-to-r from-surface/80 to-surface/30 border border-border/70 hover:border-coral/40 transition", title: "切换校园 / 园区", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-8 rounded-xl bg-gradient-to-br from-coral via-sun to-mint grid place-items-center shadow-sm text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 leading-none", children: "校园社区" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-display font-semibold truncate max-w-[160px] leading-tight mt-0.5", children: campus.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 text-muted-foreground group-hover:text-coral transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setInviteOpen(true), className: "ml-auto h-9 px-3.5 rounded-full bg-gradient-to-r from-coral to-sun text-background text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-coral/30 transition", title: "生成邀请码", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-3.5" }),
          " 邀请"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none", children: ["all", "second", "vent", "ask"].map((c) => {
        const {
          label,
          icon: Icon
        } = TAB_META[c];
        const active = activeCat === c;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveCat(c), className: `shrink-0 h-9 pl-3 pr-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-all duration-200 ${active ? "bg-gradient-to-r from-coral to-sun text-background shadow-sm shadow-coral/30 scale-[1.03]" : "bg-surface/60 border border-border/70 text-muted-foreground hover:text-foreground hover:border-coral/30"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" }),
          label
        ] }, c);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 pt-4 space-y-6", children: [
      activeCat === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-coral/15 via-sun/10 to-mint/15 p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-12 -right-12 size-40 rounded-full bg-coral/20 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-16 -left-10 size-40 rounded-full bg-mint/20 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-gradient-to-br from-coral to-sun grid place-items-center text-background shadow-md shadow-coral/30 animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base leading-tight", children: "热点排行榜" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-none mt-0.5", children: "最近大家都在聊的事" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-coral/70" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2.5", children: [
          hotRank.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs text-muted-foreground", children: "暂时还没有热门内容～" }),
          hotRank.map((p, i) => {
            const Icon = CATEGORY_META[p.category].icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActivePostId(p.id), className: "group/rank w-full flex items-center gap-3 rounded-xl px-2 py-1.5 -mx-2 text-left transition hover:bg-background/40 active:scale-[0.99]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${i === 0 ? "bg-gradient-to-br from-coral to-rose-500 text-background" : i === 1 ? "bg-gradient-to-br from-sun to-amber-500 text-background" : i === 2 ? "bg-gradient-to-br from-mint to-emerald-500 text-background" : "bg-surface/80 text-muted-foreground"}`, children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm truncate group-hover/rank:text-coral transition", children: p.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums shrink-0", children: p.hot >= 1e3 ? `${(p.hot / 1e3).toFixed(1)}k` : p.hot })
            ] }) }, p.id);
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyFeed, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "columns-2 md:columns-3 gap-3 [column-fill:_balance]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: posts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, onLike: () => likeMut.mutate(post.id), onOpen: () => setActivePostId(post.id) }, post.id)) }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "community", onCompose: () => setComposeOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: campusOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setCampusOpen(false), title: "切换校园 / 园区", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
      campuses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setCampus(c);
        setCampusOpen(false);
      }, className: `w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${c.id === campus.id ? "bg-coral/15 text-coral" : "hover:bg-surface/60"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "size-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: c.name }),
          c.location && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: c.location })
        ] })
      ] }) }, c.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "pt-2 mt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setCampusOpen(false);
        setJoinOpen(true);
      }, className: "w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-surface/60 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "用邀请码加入新园区" })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: inviteOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(InviteSheet, { campus, onClose: () => setInviteOpen(false) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: joinOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setJoinOpen(false), title: "加入新园区", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InlineJoinForm, { onJoined: () => {
      setJoinOpen(false);
      qc.invalidateQueries({
        queryKey: ["my-campuses"]
      });
    } }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: composeOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ComposeSheet, { onClose: () => setComposeOpen(false), campus, onPublished: () => qc.invalidateQueries({
      queryKey: ["community-posts"]
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activePost && /* @__PURE__ */ jsxRuntimeExports.jsx(PostDetail, { post: activePost, onClose: () => setActivePostId(null), onLike: () => likeMut.mutate(activePost.id) }) })
  ] });
}
function InlineJoinForm({
  onJoined
}) {
  const [code, setCode] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const redeemFn = useServerFn(redeemCampusInvite);
  const submit = async () => {
    const v = code.trim();
    if (v.length < 4) return;
    setSubmitting(true);
    try {
      await redeemFn({
        data: {
          code: v
        }
      });
      toast.success("成功加入校园社区");
      onJoined();
    } catch (e) {
      toast.error(e?.message ?? "加入失败");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "每个学校/园区都是独立的同频圈子。向圈内同学要一个邀请码即可加入。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), maxLength: 16, placeholder: "例如 K7QZ4M2A", className: "w-full h-12 px-4 rounded-2xl bg-background/40 border border-border text-center font-mono tracking-[0.3em] text-lg uppercase outline-none focus:border-coral/60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: submit, disabled: !code.trim() || submitting, className: "w-full h-11 rounded-full bg-coral text-background font-semibold disabled:opacity-40", children: submitting ? "验证中…" : "加入社区" })
  ] });
}
function JoinCampusGate({
  onJoined
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 mx-auto rounded-2xl bg-coral/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-7 text-coral" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "输入邀请码加入社区" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: [
        "每个学校/园区都是独立的同频圈子。",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "向圈内同学要一个邀请码即可加入。"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InlineJoinForm, { onJoined }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/me", className: "block text-xs text-muted-foreground hover:text-foreground text-center", children: "前往个人主页 →" })
  ] }) });
}
function InviteSheet({
  campus,
  onClose
}) {
  const [tab, setTab] = reactExports.useState("users");
  const [maxUses, setMaxUses] = reactExports.useState(5);
  const [hours, setHours] = reactExports.useState(168);
  const [latest, setLatest] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const createFn = useServerFn(createCampusInvite);
  const searchFn = useServerFn(searchInviteCandidates);
  const inviteUsersFn = useServerFn(inviteUsersToCampus);
  const [q, setQ] = reactExports.useState("");
  const [users, setUsers] = reactExports.useState([]);
  const [searching, setSearching] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [note, setNote] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const {
          users: rows
        } = await searchFn({
          data: {
            campus_id: campus.id,
            q
          }
        });
        if (!cancelled) setUsers(rows);
      } catch (e) {
        if (!cancelled) toast.error(e?.message ?? "搜索失败");
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, campus.id, searchFn]);
  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 20) next.add(id);
      else toast.message("一次最多邀请 20 人");
      return next;
    });
  };
  const sendInvites = async () => {
    if (selected.size === 0) {
      toast.error("请先选择至少一位用户");
      return;
    }
    setSending(true);
    try {
      const {
        sent,
        failed
      } = await inviteUsersFn({
        data: {
          campus_id: campus.id,
          recipient_ids: Array.from(selected),
          expires_in_hours: 168,
          note: note.trim() || void 0
        }
      });
      if (sent > 0) toast.success(`已发送 ${sent} 条邀请${failed ? `，${failed} 条失败` : ""}`);
      else toast.error("邀请发送失败");
      setSelected(/* @__PURE__ */ new Set());
      setNote("");
    } catch (e) {
      toast.error(e?.message ?? "发送失败");
    } finally {
      setSending(false);
    }
  };
  const generate = async () => {
    setCreating(true);
    try {
      const {
        invite
      } = await createFn({
        data: {
          campus_id: campus.id,
          max_uses: maxUses,
          expires_in_hours: hours
        }
      });
      setLatest({
        code: invite.code,
        max_uses: invite.max_uses,
        expires_at: invite.expires_at
      });
    } catch (e) {
      toast.error(e?.message ?? "生成失败");
    } finally {
      setCreating(false);
    }
  };
  const copy = async () => {
    if (!latest) return;
    await navigator.clipboard.writeText(latest.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose, title: `邀请好友加入 ${campus.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 p-1 rounded-full bg-background/40 border border-border", children: [{
      k: "users",
      label: "选用户发送",
      icon: UserPlus
    }, {
      k: "code",
      label: "生成邀请码",
      icon: KeyRound
    }].map((t) => {
      const active = tab === t.k;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.k), className: `flex-1 h-9 rounded-full text-xs font-medium inline-flex items-center justify-center gap-1.5 transition ${active ? "bg-coral text-background" : "text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-3.5" }),
        t.label
      ] }, t.k);
    }) }),
    tab === "users" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "按昵称搜索用户", className: "w-full h-10 pl-9 pr-3 rounded-xl bg-background/40 border border-border text-sm outline-none focus:border-coral/50" })
      ] }),
      selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "已选 ",
          selected.size,
          " 人"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected(/* @__PURE__ */ new Set()), className: "text-coral", children: "清空" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-64 overflow-y-auto -mx-1 px-1 space-y-1.5", children: searching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 flex items-center justify-center text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-2" }),
        " 搜索中…"
      ] }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-xs text-muted-foreground", children: q ? "没找到匹配的用户" : "没有可邀请的用户" }) : users.map((u) => {
        const checked = selected.has(u.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggle(u.id), className: `w-full flex items-center gap-3 p-2.5 rounded-xl border transition ${checked ? "border-coral/60 bg-coral/10" : "border-border bg-background/30 hover:border-coral/30"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AuthorBadge, { nickname: u.nickname, avatar: u.avatar, fallback: u.id.slice(0, 2), size: "md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: u.nickname || "未命名" }),
            u.city && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: u.city })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-5 rounded-md border flex items-center justify-center ${checked ? "bg-coral border-coral text-background" : "border-border"}`, children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) })
        ] }, u.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: note, onChange: (e) => setNote(e.target.value.slice(0, 200)), placeholder: "附言（可选，≤ 200 字）", rows: 2, className: "w-full px-3 py-2 rounded-xl bg-background/40 border border-border text-sm outline-none focus:border-coral/50 resize-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: sendInvites, disabled: sending || selected.size === 0, className: "w-full h-11 rounded-full bg-coral text-background font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2", children: [
        sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
        sending ? "发送中…" : `发送邀请${selected.size ? ` (${selected.size})` : ""}`
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "仅本园区成员可见的同频社区。生成邀请码发给同学，他们输入即可加入。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-muted-foreground space-y-1", children: [
          "可使用次数",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 500, value: maxUses, onChange: (e) => setMaxUses(Math.max(1, Math.min(500, Number(e.target.value) || 1))), className: "w-full h-10 px-3 rounded-xl bg-background/40 border border-border text-sm text-foreground outline-none focus:border-coral/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-muted-foreground space-y-1", children: [
          "有效期 (小时)",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 1440, value: hours, onChange: (e) => setHours(Math.max(1, Math.min(1440, Number(e.target.value) || 1))), className: "w-full h-10 px-3 rounded-xl bg-background/40 border border-border text-sm text-foreground outline-none focus:border-coral/50" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: generate, disabled: creating, className: "w-full h-11 rounded-full bg-coral text-background font-semibold disabled:opacity-50", children: creating ? "生成中…" : "生成邀请码" }),
      latest && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-background/40 p-4 text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl tracking-[0.3em]", children: latest.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
          "可邀请 ",
          latest.max_uses,
          " 人 ·",
          " ",
          latest.expires_at ? `${new Date(latest.expires_at).toLocaleString("zh-CN")} 前有效` : "长期有效"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copy, className: "inline-flex items-center gap-1.5 text-xs text-coral", children: [
          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }),
          copied ? "已复制" : "复制邀请码"
        ] })
      ] })
    ] })
  ] }) });
}
function AuthorBadge({
  nickname,
  avatar,
  fallback,
  size = "sm"
}) {
  const ini = (nickname ?? fallback).slice(0, 2).toUpperCase();
  const cls = size === "md" ? "size-9 text-sm" : "size-5 text-[10px]";
  if (avatar) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatar, alt: nickname ?? ini, className: `${cls} rounded-full object-cover shrink-0`, loading: "lazy" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${cls} rounded-full bg-gradient-to-br from-coral/50 to-mint/40 flex items-center justify-center font-bold shrink-0`, children: ini });
}
function PostCard({
  post,
  onLike,
  onOpen
}) {
  const meta = CATEGORY_META[post.category];
  const h = heightFor(post.id);
  const heightClass = h === "tall" ? "h-60" : h === "mid" ? "h-48" : "h-36";
  const displayName = post.author_nickname ?? `同学 ${post.author_id.slice(0, 2).toUpperCase()}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { layout: true, initial: {
    opacity: 0,
    y: 10
  }, animate: {
    opacity: 1,
    y: 0
  }, exit: {
    opacity: 0,
    scale: 0.98
  }, transition: {
    duration: 0.22,
    ease: "easeOut"
  }, onClick: onOpen, className: "group mb-3 break-inside-avoid rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm border border-border/70 hover:border-coral/50 hover:shadow-xl hover:shadow-coral/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-[0.98]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${heightClass} bg-gradient-to-br ${post.cover} overflow-hidden`, children: [
      post.media && post.media[0] ? post.media[0].type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.media[0].url, alt: post.title, className: "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: post.media[0].url, className: "absolute inset-0 size-full object-cover", muted: true, playsInline: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-grid opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-md ${meta.color}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(meta.icon, { className: "size-3" }),
        meta.label
      ] }),
      post.media && post.media.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-background/70 text-[10px] text-foreground/90 backdrop-blur-md", children: [
        "+",
        post.media.length - 1
      ] }),
      post.status && post.status !== "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md border ${post.status === "pending" ? "bg-amber-500/30 text-amber-50 border-amber-400/40" : post.status === "rejected" ? "bg-rose-500/40 text-rose-50 border-rose-400/40" : "bg-zinc-700/60 text-zinc-100 border-zinc-500/40"}`, children: post.status === "pending" ? "审核中" : post.status === "rejected" ? "已驳回" : "已移除" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-snug line-clamp-2 text-foreground", children: post.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2", children: post.content }),
      post.status && post.status !== "approved" && (post.review_note || post.auto_flag_reason) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-400/20 rounded-md px-2 py-1", children: [
        post.status === "rejected" || post.status === "removed" ? "审核备注: " : "提示: ",
        post.review_note || post.auto_flag_reason
      ] }),
      post.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: post.tags.slice(0, 3).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-mint bg-mint/10 px-1.5 py-0.5 rounded-md border border-mint/20", children: [
        "#",
        t
      ] }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 flex items-center justify-between border-t border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AuthorBadge, { nickname: post.author_nickname, avatar: post.author_avatar, fallback: post.author_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[90px]", children: displayName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs text-muted-foreground pt-2 tabular-nums", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: (e) => {
            e.stopPropagation();
            onLike();
          }, className: `inline-flex items-center gap-0.5 transition active:scale-90 ${post.liked_by_me ? "text-coral" : "hover:text-coral"}`, "aria-label": "点赞", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-3.5 ${post.liked_by_me ? "fill-coral" : ""}` }),
            post.likes_count
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5" }),
            post.comments_count
          ] })
        ] })
      ] })
    ] })
  ] });
}
function FeedSkeleton() {
  const heights = ["h-56", "h-44", "h-60", "h-40", "h-52", "h-44", "h-56", "h-48"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "columns-2 md:columns-3 gap-3 [column-fill:_balance]", "aria-busy": "true", "aria-label": "正在加载", children: heights.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 break-inside-avoid rounded-2xl overflow-hidden bg-surface/60 border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${h} bg-gradient-to-br from-surface to-background animate-pulse` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-5/6 rounded-md bg-surface animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-4/6 rounded-md bg-surface/80 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-5 rounded-full bg-surface animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-14 rounded bg-surface/80 animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-10 rounded bg-surface/80 animate-pulse" })
      ] })
    ] })
  ] }, i)) });
}
function EmptyFeed() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 px-6 text-center rounded-3xl border border-dashed border-border bg-surface/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 mx-auto rounded-2xl bg-coral/10 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-6 text-coral" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-base font-semibold", children: "这里还很安静" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-muted-foreground leading-relaxed", children: [
      "这个分类还没有动态",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "点击下方「+」发布第一条吧"
    ] })
  ] });
}
function CommunityBootSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-32 rounded-full bg-surface animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto h-9 w-16 rounded-full bg-surface animate-pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 pb-3 flex items-center gap-2 overflow-hidden", children: [60, 80, 70, 64].map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 rounded-full bg-surface animate-pulse", style: {
        width: w
      } }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 pt-4 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 rounded-3xl bg-surface/50 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {})
    ] })
  ] });
}
function PostDetail({
  post,
  onClose,
  onLike
}) {
  const meta = CATEGORY_META[post.category];
  const displayName = post.author_nickname ?? `同学 ${post.author_id.slice(0, 2).toUpperCase()}`;
  const media = post.media ?? [];
  const [idx, setIdx] = reactExports.useState(0);
  const [draft, setDraft] = reactExports.useState("");
  const [meId, setMeId] = reactExports.useState(null);
  const [report, setReport] = reactExports.useState(null);
  const qc = useQueryClient();
  const listFn = useServerFn(listCommunityComments);
  const addFn = useServerFn(addCommunityComment);
  const delFn = useServerFn(deleteCommunityComment);
  const commentsKey = ["community-comments", post.id];
  const {
    data: cData
  } = useQuery({
    queryKey: commentsKey,
    queryFn: () => listFn({
      data: {
        post_id: post.id
      }
    })
  });
  const comments = cData?.comments ?? [];
  reactExports.useEffect(() => {
    supabase.auth.getUser().then(({
      data
    }) => setMeId(data.user?.id ?? null));
  }, []);
  const addMut = useMutation({
    mutationFn: (content) => addFn({
      data: {
        post_id: post.id,
        content
      }
    }),
    onSuccess: ({
      comment
    }) => {
      qc.setQueryData(commentsKey, (prev) => ({
        comments: [...prev?.comments ?? [], comment]
      }));
      qc.invalidateQueries({
        queryKey: ["community-posts"]
      });
      setDraft("");
    },
    onError: (e) => toast.error(e?.message ?? "评论失败")
  });
  const delMut = useMutation({
    mutationFn: (comment_id) => delFn({
      data: {
        comment_id
      }
    }),
    onSuccess: (_r, comment_id) => {
      qc.setQueryData(commentsKey, (prev) => ({
        comments: (prev?.comments ?? []).filter((c) => c.id !== comment_id)
      }));
      qc.invalidateQueries({
        queryKey: ["community-posts"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "删除失败")
  });
  const handleSubmit = () => {
    const text = draft.trim();
    if (!text) return;
    if (text.length > 500) {
      toast.error("评论最多 500 字");
      return;
    }
    addMut.mutate(text);
  };
  const commentCount = comments.length || post.comments_count;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0
  }, animate: {
    opacity: 1
  }, exit: {
    opacity: 0
  }, className: "fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6", onClick: onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      y: 60,
      opacity: 0
    }, animate: {
      y: 0,
      opacity: 1
    }, exit: {
      y: 60,
      opacity: 0
    }, className: "w-full md:max-w-5xl max-h-[95vh] md:h-[88vh] rounded-t-3xl md:rounded-3xl bg-surface border border-border overflow-hidden flex flex-col md:flex-row", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative bg-black md:w-[58%] md:h-full shrink-0 ${media.length > 0 ? "aspect-square md:aspect-auto" : "h-40 md:h-full"} bg-gradient-to-br ${post.cover}`, children: [
        media.length > 0 ? media[idx].type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: media[idx].url, alt: post.title, className: "absolute inset-0 size-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: media[idx].url, controls: true, className: "absolute inset-0 size-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-grid opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${meta.color}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(meta.icon, { className: "size-3" }),
          " ",
          meta.label
        ] }),
        media.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIdx((idx - 1 + media.length) % media.length), className: "absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-background/80", "aria-label": "上一张", children: "‹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIdx((idx + 1) % media.length), className: "absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-background/80", "aria-label": "下一张", children: "›" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-background/70 text-xs backdrop-blur-md", children: [
            idx + 1,
            " / ",
            media.length
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-h-0 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3.5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AuthorBadge, { nickname: post.author_nickname, avatar: post.author_avatar, fallback: post.author_id, size: "md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Pulse 用户" })
          ] }),
          meId && meId !== post.author_id && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReport({
            type: "post",
            id: post.id,
            authorId: post.author_id
          }), className: "size-8 rounded-full bg-surface/70 flex items-center justify-center text-muted-foreground hover:text-coral", "aria-label": "举报", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "size-8 rounded-full bg-surface/70 flex items-center justify-center md:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-bold leading-snug", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap", children: post.content }),
          post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: post.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-mint", children: [
            "#",
            t
          ] }, t)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(post.created_at).toLocaleDateString("zh-CN") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
              post.location
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 mt-2 border-t border-border text-xs text-muted-foreground", children: [
            "共 ",
            commentCount,
            " 条评论"
          ] }),
          comments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-xs text-muted-foreground", children: "还没有评论，来抢沙发吧～" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 pt-1", children: comments.map((c) => {
            const name = c.author_nickname || `同学 ${c.author_id.slice(0, 2).toUpperCase()}`;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AuthorBadge, { nickname: c.author_nickname, avatar: c.author_avatar, fallback: c.author_id, size: "md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground/90 truncate", children: name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(c.created_at).toLocaleDateString("zh-CN") }),
                  meId === c.author_id && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => delMut.mutate(c.id), className: "ml-auto text-[11px] text-muted-foreground hover:text-coral", children: "删除" }),
                  meId && meId !== c.author_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReport({
                    type: "comment",
                    id: c.id,
                    authorId: c.author_id
                  }), className: "ml-auto inline-flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-coral", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "size-3" }),
                    " 举报"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed mt-0.5 whitespace-pre-wrap break-words", children: c.content })
              ] })
            ] }, c.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-background/85 backdrop-blur-xl px-4 py-2.5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft, onChange: (e) => setDraft(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }, maxLength: 500, placeholder: "说点什么…", className: "flex-1 h-9 px-4 rounded-full bg-surface/80 border border-border text-sm placeholder:text-muted-foreground outline-none focus:border-coral/50" }),
          draft.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSubmit, disabled: addMut.isPending, className: "h-9 px-4 rounded-full bg-coral text-background text-xs font-medium disabled:opacity-60", children: addMut.isPending ? "发送中" : "发送" }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onLike, className: `inline-flex items-center gap-1 text-xs ${post.liked_by_me ? "text-coral" : "text-muted-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-5 ${post.liked_by_me ? "fill-coral" : ""}` }),
            post.likes_count
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-5" }),
            commentCount
          ] })
        ] })
      ] })
    ] }),
    report && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportSheet, { open: true, onClose: () => setReport(null), targetType: report.type, targetId: report.id, authorId: report.authorId ?? void 0 })
  ] });
}
function Modal({
  children,
  onClose,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0
  }, animate: {
    opacity: 1
  }, exit: {
    opacity: 0
  }, className: "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    y: 40,
    opacity: 0
  }, animate: {
    y: 0,
    opacity: 1
  }, exit: {
    y: 40,
    opacity: 0
  }, className: "w-full max-w-md rounded-3xl bg-surface border border-border p-5", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "size-8 rounded-full bg-background/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    children
  ] }) });
}
function ComposeSheet({
  onClose,
  campus,
  onPublished
}) {
  const [cat, setCat] = reactExports.useState("second");
  const [title, setTitle] = reactExports.useState("");
  const [content, setContent] = reactExports.useState("");
  const [tagDraft, setTagDraft] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState([]);
  const createFn = useServerFn(createCommunityPost);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [media, setMedia] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const onPickFiles = async (files) => {
    if (!files || files.length === 0) return;
    const {
      data: sess
    } = await supabase.auth.getSession();
    const uid = sess.session?.user.id;
    if (!uid) {
      toast.error("请先登录后再上传");
      return;
    }
    setUploading(true);
    try {
      const next = [...media];
      for (const file of Array.from(files).slice(0, 9 - next.length)) {
        if (file.size > 25 * 1024 * 1024) {
          toast.error(`${file.name} 超过 25MB，已跳过`);
          continue;
        }
        const ext = file.name.split(".").pop() || "bin";
        const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const {
          error
        } = await supabase.storage.from("community-media").upload(path, file, {
          contentType: file.type,
          upsert: false
        });
        if (error) {
          toast.error(`上传失败：${error.message}`);
          continue;
        }
        const {
          data: pub
        } = supabase.storage.from("community-media").getPublicUrl(path);
        next.push({
          url: pub.publicUrl,
          type: file.type.startsWith("video") ? "video" : "image",
          path
        });
      }
      setMedia(next);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  const removeMedia = async (idx) => {
    const item = media[idx];
    setMedia((m) => m.filter((_, i) => i !== idx));
    await supabase.storage.from("community-media").remove([item.path]).catch(() => {
    });
  };
  const addTag = () => {
    const t = tagDraft.trim().replace(/^#/, "").slice(0, 20);
    if (!t) return;
    if (tags.includes(t)) {
      setTagDraft("");
      return;
    }
    if (tags.length >= 6) {
      toast.error("最多 6 个话题");
      return;
    }
    setTags([...tags, t]);
    setTagDraft("");
  };
  const submit = async () => {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const res = await createFn({
        data: {
          campus_id: campus.id,
          category: cat,
          title: title.trim(),
          content: content.trim(),
          location: campus.name,
          tags,
          media: media.map(({
            url,
            type
          }) => ({
            url,
            type
          }))
        }
      });
      track(Events.PostCreated, {
        category: cat,
        has_media: media.length > 0,
        tags_count: tags.length
      });
      if (res?.pending) {
        toast.success("已提交,内容含敏感词,需管理员审核通过后才会公开展示");
      } else {
        toast.success("发布成功");
      }
      onPublished();
      onClose();
    } catch (e) {
      const msg = e?.message ?? "";
      if (msg.includes("Unauthorized")) toast.error("请先登录");
      else if (msg.includes("row-level security")) toast.error("你还不是该园区的成员");
      else toast.error("发布失败，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose, title: "发布新动态", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: Object.keys(CATEGORY_META).map((c) => {
      const meta = CATEGORY_META[c];
      const active = cat === c;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCat(c), className: `flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition ${active ? meta.color : "bg-background/40 border-border text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(meta.icon, { className: "size-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: meta.label })
      ] }, c);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*,video/*", multiple: true, className: "hidden", onChange: (e) => onPickFiles(e.target.files) }),
    media.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => fileRef.current?.click(), disabled: uploading, className: "w-full rounded-xl border border-dashed border-border h-32 flex flex-col items-center justify-center gap-1.5 text-muted-foreground text-xs hover:border-coral/50 hover:text-coral transition disabled:opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-6" }),
      uploading ? "上传中…" : "点击上传图片 / 视频"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      media.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square rounded-xl overflow-hidden bg-background/40 border border-border", children: [
        m.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.url, alt: "", className: "size-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: m.url, className: "size-full object-cover", muted: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeMedia(i), className: "absolute top-1 right-1 size-5 rounded-full bg-background/80 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) })
      ] }, m.path)),
      media.length < 9 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => fileRef.current?.click(), disabled: uploading, className: "aspect-square rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-coral hover:border-coral/50 transition disabled:opacity-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "给你的笔记起一个标题...", className: "w-full h-10 px-3 rounded-xl bg-background/40 border border-border text-sm focus:outline-none focus:border-coral/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), placeholder: "分享你的故事、好物、求助...", rows: 4, className: "w-full p-3 rounded-xl bg-background/40 border border-border text-sm resize-none focus:outline-none focus:border-coral/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-mint/15 text-mint text-xs", children: [
        "#",
        t,
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTags(tags.filter((x) => x !== t)), className: "opacity-70 hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) })
      ] }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3.5 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: tagDraft, onChange: (e) => setTagDraft(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          }
        }, maxLength: 20, placeholder: "添加话题，回车确认（最多 6 个）", className: "flex-1 h-8 px-2 rounded-lg bg-background/40 border border-border text-xs focus:outline-none focus:border-coral/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "size-3 text-coral" }),
        " 发布到 ",
        campus.name
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: submit, disabled: !title.trim() || !content.trim() || submitting, className: "w-full h-11 rounded-full bg-gradient-to-r from-coral to-sun text-background font-semibold disabled:opacity-40", children: submitting ? "发布中…" : "发布到社区" })
  ] }) });
}
export {
  CommunityPage as component
};
