import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/voice-card")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
