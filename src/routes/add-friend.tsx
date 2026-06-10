import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/add-friend")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
});
