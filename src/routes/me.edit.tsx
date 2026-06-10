import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { getMyProfile, saveProfile } from "@/lib/profile.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/me/edit")({
  head: () => ({ meta: [{ title: "编辑个人资料 · Pulse" }] }),
  component: MeEditPage,
});

type FormState = {
  nickname: string; gender: string; birthday: string; city: string; hometown: string; height: string; job: string; education: string; school: string;
  signature: string; intro: string; status: string; interestsText: string; personalityText: string; mbti: string; zodiac: string;
  smoke: string; drink: string; sleep: string; diet: string; pet: string; health: string;
  intent: string[]; relationship: string; sexualOrientation: string; idealType: string; ageMin: string; ageMax: string; distance: string; icebreaker: string;
  phone: string; phoneVerified: boolean; verifyReal: boolean; verifyStudent: boolean;
};

const defaultForm: FormState = {
  nickname: "", gender: "", birthday: "", city: "", hometown: "", height: "", job: "", education: "", school: "",
  signature: "", intro: "", status: "", interestsText: "", personalityText: "", mbti: "", zodiac: "",
  smoke: "", drink: "", sleep: "", diet: "", pet: "", health: "",
  intent: [], relationship: "", sexualOrientation: "", idealType: "", ageMin: "", ageMax: "", distance: "", icebreaker: "",
  phone: "", phoneVerified: false, verifyReal: false, verifyStudent: false,
};

const intentOptions = ["认真恋爱", "认识朋友", "一起玩", "聊天陪伴", "同城活动", "寻找搭子"];
const PROFILE_CACHE_KEY = "pulse_profile_edit_cache";

function profileToForm(p: any): FormState {
  if (!p) return defaultForm;
  return {
    nickname: p.nickname ?? "", gender: p.gender ?? "", birthday: p.birthday ?? "", city: p.city ?? "", hometown: p.hometown ?? "", height: p.height ?? "", job: p.job ?? "", education: p.education ?? "", school: p.school ?? "",
    signature: p.signature ?? "", intro: p.intro ?? "", status: p.status ?? "", interestsText: Array.isArray(p.interests) ? p.interests.join("、") : "", personalityText: Array.isArray(p.personality) ? p.personality.join("、") : "", mbti: p.mbti ?? "", zodiac: p.zodiac ?? "",
    smoke: p.smoke ?? "", drink: p.drink ?? "", sleep: p.sleep ?? "", diet: p.diet ?? "", pet: p.pet ?? "", health: p.health ?? "",
    intent: Array.isArray(p.intent) ? p.intent : [], relationship: p.relationship ?? "", sexualOrientation: p.sexual_orientation ?? p.sexualOrientation ?? "", idealType: p.ideal_type ?? p.idealType ?? "", ageMin: p.age_range?.min ? String(p.age_range.min) : "", ageMax: p.age_range?.max ? String(p.age_range.max) : "", distance: p.distance ?? "", icebreaker: p.icebreaker ?? "",
    phone: p.phone ?? "", phoneVerified: Boolean(p.phone_verified ?? p.phoneVerified), verifyReal: Boolean(p.verify_real ?? p.verifyReal), verifyStudent: Boolean(p.verify_student ?? p.verifyStudent),
  };
}

function readCachedForm() {
  if (typeof window === "undefined") return defaultForm;
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? profileToForm(JSON.parse(raw)) : defaultForm;
  } catch {
    return defaultForm;
  }
}

