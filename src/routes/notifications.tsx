import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/notifications")({
  beforeLoad: () => {
    throw redirect({ to: "/messages" });
  },
});
