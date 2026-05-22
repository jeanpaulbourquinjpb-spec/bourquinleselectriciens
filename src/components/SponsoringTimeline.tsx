import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";

type Item = { text: string };

function parseYear(text: string): number {
  const full = text.match(/(?:19|20)\d{2}/g);
  if (full && full.length) return parseInt(full[full.length - 1], 10);
  const short = [...text.matchAll(/\.(\d{2})(?!\d)/g)];
  if (short.length) return 2000 + parseInt(short[short.length - 1][1], 10);
  return 0;
}

function splitParts(text: string): { title: string; date?: string; location?: string } {
  const parts = text.split("—").map((p) => p.trim());
  if (parts.length >= 3) {
    return { title: parts[0], date: parts[1], location: parts.slice(2).join(" — ") };
  }
  if (parts.length === 2) return { title: parts[0], date: parts[1] };
  return { title: text };
}

export function SponsoringTimeline({ items }: { items: Item[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());

  const enriched = items
    .map((it, i) => ({ ...splitParts(it.text), year: parseYear(it.text), idx: i }))
    .sort((a, b) => b.year - a.year);

  useEffect(() => {
    const els = scrollerRef.current?.querySelectorAll<HTMLElement>("[data-tl-item]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        setVisibleSet((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            const i = Number((e.target as HTMLElement).dataset.index);
            if (e.isIntersecting) next.add(i);
          });
          return next;
        });
      },
      { root: scrollerRef.current, threshold: 0.4 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative mt-12">
      <div className="container-x flex justify-end gap-2 mb-4">
        <button
          aria-label="Précédent"
          onClick={() => scrollBy(-1)}
          className="w-10 h-10 rounded-full border border-[color:var(--line)] bg-white flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Suivant"
          onClick={() => scrollBy(1)}
          className="w-10 h-10 rounded-full border border-[color:var(--line)] bg-white flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="relative overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pb-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="relative flex items-stretch gap-6 px-6 md:px-12 min-w-max">
          {/* Connecting line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[148px] h-px bg-gradient-to-r from-transparent via-[color:var(--brand)]/40 to-transparent"
          />
          {enriched.map((it, i) => {
            const visible = visibleSet.has(i);
            return (
              <article
                key={i}
                data-tl-item
                data-index={i}
                className={[
                  "snap-center shrink-0 w-[280px] md:w-[320px] relative group",
                  "transition-all duration-500 ease-out",
                  visible ? "opacity-100 translate-y-0" : "opacity-40 translate-y-3",
                ].join(" ")}
              >
                {/* Year above the line */}
                <div className="h-[120px] flex items-end justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-brand tracking-tight transition-transform duration-300 group-hover:-translate-y-1">
                    {it.year || "—"}
                  </span>
                </div>

                {/* Dot on the line */}
                <div className="h-[56px] flex items-center justify-center">
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-5 h-5 rounded-full bg-brand/20 animate-ping group-hover:bg-brand/40" />
                    <span className="relative w-3 h-3 rounded-full bg-brand ring-4 ring-[color:var(--surface-muted)] transition-transform duration-300 group-hover:scale-150" />
                  </span>
                </div>

                {/* Card below */}
                <div className="card-soft text-sm h-[180px] flex flex-col gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                  <p className="font-medium text-foreground line-clamp-3">{it.title}</p>
                  <div className="mt-auto space-y-1 text-xs text-[color:var(--muted-foreground)]">
                    {it.date && (
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span className="truncate">{it.date}</span>
                      </p>
                    )}
                    {it.location && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span className="truncate">{it.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
