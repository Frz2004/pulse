import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Heart, X, Star, Sparkles, MapPin, Undo2, Briefcase, GraduationCap, MessageCircle, RotateCcw } from "lucide-react";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";
import profile5 from "@/assets/profile-5.jpg";
import { track, Events } from "@/lib/analytics";
import { listDiscoverCandidates } from "@/lib/profile.functions";
import { startConversation } from "@/lib/chat.functions";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "发现 · Pulse" },
      { name: "description", content: "在 Pulse 上滑动卡片，遇见同频的人。" },
      { property: "og:title", content: "发现 · Pulse" },
      { property: "og:description", content: "滑动卡片，遇见同频的人。" },
    ],
  }),
  component: DiscoverPage,
});

type Profile = {
  id: number;
  name: string;
  age: number;
  city: string;
  distance: string;
  bio: string;
  tags: string[];
  gradient: string;
  match: number;
  photo: string;
  photos: string[];
  school?: string;
  job?: string;
  sbtiType?: string;
  sbtiTitle: string;
  interestScore: number;
  personalityScore: number;
  activityScore: number;
  distanceScore: number;
  completionScore: number;
  likedMe: boolean;
  userId?: string;
};

const PROFILES: Profile[] = [
  {
    id: 1, name: "苏雨桐", age: 24, city: "上海 · 静安",
    distance: "1.2 km",
    bio: "喜欢去 livehouse 听独立乐队，周末沿着苏州河散步，找一个能一起赖在沙发上看老电影的人。",
    tags: ["独立音乐", "电影", "City Walk", "猫"],
    gradient: "from-[#ff8a7a] via-[#ff5a6e] to-[#7a4bff]",
    match: 96,
    photo: profile1,
    photos: [profile1, profile2, profile3],
    school: "复旦大学",
    job: "品牌策划",
    sbtiType: "ENFP",
    sbtiTitle: "快乐气氛组",
    interestScore: 92,
    personalityScore: 90,
    activityScore: 90,
    distanceScore: 88,
    completionScore: 96,
    likedMe: true,
  },
  {
    id: 2, name: "陈一然", age: 27, city: "北京 · 朝阳",
    distance: "3.8 km",
    bio: "前端工程师 / 业余冲浪选手。最近在学陶艺,周末常常往海边跑。想找一个能一起做傻事的伙伴。",
    tags: ["冲浪", "陶艺", "代码", "旅行"],
    gradient: "from-[#5eead4] via-[#38bdf8] to-[#6366f1]",
    match: 92,
    photo: profile2,
    photos: [profile2, profile4, profile1],
    school: "清华大学",
    job: "前端工程师",
    sbtiType: "INTJ",
    sbtiTitle: "冷面规划师",
    interestScore: 88,
    personalityScore: 84,
    activityScore: 84,
    distanceScore: 80,
    completionScore: 92,
    likedMe: false,
  },
  {
    id: 3, name: "Luna 林", age: 23, city: "成都 · 锦江",
    distance: "0.6 km",
    bio: "插画师,养了一只叫年糕的橘猫。喜欢小酒馆、爵士乐和一切毛茸茸的东西。",
    tags: ["插画", "爵士", "猫奴", "小酒馆"],
    gradient: "from-[#fde68a] via-[#fb923c] to-[#ef4444]",
    match: 89,
    photo: profile3,
    photos: [profile3, profile5, profile2],
    school: "四川美术学院",
    job: "插画师",
    sbtiType: "ISFP",
    sbtiTitle: "感性收藏家",
    interestScore: 86,
    personalityScore: 78,
    activityScore: 78,
    distanceScore: 96,
    completionScore: 90,
    likedMe: true,
  },
  {
    id: 4, name: "周野", age: 29, city: "杭州 · 西湖",
    distance: "5.1 km",
    bio: "户外向导,带过 200+ 人去爬雪山。简介里写不下我去过的地方,但写得下我想和谁一起去。",
    tags: ["登山", "摄影", "露营", "滑雪"],
    gradient: "from-[#a7f3d0] via-[#34d399] to-[#0f766e]",
    match: 87,
    photo: profile4,
    photos: [profile4, profile1, profile5, profile3],
    school: "浙江大学",
    job: "户外向导",
    sbtiType: "ESTP",
    sbtiTitle: "行动派冒险家",
    interestScore: 82,
    personalityScore: 82,
    activityScore: 91,
    distanceScore: 70,
    completionScore: 88,
    likedMe: false,
  },
  {
    id: 5, name: "夏季限定", age: 25, city: "广州 · 天河",
    distance: "2.4 km",
    bio: "广告策划,白天写 brief,晚上写诗。最近在练习不那么用力地生活。",
    tags: ["写作", "诗歌", "美食", "瑜伽"],
    gradient: "from-[#fbcfe8] via-[#f472b6] to-[#7c3aed]",
    match: 84,
    photo: profile5,
    photos: [profile5, profile3, profile4],
    school: "中山大学",
    job: "广告策划",
    sbtiType: "INFP",
    sbtiTitle: "月亮代言人",
    interestScore: 84,
    personalityScore: 76,
    activityScore: 76,
    distanceScore: 86,
    completionScore: 86,
    likedMe: false,
  },
];

