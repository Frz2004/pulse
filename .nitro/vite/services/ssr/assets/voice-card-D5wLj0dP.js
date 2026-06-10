import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, H as useNavigate, I as useQueryClient, L as Link, A as ArrowLeft, F as toast } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { g as getMyProfile } from "./profile.functions-Hlr7jGu-.js";
import { s as saveVoiceCard, c as deleteVoiceCard } from "./videos.functions-C_p_A1F_.js";
import { T as Trash2 } from "./trash-2-CcSJJm4y.js";
import { M as Mic } from "./mic-Yc4eiEE-.js";
import { P as Play } from "./play-vbVkUnKJ.js";
import { L as LoaderCircle } from "./loader-circle-D56XrETM.js";
import { C as CloudUpload } from "./cloud-upload-DyKoVVma.js";
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
const __iconNode$1 = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
];
const Pause = createLucideIcon("pause", __iconNode$1);
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode);
const MAX_SEC = 60;
function VoiceCardPage() {
  useNavigate();
  const qc = useQueryClient();
  const [authed, setAuthed] = reactExports.useState(null);
  const [userId, setUserId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data: data2
    }) => {
      setAuthed(!!data2.session);
      setUserId(data2.session?.user.id ?? null);
    });
  }, []);
  const fetchMe = useServerFn(getMyProfile);
  const {
    data
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchMe(),
    enabled: authed === true
  });
  const save = useServerFn(saveVoiceCard);
  const remove = useServerFn(deleteVoiceCard);
  const existing = data?.profile?.voice_card_url;
  const existingDur = data?.profile?.voice_card_duration;
  const mediaRef = reactExports.useRef(null);
  const chunksRef = reactExports.useRef([]);
  const startTsRef = reactExports.useRef(0);
  const timerRef = reactExports.useRef(null);
  const [recording, setRecording] = reactExports.useState(false);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [blob, setBlob] = reactExports.useState(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [duration, setDuration] = reactExports.useState(0);
  const [playing, setPlaying] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const audioRef = reactExports.useRef(null);
  reactExports.useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [previewUrl]);
  const startRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm"
        });
        setBlob(b);
        const url = URL.createObjectURL(b);
        setPreviewUrl(url);
        const dur = Math.max(1, Math.round((Date.now() - startTsRef.current) / 1e3));
        setDuration(dur);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current = mr;
      startTsRef.current = Date.now();
      setElapsed(0);
      setBlob(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      mr.start();
      setRecording(true);
      timerRef.current = window.setInterval(() => {
        const sec = Math.floor((Date.now() - startTsRef.current) / 1e3);
        setElapsed(sec);
        if (sec >= MAX_SEC) stopRecord();
      }, 250);
    } catch (e) {
      toast.error("无法获取麦克风权限");
    }
  };
  const stopRecord = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    mediaRef.current?.stop();
  };
  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };
  const upload = async () => {
    if (!blob || !userId) return;
    setUploading(true);
    try {
      const ext = (blob.type.split("/")[1] || "webm").split(";")[0];
      const path = `${userId}/${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("voice-cards").upload(path, blob, {
        contentType: blob.type,
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data: pub
      } = supabase.storage.from("voice-cards").getPublicUrl(path);
      await save({
        data: {
          url: pub.publicUrl,
          durationSec: duration
        }
      });
      toast.success("语音名片已保存");
      qc.invalidateQueries({
        queryKey: ["my-profile"]
      });
      setBlob(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (e) {
      toast.error(e?.message ?? "保存失败");
    } finally {
      setUploading(false);
    }
  };
  const removeExisting = async () => {
    if (!confirm("确认删除当前语音名片?")) return;
    try {
      await remove();
      toast.success("已删除");
      qc.invalidateQueries({
        queryKey: ["my-profile"]
      });
    } catch (e) {
      toast.error(e?.message ?? "删除失败");
    }
  };
  if (authed === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 max-w-sm rounded-3xl border border-border bg-surface/70 p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: "先登录,再录语音" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
        mode: "login"
      }, className: "mt-4 inline-block rounded-full bg-coral px-6 py-2.5 text-sm font-semibold text-background", children: "去登录" })
    ] }) });
  }
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-grid text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 h-[400px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--coral)_22%,transparent),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/me", className: "inline-flex items-center gap-1 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " 我的"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "语音名片" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto w-full max-w-md px-5 pb-24 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "用声音介绍自己" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "最长 60 秒,会显示在你的资料卡上。" }),
      existing && !blob && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-3xl border border-border bg-surface/70 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "当前的语音名片" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: existing, controls: true, className: "mt-3 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "时长 ",
            existingDur ?? "?",
            "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: removeExisting, className: "inline-flex items-center gap-1 text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
            " 删除"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-3xl border border-border bg-surface/70 p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-44 w-44", children: [
          recording && [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 animate-ping rounded-full border-2 border-coral/40", style: {
            animationDelay: `${i * 0.4}s`
          } }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-6 grid place-items-center rounded-full ${recording ? "bg-gradient-to-br from-coral to-sun" : "bg-gradient-to-br from-mint/40 to-coral/40"} text-background`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-14 w-14" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-display text-4xl tabular-nums", children: recording ? `${mm}:${ss}` : blob ? `${Math.floor(duration / 60).toString().padStart(2, "0")}:${(duration % 60).toString().padStart(2, "0")}` : `00:00` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "最长 ",
          MAX_SEC,
          " 秒"
        ] }),
        !recording && !blob && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: startRecord, className: "mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun px-7 font-semibold text-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" }),
          " 开始录制"
        ] }),
        recording && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: stopRecord, className: "mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-destructive px-7 font-semibold text-destructive-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4" }),
          " 停止"
        ] }),
        blob && previewUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef, src: previewUrl, onEnded: () => setPlaying(false), className: "hidden" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: togglePlay, className: "inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background/40 px-5 text-sm", children: [
              playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
              playing ? "暂停" : "试听"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setBlob(null);
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }, className: "inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background/40 px-5 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
              " 重录"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: upload, disabled: uploading, className: "mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mint to-coral font-semibold text-background disabled:opacity-50", children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "h-4 w-4" }),
            uploading ? "保存中…" : "保存为语音名片"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  VoiceCardPage as component
};
