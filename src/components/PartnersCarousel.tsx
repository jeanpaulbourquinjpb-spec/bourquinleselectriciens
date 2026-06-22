import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPartners, type PartnerDTO } from "@/lib/partners.functions";

export function PartnersCarousel() {
  const list = useServerFn(listPartners);
  const q = useQuery({ queryKey: ["partners"], queryFn: () => list() });
  const partners: PartnerDTO[] = q.data?.partners ?? [];

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const animate = partners.length >= 3;
  const items = animate ? [...partners, ...partners] : partners;

  // Auto-scroll (replaces CSS marquee) — pauses on user interaction.
  useEffect(() => {
    if (!animate) return;
    const el = scrollerRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (paused) return;
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) {
        el.scrollLeft = el.scrollLeft - half;
      }
      el.scrollLeft += 1;
    }, 20);
    return () => window.clearInterval(id);
  }, [animate, paused, items.length]);

  const scrollByLogo = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    setPaused(true);
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
    window.setTimeout(() => setPaused(false), 1500);
  };

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

  return (
    <section className="py-20 bg-[color:var(--surface-muted)] overflow-hidden">
      <div className="container-x">
        <p className="eyebrow text-center">Associations et Partenariats</p>
        <h2 className="mt-3 text-3xl md:text-4xl text-center">Ils nous font confiance</h2>
      </div>
      <div className="mt-12 relative group">
        <div
          ref={scrollerRef}
          className={`flex gap-16 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            animate ? "w-full" : "w-full justify-center flex-wrap"
          }`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => {
            setPaused(true);
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            touchStartX.current = null;
            if (start != null) {
              const dx = e.changedTouches[0].clientX - start;
              if (Math.abs(dx) > 50) {
                scrollerRef.current?.scrollBy({
                  left: dx < 0 ? 200 : -200,
                  behavior: "smooth",
                });
              }
            }
            window.setTimeout(() => setPaused(false), 1500);
          }}
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

        {animate && (
          <>
            <button
              type="button"
              onClick={() => scrollByLogo(-1)}
              aria-label="Précédent"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByLogo(1)}
              aria-label="Suivant"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
