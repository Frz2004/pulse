/** 掌纹线型 → 人格侧写文案 */
export const PALM_LINE_LABELS = {
  life: "生命线",
  heart: "感情线",
  head: "智慧线",
  fate: "命运线",
} as const;

export const PALM_ARCHETYPES = [
  { id: "fire", name: "烈焰掌", desc: "掌纹清晰有力，行动派气质，敢冲敢拼。" },
  { id: "water", name: "流水掌", desc: "纹路绵长柔和，共情力强，情绪细腻。" },
  { id: "wood", name: "青木掌", desc: "主线分明且直，思维清晰，擅长规划。" },
  { id: "gold", name: "金辉掌", desc: "命运线深而稳，目标感强，越挫越勇。" },
  { id: "earth", name: "厚土掌", desc: "掌肉饱满纹路密，可靠务实，慢热但长情。" },
] as const;

export const PALM_TRAIT_POOL = [
  "直觉敏锐", "外冷内热", "社交蝴蝶", "深夜哲思", "行动优先",
  "细节控", "浪漫理想", "独立边界", "治愈系", "反差萌",
  "冒险精神", "稳定输出", "嘴硬心软", "慢热专情", "创意爆棚",
];
