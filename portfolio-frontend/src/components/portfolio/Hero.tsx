import { profile } from "@/lib/profile";
import { ArrowUpRight } from "lucide-react";

export function Hero({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <section id="top" className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 md:pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="parallax-bg-shape absolute top-0 right-[10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="parallax-bg-shape-reverse absolute top-[40%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_theme(colors.emerald.500/40%)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Available for Software engineering roles
        </span>
      </div>

      <div className="max-w-[36ch]">
        {/* <h1 className="font-serif text-5xl sm:text-7xl leading-[0.98] text-balance mb-8 font-medium italic text-page-fg">
          {profile.tagline}
        </h1> */}
        <h1 className="font-serif text-4xl sm:text-5xl leading-[0.98] text-balance mb-8 font-medium italic text-page-fg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[150ms] fill-mode-backwards">
          {profile.tagline}
        </h1>
      </div>
      <div className="max-w-[58ch]">
        <p className="font-serif text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[300ms] fill-mode-backwards">
          I am a{" "}
          {profile.title} with 7+ years of experience architecting enterprise Java systems, plus
          deep work in <em>Python</em> and <em>C++</em> systems programming, alongside LLM orchestration.
        </p>
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[450ms] fill-mode-backwards">
          <button
            onClick={onOpenChat}
            className="group bg-accent text-accent-foreground px-6 py-3 rounded-full font-medium ring-1 ring-black/5 hover:brightness-110 active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            Ask the AI about me
            <ArrowUpRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
          </button>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 py-3 rounded-full font-medium ring-1 ring-zinc-200 dark:ring-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 hover:text-page-fg active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            GitHub
            <ArrowUpRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 py-3 rounded-full font-medium ring-1 ring-zinc-200 dark:ring-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 hover:text-page-fg active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            LinkedIn
            <ArrowUpRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </section>
  );
}