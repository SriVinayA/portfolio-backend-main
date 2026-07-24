import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Trajectory } from "@/components/portfolio/Trajectory";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Strengths } from "@/components/portfolio/Strengths";
import { Footer } from "@/components/portfolio/Footer";
import { ChatCommandPalette } from "@/components/portfolio/ChatCommandPalette";
import { FloatingChatButton } from "@/components/portfolio/FloatingChatButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setChatOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-page-bg text-page-fg">
      <Nav onOpenChat={() => setChatOpen(true)} />
      <main>
        <Hero onOpenChat={() => setChatOpen(true)} />
        <Trajectory />
        <Skills />
        <Projects />
        <Strengths />
      </main>
      <Footer />
      <ChatCommandPalette open={chatOpen} onClose={() => setChatOpen(false)} />
      <FloatingChatButton onOpen={() => setChatOpen(true)} />
    </div>
  );
}
