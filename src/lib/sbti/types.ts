export type DimLevel = "L" | "M" | "H";

export type SbtiQuestion = {
  id: string;
  dim?: string;
  text: string;
  special?: boolean;
  kind?: string;
  options: Array<{ label: string; value: number }>;
};

export type SbtiType = {
  code: string;
  pattern?: string;
  cn: string;
  intro: string;
  desc: string;
  trigger?: string;
  note?: string;
};

export type SbtiMatch = SbtiType & {
  distance: number;
  exact: number;
  similarity: number;
};

export type SbtiResult = {
  primary: SbtiMatch;
  secondary: SbtiMatch | null;
  rankings: SbtiMatch[];
  mode: "normal" | "drunk" | "fallback";
  userLevels: Record<string, DimLevel>;
};
