import { k as createServerFn, X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { L as Link, A as ArrowLeft, F as toast } from "./router-qNgQXy3C.js";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import { H as Hand } from "./hand-i4ZbhQ_u.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import { R as RefreshCw } from "./refresh-cw-D5mMr7F5.js";
import { U as Upload } from "./upload-J2G80RnS.js";
import { C as Check } from "./check-DKEi7gus.js";
import { S as Share2 } from "./share-2-DwEs5xm_.js";
import { H as Heart } from "./heart-ai2ZrGuK.js";
import { Z as Zap } from "./zap-CP9rJA2P.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-C8UrIk37.js";
import "./index-m6JgwYlt.js";
import "./types-DNG0tEns.js";
const getPalmQuota = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("db6e63473ec7d56fd70595da724fac8c2d61ab6e68f1fdafddd5c626ba5df1f0"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("37f4f5a1bd02bc61d24c92d1fd7f56b5d9c5c1b5314112f5f7903e5274093dc3"));
const verifyPalm = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => {
  if (!d?.imageDataUrl || !d.imageDataUrl.startsWith("data:image/")) {
    throw new Error("图片格式不正确");
  }
  if (d.imageDataUrl.length > 8e6) throw new Error("图片过大，请压缩后重试");
  return d;
}).handler(createSsrRpc("c8ce0b09cb4524dfa4ce81027bf8f07b94e5da700da796267ef2c9873e1d76b1"));
const revealPalm = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => {
  if (!d?.readingId) throw new Error("缺少 readingId");
  return d;
}).handler(createSsrRpc("23f31f51eaf28ef161a866620520148ef59ebf3ecdfebafa36dfe52625011e7e"));
function PalmPage() {
  const verifyFn = useServerFn(verifyPalm);
  const revealFn = useServerFn(revealPalm);
  const quotaFn = useServerFn(getPalmQuota);
  const [preview, setPreview] = reactExports.useState(null);
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [stage, setStage] = reactExports.useState("idle");
  const [readingId, setReadingId] = reactExports.useState(null);
  const [shareConfirmed, setShareConfirmed] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const quota = useQuery({
    queryKey: ["palm-quota"],
    queryFn: () => quotaFn({})
  });
  const remaining = quota.data?.remaining ?? 0;
  const limit = quota.data?.limit ?? 2;
  reactExports.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);
  const onFile = async (file) => {
    setError(null);
    setReport(null);
    const dataUrl = await compressImage(file, 1024, 0.85);
    setPreview(dataUrl);
  };
  const analyze = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    try {
      const r = await verifyFn({
        data: {
          imageDataUrl: preview
        }
      });
      setReadingId(r.readingId);
      setStage("share");
      void quota.refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "识别失败，请重试");
    } finally {
      setLoading(false);
    }
  };
  const reveal = async () => {
    if (!readingId) return;
    setLoading(true);
    setError(null);
    try {
      const r = await revealFn({
        data: {
          readingId
        }
      });
      setReport(r.preset);
      setStage("report");
    } catch (e) {
      setError(e instanceof Error ? e.message : "查看失败，请重试");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setPreview(null);
    setReport(null);
    setError(null);
    setStage("idle");
    setReadingId(null);
    setShareConfirmed(false);
    if (inputRef.current) inputRef.current.value = "";
  };
  const outOfQuota = !quota.isLoading && remaining <= 0 && stage === "idle";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 -left-20 size-[420px] rounded-full bg-coral/30 blur-[120px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-32 right-0 size-[380px] rounded-full bg-sun/20 blur-[120px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "relative sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/games", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        "返回游戏库"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-xl bg-coral/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hand, { className: "size-3.5 text-coral" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm", children: "AI 看手相" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-4xl px-6 pt-8 md:pt-10 pb-20", children: [
      stage === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-[32px] border border-border bg-surface/70 backdrop-blur p-5 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5 text-coral" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Powered by Pulse AI · 仅供娱乐 · 每人 ",
              limit,
              " 次"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 font-display text-3xl md:text-5xl font-bold tracking-tight leading-[0.98]", children: [
            "上传手掌，马上开始",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display italic text-gradient-hero", children: " AI 看手相" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
            "剩余测试机会：",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
              remaining,
              "/",
              limit
            ] }),
            " · 分享到朋友圈解锁结果"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UploadZone, { preview, onSelect: () => inputRef.current?.click(), onClear: reset }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, type: "file", accept: "image/*", capture: "environment", hidden: true, onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-3", children: "拍照小贴士" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { children: "张开手掌，五指自然分开" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { children: "光线均匀，避免强烈阴影" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { children: "整只手掌清晰入镜即可" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { children: "左右手皆可，传统看左手" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: analyze, disabled: !preview || loading || outOfQuota, className: "mt-8 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground font-semibold glow-coral hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "正在识别手掌…"
            ] }) : outOfQuota ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "已用完 ",
              limit,
              " 次机会"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
              "开始识别手相"
            ] }) }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-coral text-center", children: error })
          ] })
        ] })
      ] }),
      stage === "share" && preview && /* @__PURE__ */ jsxRuntimeExports.jsx(ShareGate, { preview, confirmed: shareConfirmed, onConfirm: () => setShareConfirmed(true), onReveal: reveal, loading, error }),
      stage === "report" && report && preview && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportView, { report, preview, onReset: reset })
    ] })
  ] });
}
function Tip({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 size-1.5 rounded-full bg-mint shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children })
  ] });
}
function UploadZone({
  preview,
  onSelect,
  onClear
}) {
  if (preview) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square rounded-3xl overflow-hidden border border-border group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "手掌预览", className: "w-full h-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSelect, className: "flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-semibold hover:bg-background transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5" }),
          "换一张"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClear, className: "inline-flex items-center justify-center h-9 px-3 rounded-full bg-background/80 backdrop-blur border border-border text-xs hover:bg-background transition", children: "移除" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 ring-1 ring-inset ring-coral/30 rounded-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PalmLines, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSelect, className: "relative aspect-square w-full rounded-3xl border-2 border-dashed border-border bg-surface-2/40 hover:bg-surface-2/70 hover:border-coral/50 transition flex flex-col items-center justify-center gap-3 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl bg-coral/15 flex items-center justify-center group-hover:scale-110 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hand, { className: "size-7 text-coral" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "上传 / 拍摄手掌" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3" }),
        "点击选择照片"
      ] })
    ] })
  ] });
}
function PalmLines() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "pointer-events-none absolute inset-0 w-full h-full opacity-50 mix-blend-screen", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "pl1", x1: "0", x2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.72 0.18 22)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.87 0.16 88)" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 35 Q 40 30 70 50", stroke: "url(#pl1)", strokeWidth: "0.4", fill: "none", className: "animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 55 Q 30 75 55 90", stroke: "oklch(0.78 0.15 165)", strokeWidth: "0.4", fill: "none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M25 25 Q 45 50 50 90", stroke: "oklch(0.87 0.16 88)", strokeWidth: "0.3", fill: "none" })
  ] });
}
function ReportView({
  report,
  preview,
  onReset
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-[32px] border border-border bg-surface/70 backdrop-blur overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[200px_1fr] gap-6 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square rounded-2xl overflow-hidden border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "手掌", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PalmLines, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-coral font-semibold", children: "Pulse 手相报告" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-2 font-display text-2xl md:text-3xl font-bold leading-snug", children: [
          '"',
          report.overall,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground leading-relaxed", children: report.fortune })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LineCard, { color: "coral", icon: Heart, label: "感情线", data: report.love }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LineCard, { color: "sun", icon: Zap, label: "事业线", data: report.career }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LineCard, { color: "mint", icon: Sparkles, label: "生命线", data: report.life })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/60 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-mint font-semibold mb-2", children: "缘分提示" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: report.matchHint })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-surface/30 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2", children: "温馨提示" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: report.warning })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onReset, className: "flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full border border-border bg-surface hover:bg-surface-2 transition text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4" }),
        "再测一次"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/discover", className: "flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground font-semibold glow-coral hover:scale-[1.01] transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" }),
        "去匹配同频的人"
      ] })
    ] })
  ] });
}
function ShareGate({
  preview,
  confirmed,
  onConfirm,
  onReveal,
  loading,
  error
}) {
  const cardRef = reactExports.useRef(null);
  const downloadCard = async () => {
    const canvas = document.createElement("canvas");
    const W = 750;
    const H = 1e3;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0e0e12");
    grad.addColorStop(1, "#1a1216");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = preview;
    }).catch(() => null);
    if (img) {
      const size = 500;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect((W - size) / 2, 200, size, size, 36);
      ctx.clip();
      ctx.drawImage(img, (W - size) / 2, 200, size, size);
      ctx.restore();
    }
    ctx.fillStyle = "#ff6b6b";
    ctx.font = "bold 28px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PULSE · AI 手相", W / 2, 100);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 56px -apple-system, system-ui, sans-serif";
    ctx.fillText("我的专属手相报告", W / 2, 170);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "400 26px -apple-system, system-ui, sans-serif";
    ctx.fillText("扫描朋友圈，揭晓我的爱情线", W / 2, 770);
    ctx.fillText("· 上 Pulse · AI 看手相 ·", W / 2, 820);
    ctx.fillStyle = "#ffd166";
    ctx.font = "italic 22px Georgia, serif";
    ctx.fillText("分享后解锁你的完整运势", W / 2, 900);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "palm-share.png";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("已保存到本地，去朋友圈分享吧～");
    }, "image/png");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-[32px] border border-border bg-surface/70 backdrop-blur p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-mint/15 text-mint px-3 py-1.5 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
        "手掌识别成功"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-2xl md:text-3xl font-bold", children: "分享到朋友圈，解锁你的手相报告" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "保存下方卡片 → 发到朋友圈 → 回来点击「已分享，查看结果」" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: cardRef, className: "mx-auto max-w-sm rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-coral/20 via-background to-sun/15 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-coral text-xs font-bold tracking-widest", children: "PULSE · AI 手相" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-xl font-bold", children: "我的专属手相报告已生成" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 relative aspect-square rounded-2xl overflow-hidden border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "手掌", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PalmLines, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-xs text-muted-foreground", children: "扫描朋友圈，揭晓你的爱情线 · 事业线 · 生命线" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-serif-display italic text-sm text-foreground", children: '"分享后解锁你的完整运势 ✨"' })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid sm:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: downloadCard, className: "inline-flex items-center justify-center gap-2 h-12 rounded-full border border-border bg-surface hover:bg-surface-2 transition text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-4" }),
        "保存卡片图片"
      ] }),
      !confirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onConfirm, className: "inline-flex items-center justify-center gap-2 h-12 rounded-full bg-mint text-background hover:scale-[1.01] transition text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
        "我已分享朋友圈"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onReveal, disabled: loading, className: "inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground glow-coral hover:scale-[1.01] transition text-sm font-semibold disabled:opacity-50", children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
        "查看我的手相结果"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-coral text-center", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground text-center", children: "诚信小提示：分享是给小伙伴一起玩的福利，不分享也能查看，但会少点仪式感～" })
  ] }) });
}
function LineCard({
  color,
  icon: Icon,
  label,
  data
}) {
  const score = Math.max(0, Math.min(100, Math.round(data.score ?? 0)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl border border-border bg-surface/60 p-6 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-16 -right-16 size-40 rounded-full blur-3xl opacity-30", style: {
      background: `var(--${color})`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold", style: {
        background: `color-mix(in oklab, var(--${color}) 18%, transparent)`,
        color: `var(--${color})`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" }),
        label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-bold", style: {
        color: `var(--${color})`
      }, children: score })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 rounded-full bg-border overflow-hidden mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-700", style: {
      width: `${score}%`,
      background: `var(--${color})`
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative font-semibold text-sm mb-1.5", children: data.line }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative text-xs text-muted-foreground leading-relaxed", children: data.comment })
  ] });
}
async function compressImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export {
  PalmPage as component
};
