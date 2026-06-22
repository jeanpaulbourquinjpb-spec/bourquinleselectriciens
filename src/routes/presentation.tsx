import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/presentation")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
