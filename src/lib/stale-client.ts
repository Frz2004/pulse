function collectErrorText(error: unknown, seen = new Set<unknown>()): string {
  if (error == null || seen.has(error)) return "";
  seen.add(error);

  if (typeof error === "string") return error;
  if (typeof error !== "object") return String(error);

  const record = error as Record<string, unknown>;
  const parts = [record.name, record.message, record.stack]
    .filter((value): value is string => typeof value === "string");

  for (const key of ["cause", "runnerError", "error"] as const) {
    parts.push(collectErrorText(record[key], seen));
  }

  if (Array.isArray(record.errors)) {
    for (const item of record.errors) parts.push(collectErrorText(item, seen));
  }

  return parts.filter(Boolean).join("\n");
}

export function isStaleServerFunctionError(error: unknown): boolean {
  return collectErrorText(error).includes("Invalid server function ID");
}

export function staleServerFunctionResponse(): Response {
  return new Response(JSON.stringify({ error: "STALE_CLIENT", refresh: true }), {
    status: 409,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "clear-site-data": '"cache"',
    },
  });
}