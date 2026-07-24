import { useCallback, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Base URL of the Spring Boot chatbot backend.
// Defaults to http://localhost:8080 for local development.
// To point at a deployed backend, set VITE_CHAT_API_URL at build time.
const CHAT_API_BASE =
  ((import.meta.env.VITE_CHAT_API_URL as string | undefined) ?? "http://localhost:8080").replace(/\/$/, "");

const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * Parse a chunk of text from the /api/chat/stream endpoint.
 * Handles both raw text streaming and text/event-stream `data: ...` framing.
 */
function extractDelta(buffer: string): { text: string; rest: string } {
  // If no SSE framing at all, treat the whole chunk as raw text.
  if (!buffer.includes("data:") && !buffer.includes("\n\n")) {
    return { text: buffer, rest: "" };
  }
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  let text = "";
  for (const evt of parts) {
    const lines = evt.split("\n");
    const dataLines: string[] = [];
    for (const line of lines) {
      if (line.startsWith("data:")) {
        // The Spring Boot SSE encoder does not append the optional U+0020 space after 'data:'.
        // Therefore, whatever comes immediately after 'data:' is the exact chunk.
        const payload = line.slice(5);
        dataLines.push(payload);
      }
    }

    if (dataLines.length > 0) {
      const eventData = dataLines.join("\n");
      if (eventData === "[DONE]") continue;

      // Try JSON first; fall back to raw string.
      try {
        const parsed = JSON.parse(eventData);
        if (typeof parsed === "string") text += parsed;
        else if (parsed && typeof parsed.content === "string") text += parsed.content;
        else if (parsed && typeof parsed.delta === "string") text += parsed.delta;
        else text += eventData;
      } catch {
        text += eventData;
      }
    }
  }
  return { text, rest };
}

export function useStreamingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
    const assistantMsg: ChatMessage = { id: uid(), role: "assistant", content: "" };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setError(null);
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${CHAT_API_BASE}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ 
          message: trimmed,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { text, rest } = extractDelta(buffer);
        buffer = rest;
        if (text) {
          // Simulate streaming delay on the frontend
          const chunkSize = 4;
          for (let i = 0; i < text.length; i += chunkSize) {
            if (controller.signal.aborted) break;
            const chunk = text.slice(i, i + chunkSize);
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m)),
            );
            await new Promise((r) => setTimeout(r, 15));
          }
        }
      }

      // Flush any remaining buffered content.
      if (buffer.trim()) {
        const { text } = extractDelta(buffer + "\n\n");
        if (text) {
          const chunkSize = 4;
          for (let i = 0; i < text.length; i += chunkSize) {
            if (controller.signal.aborted) break;
            const chunk = text.slice(i, i + chunkSize);
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m)),
            );
            await new Promise((r) => setTimeout(r, 15));
          }
        }
      }

      setStatus("idle");
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setStatus("idle");
        return;
      }
      const msg = "Sorry, I couldn't reach the API right now. Please try again later.";
      setError(msg);
      setStatus("error");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id && !m.content
            ? {
                ...m,
                content: msg,
              }
            : m,
        ),
      );
    } finally {
      abortRef.current = null;
    }
  }, [messages]);

  return { messages, status, error, sendMessage, stop, reset };
}
