import { Search } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

export function Nav({ onOpenChat }: { onOpenChat: () => void }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <nav className="scroll-header h-20 fixed top-0 w-full z-40 bg-page-bg/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); window.location.reload(); }}
          className="font-serif italic text-xl tracking-tight text-page-fg cursor-pointer"
        >
          &lt; Sri Vinay &gt;
        </a>
        <div className="flex items-center gap-2 sm:gap-8 text-sm font-medium">
          <a href="#experience" className="hidden sm:inline text-zinc-500 dark:text-zinc-400 hover:text-page-fg transition-colors">
            Experience
          </a>
          <a href="#projects" className="hidden sm:inline text-zinc-500 dark:text-zinc-400 hover:text-page-fg transition-colors">
            Projects
          </a>
          <a href="#skills" className="hidden sm:inline text-zinc-500 dark:text-zinc-400 hover:text-page-fg transition-colors">
            Craft
          </a>
          <ThemeToggle />
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 py-2 pr-3 pl-2 rounded-md ring-1 ring-zinc-950/10 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <span className="size-4 shrink-0 bg-white/15 rounded-full flex items-center justify-center">
              <Search className="size-2.5" strokeWidth={3} />
            </span>
            <span className="text-sm">Ask the AI</span>
            <kbd className="ml-2 text-[10px] opacity-60 font-sans tracking-widest">
              {isMac ? "⌘K" : "CTRL K"}
            </kbd>
          </button>
        </div>
      </div>
    </nav>
  );
}
