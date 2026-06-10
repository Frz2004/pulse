import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/verify")({
  beforeLoad: () => {
    throw redirect({ to: "/me" });
  },
});