function normalizeSbti(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim().toUpperCase();
  return s.length >= 4 ? s.slice(0, 4) : null;
}

function sbtiCompatScore(me: string | null, other: string | null): number {
  // no penalty when missing
  if (!me || !other) return 60;
  if (me === other) return 92;
  let score = 60;
  if (me[0] === other[0]) score += 12;
  if (me[1] === other[1]) score += 8;
  if (me[2] === other[2]) score += 10;
  if (me[3] === other[3]) score += 10;
  return Math.max(0, Math.min(100, score));
}

function calcMatchScore(profile: Profile, mySbti: string | null): number {
  const personalityScore = profile.personalityScore || sbtiCompatScore(mySbti, normalizeSbti(profile.sbtiType));
  const total =
    0.2 * profile.interestScore +
    0.2 * personalityScore +
    0.15 * profile.activityScore +
    0.35 * profile.distanceScore +
    0.1 * profile.completionScore;
  return Math.round(total);
}

type SwipeRecord = {
  id: number;
  dir: "left" | "right" | "up";
  at: number;
};

function readSwipeRecords(): SwipeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("pulse_match_swipes");
    return raw ? (JSON.parse(raw) as SwipeRecord[]) : [];
  } catch {
    return [];
  }
}

function writeSwipeRecord(record: SwipeRecord) {
  if (typeof window === "undefined") return;
  const records = readSwipeRecords().filter((r) => r.id !== record.id);
  localStorage.setItem("pulse_match_swipes", JSON.stringify([...records, record].slice(-200)));
}

function shouldRecommend(profile: Profile, records: SwipeRecord[]) {
  const record = records.find((r) => r.id === profile.id);
  if (!record) return true;
  const ageDays = (Date.now() - record.at) / 86400000;
  if (record.dir === "left") return ageDays >= 30;
  if (record.dir === "right" || record.dir === "up") return ageDays >= 7;
  return true;
}

function ensurePhotoRange(photos: string[], fallback: string) {
  const unique = [...new Set([...(photos.length ? photos : [fallback]), fallback])];
  const seeds = [profile1, profile2, profile3, profile4, profile5];
  for (const seed of seeds) {
    if (unique.length >= 2) break;
    unique.push(seed);
  }
  return unique.slice(0, 8);
}

function DiscoverPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<Array<{ id: number; dir: "left" | "right" | "up" }>>([]);
  const [lastAction, setLastAction] = useState<"like" | "nope" | "super" | null>(null);
  const [matched, setMatched] = useState<Profile | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [openingChat, setOpeningChat] = useState(false);
  const [superLikeUsed, setSuperLikeUsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const today = new Date().toDateString();
    return localStorage.getItem("pulse_super_like_day") === today;
  });

  const fetchCandidates = useServerFn(listDiscoverCandidates);
  const startConvFn = useServerFn(startConversation);
  const { data } = useQuery({
    queryKey: ["discover-candidates"],
    queryFn: () => fetchCandidates(),
  });

  const rankedProfiles = useMemo(() => {
    const meSbti = normalizeSbti((data?.me as any)?.sbti_type ?? null);
    const rows = (data?.candidates as Array<Record<string, any>> | undefined) ?? [];

    const records = readSwipeRecords();
    const mapped: Profile[] = rows
      .map((r, i) => {
        const sourcePhotos = Array.isArray(r.photos) ? (r.photos as string[]) : [];
        const seed = PROFILES[i % PROFILES.length];
        const photo = sourcePhotos[(typeof r.main_idx === "number" ? r.main_idx : 0)] || sourcePhotos[0] || seed.photo;
        const photos = ensurePhotoRange(sourcePhotos, photo);
        const interests = Array.isArray(r.interests) && r.interests.length ? (r.interests as string[]).slice(0, 6) : seed.tags;
        const interestScore = Math.min(100, 58 + interests.length * 7 + (i % 5));
        const personalityScore = sbtiCompatScore(meSbti, normalizeSbti((r.sbti_type as string) || seed.sbtiType));
        const activityScore = 72 + (i % 23);
        const distanceScore = Math.max(45, 96 - (i % 8) * 6);
        const completionScore = Math.min(100, 62 + photos.length * 5 + interests.length * 3 + ((r.signature || r.intro) ? 12 : 0));
        const seedGradient = seed.gradient;

        const p: Profile = {
          id: i + 1,
          name: (r.nickname as string) || "Pulse 用户",
          age: 22 + (i % 8),
          city: (r.city as string) || "同城",
          distance: `${(0.8 + (i % 7) * 0.7).toFixed(1)} km`,
          bio: (r.signature as string) || (r.intro as string) || "这个人很神秘，还没写自我介绍。",
          tags: interests,
          gradient: seedGradient,
          match: 0,
          photo,
          photos,
          school: (r.school as string) || seed.school,
          job: (r.job as string) || (r.occupation as string) || seed.job,
          sbtiType: (r.sbti_type as string) || seed.sbtiType,
          sbtiTitle: seed.sbtiTitle,
          interestScore,
          personalityScore,
          activityScore,
          distanceScore,
          completionScore,
          likedMe: i % 4 === 0,
          userId: typeof r.id === "string" ? r.id : undefined,
        };
        return { ...p, match: calcMatchScore(p, meSbti) };
      })
      .filter((p) => shouldRecommend(p, records))
      .sort((a, b) => b.match - a.match);

    if (mapped.length > 0) return mapped;

    const fallbackSbti = normalizeSbti(typeof window !== "undefined" ? localStorage.getItem("pulse_my_sbti") : null);
    const filtered = [...PROFILES]
      .map((p) => ({ ...p, photos: ensurePhotoRange(p.photos, p.photo), match: calcMatchScore(p, fallbackSbti) }))
      .filter((p) => shouldRecommend(p, records))
      .sort((a, b) => b.match - a.match);
    return filtered.length ? filtered : [...PROFILES].map((p) => ({ ...p, photos: ensurePhotoRange(p.photos, p.photo), match: calcMatchScore(p, fallbackSbti) }));
  }, [data]);

  const visibleProfiles = rankedProfiles.filter((p) => !hiddenIds.includes(p.id));
  const safeProfiles = visibleProfiles.length ? visibleProfiles : rankedProfiles;
  const current = safeProfiles[index % safeProfiles.length];
  const next = safeProfiles[(index + 1) % safeProfiles.length];
  const after = safeProfiles[(index + 2) % safeProfiles.length];

  const swipe = (dir: "left" | "right" | "up") => {
    if (dir === "up" && superLikeUsed) {
      setLastAction(null);
      return;
    }

    track(Events.MatchSwipe, { direction: dir, profile_id: current.id });
    writeSwipeRecord({ id: current.id, dir, at: Date.now() });
    setHiddenIds((ids) => (ids.includes(current.id) ? ids : [...ids, current.id]));
    setHistory((h) => [...h, { id: current.id, dir }]);
    setLastAction(dir === "right" ? "like" : dir === "left" ? "nope" : "super");

    if (dir === "up") {
      const today = new Date().toDateString();
      localStorage.setItem("pulse_super_like_day", today);
      setSuperLikeUsed(true);
    }

    if ((dir === "right" || dir === "up") && current.likedMe) {
      const matchedProfile = current;
      window.setTimeout(() => setMatched(matchedProfile), 600);
    }
    setIndex((i) => i + 1);
    window.setTimeout(() => setLastAction(null), 700);
  };

  const undo = () => {
    if (!history.length) return;
    setHistory((h) => h.slice(0, -1));
    setIndex((i) => Math.max(0, i - 1));
  };

  const openMatchedChat = async () => {
    if (!matched || openingChat) return;
    setOpeningChat(true);
    try {
      if (matched.userId) {
        const conv = await startConvFn({ data: { partnerId: matched.userId, source: "match" } });
        navigate({ to: "/chat", search: { conv: conv.id, name: matched.name, from: "match" } });
        return;
      }

      const mockConvId = `match-${matched.id}-${Date.now()}`;
      const item = {
        id: mockConvId,
        partnerName: matched.name,
        partnerAvatar: matched.photo,
        partnerGradient: matched.gradient,
        partnerCity: matched.city,
        source: "match",
        lastMessage: "你们互相喜欢了，快发送第一条消息吧",
        lastMessageAt: new Date().toISOString(),
        messages: [
          { id: `sys-${Date.now()}`, from: "system", text: "你们互相喜欢，成功匹配", time: new Date().toISOString() },
        ],
      };
      const raw = localStorage.getItem("pulse_mock_conversations");
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem("pulse_mock_conversations", JSON.stringify([item, ...list.filter((c: any) => c.id !== mockConvId)].slice(0, 50)));
      navigate({ to: "/chat", search: { conv: mockConvId, name: matched.name, avatar: matched.gradient, from: "match", city: matched.city } });
    } catch {
      navigate({ to: "/chat", search: { name: matched.name, avatar: matched.gradient, from: "match", city: matched.city } });
    } finally {
      setOpeningChat(false);
    }
  };

  return (
    <div className="mobile-page bg-background bg-grid text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--coral)_25%,transparent),transparent)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-[430px] flex-col items-center px-4 pb-8 pt-5">

        {/* Card stack */}
        <div className="relative h-[min(64dvh,560px)] min-h-[470px] w-full">
          {/* back-2 */}
          <StaticCard profile={after} offset={2} />
          {/* back-1 */}
          <StaticCard profile={next} offset={1} />
          {/* front */}
          <AnimatePresence mode="popLayout">
            <SwipeCard key={current.id + "-" + index} profile={current} onSwipe={swipe} />
          </AnimatePresence>

          {/* action flash */}
          <AnimatePresence>
            {lastAction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-0 grid place-items-center"
              >
                <div className={
                  "rounded-full px-6 py-3 text-lg font-bold backdrop-blur " +
                  (lastAction === "like"
                    ? "bg-mint/20 text-mint border border-mint/40"
                    : lastAction === "super"
                    ? "bg-sun/20 text-sun border border-sun/40"
                    : "bg-destructive/20 text-destructive border border-destructive/40")
                }>
                  {lastAction === "like" ? "LIKE" : lastAction === "super" ? "SUPER" : "NOPE"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action bar */}
        <div className="mt-5 flex items-center gap-3">
          <ActionBtn label="撤回" onClick={undo} className="h-12 w-12 border-border bg-surface/80 text-muted-foreground hover:text-foreground backdrop-blur-xl">
            <Undo2 className="h-5 w-5" />
          </ActionBtn>
          <ActionBtn label="跳过" onClick={() => swipe("left")} className="h-15 w-15 border-destructive/40 bg-surface/80 text-destructive hover:bg-destructive/10 backdrop-blur-xl">
            <X className="h-7 w-7" />
          </ActionBtn>
          <ActionBtn label={superLikeUsed ? "今日超级喜欢已用" : "超级喜欢"} onClick={() => swipe("up")} className={`h-13 w-13 border-sun/40 bg-surface/80 text-sun hover:bg-sun/10 backdrop-blur-xl ${superLikeUsed ? "opacity-45" : ""}`}>
            <Star className="h-6 w-6" />
          </ActionBtn>
          <ActionBtn label="喜欢" onClick={() => swipe("right")} className="h-15 w-15 border-mint/40 bg-gradient-to-br from-mint/20 to-coral/20 text-coral hover:from-mint/30 hover:to-coral/30 backdrop-blur-xl">
            <Heart className="h-7 w-7 fill-current" />
          </ActionBtn>
        </div>

      </main>

      <BottomNav active="community" />

      <AnimatePresence>
        {matched && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 18 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-coral/40 bg-surface p-6 text-center shadow-2xl"
            >
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${matched.gradient} opacity-50`} />
              <div className="relative">
                <div className="text-xs uppercase tracking-[0.3em] text-coral">It's a Match</div>
                <h2 className="mt-2 font-display text-3xl font-semibold">匹配成功</h2>
                <p className="mt-1 text-sm text-muted-foreground">你们互相喜欢了 · 点击下方按钮开启聊天</p>

                <div className="relative mx-auto mt-6 flex items-center justify-center">
                  <div className="grid h-24 w-24 -mr-4 place-items-center rounded-full border-4 border-background bg-gradient-to-br from-coral to-sun font-display text-2xl text-background shadow-lg">我</div>
                  <div className={`grid h-24 w-24 -ml-4 place-items-center rounded-full border-4 border-background bg-gradient-to-br ${matched.gradient} font-display text-2xl text-background shadow-lg`}>
                    {matched.name.slice(0, 1)}
                  </div>
                  <motion.div
                    className="absolute grid h-10 w-10 place-items-center rounded-full bg-coral text-background shadow-xl"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </motion.div>
                </div>

                <button
                  type="button"
                  onClick={openMatchedChat}
                  disabled={openingChat}
                  className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-coral to-sun px-4 py-3 text-sm font-semibold text-background shadow-lg disabled:opacity-60"
                >
                  <MessageCircle className="h-4 w-4" /> {openingChat ? "正在开启聊天…" : "发送第一条消息"}
                </button>
                <button onClick={() => setMatched(null)} className="mt-3 w-full text-xs text-muted-foreground">继续滑卡</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StaticCard({ profile, offset }: { profile: Profile; offset: number }) {
  const scale = 1 - offset * 0.05;
  const y = offset * 14;
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
      style={{ transform: `translateY(${y}px) scale(${scale})`, opacity: 1 - offset * 0.25, zIndex: 10 - offset }}
    >
      <img src={profile.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function SwipeCard({ profile, onSwipe }: { profile: Profile; onSwipe: (d: "left" | "right" | "up") => void }) {
  const [flipped, setFlipped] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const nopeOpacity = useTransform(x, [-160, -40], [1, 0]);
  const superOpacity = useTransform(y, [-160, -40], [1, 0]);

  const handleEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y < -120 || velocity.y < -600) return onSwipe("up");
    if (offset.x > 140 || velocity.x > 600) return onSwipe("right");
    if (offset.x < -140 || velocity.x < -600) return onSwipe("left");
  };

  const photos = profile.photos.length ? profile.photos : [profile.photo];
  const currentPhoto = photos[photoIndex % photos.length];

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((i) => (i + 1) % photos.length);
  };

  const viewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(true);
  };

  return (
    <motion.div
      className="absolute inset-0 z-20 cursor-grab overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl active:cursor-grabbing"
      style={{ x, y, rotate }}
      drag
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleEnd}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
        y: y.get() < 0 ? -600 : 0,
        opacity: 0,
        transition: { duration: 0.35 },
      }}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="relative h-full w-full" onClick={() => setFlipped((v) => !v)}>
        <img src={currentPhoto} alt={profile.name} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

        <div className="absolute left-4 right-4 top-3 z-10 flex gap-1">
          {photos.map((photo, i) => (
            <div key={`${photo}-${i}`} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <div className={`h-full rounded-full bg-white transition-all ${i === photoIndex ? "w-full" : "w-0"}`} />
            </div>
          ))}
        </div>

        <button type="button" onClick={nextPhoto} className="absolute inset-y-14 right-0 z-10 w-1/2" aria-label="切换照片" />
        <button type="button" onClick={viewProfile} className="absolute left-5 top-14 z-20 grid size-12 place-items-center overflow-hidden rounded-full border-2 border-white/70 bg-black/20 backdrop-blur" aria-label="查看完整资料">
          <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
        </button>

        {/* Top badges */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <div className="flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-sun" />
            匹配度 {profile.match}%
          </div>
          <div className="flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur">
            <MapPin className="h-3.5 w-3.5" />
            {profile.distance}
          </div>
        </div>

        {/* Swipe labels */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute left-6 top-16 rotate-[-12deg] rounded-xl border-4 border-mint bg-mint/20 px-4 py-2 text-2xl font-extrabold text-mint backdrop-blur"
        >
          LIKE
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute right-6 top-16 rotate-[12deg] rounded-xl border-4 border-destructive bg-destructive/20 px-4 py-2 text-2xl font-extrabold text-destructive backdrop-blur"
        >
          NOPE
        </motion.div>
        <motion.div
          style={{ opacity: superOpacity }}
          className="absolute left-1/2 top-10 -translate-x-1/2 rounded-xl border-4 border-sun bg-sun/20 px-4 py-2 text-2xl font-extrabold text-sun backdrop-blur"
        >
          SUPER
        </motion.div>

        {/* Info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 pt-16">
          <div className="flex items-baseline gap-2 text-white">
            <h2 className="font-display text-3xl font-semibold tracking-tight">{profile.name}</h2>
            <span className="text-2xl font-light opacity-90">{profile.age}</span>
            <span className="ml-auto text-xs opacity-70">{profile.city}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/80">
            {profile.school && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur"><GraduationCap className="size-3" />{profile.school}</span>
            )}
            {profile.job && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur"><Briefcase className="size-3" />{profile.job}</span>
            )}
            {profile.sbtiType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sun/20 px-2 py-1 text-sun backdrop-blur">{profile.sbtiType} · {profile.sbtiTitle}</span>
            )}
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/85">{profile.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] text-white backdrop-blur">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {flipped && (
            <motion.div
              className="absolute inset-0 z-30 overflow-y-auto rounded-3xl border border-white/10 bg-background/95 p-5 text-foreground backdrop-blur-xl"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <img src={profile.photo} alt={profile.name} className="size-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl font-bold">{profile.name}, {profile.age}</p>
                  <p className="text-xs text-muted-foreground">{profile.city} · {profile.distance}</p>
                </div>
                <button type="button" onClick={() => setFlipped(false)} className="rounded-full border border-border p-2 text-muted-foreground" aria-label="返回卡片">
                  <RotateCcw className="size-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-border bg-surface/50 p-3">
                  <p className="text-muted-foreground">学校 / 职业</p>
                  <p className="mt-1 font-medium">{profile.school || "未填写"} · {profile.job || "自由职业"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface/50 p-3">
                  <p className="text-muted-foreground">SBTI 人格</p>
                  <p className="mt-1 font-medium text-sun">{profile.sbtiType || "未知"} · {profile.sbtiTitle}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-surface/50 p-4">
                <p className="text-xs text-muted-foreground">个人签名</p>
                <p className="mt-2 text-sm leading-relaxed">{profile.bio}</p>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs text-muted-foreground">展示照片 {photos.length}/8</p>
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo, i) => (
                    <button key={`${photo}-grid-${i}`} type="button" onClick={() => setPhotoIndex(i)} className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
                      <img src={photo} alt={`${profile.name} ${i + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border bg-surface/70 px-2.5 py-1 text-[11px]">#{t}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ActionBtn({
  children, label, onClick, className,
}: { children: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`grid place-items-center rounded-full border shadow-lg tap-scale active:scale-90 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}