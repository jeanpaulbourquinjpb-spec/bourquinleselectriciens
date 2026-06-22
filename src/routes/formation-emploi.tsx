import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/formation-emploi")({
  beforeLoad: () => {
    throw redirect({ to: "/carrieres", statusCode: 301 });
  },
});
