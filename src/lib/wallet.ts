// Shared wallet/gift catalog & helpers (client-safe).
export type GiftItem = {
  code: string;
  emoji: string;
  name: string;
  coins: number;
  tier: "basic" | "warm" | "premium" | "luxury";
};

export const GIFT_CATALOG: GiftItem[] = [
  { code: "rose", emoji: "🌹", name: "玫瑰", coins: 9, tier: "basic" },
  { code: "latte", emoji: "☕️", name: "拿铁", coins: 18, tier: "basic" },
  { code: "cake", emoji: "🍰", name: "心动蛋糕", coins: 38, tier: "warm" },
  { code: "bear", emoji: "🧸", name: "毛绒熊", coins: 66, tier: "warm" },
  { code: "diamond", emoji: "💎", name: "钻石", coins: 188, tier: "premium" },
  { code: "rocket", emoji: "🚀", name: "心动火箭", coins: 388, tier: "premium" },
  { code: "yacht", emoji: "🛥️", name: "Pulse 游艇", coins: 888, tier: "luxury" },
  { code: "castle", emoji: "🏰", name: "梦幻城堡", coins: 1888, tier: "luxury" },
];

export function findGift(code: string) {
  return GIFT_CATALOG.find((g) => g.code === code);
}

export const TOPUP_PACKS = [
  { coins: 60, label: "新手包" },
  { coins: 188, label: "心动包" },
  { coins: 488, label: "热恋包" },
  { coins: 1288, label: "灵魂包" },
  { coins: 3288, label: "至尊包" },
];

export const PRO_PLANS = [
  { plan: "month" as const, label: "月卡", coins: 188, days: 30 },
  { plan: "quarter" as const, label: "季卡", coins: 488, days: 90 },
  { plan: "year" as const, label: "年卡", coins: 1588, days: 365 },
];

export function isPro(proUntil: string | null | undefined) {
  if (!proUntil) return false;
  return new Date(proUntil).getTime() > Date.now();
}