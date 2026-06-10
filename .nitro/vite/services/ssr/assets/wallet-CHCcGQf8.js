const GIFT_CATALOG = [
  { code: "rose", emoji: "🌹", name: "玫瑰", coins: 9, tier: "basic" },
  { code: "latte", emoji: "☕️", name: "拿铁", coins: 18, tier: "basic" },
  { code: "cake", emoji: "🍰", name: "心动蛋糕", coins: 38, tier: "warm" },
  { code: "bear", emoji: "🧸", name: "毛绒熊", coins: 66, tier: "warm" },
  { code: "diamond", emoji: "💎", name: "钻石", coins: 188, tier: "premium" },
  { code: "rocket", emoji: "🚀", name: "心动火箭", coins: 388, tier: "premium" },
  { code: "yacht", emoji: "🛥️", name: "Pulse 游艇", coins: 888, tier: "luxury" },
  { code: "castle", emoji: "🏰", name: "梦幻城堡", coins: 1888, tier: "luxury" }
];
function findGift(code) {
  return GIFT_CATALOG.find((g) => g.code === code);
}
const TOPUP_PACKS = [
  { coins: 60, label: "新手包" },
  { coins: 188, label: "心动包" },
  { coins: 488, label: "热恋包" },
  { coins: 1288, label: "灵魂包" },
  { coins: 3288, label: "至尊包" }
];
const PRO_PLANS = [
  { plan: "month", label: "月卡", coins: 188, days: 30 },
  { plan: "quarter", label: "季卡", coins: 488, days: 90 },
  { plan: "year", label: "年卡", coins: 1588, days: 365 }
];
function isPro(proUntil) {
  if (!proUntil) return false;
  return new Date(proUntil).getTime() > Date.now();
}
export {
  GIFT_CATALOG as G,
  PRO_PLANS as P,
  TOPUP_PACKS as T,
  findGift as f,
  isPro as i
};
