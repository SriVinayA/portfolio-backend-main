import { experience } from "@/lib/profile";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Trajectory() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 350; // Roughly the width of one card + gap
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="experience" className="bg-zinc-100/60 dark:bg-white/5 py-24 border-y border-zinc-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Professional Trajectory
          </h2>
          <div className="flex items-center gap-6">
            <span className="font-serif italic text-zinc-400 text-sm hidden sm:inline">
              Five companies. One craft.
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div ref={containerRef} className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar scroller-x items-center -mx-6 px-6">
            {experience.map((job, i) => (
              <article
                key={job.company}
                data-index={i}
                className="scroll-reveal shrink-0 w-80 md:w-96 snap-start"
              >
                <div className="trajectory-card h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="trajectory-card-label text-xs font-medium transition-colors duration-300"
                    >
                      {job.period}
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-xs text-zinc-500">{job.location}</span>
                  </div>
                  <div className="p-6 bg-white dark:bg-card rounded-2xl ring-1 ring-black/5 dark:ring-white/10 h-[340px] flex flex-col">
                    <h3 className="font-serif text-2xl font-medium mb-1 text-page-fg">{job.company}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{job.role}</p>
                  <ul className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2 flex-1 overflow-hidden">
                    {job.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="text-accent shrink-0 mt-1.5 size-1 rounded-full bg-accent" />
                        <span className="line-clamp-2">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-100 dark:border-white/10">
                    {job.stack.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 text-[11px] rounded ring-1 ring-black/5 dark:ring-white/10"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Scroll Affordance Hint */}
          <div className="indicator-right pointer-events-none absolute right-0 top-0 bottom-8 w-24 sm:w-48 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent" />
        </div>
      </div>
    </section>
  );
}
