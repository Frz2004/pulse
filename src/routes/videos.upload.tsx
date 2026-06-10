import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/videos/upload")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
