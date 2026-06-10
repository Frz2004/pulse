/**
 * DeepSeek API 通用封装(纯文本)。
 * 仅可在服务端使用(server functions / server routes)。
 *
 * 视觉/听觉识别 DeepSeek 暂不支持,继续走 Lovable AI Gateway(见 palm.functions.ts)。
 */

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DeepSeekChatOptions = {
  /** 默认 deepseek-chat;复杂推理可用 deepseek-reasoner */
  model?: "deepseek-chat" | "deepseek-reasoner";
  temperature?: number;
  maxTokens?: number;
  /** 要求返回 JSON 对象 */
  jsonMode?: boolean;
};

function getKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY 未配置");
  return key;
}

/** 调用 DeepSeek chat completions,返回首条回复文本 */
export async function deepseekChat(
  messages: DeepSeekMessage[],
  options: DeepSeekChatOptions = {},
): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? "deepseek-chat",
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      response_format: options.jsonMode ? { type: "json_object" } : undefined,
    }),
  });

  if (res.status === 401) throw new Error("DeepSeek 鉴权失败,请检查 API Key");
  if (res.status === 402) throw new Error("DeepSeek 额度不足,请充值后再试");
  if (res.status === 429) throw new Error("DeepSeek 请求过于频繁,请稍后再试");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DeepSeek 服务出错 (${res.status}) ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const content: string = json?.choices?.[0]?.message?.content ?? "";
  return content;
}

/** 调用 DeepSeek 并解析 JSON 返回 */
export async function deepseekJSON<T = unknown>(
  messages: DeepSeekMessage[],
  options: Omit<DeepSeekChatOptions, "jsonMode"> = {},
): Promise<T> {
  const content = await deepseekChat(messages, { ...options, jsonMode: true });
  try {
    return JSON.parse(content) as T;
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("DeepSeek 返回的内容不是合法 JSON");
  }
}