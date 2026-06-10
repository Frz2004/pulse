import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { getMyPrivacy, updateMyPrivacy, type PrivacySettings } from "@/lib/privacy.functions";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "隐私与可见性 · Pulse" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchFn = useServerFn(getMyPrivacy);
  const updateFn = useServerFn(updateMyPrivacy);
  const { data, isLoading } = useQuery({
    queryKey: ["my-privacy"],
    queryFn: () => fetchFn(),
  });
  const mut = useMutation({
    mutationFn: (patch: Partial<PrivacySettings>) => updateFn({ data: patch }),
    onSuccess: () => {
      toast.success("已更新");
      qc.invalidateQueries({ queryKey: ["my-privacy"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "更新失败"),
  });

  const s = data?.settings;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate({ to: "/me" })}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface/70"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4" /> 隐私与可见性
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pb-16 pt-4">
        {isLoading || !s ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            <Section title="发现 & 搜索">
              <ToggleRow
                label="允许他人通过昵称搜到我"
                desc="关闭后将不在添加好友的搜索结果中出现"
                value={s.searchable}
                onChange={(v) => mut.mutate({ searchable: v })}
              />
            </Section>

            <Section title="谁能给我发消息">
              <ChoiceRow
                value={s.allow_messages}
                options={[
                  { v: "everyone", label: "所有人" },
                  { v: "matches", label: "仅互相喜欢" },
                  { v: "none", label: "暂不接受" },
                ]}
                onChange={(v) => mut.mutate({ allow_messages: v as PrivacySettings["allow_messages"] })}
              />
            </Section>

            <Section title="资料展示">
              <ToggleRow
                label="隐藏我的城市"
                desc="在他人查看你时不显示城市信息"
                value={s.hide_city}
                onChange={(v) => mut.mutate({ hide_city: v })}
              />
              <ToggleRow
                label="隐藏我与他人的距离"
                desc="在雷达和卡片中不展示距离"
                value={s.hide_distance}
                onChange={(v) => mut.mutate({ hide_distance: v })}
              />
            </Section>

            <p className="px-2 pt-2 text-[11px] text-muted-foreground">
              更改会立即生效。已建立的聊天不会受影响。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="px-1 pb-1.5 text-xs font-medium text-muted-foreground">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/60 divide-y divide-border">
        {children}
      </div>
    </section>
  );
}

function ToggleRow({
  label, desc, value, onChange,
}: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-sm">{label}</div>
        {desc && <div className="mt-0.5 text-[11px] text-muted-foreground">{desc}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          value ? "bg-coral" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${
            value ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function ChoiceRow({
  value, options, onChange,
}: {
  value: string;
  options: { v: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="p-2">
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-xl px-2 py-2 text-xs transition ${
              value === o.v
                ? "bg-coral text-background shadow-sm"
                : "border border-border bg-background/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}