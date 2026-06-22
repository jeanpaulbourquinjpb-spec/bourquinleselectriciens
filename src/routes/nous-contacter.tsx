import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/nous-contacter")({
  beforeLoad: () => {
    throw redirect({ to: "/contact", statusCode: 301 });
  },
});
