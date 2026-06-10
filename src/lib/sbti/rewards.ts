import { sbtiSpecialTypes, sbtiStandardTypes } from "./data";
import type { SbtiType } from "./types";

/** 官方 SBTI 在线测试（与题库来源一致） */
export const SBTI_EXTERNAL_TEST_URL = "https://www.sbti-test.org/zh-hant/test";

export type SbtiOutfit = {
  gradient: string;
  accent: string;
  accessory: string;
  label: string;
};

export type SbtiRewardMeta = {
  code: string;
  cn: string;
  title: string;
  intro: string;
  keywords: string[];
  nameplate: string;
  outfit: SbtiOutfit;
};

const OUTFIT_PRESETS: SbtiOutfit[] = [
  { gradient: "from-coral via-sun to-coral", accent: "ring-coral/60", accessory: "👑", label: "暖焰王冠" },
  { gradient: "from-mint via-brand to-mint", accent: "ring-mint/60", accessory: "🎭", label: "薄荷面具" },
  { gradient: "from-sun via-coral to-sun", accent: "ring-sun/60", accessory: "✨", label: "日光披风" },
  { gradient: "from-brand via-mint to-brand", accent: "ring-brand/60", accessory: "🌊", label: "潮汐外套" },
  { gradient: "from-[#7a4bff] via-coral to-sun", accent: "ring-[#7a4bff]/50", accessory: "🔮", label: "星尘长袍" },
  { gradient: "from-[#ff5a6e] via-[#fde68a] to-mint", accent: "ring-[#ff5a6e]/50", accessory: "💫", label: "霓虹夹克" },
  { gradient: "from-[#38bdf8] via-mint to-[#6366f1]", accent: "ring-[#38bdf8]/50", accessory: "🎧", label: "电音耳罩" },
  { gradient: "from-[#fb923c] via-sun to-coral", accent: "ring-[#fb923c]/50", accessory: "🔥", label: "落日围巾" },
  { gradient: "from-[#5eead4] via-brand to-[#6366f1]", accent: "ring-[#5eead4]/50", accessory: "🌙", label: "月影兜帽" },
  { gradient: "from-coral via-[#ef4444] to-sun", accent: "ring-coral/60", accessory: "❤️", label: "心动胸章" },
  { gradient: "from-mint via-sun to-brand", accent: "ring-mint/60", accessory: "🎪", label: "嘉年华帽" },
  { gradient: "from-[#fde68a] via-sun to-coral", accent: "ring-sun/60", accessory: "☀️", label: "阳光贝雷" },
  { gradient: "from-brand via-coral to-mint", accent: "ring-brand/60", accessory: "🎸", label: "摇滚肩章" },
  { gradient: "from-[#6366f1] via-brand to-mint", accent: "ring-[#6366f1]/50", accessory: "🧠", label: "思辨眼镜" },
  { gradient: "from-coral via-mint to-sun", accent: "ring-coral/60", accessory: "🌸", label: "花语披肩" },
  { gradient: "from-sun via-brand to-coral", accent: "ring-sun/60", accessory: "⚡", label: "闪电徽章" },
  { gradient: "from-mint via-[#38bdf8] to-brand", accent: "ring-mint/60", accessory: "🐚", label: "贝壳项链" },
  { gradient: "from-[#7a4bff] via-mint to-sun", accent: "ring-[#7a4bff]/50", accessory: "🦋", label: "幻彩翅膀" },
  { gradient: "from-coral via-[#fb923c] to-sun", accent: "ring-coral/60", accessory: "🍊", label: "柑橘卫衣" },
  { gradient: "from-brand via-sun to-mint", accent: "ring-brand/60", accessory: "📚", label: "学者领结" },
  { gradient: "from-[#ef4444] via-coral to-sun", accent: "ring-[#ef4444]/50", accessory: "🎯", label: "目标臂环" },
  { gradient: "from-mint via-coral to-brand", accent: "ring-mint/60", accessory: "🌿", label: "森系斗篷" },
  { gradient: "from-sun via-mint to-coral", accent: "ring-sun/60", accessory: "🎨", label: "调色盘包" },
  { gradient: "from-[#6366f1] via-sun to-coral", accent: "ring-[#6366f1]/50", accessory: "🚀", label: "探索背包" },
  { gradient: "from-coral via-brand to-mint", accent: "ring-coral/60", accessory: "💎", label: "晶石胸针" },
  { gradient: "from-[#ff5a6e] via-[#7a4bff] to-mint", accent: "ring-[#ff5a6e]/50", accessory: "🃏", label: "小丑礼帽" },
];

