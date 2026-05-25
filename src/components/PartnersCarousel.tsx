import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPartners, type PartnerDTO } from "@/lib/partners.functions";

export function PartnersCarousel() {
  const list = useServerFn(listPartners);
  const q = useQuery({ queryKey: ["partners"], queryFn: () => list() });
  const partners: PartnerDTO[] = q.data?.partners ?? [];

  if (partners.length === 0) {
    return (
      <section className="py-20 bg-[color:var(--surface-muted)] overflow-hidden">
        <div className="container-x">
          <p className="eyebrow text-center">Associations et Partenariats</p>
          <h2 className="mt-3 text-3xl md:text-4xl text-center">Ils nous font confiance</h2>
        </div>
      </section>
    );
  }

  // Need at least 3 logos for a smooth marquee loop; below that, render
  // them once, centered, with no animation (otherwise a single uploaded
  // logo appears twice because the marquee duplicates its track).
  const animate = partners.length >= 3;
  const items = animate ? [...partners, ...partners] : partners;
  return (
    <section className="py-20 bg-[color:var(--surface-muted)] overflow-hidden">
      <div className="container-x">
        <p className="eyebrow text-center">Associations et Partenariats</p>
        <h2 className="mt-3 text-3xl md:text-4xl text-center">Ils nous font confiance</h2>
      </div>
      <div className="mt-12 relative">
        <div
          className={`flex gap-16 ${animate ? "marquee-track w-max" : "w-full justify-center flex-wrap"}`}
        >
          {items.map((p, i) => {
            const content = p.logo_url ? (
              <img
                src={p.logo_url}
                alt={p.name}
                className="max-h-16 max-w-full object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-sm font-semibold text-[#666666]">{p.name}</span>
            );
            const className =
              "shrink-0 h-20 w-40 flex items-center justify-center opacity-90 hover:opacity-100 transition duration-300";
            return p.url ? (
              <a
                key={`${p.id}-${i}`}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                aria-label={p.name}
                className={className}
              >
                {content}
              </a>
            ) : (
              <div key={`${p.id}-${i}`} aria-label={p.name} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
