function getVisionConfig() {
  const apiKey = process.env.VISION_API_KEY ?? process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error("VISION_API_KEY 或 DASHSCOPE_API_KEY 未配置");
  }
  const baseUrl = process.env.VISION_API_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1";
  const model = process.env.VISION_MODEL ?? "qwen-vl-max";
  return { apiKey, baseUrl: baseUrl.replace(/\/$/, ""), model };
}
async function visionJSON(prompt, imageDataUrl) {
  const { apiKey, baseUrl, model } = getVisionConfig();
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageDataUrl } }
      ]
    }
  ];
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: "json_object" }
    })
  });
  if (res.status === 401) throw new Error("视觉 API 鉴权失败，请检查 Key");
  if (res.status === 429) throw new Error("视觉 API 请求过于频繁，请稍后再试");
  if (res.status === 402) throw new Error("视觉 API 额度不足");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`视觉 API 出错 (${res.status}) ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("视觉 API 返回的内容不是合法 JSON");
  }
}
export {
  visionJSON
};
