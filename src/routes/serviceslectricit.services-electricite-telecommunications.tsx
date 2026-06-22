import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-telecommunications",
)({
  beforeLoad: () => {
    throw redirect({ to: "/telecoms", statusCode: 301 });
  },
});
