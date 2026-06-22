import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-objets-dintervention",
)({
  beforeLoad: () => {
    throw redirect({ to: "/renovation", statusCode: 301 });
  },
});
