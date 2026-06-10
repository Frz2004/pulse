import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/venues")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
