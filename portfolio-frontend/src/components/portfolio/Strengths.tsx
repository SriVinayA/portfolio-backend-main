import { strengths, education, profile } from "@/lib/profile";

export function Strengths() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 scroll-reveal">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-6">
            Core Strengths
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {strengths.map((s) => (
              <li key={s} className="flex items-baseline gap-3 py-2 border-b border-zinc-200/60 dark:border-white/10">
                <span className="size-1 rounded-full bg-accent shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-[15px]">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="scroll-reveal">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-6">
            Education
          </h2>
          {education.map((e) => (
            <div key={e.degree} className="mb-8">
              <h3 className="font-serif text-xl font-medium text-page-fg mb-1">{e.degree}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{e.detail}</p>
            </div>
          ))}
          <blockquote className="font-serif italic text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-2 border-accent pl-5 mt-8">
            "{profile.quote}"
          </blockquote>
        </div>
      </div>
    </section>
  );
}
