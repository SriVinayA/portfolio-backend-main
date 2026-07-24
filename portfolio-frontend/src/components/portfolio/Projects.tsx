import { projects } from "@/lib/profile";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  return (
    <section id="projects" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }} className="bg-zinc-100/60 dark:bg-white/5 py-24 md:py-32 border-y border-zinc-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 scroll-reveal">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-6">
            Featured Builds
          </h2>
          <h3 className="font-serif text-3xl md:text-4xl font-medium leading-tight max-w-[24ch] text-page-fg italic">
            Three things I've built that I care about.
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <a
              key={p.name}
              href={p.link !== "#" ? p.link : undefined}
              target={p.link !== "#" ? "_blank" : undefined}
              rel={p.link !== "#" ? "noopener noreferrer" : undefined}
              className="scroll-reveal relative group bg-white dark:bg-card rounded-2xl ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/20 dark:hover:ring-white/20 overflow-hidden flex flex-col transition-all cursor-pointer"
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
            >
              <div className="card-glow pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />
              <div className="aspect-[16/10] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/10 relative z-0">
                <img
                  src={p.cover}
                  alt={`${p.name} cover`}
                  loading={i === 0 ? undefined : "lazy"}
                  decoding={i === 0 ? undefined : "async"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  width={1024}
                  height={640}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-baseline justify-between mb-2">
                  <h4 className="font-serif text-2xl font-medium text-page-fg">{p.name}</h4>
                  {p.link !== "#" && (
                    <div className="text-zinc-400 group-hover:text-accent transition-colors">
                      <ArrowUpRight className="size-4" strokeWidth={2.25} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mb-4 font-serif">{p.tagline}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5 flex-1">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100 dark:border-white/10">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 text-[11px] rounded ring-1 ring-black/5 dark:ring-white/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
