import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { H as useNavigate, A as ArrowLeft, L as Link, I as useQueryClient, F as toast } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { g as getMyVerifications, s as submitVerification, C as CircleCheck, a as CircleX } from "./verify.functions-dLAJ6Ts8.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { G as GraduationCap, S as Shield } from "./shield-RgmoyAeK.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import { U as Upload } from "./upload-J2G80RnS.js";
import { C as Clock } from "./clock-BGJF3hqR.js";
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
const KIND_META = {
  real: {
    title: "实人认证",
    icon: Shield,
    color: "from-mint to-brand",
    desc: "上传一张你手持身份证件、脸部清晰可见的自拍。审核通过后会获得「真人」徽章。",
    accept: "image/*",
    extraLabel: "备注（可选，例如你今天穿了什么）"
  },
  student: {
    title: "学生认证",
    icon: GraduationCap,
    color: "from-coral to-sun",
    desc: "上传一张能证明你在校生身份的图片（学生证 / 校园卡 / 学校邮箱截图）。",
    accept: "image/*",
    extraLabel: "学校名称（可选）"
  }
};
function VerifyPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({
      data: data2
    }) => {
      if (alive) setAuthed(!!data2.session);
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const fetchMine = useServerFn(getMyVerifications);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["my-verifications"],
    queryFn: () => fetchMine(),
    enabled: authed === true
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-md items-center gap-3 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/me"
      }), className: "grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-semibold tracking-tight", children: "实名 & 学生认证" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto w-full max-w-md px-5 pb-20 pt-5", children: [
      authed === false && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/60 p-6 text-center text-sm text-muted-foreground", children: [
        "请先",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
          mode: "login"
        }, className: "mx-1 text-coral underline", children: "登录" }),
        "再进行认证"
      ] }),
      authed === true && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-coral/30 bg-gradient-to-r from-coral/15 via-sun/10 to-mint/15 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-coral" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: "为什么要认证？" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs leading-relaxed text-muted-foreground", children: "认证用户拥有徽章、在匹配中优先曝光、获得更多信任。资料仅用于人工审核，不会公开展示。" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: ["real", "student"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(VerifyCard, { kind: k, record: data?.[k] ?? null, loading: isLoading, onChanged: refetch }, k)) })
      ] })
    ] })
  ] });
}
function VerifyCard({
  kind,
  record,
  loading,
  onChanged
}) {
  const qc = useQueryClient();
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  const submitFn = useServerFn(submitVerification);
  const fileRef = reactExports.useRef(null);
  const [extra, setExtra] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const status = record?.status;
  const StatusBadge = () => {
    if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "加载中…" });
    if (status === "approved") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-mint/20 px-2 py-0.5 text-[11px] text-mint", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      " 已通过"
    ] });
    if (status === "pending") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-sun/20 px-2 py-0.5 text-[11px] text-sun", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
      " 审核中"
    ] });
    if (status === "rejected") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-[11px] text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
      " 未通过"
    ] });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: "未提交" });
  };
  const handlePick = () => fileRef.current?.click();
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("请选择图片文件");
    if (file.size > 8 * 1024 * 1024) return toast.error("图片最大 8MB");
    setUploading(true);
    try {
      const {
        data: sess
      } = await supabase.auth.getUser();
      const uid = sess.user?.id;
      if (!uid) throw new Error("请先登录");
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${uid}/verify/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type,
        upsert: false
      });
      if (upErr) throw upErr;
      await submitFn({
        data: {
          kind,
          storagePath: path,
          extra: extra || void 0
        }
      });
      toast.success("已提交，请等待人工审核（一般 24 小时内）");
      setExtra("");
      qc.invalidateQueries({
        queryKey: ["my-verifications"]
      });
      onChanged();
    } catch (err) {
      toast.error(err?.message || "提交失败");
    } finally {
      setUploading(false);
    }
  };
  const canSubmit = status !== "approved" && status !== "pending";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/60 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${meta.color} text-background shadow`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: meta.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: meta.desc })
      ] })
    ] }),
    status === "rejected" && record?.review_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive", children: [
      "审核备注：",
      record.review_note
    ] }),
    canSubmit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: extra, onChange: (e) => setExtra(e.target.value), placeholder: meta.extraLabel, maxLength: 200, className: "w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: meta.accept, className: "hidden", onChange: handleFile }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handlePick, disabled: uploading, className: "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coral to-sun py-2.5 text-sm font-semibold text-background shadow disabled:opacity-50", children: [
        uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
        status === "rejected" ? "重新提交" : "上传凭证"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "支持 JPG / PNG，最大 8MB，凭证仅用于审核。" })
    ] }),
    status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
      "已提交于 ",
      new Date(record.created_at).toLocaleString(),
      "，审核中…"
    ] }),
    status === "approved" && record?.reviewed_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-mint", children: [
      "已通过 · ",
      new Date(record.reviewed_at).toLocaleDateString()
    ] })
  ] });
}
export {
  VerifyPage as component
};
