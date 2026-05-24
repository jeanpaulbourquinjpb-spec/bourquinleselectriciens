const partners = [
  { name: "AAE", href: "https://www.eev.ch/fr", domain: "eev.ch" },
  { name: "Electrosuisse", href: "https://www.electrosuisse.ch", domain: "electrosuisse.ch" },
  { name: "Tech-Bat", href: "https://www.tech-bat.ch", domain: "tech-bat.ch" },
  { name: "SIG", href: "https://www.sig-ge.ch", domain: "sig-ge.ch" },
  { name: "Swisscom", href: "https://www.swisscom.ch", domain: "swisscom.ch" },
  { name: "Reichle & De-Massari", href: "https://www.rdm.com", domain: "rdm.com" },
  { name: "eco21", href: "https://www.eco21.ch", domain: "eco21.ch" },
];

export function PartnersCarousel() {
  const loop = [...partners, ...partners];
  return (
    <section className="py-20 bg-[color:var(--surface-muted)] overflow-hidden">
      <div className="container-x">
        <p className="eyebrow text-center">Associations et Partenariats</p>
        <h2 className="mt-3 text-3xl md:text-4xl text-center">Ils nous font confiance</h2>
      </div>
      <div className="mt-12 relative">
        <div className="marquee-track flex gap-16 w-max">
          {loop.map((p, i) => (
            <a
              key={`${p.name}-${i}`}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              aria-label={p.name}
              className="shrink-0 h-20 w-40 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-300"
            >
              <img
                src={`https://logo.clearbit.com/${p.domain}`}
                alt={p.name}
                className="max-h-16 max-w-full object-contain"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.replaceWith(Object.assign(document.createElement("span"), {
                    className: "text-sm font-semibold text-[color:var(--foreground)]",
                    textContent: p.name,
                  }));
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
