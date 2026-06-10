import { c as createServerRpc } from "./createServerRpc-BO-iKgU9.js";
import { k as createServerFn } from "./server-ChSCHK5Z.js";
import { r as requireSupabaseAuth } from "./auth-middleware-Y8f4GSpx.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-m6JgwYlt.js";
const PALM_LIMIT = 2;
const PRESETS = [{
  overall: "外冷内热的浪漫主义者，骨子里相信一见钟情。",
  love: {
    score: 88,
    line: "感情线深而清晰",
    comment: "一旦动心就掏心掏肺，但容易被忽冷忽热劝退。"
  },
  career: {
    score: 72,
    line: "事业线笔直向上",
    comment: "适合做需要审美和直觉的工作，三十岁后开窍。"
  },
  life: {
    score: 81,
    line: "生命线饱满有力",
    comment: "体力线长，注意别熬夜把火气都点燃。"
  },
  fortune: "近期会遇到一个让你心跳加速的新朋友。",
  matchHint: "适合温柔但有主见、能接住你冷幽默的人。",
  warning: "结果仅供娱乐，真正的命运在你手上。"
}, {
  overall: "天生的能量发射器，走到哪里都是焦点。",
  love: {
    score: 76,
    line: "感情线分叉上扬",
    comment: "桃花旺但容易心猿意马，定下来才会幸福。"
  },
  career: {
    score: 90,
    line: "事业线粗壮有力",
    comment: "你是天生的领导者，三十五岁前必有一次跃迁。"
  },
  life: {
    score: 78,
    line: "生命线弧度漂亮",
    comment: "运动天赋好，但肠胃是你的薄弱环节。"
  },
  fortune: "本月适合主动出击，犹豫就会错过。",
  matchHint: "适合能跟得上你节奏、又能拉住你的对手型伴侣。",
  warning: "看完笑笑就好，认真你就输了。"
}, {
  overall: "温柔的治愈系，谁靠近你都会被照顾得很好。",
  love: {
    score: 92,
    line: "感情线柔和绵长",
    comment: "你的爱让人安心，但别忘了也让自己被宠爱。"
  },
  career: {
    score: 68,
    line: "事业线分段清晰",
    comment: "适合服务、教育、创作类，慢热但走得远。"
  },
  life: {
    score: 85,
    line: "生命线平稳",
    comment: "健康牌打得不错，注意肩颈和睡眠。"
  },
  fortune: "未来一个月有贵人相助，记得开口求帮忙。",
  matchHint: "适合理性、靠谱、能在你软弱时撑伞的人。",
  warning: "命由己造，本卦只负责让你开心。"
}, {
  overall: "聪明的观察者，朋友圈里最懂洞察人心的那个。",
  love: {
    score: 70,
    line: "感情线细密",
    comment: "想得多动得少，先迈出第一步才有故事。"
  },
  career: {
    score: 86,
    line: "事业线如箭",
    comment: "适合分析、策划、技术，越深耕越值钱。"
  },
  life: {
    score: 74,
    line: "生命线规整",
    comment: "脑力消耗大，记得给眼睛和大脑放假。"
  },
  fortune: "近期会有一个被忽略的好机会重新出现。",
  matchHint: "适合不需要你解释太多、就能懂你的人。",
  warning: "占卜如奶茶，偶尔来一杯就好。"
}, {
  overall: "自由灵魂，规则对你来说更像参考线。",
  love: {
    score: 80,
    line: "感情线起伏跳跃",
    comment: "你需要的不是稳定，而是同频共振。"
  },
  career: {
    score: 82,
    line: "事业线多支线",
    comment: "斜杠人生最适合你，专一反而困住才华。"
  },
  life: {
    score: 88,
    line: "生命线宽阔",
    comment: "精力旺盛，但情绪起伏需要冥想来稳压。"
  },
  fortune: "三周内会冒出一个让你想立刻出发的灵感。",
  matchHint: "适合同样热爱探索、不黏人但够浪漫的旅伴。",
  warning: "再准也只是娱乐，请把方向盘握在自己手里。"
}, {
  overall: "稳重派代表，是大家心里的'安全感发电厂'。",
  love: {
    score: 84,
    line: "感情线深刻",
    comment: "你不轻易付出，但一旦认定就长情。"
  },
  career: {
    score: 79,
    line: "事业线平稳上升",
    comment: "你的成功是复利型的，别和短跑选手比。"
  },
  life: {
    score: 80,
    line: "生命线圆润",
    comment: "免疫力不错，注意腰背的小毛病。"
  },
  fortune: "财运渐入佳境，存钱比理财更重要。",
  matchHint: "适合温暖体贴、愿意一起规划未来的人。",
  warning: "本结果不构成投资或感情建议。"
}, {
  overall: "幽默精怪的灵魂，能把日子过出甜味儿。",
  love: {
    score: 89,
    line: "感情线翘起",
    comment: "桃花就在身边，只看你愿不愿意点头。"
  },
  career: {
    score: 74,
    line: "事业线带星纹",
    comment: "创意行业的星纹手，作品会替你说话。"
  },
  life: {
    score: 83,
    line: "生命线明亮",
    comment: "心态年轻是你的最大资产，少糖多笑。"
  },
  fortune: "近期适合主动联络一个许久未见的朋友。",
  matchHint: "适合能 get 你梗、笑点同步的人。",
  warning: "命运的方向盘永远在你手里，本卦只是副驾。"
}, {
  overall: "深海型人格，沉静水面下藏着丰富宇宙。",
  love: {
    score: 77,
    line: "感情线收敛",
    comment: "你不容易动心，但一动就是认真款。"
  },
  career: {
    score: 81,
    line: "事业线深刻",
    comment: "适合研究、写作、艺术等需要专注的事业。"
  },
  life: {
    score: 76,
    line: "生命线安静",
    comment: "需要独处充电，别勉强自己社交。"
  },
  fortune: "近一个月内灵感涌现，请把它们写下来。",
  matchHint: "适合安静、有内容、能陪你长时间不说话的人。",
  warning: "看手相图个乐，认真你就输给科学了。"
}, {
  overall: "行动力满格，是想到就立刻去做的执行派。",
  love: {
    score: 73,
    line: "感情线明快",
    comment: "喜欢就直球出击，慢热的人可能跟不上。"
  },
  career: {
    score: 91,
    line: "事业线坚实",
    comment: "三年内会有一次决定性的高光时刻。"
  },
  life: {
    score: 86,
    line: "生命线强健",
    comment: "体能在线，注意别让节奏拉伤情绪。"
  },
  fortune: "本月适合签合同、定计划，别再拖了。",
  matchHint: "适合冷静稳重、能在你冲动时按下暂停键的人。",
  warning: "结论娱乐就好，下一步还是要自己走。"
}, {
  overall: "天生的故事讲述者，眼里有光，心里有戏。",
  love: {
    score: 86,
    line: "感情线柔韧",
    comment: "你爱得浪漫但不天真，分寸感很迷人。"
  },
  career: {
    score: 78,
    line: "事业线弯而长",
    comment: "曲线救国型，绕过的弯路都是后来的素材。"
  },
  life: {
    score: 82,
    line: "生命线流畅",
    comment: "情绪是你最大的天气系统，记得晒太阳。"
  },
  fortune: "未来两周会收到一个意想不到的好消息。",
  matchHint: "适合愿意做你第一个读者和最久听众的人。",
  warning: "看个手相而已，别真把自己框死。"
}];
function pickPreset(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) | 0;
  const index = Math.abs(h + Math.floor(Math.random() * 9973)) % PRESETS.length;
  return {
    index,
    preset: PRESETS[index]
  };
}
const getPalmQuota_createServerFn_handler = createServerRpc({
  id: "db6e63473ec7d56fd70595da724fac8c2d61ab6e68f1fdafddd5c626ba5df1f0",
  name: "getPalmQuota",
  filename: "src/lib/palm.functions.ts"
}, (opts) => getPalmQuota.__executeServer(opts));
const getPalmQuota = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getPalmQuota_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    count,
    error
  } = await supabase.from("palm_readings").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId);
  if (error) throw new Error(error.message);
  const used = count ?? 0;
  return {
    used,
    limit: PALM_LIMIT,
    remaining: Math.max(0, PALM_LIMIT - used)
  };
});
const listMyPalmReadings_createServerFn_handler = createServerRpc({
  id: "37f4f5a1bd02bc61d24c92d1fd7f56b5d9c5c1b5314112f5f7903e5274093dc3",
  name: "listMyPalmReadings",
  filename: "src/lib/palm.functions.ts"
}, (opts) => listMyPalmReadings.__executeServer(opts));
const listMyPalmReadings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyPalmReadings_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("palm_readings").select("id, result, created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const verifyPalm_createServerFn_handler = createServerRpc({
  id: "c8ce0b09cb4524dfa4ce81027bf8f07b94e5da700da796267ef2c9873e1d76b1",
  name: "verifyPalm",
  filename: "src/lib/palm.functions.ts"
}, (opts) => verifyPalm.__executeServer(opts));
const verifyPalm = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => {
  if (!d?.imageDataUrl || !d.imageDataUrl.startsWith("data:image/")) {
    throw new Error("图片格式不正确");
  }
  if (d.imageDataUrl.length > 8e6) throw new Error("图片过大，请压缩后重试");
  return d;
}).handler(verifyPalm_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    count
  } = await supabase.from("palm_readings").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId);
  const used = count ?? 0;
  if (used >= PALM_LIMIT) {
    throw new Error(`每位用户最多 ${PALM_LIMIT} 次机会，你已用完`);
  }
  const {
    visionJSON
  } = await import("./vision.server-DdnmhkwD.js");
  const parsed = await visionJSON('判断图片中是否清晰可见一只真人手掌（不是绘画、雕塑、玩偶或动物爪）。严格输出 JSON：{"isHand": boolean, "confidence": 0-1, "reason": "一句中文说明"}', data.imageDataUrl);
  if (!parsed.isHand || (parsed.confidence ?? 0) < 0.5) {
    throw new Error(parsed.reason || "没识别到清晰的手掌，请重新拍一张");
  }
  const {
    index
  } = pickPreset(`${userId}-${Date.now()}`);
  const {
    data: row,
    error
  } = await supabase.from("palm_readings").insert({
    user_id: userId,
    result: {
      presetIndex: index,
      shared: false,
      revealed: false
    }
  }).select("id").single();
  if (error || !row) throw new Error(error?.message || "保存失败");
  return {
    readingId: row.id,
    remaining: Math.max(0, PALM_LIMIT - used - 1)
  };
});
const revealPalm_createServerFn_handler = createServerRpc({
  id: "23f31f51eaf28ef161a866620520148ef59ebf3ecdfebafa36dfe52625011e7e",
  name: "revealPalm",
  filename: "src/lib/palm.functions.ts"
}, (opts) => revealPalm.__executeServer(opts));
const revealPalm = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => {
  if (!d?.readingId) throw new Error("缺少 readingId");
  return d;
}).handler(revealPalm_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: row,
    error
  } = await supabase.from("palm_readings").select("id, result, user_id").eq("id", data.readingId).single();
  if (error || !row) throw new Error("找不到这次手相记录");
  if (row.user_id !== userId) throw new Error("无权查看");
  const result = row.result ?? {};
  const idx = typeof result.presetIndex === "number" ? result.presetIndex : 0;
  const preset = PRESETS[idx] ?? PRESETS[0];
  await supabase.from("palm_readings").update({
    result: {
      presetIndex: idx,
      shared: true,
      revealed: true
    }
  }).eq("id", data.readingId);
  return {
    preset,
    presetIndex: idx
  };
});
export {
  getPalmQuota_createServerFn_handler,
  listMyPalmReadings_createServerFn_handler,
  revealPalm_createServerFn_handler,
  verifyPalm_createServerFn_handler
};
