import { REFERRAL_REWARDS } from "./rewards";

export type SbtiProgress = {
  sbtiType: string | null;
  outfitCode: string | null;
  xp: number;
  points: number;
  inviteCode: string;
  redeemedRefs: string[];
};

const PREFIX = "pulse_sbti_";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function getOrCreateInviteCode(userSeed?: string): string {
  const existing = typeof window !== "undefined" ? localStorage.getItem(PREFIX + "invite_code") : null;
  if (existing) return existing;
  const seed = userSeed?.replace(/-/g, "").slice(0, 4).toUpperCase() ?? "";
  const code = `P${seed}${randomCode(4)}`.slice(0, 8);
  if (typeof window !== "undefined") localStorage.setItem(PREFIX + "invite_code", code);
  return code;
}

export function getSbtiProgress(userSeed?: string): SbtiProgress {
  const legacyType = typeof window !== "undefined" ? localStorage.getItem("pulse_my_sbti") : null;
  const storedType = readJson<string | null>("type", null) ?? legacyType;
  return {
    sbtiType: storedType,
    outfitCode: readJson<string | null>("outfit_code", storedType),
    xp: readJson<number>("xp", 0),
    points: readJson<number>("points", 0),
    inviteCode: getOrCreateInviteCode(userSeed),
    redeemedRefs: readJson<string[]>("redeemed_refs", []),
  };
}

export function unlockSbtiReward(code: string, ref?: string | null): {
  progress: SbtiProgress;
  referral?: { inviterBonus: typeof REFERRAL_REWARDS.inviter; inviteeBonus: typeof REFERRAL_REWARDS.invitee };
} {
  writeJson("type", code);
  writeJson("outfit_code", code);
  if (typeof window !== "undefined") {
    localStorage.setItem("pulse_my_sbti", code);
  }

  let referral: { inviterBonus: typeof REFERRAL_REWARDS.inviter; inviteeBonus: typeof REFERRAL_REWARDS.invitee } | undefined;
  if (ref) {
    const redeemed = readJson<string[]>("redeemed_refs", []);
    if (!redeemed.includes(ref)) {
      writeJson("points", readJson<number>("points", 0) + REFERRAL_REWARDS.invitee.points);
      writeJson("xp", readJson<number>("xp", 0) + REFERRAL_REWARDS.invitee.xp);
      writeJson("redeemed_refs", [...redeemed, ref]);
      referral = { inviterBonus: REFERRAL_REWARDS.inviter, inviteeBonus: REFERRAL_REWARDS.invitee };
    }
  }

  return { progress: getSbtiProgress(), referral };
}

export function buildShareUrl(origin: string, inviteCode: string, typeCode?: string) {
  const url = new URL("/sbti", origin);
  url.searchParams.set("ref", inviteCode);
  if (typeCode) url.searchParams.set("from", typeCode);
  return url.toString();
}
