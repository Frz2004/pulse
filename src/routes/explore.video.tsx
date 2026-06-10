import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/video")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
