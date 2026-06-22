import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-efficience-energetique",
)({
  beforeLoad: () => {
    throw redirect({ to: "/efficience-energetique", statusCode: 301 });
  },
});