const KEYWORD_OVERRIDES: Record<string, string[]> = {
  CTRL: ["掌控", "高效", "秩序", "领导力"],
  "ATM-er": ["可靠", "付出", "担当", "温暖"],
  "Dior-s": ["清醒", "犬儒", "躺平", "真实"],
  BOSS: ["领袖", "目标感", "自律", "破局"],
  "THAN-K": ["感恩", "乐观", "温柔", "治愈"],
  "OH-NO": ["谨慎", "边界感", "预判", "秩序"],
  GOGO: ["行动派", "效率", "直给", "完成主义"],
  SEXY: ["魅力", "自信", "光芒", "吸引力"],
  "LOVE-R": ["浪漫", "多情", "理想", "共情"],
  MUM: ["温柔", "治愈", "包容", "守护"],
  FAKE: ["社交", "面具", "适应", "表演"],
  OG8K: ["随缘", "佛系", "王者", "都行"],
  MALO: ["自由", "童心", "跳脱", "创意"],
  "JOKE-R": ["幽默", "小丑", "敏感", "舞台"],
  "WOC!": ["震惊", "冷静", "旁观", "草系"],
  "THIN-K": ["思辨", "理性", "深度", "独立"],
  SHIT: ["愤世", "嘴硬", "靠谱", "反差"],
  ZZZZ: ["装死", "节能", "爆发", "边界"],
  POOR: ["专注", "极简", "激光", "专精"],
  MONK: ["清修", "疏离", "内观", "结界"],
  IMSB: ["内耗", "冲劲", "纠结", "真实"],
  SOLO: ["独立", "孤独", "国王", "刺猬"],
  "FU?K": ["野草", "叛逆", "生命力", "自由"],
  DEAD: ["虚无", "通透", "佛系", "贤者"],
  IMFW: ["脆弱", "纯粹", "珍宝", "无防"],
  HHHH: ["傻乐", "快乐", "意外", "混沌"],
};

/** 26 种可选人格：25 标准 + HHHH 兜底型 */
export const ALL_SELECTABLE_SBTI_TYPES: SbtiType[] = [
  ...sbtiStandardTypes,
  sbtiSpecialTypes.find((t) => t.code === "HHHH")!,
];

export function getSbtiTypeByCode(code: string): SbtiType | undefined {
  return ALL_SELECTABLE_SBTI_TYPES.find((t) => t.code === code)
    ?? sbtiSpecialTypes.find((t) => t.code === code);
}

export function getSbtiRewardMeta(code: string): SbtiRewardMeta | null {
  const type = getSbtiTypeByCode(code);
  if (!type) return null;
  const idx = ALL_SELECTABLE_SBTI_TYPES.findIndex((t) => t.code === code);
  const outfit = OUTFIT_PRESETS[idx >= 0 ? idx % OUTFIT_PRESETS.length : 0];
  const keywords = KEYWORD_OVERRIDES[type.code] ?? [type.cn, "同频", "Pulse"];
  return {
    code: type.code,
    cn: type.cn,
    title: `${type.cn} · ${type.code}`,
    intro: type.intro,
    keywords,
    nameplate: `${type.code} · ${type.cn}`,
    outfit,
  };
}

export const REFERRAL_REWARDS = {
  inviter: { points: 50, xp: 30 },
  invitee: { points: 30, xp: 20 },
} as const;
