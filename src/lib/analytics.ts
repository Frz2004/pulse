import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  if (typeof window === "undefined") return;
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) return;
  posthog.init(key, {
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string) || "https://us.i.posthog.com",
    capture_pageview: false, // 手动控制，配合路由
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: false,
    disable_session_recording: false,
  });
  initialized = true;
}

export function trackPageview(path: string) {
  if (!initialized) return;
  posthog.capture("$pageview", { $current_url: window.location.href, path });
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, props);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.identify(userId, traits);
}

export function resetAnalytics() {
  if (!initialized) return;
  posthog.reset();
}

// 统一事件名约定（snake_case，便于在 PostHog 漏斗 / 留存里筛选）
export const Events = {
  // 账户
  SignUp: "auth_sign_up",
  SignIn: "auth_sign_in",
  SignOut: "auth_sign_out",
  // 核心互动
  PostCreated: "post_created",
  PostLiked: "post_liked",
  CommentCreated: "comment_created",
  ChatMessageSent: "chat_message_sent",
  VideoUploaded: "video_uploaded",
  ProfileViewed: "profile_viewed",
  MatchSwipe: "match_swipe",
  SbtiPromptShow: "sbti_prompt_show",
  SbtiPromptClickFill: "sbti_prompt_click_fill",
  SbtiPromptClickLater: "sbti_prompt_click_later",
  // 变现漏斗
  WalletViewed: "wallet_viewed",
  TopupStarted: "topup_started",
  TopupSucceeded: "topup_succeeded",
  TopupFailed: "topup_failed",
  PaidFeatureUnlocked: "paid_feature_unlocked",
  // 管理员
  AdminActionPerformed: "admin_action_performed",
} as const;