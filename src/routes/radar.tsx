import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/radar")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
