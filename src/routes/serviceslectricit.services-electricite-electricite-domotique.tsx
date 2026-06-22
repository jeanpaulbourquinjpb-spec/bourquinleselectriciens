import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-electricite-domotique",
)({
  beforeLoad: () => {
    throw redirect({ to: "/domotique", statusCode: 301 });
  },
});
