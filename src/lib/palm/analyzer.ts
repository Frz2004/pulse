import { ALL_SELECTABLE_SBTI_TYPES } from "@/lib/sbti/rewards";
import { PALM_ARCHETYPES, PALM_TRAIT_POOL } from "./data";

export type PalmLineScore = {
  life: number;
  heart: number;
  head: number;
  fate: number;
};

export type PalmReadingResult = {
  lines: PalmLineScore;
  archetype: (typeof PALM_ARCHETYPES)[number];
  summary: string;
  traits: string[];
  suggestedSbti: string;
  suggestedSbtiCn: string;
  confidence: number;
  imageHash: string;
};

function hashPixels(data: Uint8ClampedArray): number {
  let h = 2166136261;
  for (let i = 0; i < data.length; i += 16) {
    h ^= data[i];
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function scoreFromHash(h: number, salt: number): number {
  return 35 + ((h ^ salt) % 66);
}

/** 基于掌纹图片像素生成稳定、可复现的掌纹人格结果（本地娱乐向） */
export async function analyzePalmImage(file: File): Promise<PalmReadingResult> {
  const bitmap = await createImageBitmap(file);
  const size = 160;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法读取图片");

  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, size, size);
  const hash = hashPixels(data);

  const lines: PalmLineScore = {
    life: scoreFromHash(hash, 1),
    heart: scoreFromHash(hash, 2),
    head: scoreFromHash(hash, 3),
    fate: scoreFromHash(hash, 4),
  };

  const archetype = PALM_ARCHETYPES[hash % PALM_ARCHETYPES.length];
  const typeIdx = (lines.life + lines.heart * 2 + lines.head + lines.fate * 3) % ALL_SELECTABLE_SBTI_TYPES.length;
  const suggested = ALL_SELECTABLE_SBTI_TYPES[typeIdx];

  const traits = Array.from({ length: 4 }, (_, i) =>
    PALM_TRAIT_POOL[(hash + i * 7) % PALM_TRAIT_POOL.length],
  );

  const confidence = 72 + (hash % 23);

  const summary = `你的${archetype.name}显示：感情线 ${lines.heart}% · 智慧线 ${lines.head}% · 与 SBTI「${suggested.cn}」高度同频。${archetype.desc}`;

  return {
    lines,
    archetype,
    summary,
    traits: [...new Set(traits)],
    suggestedSbti: suggested.code,
    suggestedSbtiCn: suggested.cn,
    confidence,
    imageHash: hash.toString(16),
  };
}
