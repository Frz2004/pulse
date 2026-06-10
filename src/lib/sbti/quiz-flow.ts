import type { SbtiQuestion } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function insertAtRandom<T>(list: T[], item: T | undefined): T[] {
  if (!item) return list;
  const out = [...list];
  out.splice(Math.floor(Math.random() * (out.length + 1)), 0, item);
  return out;
}

function insertAfter<T extends { id: string }>(list: T[], afterId: string, item: T): T[] {
  const idx = list.findIndex((q) => q.id === afterId);
  if (idx < 0) return [...list, item];
  const out = [...list];
  out.splice(idx + 1, 0, item);
  return out;
}

export type DrinkGateConfig = {
  questionId: string;
  triggerValue: number;
  drunkTriggerValue: number;
};

export function buildQuestionQueue(
  main: SbtiQuestion[],
  special: SbtiQuestion[],
  drinkGate: DrinkGateConfig,
): SbtiQuestion[] {
  const drinkGateQ1 = special.find((q) => q.id === drinkGate.questionId);
  return insertAtRandom(shuffle(main), drinkGateQ1);
}

export function nextQueueAfterAnswer(
  queue: SbtiQuestion[],
  question: SbtiQuestion,
  value: number,
  special: SbtiQuestion[],
  drinkGate: DrinkGateConfig,
): { queue: SbtiQuestion[]; isDrunk: boolean } {
  let nextQueue = queue;
  let isDrunk = false;

  if (question.id === drinkGate.questionId && value === drinkGate.triggerValue) {
    const drinkGateQ2 = special.find((q) => q.id === "drink_gate_q2");
    if (drinkGateQ2) nextQueue = insertAfter(nextQueue, question.id, drinkGateQ2);
  }

  if (question.id === "drink_gate_q2" && value === drinkGate.drunkTriggerValue) {
    isDrunk = true;
  }

  return { queue: nextQueue, isDrunk };
}
