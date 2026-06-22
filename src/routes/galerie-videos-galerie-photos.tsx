import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/galerie-videos-galerie-photos")({
  beforeLoad: () => {
    throw redirect({ to: "/projets", statusCode: 301 });
  },
});
