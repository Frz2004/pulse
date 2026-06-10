import type { DimLevel, SbtiMatch, SbtiQuestion, SbtiResult, SbtiType } from "./types";

const LEVEL_NUM: Record<DimLevel, number> = { L: 1, M: 2, H: 3 };

export function calcDimensionScores(
  answers: Record<string, number>,
  questions: SbtiQuestion[],
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const q of questions) {
    if (q.dim == null || answers[q.id] == null) continue;
    scores[q.dim] = (scores[q.dim] || 0) + answers[q.id];
  }
  return scores;
}

export function scoresToLevels(
  scores: Record<string, number>,
  thresholds: { L: [number, number]; M: [number, number]; H: [number, number] },
): Record<string, DimLevel> {
  const levels: Record<string, DimLevel> = {};
  for (const [dim, score] of Object.entries(scores)) {
    if (score <= thresholds.L[1]) levels[dim] = "L";
    else if (score >= thresholds.H[0]) levels[dim] = "H";
    else levels[dim] = "M";
  }
  return levels;
}

function parsePattern(pattern: string): DimLevel[] {
  return pattern.replace(/-/g, "").split("") as DimLevel[];
}

export function matchType(
  userLevels: Record<string, DimLevel>,
  dimOrder: string[],
  pattern: string,
): { distance: number; exact: number; similarity: number } {
  const typeLevels = parsePattern(pattern);
  let distance = 0;
  let exact = 0;

  for (let i = 0; i < dimOrder.length; i++) {
    const userVal = LEVEL_NUM[userLevels[dimOrder[i]]] ?? 2;
    const typeVal = LEVEL_NUM[typeLevels[i]] ?? 2;
    const diff = Math.abs(userVal - typeVal);
    distance += diff;
    if (diff === 0) exact++;
  }

  return { distance, exact, similarity: Math.max(0, Math.round((1 - distance / 30) * 100)) };
}

export function determineResult(
  userLevels: Record<string, DimLevel>,
  dimOrder: string[],
  standardTypes: SbtiType[],
  specialTypes: SbtiType[],
  options: { isDrunk?: boolean } = {},
): Omit<SbtiResult, "userLevels"> {
  const rankings: SbtiMatch[] = standardTypes
    .filter((t) => t.pattern)
    .map((type) => ({ ...type, ...matchType(userLevels, dimOrder, type.pattern!) }))
    .sort(
      (a, b) => a.distance - b.distance || b.exact - a.exact || b.similarity - a.similarity,
    );

  const best = rankings[0];
  const drunk = specialTypes.find((t) => t.code === "DRUNK");
  const hhhh = specialTypes.find((t) => t.code === "HHHH");

  if (options.isDrunk && drunk) {
    return {
      primary: { ...drunk, distance: best.distance, exact: best.exact, similarity: best.similarity },
      secondary: best,
      rankings,
      mode: "drunk",
    };
  }

  if (best.similarity < 60 && hhhh) {
    return {
      primary: { ...hhhh, distance: best.distance, exact: best.exact, similarity: best.similarity },
      secondary: best,
      rankings,
      mode: "fallback",
    };
  }

  return { primary: best, secondary: rankings[1] ?? null, rankings, mode: "normal" };
}

export function scoreSbti(
  answers: Record<string, number>,
  mainQuestions: SbtiQuestion[],
  dimOrder: string[],
  standardTypes: SbtiType[],
  specialTypes: SbtiType[],
  isDrunk: boolean,
  thresholds: { L: [number, number]; M: [number, number]; H: [number, number] },
): SbtiResult {
  const scores = calcDimensionScores(answers, mainQuestions);
  const userLevels = scoresToLevels(scores, thresholds);
  return {
    userLevels,
    ...determineResult(userLevels, dimOrder, standardTypes, specialTypes, { isDrunk }),
  };
}
