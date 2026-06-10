import configJson from "./data/config.json";
import dimensionsJson from "./data/dimensions.json";
import questionsJson from "./data/questions.json";
import typesJson from "./data/types.json";
import type { SbtiQuestion, SbtiType } from "./types";

export const sbtiConfig = configJson;
export const sbtiDimensions = dimensionsJson;
export const sbtiQuestions = questionsJson as { main: SbtiQuestion[]; special: SbtiQuestion[] };
export const sbtiStandardTypes = typesJson.standard as SbtiType[];
export const sbtiSpecialTypes = typesJson.special as SbtiType[];
export const sbtiDimOrder = dimensionsJson.order as string[];

export const SBTI_ATTRIBUTION =
  "题库与类型图来自 yondddd/sbti-test（MIT），原创 @蛆肉儿串儿 · 仅供娱乐";
