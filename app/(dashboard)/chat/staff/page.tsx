"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, RefreshCw, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "特定技能1号の定期面談は何ヶ月以内に実施すればよいですか？",
  "1号支援計画に必要な項目を教えてください",
  "技能実習修了者が特定活動46号を経て特定技能に移行する手順は？",
  "育成就労制度と技能実習制度の主な違いを教えてください",
  "特定技能外国人が転職する際の手続きを教えてください",
  "在留資格更新申請（EXT）に必要な書類は？",
];

export default function ChatStaffPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const question = text ?? input.trim();
    if (!question || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/chat/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const { reply } = await res.json();
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold">職員向けAIアシスタント</h1>
            <p className="text-xs text-muted">入管法・技能実習・特定技能・育成就労の実務Q&A</p>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="flex items-center gap-1 text-xs text-muted hover:text-white transition px-2 py-1 rounded border border-border">
          <RefreshCw size={12} /> リセット
        </button>
      </div>

      {/* チャット本文 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 text-muted">
              <Bot size={36} className="mb-3 opacity-30" />
              <p className="text-sm">入管・技能実習・特定技能に関する質問をどうぞ</p>
              <p className="text-xs mt-1 opacity-70">Shift+Enterで改行 / Enterで送信</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-2 px-1">よくある質問</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button key={q} onClick={() => send(q)} className="text-left px-3 py-2 rounded-lg border border-border bg-surface/60 text-xs text-muted hover:text-white hover:border-brand-blue transition">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
              msg.role === "user"
                ? "bg-brand-blue text-white rounded-tr-sm"
                : "bg-surface border border-border text-white rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-1">
                <User size={13} className="text-muted" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-brand-teal" />
              <span className="text-xs text-muted">回答を生成中...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div className="shrink-0 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          rows={2}
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface/60 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-blue"
          placeholder="質問を入力してください..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 shrink-0"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
