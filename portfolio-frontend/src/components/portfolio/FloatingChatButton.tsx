import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";


export function FloatingChatButton({ onOpen }: { onOpen: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the button when scrolling past 400px (approx height of the hero content)
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={onOpen}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
      aria-label="Open AI Assistant"
    >
      <MessageCircle className="size-6" />
    </button>
  );
}
