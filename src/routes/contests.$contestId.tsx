import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contests/$contestId")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
