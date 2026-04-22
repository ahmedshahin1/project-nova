import { useApp } from "@/contexts/AppContext";

export function ClientsSlider() {
  const { t } = useApp();
  const items = [...t.clients.items, ...t.clients.items];

  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {t.clients.title}
        </p>
        <div className="mask-fade-edges overflow-hidden">
          <div className="flex w-max animate-slide-x gap-4">
            {items.map((label, i) => (
              <div
                key={`${label}-${i}`}
                className="glass flex h-16 min-w-[200px] items-center justify-center rounded-2xl px-8"
              >
                <span className="font-display text-base font-semibold tracking-tight text-foreground/80">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
