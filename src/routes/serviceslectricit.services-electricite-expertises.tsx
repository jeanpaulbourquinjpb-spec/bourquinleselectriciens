import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-expertises",
)({
  beforeLoad: () => {
    throw redirect({ to: "/etude-conseil-controle", statusCode: 301 });
  },
});
