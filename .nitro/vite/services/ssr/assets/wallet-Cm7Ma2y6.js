import { X as reactExports, N as jsxRuntimeExports } from "./server-ChSCHK5Z.js";
import { i as createLucideIcon, H as useNavigate, I as useQueryClient, A as ArrowLeft, G as track, E as Events, F as toast } from "./router-qNgQXy3C.js";
import { u as useServerFn } from "./createSsrRpc-DIcQTQ8d.js";
import { u as useQuery } from "./useQuery-_QEYf79R.js";
import { t as topUpCoins, b as buyProPlan, a as getMyWallet, g as getMyLedger } from "./wallet.functions-C09-LSTq.js";
import { i as isPro, T as TOPUP_PACKS, P as PRO_PLANS, G as GIFT_CATALOG, f as findGift } from "./wallet-CHCcGQf8.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { C as Coins } from "./coins-Ctq2HWCO.js";
import { C as Crown } from "./crown-CA7Qlek8.js";
import { P as Plus } from "./plus-Bydlo4jQ.js";
import { G as Gift } from "./gift-DA16lxDn.js";
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
import "./auth-middleware-Y8f4GSpx.js";
import "./index-m6JgwYlt.js";
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode);
const KIND_LABEL = {
  topup: "充值",
  spend: "消费",
  gift_sent: "送出礼物",
  gift_received: "收到礼物",
  pro_sub: "订阅 Pulse Pro",
  refund: "退款",
  admin: "管理员调整"
};
function fmtDate(iso) {
  const d = new Date(iso);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${m}-${day} ${hh}:${mm}`;
}
function WalletPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = reactExports.useState("topup");
  const [busy, setBusy] = reactExports.useState(null);
  const [authed, setAuthed] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => setAuthed(!!data.session));
  }, []);
  const fetchWallet = useServerFn(getMyWallet);
  const fetchLedger = useServerFn(getMyLedger);
  const topup = useServerFn(topUpCoins);
  const buyPro = useServerFn(buyProPlan);
  const w = useQuery({
    queryKey: ["wallet"],
    queryFn: () => fetchWallet(),
    enabled: authed === true
  });
  const ledger = useQuery({
    queryKey: ["wallet-ledger"],
    queryFn: () => fetchLedger(),
    enabled: authed === true
  });
  reactExports.useEffect(() => {
    if (authed !== true) return;
    const ch = supabase.channel("wallet-rt").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "wallets"
    }, () => {
      qc.invalidateQueries({
        queryKey: ["wallet"]
      });
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [authed, qc]);
  const handleTopUp = async (amount) => {
    setBusy(`topup-${amount}`);
    track(Events.TopupStarted, {
      amount
    });
    try {
      await topup({
        data: {
          amount
        }
      });
      track(Events.TopupSucceeded, {
        amount
      });
      toast.success(`充值成功 +${amount} 心动币`);
      qc.invalidateQueries({
        queryKey: ["wallet"]
      });
      qc.invalidateQueries({
        queryKey: ["wallet-ledger"]
      });
    } catch (e) {
      track(Events.TopupFailed, {
        amount,
        message: e?.message
      });
      toast.error(e.message ?? "充值失败");
    } finally {
      setBusy(null);
    }
  };
  const handleBuyPro = async (plan) => {
    setBusy(`pro-${plan}`);
    try {
      const r = await buyPro({
        data: {
          plan
        }
      });
      track(Events.PaidFeatureUnlocked, {
        feature: "pulse_pro",
        plan
      });
      toast.success(`Pulse Pro 已开通至 ${new Date(r.proUntil).toLocaleDateString()}`);
      qc.invalidateQueries({
        queryKey: ["wallet"]
      });
      qc.invalidateQueries({
        queryKey: ["wallet-ledger"]
      });
      qc.invalidateQueries({
        queryKey: ["my-profile"]
      });
    } catch (e) {
      toast.error(e.message?.includes("coins") ? "心动币不足，请先充值" : e.message ?? "开通失败");
    } finally {
      setBusy(null);
    }
  };
  if (authed === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-dvh bg-background grid place-items-center p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "mx-auto size-10 text-coral opacity-70" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "登录后查看你的钱包" })
    ] }) });
  }
  const coins = w.data?.coins ?? 0;
  const proUntil = w.data?.proUntil ?? null;
  const proActive = isPro(proUntil);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-background pb-20 text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 backdrop-blur-xl bg-background/85 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 h-14 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
        to: "/me"
      }), className: "size-9 rounded-full hover:bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-semibold", children: "钱包" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl p-5 bg-gradient-to-br from-coral via-sun/80 to-brand text-background shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs/none opacity-80", children: "我的心动币" }),
          proActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-background/20 px-2 py-0.5 text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "size-3" }),
            " Pulse Pro"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-7 mb-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold", children: coins.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] opacity-80", children: proActive ? `Pro 有效期至 ${new Date(proUntil).toLocaleDateString()}` : "开通 Pulse Pro 解锁更多权益" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "grid grid-cols-4 gap-1 rounded-2xl border border-border bg-surface/40 p-1 text-xs", children: [{
        k: "topup",
        l: "充值",
        i: Plus
      }, {
        k: "pro",
        l: "Pro",
        i: Crown
      }, {
        k: "gifts",
        l: "礼物",
        i: Gift
      }, {
        k: "history",
        l: "明细",
        i: History
      }].map(({
        k,
        l,
        i: Ic
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(k), className: `flex items-center justify-center gap-1 py-2 rounded-xl transition ${tab === k ? "bg-background text-foreground shadow" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ic, { className: "size-3.5" }),
        " ",
        l
      ] }, k)) }),
      tab === "topup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-2 gap-2.5", children: [
        TOPUP_PACKS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy === `topup-${p.coins}`, onClick: () => handleTopUp(p.coins), className: "rounded-2xl border border-border bg-card p-4 text-left hover:border-coral/60 active:scale-[0.99] transition disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: p.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1 text-2xl font-display font-bold text-coral", children: [
            busy === `topup-${p.coins}` && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
            "+",
            p.coins
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] text-muted-foreground", children: "心动币 · 测试充值" })
        ] }, p.coins)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 mt-1 rounded-xl border border-dashed border-border/60 p-3 text-[11px] text-muted-foreground", children: "当前为测试充值；接入真实支付（Stripe / 微信 / 支付宝）后此入口将替换为正式购买。" })
      ] }),
      tab === "pro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-coral/40 bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "size-4 text-sun" }),
            " Pulse Pro 会员权益"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 text-xs text-muted-foreground space-y-1.5 leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 每日额外 30 张滑卡 / 无限喜欢" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 谁喜欢了你 · 列表可见" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 高级筛选（学历 / 身高 / 兴趣）" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 已读回执、消息撤回、专属徽章" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 每月赠送 88 心动币" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: PRO_PLANS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy === `pro-${p.plan}`, onClick: () => handleBuyPro(p.plan), className: "flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-coral/60 transition disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: p.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
              p.days,
              " 天"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-coral font-display font-bold", children: [
            busy === `pro-${p.plan}` && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-4" }),
            " ",
            p.coins
          ] })
        ] }, p.plan)) })
      ] }),
      tab === "gifts" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-3 gap-2", children: [
        GIFT_CATALOG.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: g.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs font-medium", children: g.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-[11px] text-coral flex items-center justify-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-3" }),
            " ",
            g.coins
          ] })
        ] }, g.code)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "col-span-3 mt-2 text-[11px] text-muted-foreground text-center", children: [
          "在聊天页面点击 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "inline size-3" }),
          " 送礼图标，向对方赠送"
        ] })
      ] }),
      tab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-1.5", children: [
        ledger.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-8", children: "加载中…" }),
        !ledger.isLoading && (ledger.data?.entries ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-muted-foreground py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-8 mx-auto mb-2 opacity-30" }),
          "还没有流水"
        ] }),
        (ledger.data?.entries ?? []).map((e) => {
          const gift = e.ref?.gift_code ? findGift(e.ref.gift_code) : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-card/60 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium flex items-center gap-1.5", children: [
                gift && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: gift.emoji }),
                KIND_LABEL[e.kind] ?? e.kind
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                fmtDate(e.created_at),
                " · 余额 ",
                e.balance_after
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display font-semibold text-sm ${e.delta > 0 ? "text-mint" : "text-coral"}`, children: e.delta > 0 ? `+${e.delta}` : e.delta })
          ] }, e.id);
        })
      ] })
    ] })
  ] });
}
export {
  WalletPage as component
};
