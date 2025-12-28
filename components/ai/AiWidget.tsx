"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Clock3 } from "lucide-react";
import { aiShortcuts, tasks } from "@/lib/mockData";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AiWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "TENKU AIです。期限接近タスクや不足項目を提示します。",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const reminders = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "done")
        .slice(0, 3)
        .map((t) => `・${t.title} / 期限: ${t.dueDate} / 重要度: ${t.severity}`)
        .join("\n"),
    []
  );

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: prompt };
    setHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { id: `a-${Date.now()}`, role: "assistant", content: data.reply };
      setHistory((prev) => [...prev, aiMsg]);
    } catch (e) {
      const fallback: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: `内部AI応答（モック）:\n${reminders}`,
      };
      setHistory((prev) => [...prev, fallback]);
    }
    setLoading(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[360px] glass-panel border border-neon-cyan/40 shadow-neon">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="text-neon-cyan" size={18} />
              <div>
                <p className="text-sm font-semibold text-white">TENKU AI</p>
                <p className="text-[11px] text-slate-400">期限・不足項目を即時提示（モック）</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3 px-4 py-3 scrollbar-thin">
            {history.map((m) => (
              <div key={m.id} className={`text-sm leading-relaxed ${m.role === "assistant" ? "text-neon-cyan" : "text-slate-200"}`}>
                <p className="font-semibold flex items-center gap-2 text-xs text-slate-400">
                  {m.role === "assistant" ? "AI" : "You"}
                  <Clock3 size={12} className="text-slate-500" />
                </p>
                <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              </div>
            ))}
          </div>

          <div className="px-3 pb-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {aiShortcuts.map((s) => (
                <button
                  key={s.title}
                  onClick={() => sendMessage(s.prompt)}
                  className="text-[11px] px-2 py-2 rounded-lg border border-neon-cyan/40 text-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan/10"
                >
                  {s.title}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="不足項目や次アクションを質問"
                className="flex-1 rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 focus:border-neon-cyan/80 focus:outline-none text-sm"
              />
              <button type="submit" className="button-primary px-3 py-2 flex items-center gap-1" disabled={loading}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-neon-green/70 to-neon-cyan/70 text-slate-900 font-semibold shadow-neon"
        >
          <MessageCircle size={18} />
          AIアシスタント
        </button>
      )}
    </div>
  );
}