function MeEditPage() {
  const navigate = useNavigate();
  const fetchMe = useServerFn(getMyProfile);
  const save = useServerFn(saveProfile);
  const { data } = useQuery({ queryKey: ["my-profile-edit"], queryFn: () => fetchMe(), staleTime: 60_000 });
  const [form, setForm] = useState<FormState>(() => readCachedForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p: any = data?.profile;
    if (!p) return;
    setForm(profileToForm(p));
    try { localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(p)); } catch {}
  }, [data]);

  const set = (key: keyof FormState, value: any) => setForm((v) => ({ ...v, [key]: value }));
  const splitTags = (s: string, max: number) => s.split(/[、,，\s]+/).map((x) => x.trim()).filter(Boolean).slice(0, max);

  const submit = async () => {
    const interests = splitTags(form.interestsText, 15);
    const personality = splitTags(form.personalityText, 8);
    if (!form.nickname.trim() || !form.gender || !form.birthday || !form.city.trim() || !form.signature.trim() || !form.smoke || !form.drink || !form.phone.trim()) {
      toast.error("请填写所有必填项");
      return;
    }
    if (form.signature.length > 150) {
      toast.error("个性签名不能超过 150 字");
      return;
    }
    setSaving(true);
    try {
      await save({ data: {
        nickname: form.nickname, gender: form.gender, birthday: form.birthday, city: form.city, hometown: form.hometown, height: form.height, job: form.job, education: form.education, school: form.school,
        signature: form.signature, intro: form.intro, status: form.status, interests, personality, mbti: form.mbti, zodiac: form.zodiac,
        smoke: form.smoke, drink: form.drink, sleep: form.sleep, diet: form.diet, pet: form.pet, health: form.health,
        intent: form.intent, relationship: form.relationship, sexualOrientation: form.sexualOrientation, idealType: form.idealType, ageRange: { min: Number(form.ageMin) || null, max: Number(form.ageMax) || null }, distance: form.distance, icebreaker: form.icebreaker,
        phone: form.phone, phoneVerified: true, verifyReal: form.verifyReal, verifyStudent: form.verifyStudent,
      } });
      toast.success("个人资料已保存");
      navigate({ to: "/me" });
    } catch (e: any) {
      toast.error(e?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[430px] items-center justify-between px-4 py-3">
          <button onClick={() => navigate({ to: "/me" })} className="rounded-full border border-border p-2"><ArrowLeft className="h-4 w-4" /></button>
          <div className="font-display font-semibold">编辑个人资料</div>
          <button onClick={submit} disabled={saving} className="inline-flex items-center gap-1 rounded-full bg-coral px-3 py-1.5 text-sm font-semibold text-background disabled:opacity-60"><Check className="h-4 w-4" />保存</button>
        </div>
      </div>

      <main className="mx-auto max-w-[430px] space-y-5 px-4 pb-28 pt-4">
        <Card title="2.1 账号基础">
          <Input label="昵称 *" value={form.nickname} onChange={(v) => set("nickname", v)} />
          <Select label="性别 *" value={form.gender} onChange={(v) => set("gender", v)} options={["男", "女", "非二元", "暂不透露"]} />
          <Input label="出生日期 *" type="date" value={form.birthday} onChange={(v) => set("birthday", v)} />
          <Input label="所在城市 *" value={form.city} onChange={(v) => set("city", v)} />
          <Input label="家乡" value={form.hometown} onChange={(v) => set("hometown", v)} />
          <Input label="身高" value={form.height} onChange={(v) => set("height", v)} placeholder="如 172cm" />
          <Input label="职业" value={form.job} onChange={(v) => set("job", v)} />
          <Input label="学历" value={form.education} onChange={(v) => set("education", v)} />
          <Input label="学校 / 公司" value={form.school} onChange={(v) => set("school", v)} />
        </Card>

        <Card title="2.3 个人简介">
          <Textarea label={`个性签名 * (${form.signature.length}/150)`} maxLength={150} value={form.signature} onChange={(v) => set("signature", v)} />
          <Textarea label="自我介绍" value={form.intro} onChange={(v) => set("intro", v)} />
          <Input label="当前状态" value={form.status} onChange={(v) => set("status", v)} placeholder="如 搬砖中 / 想出去玩" />
        </Card>

        <Card title="2.4 兴趣与性格">
          <Textarea label="兴趣爱好（最多15个，用顿号/逗号分隔）" value={form.interestsText} onChange={(v) => set("interestsText", v)} />
          <Textarea label="性格标签（最多8个，用顿号/逗号分隔）" value={form.personalityText} onChange={(v) => set("personalityText", v)} />
          <Input label="MBTI" value={form.mbti} onChange={(v) => set("mbti", v)} placeholder="如 ENFP" />
          <Input label="星座" value={form.zodiac} onChange={(v) => set("zodiac", v)} />
        </Card>

        <Card title="2.5 生活方式">
          <Select label="是否抽烟 *" value={form.smoke} onChange={(v) => set("smoke", v)} options={["不抽烟", "偶尔", "经常", "介意可沟通"]} />
          <Select label="是否喝酒 *" value={form.drink} onChange={(v) => set("drink", v)} options={["不喝酒", "偶尔", "社交饮酒", "经常"]} />
          <Input label="作息" value={form.sleep} onChange={(v) => set("sleep", v)} />
          <Input label="饮食" value={form.diet} onChange={(v) => set("diet", v)} />
          <Input label="宠物" value={form.pet} onChange={(v) => set("pet", v)} />
          <Input label="身体状况" value={form.health} onChange={(v) => set("health", v)} />
        </Card>

        <Card title="2.6 交友意向">
          <div><div className="mb-2 text-xs text-muted-foreground">交友目的（可多选）</div><div className="flex flex-wrap gap-2">{intentOptions.map((x) => <button key={x} onClick={() => set("intent", form.intent.includes(x) ? form.intent.filter((i) => i !== x) : [...form.intent, x])} className={`rounded-full border px-3 py-1.5 text-xs ${form.intent.includes(x) ? "border-coral bg-coral text-background" : "border-border bg-background"}`}>{x}</button>)}</div></div>
          <Input label="感情状态" value={form.relationship} onChange={(v) => set("relationship", v)} />
          <Input label="性取向" value={form.sexualOrientation} onChange={(v) => set("sexualOrientation", v)} />
          <Textarea label="理想型" value={form.idealType} onChange={(v) => set("idealType", v)} />
          <div className="grid grid-cols-2 gap-2"><Input label="年龄偏好最小" value={form.ageMin} onChange={(v) => set("ageMin", v)} /><Input label="年龄偏好最大" value={form.ageMax} onChange={(v) => set("ageMax", v)} /></div>
          <Input label="距离偏好" value={form.distance} onChange={(v) => set("distance", v)} />
          <Textarea label="破冰问题" value={form.icebreaker} onChange={(v) => set("icebreaker", v)} />
        </Card>

        <Card title="2.7 认证与安全">
          <Input label="手机号 *" value={form.phone} onChange={(v) => set("phone", v)} />
          <div className="rounded-2xl border border-mint/30 bg-mint/10 p-3 text-sm text-mint"><ShieldCheck className="mr-1 inline h-4 w-4" />保存手机号后视为已完成手机认证</div>
          <Toggle label="真人认证（可选）" checked={form.verifyReal} onChange={(v) => set("verifyReal", v)} />
          <Toggle label="学生认证（可选）" checked={form.verifyStudent} onChange={(v) => set("verifyStudent", v)} />
        </Card>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3 rounded-3xl border border-border bg-card/70 p-4"><h2 className="font-display font-semibold">{title}</h2>{children}</section>;
}
function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <label className="block text-xs text-muted-foreground">{label}<input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" /></label>;
}
function Textarea({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (v: string) => void; maxLength?: number }) {
  return <label className="block text-xs text-muted-foreground">{label}<textarea value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className="mt-1 h-24 w-full resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" /></label>;
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <label className="block text-xs text-muted-foreground">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"><option value="">请选择</option>{options.map((x) => <option key={x} value={x}>{x}</option>)}</select></label>;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-2xl border border-border bg-background px-3 py-2 text-sm"><span>{label}</span><span className={`rounded-full px-2 py-0.5 text-xs ${checked ? "bg-coral text-background" : "bg-muted text-muted-foreground"}`}>{checked ? "已开启" : "未开启"}</span></button>;
}
