"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { aiShortcuts } from "@/lib/ai/presets";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function AiWidget() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "TENKU_CLOUD AIです。期限が近いタスクや不足項目を確認できます。" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async (prompt?: string) => {
    const text = prompt ?? input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  };

  return (
    <div className="fixed right-4 bottom-4 z-30 w-[320px]">
      <div className="glass-card shadow-glow">
        <button
          className="w-full flex items-center justify-between px-3 py-2 border-b border-border"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} className="text-brand-amber" />
            AIアシスタント
          </div>
          <span className="text-xs text-muted">{open ? "閉じる" : "開く"}</span>
        </button>
        {open && (
          <div className="p-3 space-y-3">
            <div className="h-56 overflow-y-auto space-y-2 pr-1">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-xs leading-relaxed px-3 py-2 rounded-lg border ${msg.role === "assistant" ? "border-brand-blue/40 bg-brand-blue/5" : "border-border bg-surface"}`}
                >
                  <p className="text-[10px] uppercase tracking-wide text-muted mb-1">{msg.role}</p>
                  {msg.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {aiShortcuts.map((shortcut) => (
                <button
                  key={shortcut.title}
                  onClick={() => handleSend(shortcut.prompt)}
                  className="text-[11px] px-2 py-1 border border-border rounded bg-surface/70 hover:border-brand-blue"
                >
                  {shortcut.title}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例: 次にやることは？"
              />
              <button onClick={() => handleSend()} className="p-2 rounded-lg border border-border hover:border-brand-blue">
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-muted">
              ルールベースのモック応答です。OpenAI API へ差し替え可能 (/api/ai/chat)。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
