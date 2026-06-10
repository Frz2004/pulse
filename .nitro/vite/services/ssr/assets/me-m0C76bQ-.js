import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, H as useNavigate, L as Link, b as ChevronRight, B as Briefcase } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { g as getMyProfile } from "./profile.functions-Hlr7jGu-.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { U as User, B as BottomNav } from "./BottomNav-BBVBglWQ.js";
import { Q as QrCode } from "./qr-code-B3hFINTC.js";
import { C as Camera } from "./camera-CTivDuYi.js";
import { S as ShieldCheck } from "./shield-check-DHXh-Xe0.js";
import { G as GraduationCap, S as Shield } from "./shield-RgmoyAeK.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { M as MessageCircle } from "./message-circle-DLgZCMdI.js";
import { F as Film } from "./film-Cy3u2ISU.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { C as Crown } from "./crown-CA7Qlek8.js";
import { B as Bell } from "./bell-DcgN1dsG.js";
import { L as Lock } from "./lock-BXO1VJd6.js";
import { U as Users } from "./users-DxsiCKVk.js";
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
import "./plus-Bydlo4jQ.js";
const __iconNode$4 = [
  ["path", { d: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8", key: "1w3rig" }],
  ["path", { d: "M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1", key: "n2jgmb" }],
  ["path", { d: "M2 21h20", key: "1nyx9w" }],
  ["path", { d: "M7 8v3", key: "1qtyvj" }],
  ["path", { d: "M12 8v3", key: "hwp4zt" }],
  ["path", { d: "M17 8v3", key: "1i6e5u" }],
  ["path", { d: "M7 4h.01", key: "1bh4kh" }],
  ["path", { d: "M12 4h.01", key: "1ujb9j" }],
  ["path", { d: "M17 4h.01", key: "1upcoc" }]
];
const Cake = createLucideIcon("cake", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
function MePage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({
      data: data2
    }) => {
      if (!mounted) return;
      setAuthed(!!data2.session);
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const fetchMe = useServerFn(getMyProfile);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchMe(),
    enabled: authed === true
  });
  if (authed === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center pt-32 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 max-w-sm rounded-3xl border border-border bg-surface/70 p-8 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-coral to-sun text-background shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-2xl font-semibold", children: "还没有登录" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "登录后即可查看你的个人主页、消息和匹配" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
            mode: "login"
          }, className: "rounded-[10px] border border-brand/40 px-4 py-2.5 text-sm font-medium text-brand", children: "登录" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
            mode: "signup"
          }, className: "rounded-[10px] bg-coral px-4 py-2.5 text-sm font-semibold text-background", children: "注册" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "me" })
    ] });
  }
  const profile = data?.profile;
  const onboarded = profile?.onboarded;
  const photos = Array.isArray(profile?.photos) ? profile.photos : [];
  const mainIdx = profile?.main_idx ?? 0;
  const mainPhoto = photos[mainIdx] || photos[0];
  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  const personality = Array.isArray(profile?.personality) ? profile.personality : [];
  const handleLogout = async () => {
    await supabase.auth.signOut();
    const {
      track,
      Events,
      resetAnalytics
    } = await import("./router-qNgQXy3C.js").then((n) => n.h);
    track(Events.SignOut);
    resetAnalytics();
    refetch();
    navigate({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 top-0 h-80 overflow-hidden pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-coral/40 via-sun/25 to-mint/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-24 -left-16 size-72 rounded-full bg-coral/40 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 -right-20 size-80 rounded-full bg-mint/35 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto flex w-full max-w-md items-center justify-between px-5 pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-card/70 backdrop-blur hover:border-coral/40 transition", "aria-label": "二维码名片", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/me", className: "grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-card/70 backdrop-blur hover:border-coral/40 transition", "aria-label": "设置", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-muted-foreground" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto mt-8 w-full max-w-md px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-[28px] border border-white/60 bg-card/85 p-5 pt-12 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(214,113,71,0.35)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 left-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -m-1 rounded-[26px] bg-gradient-to-br from-coral via-sun to-mint blur-md opacity-70" }),
          mainPhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: mainPhoto, alt: "头像", className: "relative h-24 w-24 rounded-[24px] object-cover ring-4 ring-background shadow-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative grid h-24 w-24 place-items-center rounded-[24px] bg-gradient-to-br from-coral to-sun font-display text-4xl text-background ring-4 ring-background shadow-xl", children: (profile?.nickname || "我").slice(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding", className: "absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-foreground text-background shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3.5 w-3.5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 pl-[108px] -mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate font-display text-2xl font-bold tracking-tight", children: isLoading ? "—" : profile?.nickname || "未命名" }),
            profile?.verify_real && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-mint/20 px-1.5 py-0.5 text-[10px] font-medium text-mint border border-mint/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
              " 真人"
            ] }),
            profile?.verify_student && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/25", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-3 w-3" }),
              " 学生"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed", children: profile?.signature || "还没有签名，点编辑加一句让人记住你的话" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
          profile?.city && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: MapPin, children: profile.city }),
          profile?.mbti && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: Sparkles, children: profile.mbti }),
          profile?.zodiac && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: Cake, children: profile.zodiac }),
          !profile?.city && !profile?.mbti && !profile?.zodiac && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding", className: "inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-coral/40 hover:text-coral transition", children: "+ 添加标签" })
        ] }),
        !onboarded && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/onboarding", className: "group mt-4 flex items-center justify-between rounded-2xl border border-coral/30 bg-gradient-to-r from-coral/15 via-sun/10 to-coral/15 px-4 py-3 text-sm text-coral hover:border-coral/60 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
            " 完善资料解锁更多匹配"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 group-hover:translate-x-0.5 transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: Heart, label: "同频喜欢", value: "0", tone: "coral" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: Sparkles, label: "互相匹配", value: "0", tone: "sun" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: MessageCircle, label: "收到留言", value: "0", tone: "mint" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative mx-auto w-full max-w-md px-5 pb-28 pt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-end justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-4 w-1 rounded-full bg-gradient-to-b from-coral to-sun" }),
            "我的相册",
            photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: [
              "· ",
              photos.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding", className: "text-xs text-muted-foreground hover:text-foreground", children: "编辑" })
        ] }),
        photos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding", className: "grid h-32 place-items-center rounded-2xl border-2 border-dashed border-border bg-surface/40 text-sm text-muted-foreground hover:border-coral/40 hover:text-coral transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
          " 上传你的第一张照片"
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2.5", children: photos.slice(0, 9).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-square overflow-hidden rounded-2xl border border-border/70 shadow-sm hover:shadow-lg hover:shadow-coral/10 hover:-translate-y-0.5 transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p, alt: "", className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" }),
          i === mainIdx && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1.5 top-1.5 rounded-full bg-gradient-to-r from-coral to-sun px-2 py-0.5 text-[9px] font-semibold text-background shadow-md", children: "主图" })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 font-display text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-4 w-1 rounded-full bg-gradient-to-b from-mint to-primary" }),
          "关于我"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/70 bg-card/70 p-4 text-sm leading-relaxed text-foreground/90 shadow-sm", children: profile?.intro || "还没有写自我介绍。让别人通过你的故事认识你。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs", children: [
          profile?.job && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Briefcase, children: profile.job }),
          profile?.school && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: GraduationCap, children: profile.school }),
          profile?.height && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: User, children: profile.height }),
          profile?.hometown && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: House, children: profile.hometown })
        ] })
      ] }),
      (interests.length > 0 || personality.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 font-display text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-4 w-1 rounded-full bg-gradient-to-b from-sun to-coral" }),
          "兴趣 & 性格"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm", children: [
          interests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: interests.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[11px] text-mint", children: [
            "#",
            t
          ] }, t)) }),
          personality.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: personality.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-sun/30 bg-sun/10 px-2.5 py-1 text-[11px] text-sun", children: t }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "创作与互动" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "overflow-hidden rounded-2xl border border-border/70 bg-card/70 divide-y divide-border/60 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: PenLine, label: "编辑资料", to: "/onboarding", iconColor: "text-primary", iconBg: "bg-primary/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Film, label: "我的短视频", to: "/videos", iconColor: "text-coral", iconBg: "bg-coral/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Mic, label: "语音名片", to: "/voice-card", iconColor: "text-mint", iconBg: "bg-mint/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Heart, label: "我喜欢的人", badge: "敬请期待", iconColor: "text-coral", iconBg: "bg-coral/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: MessageCircle, label: "我的消息", to: "/messages", iconColor: "text-primary", iconBg: "bg-primary/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Crown, label: "钱包 · Pulse Pro", to: "/wallet", badge: "HOT", badgeColor: "bg-gradient-to-r from-coral to-sun text-background", iconColor: "text-sun", iconBg: "bg-sun/20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "设置与安全" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "overflow-hidden rounded-2xl border border-border/70 bg-card/70 divide-y divide-border/60 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Bell, label: "通知中心", to: "/notifications", iconColor: "text-sun", iconBg: "bg-sun/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Lock, label: "隐私与可见性", to: "/privacy", iconColor: "text-mint", iconBg: "bg-mint/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: ShieldCheck, label: "实名 & 学生认证", to: "/verify", iconColor: "text-primary", iconBg: "bg-primary/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Shield, label: "我的举报与申诉", to: "/me/reports", iconColor: "text-coral", iconBg: "bg-coral/15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Users, label: "账号安全", iconColor: "text-muted-foreground", iconBg: "bg-muted" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface/40 py-3 text-sm text-muted-foreground hover:text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " 退出登录"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[11px] text-muted-foreground", children: "Pulse v0.1 · 让相遇变得有趣" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "me" })
  ] });
}
function Shell({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground", children });
}
function Chip({
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    children
  ] });
}
function StatPill({
  icon: Icon,
  label,
  value,
  tone
}) {
  const tones = {
    coral: "from-coral/20 to-coral/5 text-coral border-coral/25",
    sun: "from-sun/25 to-sun/5 text-amber-700 border-sun/30",
    mint: "from-mint/20 to-mint/5 text-mint border-mint/25"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border bg-gradient-to-br ${tones[tone]} px-3 py-3 text-center overflow-hidden`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "absolute -top-1 -right-1 h-8 w-8 opacity-15" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold text-foreground tabular-nums leading-none", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-[10px] text-muted-foreground", children: label })
  ] });
}
function SectionLabel({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground", children });
}
function InfoRow({
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-foreground/90", children })
  ] });
}
function MenuItem({
  icon: Icon,
  label,
  to,
  search,
  badge,
  badgeColor,
  iconColor,
  iconBg
}) {
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-8 w-8 place-items-center rounded-xl ${iconBg ?? "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${iconColor ?? "text-muted-foreground"}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium", children: label }),
    badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColor ?? "bg-muted text-muted-foreground"}`, children: badge }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
  ] });
  if (to) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, search, className: "block hover:bg-background/40", children: inner });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "block w-full text-left hover:bg-background/40", children: inner });
}
export {
  MePage as component
};
