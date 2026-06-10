import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, H as useNavigate, L as Link, A as ArrowLeft, F as toast, M as Moon } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { s as saveProfile } from "./profile.functions-Hlr7jGu-.js";
import { m as motion } from "./proxy-F-Xk4oX5.js";
import { A as AnimatePresence } from "./index-jTlp4AnA.js";
import { A as ArrowRight } from "./arrow-right-BzzcpbFw.js";
import { S as Star } from "./star-DExa2ZiW.js";
import { X } from "./x-C9W7T09B.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
import { C as Camera } from "./camera-CTivDuYi.js";
import { I as Image } from "./image-2OWq2Uqv.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { V as Video } from "./video-BqXgI5MD.js";
import { M as MapPin } from "./map-pin-BLU4BeSZ.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { P as Phone } from "./phone-b6RDMCGO.js";
import { B as BadgeCheck } from "./badge-check-ByBC0FrM.js";
import { C as Check } from "./check-DKEi7gus.js";
import { G as GraduationCap, S as Shield } from "./shield-RgmoyAeK.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./types-DNG0tEns.js";
import "./index-m6JgwYlt.js";
import "./auth-middleware-Y8f4GSpx.js";
const __iconNode$4 = [
  [
    "path",
    {
      d: "M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",
      key: "x6xyqk"
    }
  ],
  ["path", { d: "M8 14v.5", key: "1nzgdb" }],
  ["path", { d: "M16 14v.5", key: "1lajdz" }],
  ["path", { d: "M11.25 16.25h1.5L12 17l-.75-.75Z", key: "12kq1m" }]
];
const Cat = createLucideIcon("cat", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14", key: "1mb5g1" }],
  ["path", { d: "M18 8c0-2.5-2-2.5-2-5", key: "1il607" }],
  ["path", { d: "M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1", key: "1yl5r7" }],
  ["path", { d: "M22 8c0-2.5-2-2.5-2-5", key: "1gah44" }],
  ["path", { d: "M7 12v4", key: "jqww69" }]
];
const Cigarette = createLucideIcon("cigarette", __iconNode$3);
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
];
const UserRound = createLucideIcon("user-round", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", key: "cjf0a3" }],
  ["path", { d: "M7 2v20", key: "1473qp" }],
  ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7", key: "j28e5" }]
];
const Utensils = createLucideIcon("utensils", __iconNode$1);
const __iconNode = [
  ["path", { d: "M8 22h8", key: "rmew8v" }],
  ["path", { d: "M7 10h10", key: "1101jm" }],
  ["path", { d: "M12 15v7", key: "t2xh3l" }],
  [
    "path",
    { d: "M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z", key: "10ffi3" }
  ]
];
const Wine = createLucideIcon("wine", __iconNode);
const STEPS = [{
  key: "basic",
  title: "账号基础",
  subtitle: "让我们先认识一下你"
}, {
  key: "photos",
  title: "照片展示",
  subtitle: "上传 2–8 张真实照片"
}, {
  key: "bio",
  title: "个人简介",
  subtitle: "用一句话定义自己"
}, {
  key: "tags",
  title: "兴趣 & 性格",
  subtitle: "标签越精准，匹配越对味"
}, {
  key: "lifestyle",
  title: "生活方式",
  subtitle: "找到生活节奏相似的人"
}, {
  key: "intent",
  title: "交友意向",
  subtitle: "避免错配，让相遇更高效"
}, {
  key: "verify",
  title: "认证 & 安全",
  subtitle: "完成最后一步，开始遇见"
}];
const INTEREST_TAGS = ["旅行", "摄影", "咖啡", "健身", "徒步", "骑行", "滑雪", "潜水", "冲浪", "露营", "电影", "音乐节", "Live House", "唱跳", "乐器", "K-Pop", "摇滚", "电子", "民谣", "古典", "美食", "烘焙", "火锅", "日料", "brunch", "red wine", "调酒", "小酒馆", "街边小吃", "素食", "读书", "写作", "播客", "脱口秀", "桌游", "剧本杀", "密室", "展览", "美术馆", "设计", "宠物", "猫派", "狗派", "养花", "手作", "编织", "陶艺", "香薰", "水彩", "二次元", "原神", "王者", "CSGO", "Switch", "主机", "街机", "台球", "羽毛球", "网球", "篮球", "瑜伽", "普拉提", "跑步", "马拉松", "攀岩", "街舞", "拉丁", "民族舞", "滑板", "飞盘", "投资", "创业", "AI", "编程", "硬件", "摄影后期", "Vlog", "剪辑", "短视频", "创作者"];
const PERSONALITY_TAGS = ["温柔", "幽默", "直球", "社恐", "E人", "I人", "治愈系", "INTJ女孩", "松弛感", "氛围感", "细节控", "行动派", "完美主义", "佛系", "感性", "理性", "浪漫", "务实", "好奇心", "共情力", "话痨", "安静", "酷盖", "元气", "奶系", "御姐", "少年感", "成熟", "小天才", "钝感力"];
const MBTI = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
const ZODIAC = ["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎", "射手", "摩羯", "水瓶", "双鱼"];
const INTENT = ["认真恋爱", "拓展朋友", "兴趣搭子", "线下饭搭", "旅行同伴", "深度聊天", "随缘看看"];
const initial = {
  nickname: "",
  gender: "",
  birthday: "",
  city: "",
  hometown: "",
  height: "",
  education: "",
  job: "",
  school: "",
  photos: [],
  mainIdx: 0,
  videoIntro: "",
  signature: "",
  intro: "",
  status: "",
  interests: [],
  personality: [],
  mbti: "",
  zodiac: "",
  smoke: "",
  drink: "",
  sleep: "",
  diet: "",
  pet: "",
  intent: [],
  relationship: "",
  idealType: "",
  ageRange: [20, 30],
  distance: "同城",
  icebreaker: "",
  phone: "",
  verifyReal: false,
  verifyStudent: false
};
function Onboarding() {
  const [authed, setAuthed] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState(0);
  const [data, setData] = reactExports.useState(initial);
  const navigate = useNavigate();
  const saveProfileFn = useServerFn(saveProfile);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data: s
    }) => {
      if (!s.session) {
        navigate({
          to: "/auth",
          search: {
            mode: "signup",
            redirect: "/onboarding"
          }
        });
      } else {
        setAuthed(true);
        const meta = s.session.user.user_metadata;
        const fallback = s.session.user.email?.split("@")[0] ?? "";
        setData((d) => ({
          ...d,
          nickname: d.nickname || meta?.nickname || fallback,
          phone: d.phone || s.session.user.phone || ""
        }));
      }
    });
  }, [navigate]);
  const update = (patch) => setData((d) => ({
    ...d,
    ...patch
  }));
  const validators = [() => {
    if (!data.nickname.trim()) return "请填写昵称";
    if (!data.gender) return "请选择性别";
    if (!data.birthday) return "请选择出生日期";
    if (!data.city.trim()) return "请填写所在城市";
    return null;
  }, () => data.photos.length < 2 ? "至少上传 2 张照片" : null, () => {
    const len = data.signature.trim().length;
    if (len < 10) return "个性签名至少 10 个字";
    if (len > 150) return "个性签名不超过 150 字";
    return null;
  }, () => data.interests.length === 0 ? "至少选择 1 个兴趣标签" : null, () => null, () => data.intent.length === 0 ? "请选择交友目的" : null, () => !data.phone ? "请完成手机认证" : null];
  const [error, setError] = reactExports.useState(null);
  const next = async () => {
    const err = validators[step]();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setSubmitting(true);
      try {
        await saveProfileFn({
          data
        });
        try {
          localStorage.setItem("pulse_profile", JSON.stringify(data));
        } catch {
        }
        toast.success("资料已保存，开始遇见");
        navigate({
          to: "/me"
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "保存失败，请重试");
      } finally {
        setSubmitting(false);
      }
    }
  };
  const prev = () => {
    setError(null);
    setStep(Math.max(0, step - 1));
  };
  const progress = (step + 1) / STEPS.length * 100;
  if (authed === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm", children: "正在校验登录状态…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -left-20 size-[420px] rounded-full bg-coral/20 blur-[140px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 -right-20 size-[380px] rounded-full bg-mint/15 blur-[140px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto max-w-3xl px-5 pt-6 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
          " 返回"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          step + 1,
          " / ",
          STEPS.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-1.5 w-full rounded-full bg-surface overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "h-full bg-gradient-to-r from-coral via-sun to-mint", initial: false, animate: {
        width: `${progress}%`
      }, transition: {
        type: "spring",
        stiffness: 120,
        damping: 20
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold tracking-tight", children: STEPS[step].title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: STEPS[step].subtitle })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative z-10 mx-auto max-w-3xl px-5 pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      x: 24
    }, animate: {
      opacity: 1,
      x: 0
    }, exit: {
      opacity: 0,
      x: -24
    }, transition: {
      duration: 0.25
    }, className: "mt-6", children: [
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepBasic, { data, update }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepPhotos, { data, update }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepBio, { data, update }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepTags, { data, update }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepLifestyle, { data, update }),
      step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepIntent, { data, update }),
      step === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepVerify, { data, update })
    ] }, step) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "fixed bottom-0 inset-x-0 z-20 border-t border-border bg-background/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5 py-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: prev, disabled: step === 0, className: "inline-flex h-11 px-5 items-center gap-2 rounded-full border border-border bg-surface/60 text-sm hover:bg-surface transition disabled:opacity-40 disabled:cursor-not-allowed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " 上一步"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-center", children: error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: error }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: next, className: "inline-flex h-11 px-6 items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold glow-coral hover:scale-[1.02] active:scale-[0.98] transition", children: [
        step === STEPS.length - 1 ? "完成并进入" : "下一步",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  required,
  hint,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium", children: [
        label,
        required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-coral", children: "*" }),
        !required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] text-muted-foreground", children: "可选" })
      ] }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: hint })
    ] }),
    children
  ] });
}
function TextInput(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, className: "w-full h-11 rounded-xl bg-background border-2 border-border px-4 text-sm text-foreground outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition placeholder:text-muted-foreground/60 shadow-inner" });
}
function Chip({
  active,
  onClick,
  children,
  locked
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, disabled: locked && !active, className: ["inline-flex items-center gap-1 h-9 px-4 rounded-full border text-sm transition", active ? "bg-coral text-primary-foreground border-coral glow-coral" : "bg-surface/60 border-border text-foreground hover:border-coral/60", locked && !active ? "opacity-40 cursor-not-allowed" : "cursor-pointer"].join(" "), children: [
    active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
    " ",
    children
  ] });
}
function Card({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-2xl bg-surface/50 border border-border p-5 ${className}`, children });
}
function StepBasic({
  data,
  update
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "昵称", required: true, hint: `${data.nickname.length}/16`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { maxLength: 16, placeholder: "给自己起个有记忆点的名字", value: data.nickname, onChange: (e) => update({
      nickname: e.target.value
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "性别", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["女生", "男生", "其他"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.gender === g, onClick: () => update({
      gender: g
    }), children: g }, g)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "出生日期", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { type: "date", value: data.birthday, onChange: (e) => update({
        birthday: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "所在城市", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "如：上海", value: data.city, onChange: (e) => update({
        city: e.target.value
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "家乡", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "老家在哪里", value: data.hometown, onChange: (e) => update({
        hometown: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "身高", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "cm", inputMode: "numeric", value: data.height, onChange: (e) => update({
        height: e.target.value
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "学历", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["高中及以下", "大专", "本科", "硕士", "博士"].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.education === x, onClick: () => update({
      education: x
    }), children: x }, x)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "职业/行业", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "如：产品经理", value: data.job, onChange: (e) => update({
        job: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "学校/公司", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "可后续认证", value: data.school, onChange: (e) => update({
        school: e.target.value
      }) }) })
    ] })
  ] });
}
function StepPhotos({
  data,
  update
}) {
  const fileRef = reactExports.useRef(null);
  const onPick = (files) => {
    if (!files) return;
    const remain = 8 - data.photos.length;
    const arr = Array.from(files).slice(0, remain);
    Promise.all(arr.map((f) => new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    }))).then((urls) => update({
      photos: [...data.photos, ...urls]
    }));
  };
  const remove = (i) => {
    const next = data.photos.filter((_, idx) => idx !== i);
    update({
      photos: next,
      mainIdx: Math.min(data.mainIdx, Math.max(0, next.length - 1))
    });
  };
  const slots = reactExports.useMemo(() => Array.from({
    length: 8
  }, (_, i) => data.photos[i] || null), [data.photos]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "已上传 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: data.photos.length }),
        " / 8"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "第一张为主头像" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: slots.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] relative", children: src ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: ["size-full rounded-xl overflow-hidden border-2 cursor-pointer group relative", data.mainIdx === i ? "border-coral glow-coral" : "border-border"].join(" "), onClick: () => update({
      mainIdx: i
    }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "", className: "size-full object-cover" }),
      data.mainIdx === i && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-1.5 left-1.5 inline-flex items-center gap-1 h-6 px-2 rounded-full bg-coral text-primary-foreground text-[10px] font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3 fill-current" }),
        " 封面"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        remove(i);
      }, className: "absolute top-1.5 right-1.5 size-6 rounded-full bg-background/80 backdrop-blur grid place-items-center text-foreground hover:bg-destructive hover:text-destructive-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fileRef.current?.click(), className: "size-full rounded-xl border-2 border-dashed border-border bg-surface/40 hover:border-coral/60 hover:bg-surface transition grid place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-5" }) }) }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => onPick(e.target.files) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 pt-2", children: [{
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-4" }),
      label: "主头像",
      req: true
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-4" }),
      label: "生活照",
      req: false
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" }),
      label: "兴趣照",
      req: false
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-surface/40 border border-border px-3 py-2.5 text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-coral", children: t.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground", children: t.req ? "必填" : "建议" })
    ] }, t.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "15s 视频动态", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => update({
      videoIntro: data.videoIntro ? "" : "video.mp4"
    }), className: "w-full h-14 rounded-xl border border-dashed border-border bg-surface/40 hover:border-coral/60 transition flex items-center justify-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4" }),
      data.videoIntro ? "已添加视频动态 · 点击移除" : "录制或上传 15 秒视频（可选）"
    ] }) })
  ] });
}
function StepBio({
  data,
  update
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "个性签名", required: true, hint: `${data.signature.length}/150`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { maxLength: 150, rows: 3, placeholder: "一句话，让别人记住你 · 50~150 字", value: data.signature, onChange: (e) => update({
      signature: e.target.value
    }), className: "w-full rounded-xl bg-surface/70 border border-border px-4 py-3 text-sm outline-none focus:border-coral/60 transition placeholder:text-muted-foreground resize-none" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "自我介绍", hint: `${data.intro.length}/500`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { maxLength: 500, rows: 5, placeholder: "聊聊你的日常、爱好、最近在追的剧、想去的地方……", value: data.intro, onChange: (e) => update({
      intro: e.target.value
    }), className: "w-full rounded-xl bg-surface/70 border border-border px-4 py-3 text-sm outline-none focus:border-coral/60 transition placeholder:text-muted-foreground resize-none" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "当前状态", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["在家躺平", "加班中", "刚下班", "想找人吃饭", "旅行ing", "周末发呆", "出差中"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.status === s, onClick: () => update({
      status: data.status === s ? "" : s
    }), children: s }, s)) }) })
  ] });
}
function StepTags({
  data,
  update
}) {
  const toggle = (key, tag, max) => {
    const arr = data[key];
    if (arr.includes(tag)) update({
      [key]: arr.filter((t) => t !== tag)
    });
    else if (arr.length < max) update({
      [key]: [...arr, tag]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "兴趣爱好" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "最多选 15 个，用于匹配同频的人" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-semibold ${data.interests.length >= 15 ? "text-coral" : "text-muted-foreground"}`, children: [
          data.interests.length,
          "/15"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: INTEREST_TAGS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.interests.includes(t), locked: data.interests.length >= 15, onClick: () => toggle("interests", t, 15), children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "性格标签" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "最多选 8 个，描述真实的你" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-semibold ${data.personality.length >= 8 ? "text-coral" : "text-muted-foreground"}`, children: [
          data.personality.length,
          "/8"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PERSONALITY_TAGS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.personality.includes(t), locked: data.personality.length >= 8, onClick: () => toggle("personality", t, 8), children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "MBTI", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: MBTI.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
        mbti: data.mbti === m ? "" : m
      }), className: `h-8 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${data.mbti === m ? "bg-mint text-background" : "bg-surface border border-border text-muted-foreground hover:text-foreground"}`, children: m }, m)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "星座", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ZODIAC.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
        zodiac: data.zodiac === z ? "" : z
      }), className: `h-8 px-2.5 rounded-lg text-xs transition ${data.zodiac === z ? "bg-sun text-background font-semibold" : "bg-surface border border-border text-muted-foreground hover:text-foreground"}`, children: z }, z)) }) })
    ] })
  ] });
}
function StepLifestyle({
  data,
  update
}) {
  const rows = [{
    key: "smoke",
    label: "抽烟",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cigarette, { className: "size-4" }),
    options: ["不抽", "偶尔", "社交场合", "抽"]
  }, {
    key: "drink",
    label: "喝酒",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wine, { className: "size-4" }),
    options: ["不喝", "偶尔小酌", "聚会喝", "酒鬼一枚"]
  }, {
    key: "sleep",
    label: "作息",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "size-4" }),
    options: ["早睡早起", "规律", "夜猫子", "昼夜颠倒"]
  }, {
    key: "diet",
    label: "饮食",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "size-4" }),
    options: ["火锅党", "健身餐", "素食", "什么都吃", "brunch 爱好者"]
  }, {
    key: "pet",
    label: "宠物",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cat, { className: "size-4" }),
    options: ["猫派", "狗派", "都爱", "没养", "想养"]
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "space-y-5", children: rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5 text-sm font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-7 rounded-lg bg-surface grid place-items-center text-coral", children: row.icon }),
      row.label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: row.options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data[row.key] === o, onClick: () => update({
      [row.key]: data[row.key] === o ? "" : o
    }), children: o }, o)) })
  ] }, row.key)) });
}
function StepIntent({
  data,
  update
}) {
  const toggleIntent = (t) => {
    update({
      intent: data.intent.includes(t) ? data.intent.filter((x) => x !== t) : [...data.intent, t]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "交友目的", required: true, hint: "可多选", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: INTENT.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.intent.includes(t), onClick: () => toggleIntent(t), children: t }, t)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "感情状态", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["单身", "开放交友", "暧昧中", "稳定关系", "一言难尽"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: data.relationship === s, onClick: () => update({
        relationship: data.relationship === s ? "" : s
      }), children: s }, s)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "理想型", hint: `${data.idealType.length}/200`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { maxLength: 200, rows: 3, placeholder: "希望 TA 是什么样的人？", value: data.idealType, onChange: (e) => update({
        idealType: e.target.value
      }), className: "w-full rounded-xl bg-surface/70 border border-border px-4 py-3 text-sm outline-none focus:border-coral/60 transition placeholder:text-muted-foreground resize-none" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "年龄偏好", hint: `${data.ageRange[0]} – ${data.ageRange[1]} 岁`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: "最小" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 18, max: 60, value: data.ageRange[0], onChange: (e) => update({
            ageRange: [Number(e.target.value), Math.max(Number(e.target.value), data.ageRange[1])]
          }), className: "w-full accent-coral" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: "最大" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 18, max: 60, value: data.ageRange[1], onChange: (e) => update({
            ageRange: [Math.min(data.ageRange[0], Number(e.target.value)), Number(e.target.value)]
          }), className: "w-full accent-coral" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "距离偏好", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["3km 内", "同城", "本省", "全国"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Chip, { active: data.distance === d, onClick: () => update({
        distance: d
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3.5" }),
        " ",
        d
      ] }, d)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-sun" }),
        " 破冰问题（可选）"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "设置一个问题让对方回答，降低搭讪门槛" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "例如：周末最想去哪里发呆？", value: data.icebreaker, onChange: (e) => update({
        icebreaker: e.target.value
      }) })
    ] })
  ] });
}
function StepVerify({
  data,
  update
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4 text-coral" }),
        " 手机认证",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-coral", children: "必填" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "手机号", inputMode: "numeric", maxLength: 11, value: data.phone, onChange: (e) => update({
          phone: e.target.value.replace(/\D/g, "")
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "shrink-0 h-11 px-4 rounded-xl border border-border bg-surface text-sm hover:bg-surface-2 transition", children: "获取验证码" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { placeholder: "6 位短信验证码", inputMode: "numeric", maxLength: 6 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
      verifyReal: !data.verifyReal
    }), className: `w-full text-left rounded-2xl border p-5 transition ${data.verifyReal ? "border-mint bg-mint/10" : "border-border bg-surface/50 hover:bg-surface"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-xl grid place-items-center ${data.verifyReal ? "bg-mint text-background" : "bg-surface-2 text-mint"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "真人认证" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "建议" }),
          data.verifyReal && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-mint ml-auto" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "面部识别确认是真人，匹配率提升 3 倍，防机器人骚扰" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
      verifyStudent: !data.verifyStudent
    }), className: `w-full text-left rounded-2xl border p-5 transition ${data.verifyStudent ? "border-sun bg-sun/10" : "border-border bg-surface/50 hover:bg-surface"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-xl grid place-items-center ${data.verifyStudent ? "bg-sun text-background" : "bg-surface-2 text-sun"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "学生认证" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "可选" }),
          data.verifyStudent && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-sun ml-auto" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "解锁校园社交圈，遇见同校或同城高校的人" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-surface/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-5 text-mint mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground leading-relaxed", children: [
        "Pulse 启用 24h 风控体系，任何用户均可一键 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "举报 / 拉黑" }),
        "。 我们承诺：照片仅用于审核，绝不公开你的真实姓名与手机号。"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Preview, { data }) })
  ] });
}
function Preview({
  data
}) {
  const cover = data.photos[data.mainIdx] || data.photos[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl overflow-hidden bg-surface-2 grid place-items-center shrink-0", children: cover ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cover, alt: "", className: "size-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "size-6 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold truncate", children: data.nickname || "未命名" }),
        data.gender && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "· ",
          data.gender
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: [
        data.city || "未填城市",
        " · ",
        data.interests.length,
        " 兴趣 · ",
        data.personality.length,
        " 性格"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 truncate mt-1", children: data.signature || "（个性签名待填写）" })
    ] })
  ] });
}
export {
  Onboarding as component
};
