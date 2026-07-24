import { profile } from "@/lib/profile";

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-xs text-zinc-400">© {new Date().getFullYear()} {profile.name}</span>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-accent transition-colors"
        >
          LinkedIn
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-accent transition-colors"
        >
          GitHub
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-accent transition-colors"
        >
          Email
        </a>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent ring-4 ring-accent/10" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Available for hire
        </span>
      </div>
    </footer>
  );
}
