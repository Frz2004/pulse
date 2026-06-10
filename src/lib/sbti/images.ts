/** 类型 code → 图片文件名（public/sbti/types/zh/） */
const FILE_ALIASES: Record<string, string> = {
  "FU?K": "FUCK.png",
  OG8K: "OJBK.png",
};

export function getSbtiTypeImageUrl(code: string, locale = "zh"): string {
  const file = FILE_ALIASES[code] ?? `${code}.png`;
  return `/sbti/types/${locale}/${encodeURIComponent(file)}`;
}
