import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-securite",
)({
  beforeLoad: () => {
    throw redirect({ to: "/securite", statusCode: 301 });
  },
});
