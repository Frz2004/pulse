import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { H as useNavigate, L as Link, A as ArrowLeft, F as toast, G as track, E as Events } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { p as publishShortVideo } from "./videos.functions-C_p_A1F_.js";
import { C as CloudUpload } from "./cloud-upload-DyKoVVma.js";
import { X } from "./x-C9W7T09B.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import { S as Sparkles } from "./sparkles-SUzdm6Pw.js";
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
const MAX_BYTES = 60 * 1024 * 1024;
const MAX_DURATION = 90;
function VideoUploadPage() {
  const navigate = useNavigate();
  const fileRef = reactExports.useRef(null);
  const [file, setFile] = reactExports.useState(null);
  const [preview, setPreview] = reactExports.useState(null);
  const [duration, setDuration] = reactExports.useState(null);
  const [size, setSize] = reactExports.useState(null);
  const [caption, setCaption] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [userId, setUserId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => setUserId(data.session?.user.id ?? null));
  }, []);
  reactExports.useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  const submit = useServerFn(publishShortVideo);
  const onPick = (f) => {
    if (!f.type.startsWith("video/")) {
      toast.error("请选择视频文件");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("视频不能大于 60MB");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
    setDuration(null);
    setSize(null);
  };
  const onMeta = (e) => {
    const v = e.currentTarget;
    setDuration(Math.round(v.duration));
    setSize({
      w: v.videoWidth,
      h: v.videoHeight
    });
  };
  const onPublish = async () => {
    if (!file || !userId) return;
    if (duration && duration > MAX_DURATION) {
      toast.error(`视频不能超过 ${MAX_DURATION} 秒`);
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("short-videos").upload(path, file, {
        contentType: file.type,
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data: pub
      } = supabase.storage.from("short-videos").getPublicUrl(path);
      await submit({
        data: {
          videoUrl: pub.publicUrl,
          caption,
          durationSec: duration ?? void 0,
          width: size?.w,
          height: size?.h
        }
      });
      track(Events.VideoUploaded, {
        duration: duration ?? null,
        size_bytes: file.size
      });
      toast.success("发布成功");
      navigate({
        to: "/videos"
      });
    } catch (e) {
      toast.error(e?.message ?? "发布失败");
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/videos", className: "inline-flex items-center gap-1 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " 短视频"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "发布" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto w-full max-w-md px-5 pb-24 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "分享一段 30 秒生活" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "最长 90 秒,文件不超过 60MB。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        !preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fileRef.current?.click(), className: "flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-surface/40 text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "h-10 w-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "点击选择视频" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "MP4 / MOV · 竖屏效果更好" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-black", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: preview, className: "absolute inset-0 h-full w-full object-cover", controls: true, playsInline: true, onLoadedMetadata: onMeta }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setFile(null);
            if (preview) URL.revokeObjectURL(preview);
            setPreview(null);
          }, className: "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
          duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white", children: [
            duration,
            "s · ",
            size ? `${size.w}×${size.h}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "video/*", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "说点什么" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: caption, onChange: (e) => setCaption(e.target.value.slice(0, 300)), placeholder: "给这条视频写一句话…", rows: 3, className: "mt-2 w-full rounded-2xl border border-border bg-surface/40 p-3 text-sm outline-none focus:border-coral" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-right text-[11px] text-muted-foreground", children: [
          caption.length,
          "/300"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onPublish, disabled: !file || uploading, className: "mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun font-semibold text-background disabled:opacity-50", children: [
        uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
        uploading ? "上传中…" : "发布"
      ] })
    ] })
  ] });
}
export {
  VideoUploadPage as component
};
