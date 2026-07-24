import { skills } from "@/lib/profile";

export function Skills() {
  return (
    <section id="skills" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }} className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-16 lg:gap-24">
        <div className="scroll-reveal">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-6">
            Technical Craft
          </h2>
          <h3 className="font-serif text-3xl md:text-4xl font-medium leading-tight max-w-[22ch] text-page-fg mb-6">
            A taxonomy of technical craft developed over seven years.
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-[48ch] text-pretty font-serif text-lg leading-relaxed">
            The convergence of scalable enterprise Java, intelligent Python pipelines, and high-performance C++ systems.
            cognitive capabilities of modern LLMs.
          </p>
        </div>
        <div className="space-y-8">
          {skills.map((group) => (
            <div key={group.category} className="scroll-reveal">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-white dark:bg-card text-zinc-700 dark:text-zinc-300 text-sm rounded-md ring-1 ring-black/5 dark:ring-white/10 hover:ring-accent/40 dark:hover:ring-accent/40 hover:text-page-fg dark:hover:text-page-fg transition-all"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
