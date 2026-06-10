import type { SbtiRewardMeta } from "@/lib/sbti/rewards";

/** 将人格海报绘制为 PNG Blob，用于保存到相册 */
export async function renderSbtiPosterBlob(
  meta: SbtiRewardMeta,
  inviteCode: string,
  nickname?: string,
): Promise<Blob> {
  const W = 720;
  const H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 不可用");

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0f172a");
  bg.addColorStop(0.5, "#1e293b");
  bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,138,122,0.15)";
  ctx.beginPath();
  ctx.arc(W - 80, 80, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(94,234,212,0.12)";
  ctx.beginPath();
  ctx.arc(60, H - 60, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "500 18px system-ui, sans-serif";
  ctx.fillText("PULSE · SBTI", 48, 72);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px system-ui, sans-serif";
  wrapText(ctx, meta.title, 48, 130, W - 96, 48);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "24px system-ui, sans-serif";
  wrapText(ctx, meta.intro, 48, 220, W - 200, 32);

  ctx.font = "48px system-ui, sans-serif";
  ctx.fillText(meta.outfit.accessory, W - 120, 200);

  let tagY = 340;
  meta.keywords.forEach((k, i) => {
    const x = 48 + (i % 3) * 200;
    const y = tagY + Math.floor(i / 3) * 44;
    roundRect(ctx, x, y, 180, 36, 18, "rgba(255,255,255,0.1)");
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(`#${k}`, x + 16, y + 24);
  });

  roundRect(ctx, 48, 480, W - 96, 200, 24, "rgba(255,255,255,0.06)");
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("专属铭牌", 72, 530);
  ctx.fillStyle = "#fde68a";
  ctx.font = "bold 32px system-ui, sans-serif";
  ctx.fillText(meta.nameplate, 72, 575);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(`限定装扮 · ${meta.outfit.label}`, 72, 615);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("邀请码", W - 220, 530);
  ctx.fillStyle = "#5eead4";
  ctx.font = "bold 36px monospace";
  ctx.fillText(inviteCode, W - 220, 580);

  if (nickname) {
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(`来自 ${nickname} 的分享 · 测完双方得奖励`, 72, 660);
  }

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "18px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("打开链接测试 · 双方获得积分与装扮奖励", W / 2, H - 48);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("导出失败"))), "image/png");
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const chars = [...text];
  let line = "";
  let cy = y;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = ch;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
