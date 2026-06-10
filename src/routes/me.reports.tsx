import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/me/reports")({
  beforeLoad: () => {
    throw redirect({ to: "/me" });
  },
});
