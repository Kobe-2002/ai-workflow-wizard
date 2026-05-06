import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import { streamAI, Msg } from "@/lib/ai";
import { toast } from "sonner";
import { Send, Loader2, MessageSquare, AlertTriangle, Sparkles } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    setMessages((p) => [...p, { role: "assistant", content: "" }]);
    await streamAI({
      feature: "chat",
      messages: next,
      onDelta: (c) => {
        acc += c;
        setMessages((p) => p.map((m, i) => i === p.length - 1 ? { ...m, content: acc } : m));
      },
      onDone: () => setLoading(false),
      onError: (m) => {
        toast.error(m); setLoading(false);
        setMessages((p) => p.slice(0, -1));
      },
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-9rem)] flex flex-col">
      <PageHeader icon={MessageSquare} title="AI Chatbot" desc="Open conversation with your productivity assistant." />
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow mb-3">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-sm">Ask anything — drafting, planning, summarizing, brainstorming.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {m.role === "assistant" ? (
                  <article className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:mt-3 prose-headings:mb-2">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </article>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
            <Input
              placeholder="Send a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} className="gradient-primary text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <AlertTriangle className="h-3 w-3" /> AI-generated content may require human review.
          </div>
        </div>
      </Card>
    </div>
  );
}
