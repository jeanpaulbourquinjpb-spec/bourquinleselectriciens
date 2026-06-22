import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/serviceslectricit/services-electricite-audiovisuel",
)({
  beforeLoad: () => {
    throw redirect({ to: "/telecoms", statusCode: 301 });
  },
});
