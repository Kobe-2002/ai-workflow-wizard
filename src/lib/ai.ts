const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assist`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type Msg = { role: "user" | "assistant" | "system"; content: string };

export async function streamAI({
  feature,
  messages,
  input,
  onDelta,
  onDone,
  onError,
}: {
  feature: "email" | "meeting" | "tasks" | "research" | "chat";
  messages?: Msg[];
  input?: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({ feature, messages, input }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return onError("Rate limit reached — try again shortly.");
      if (resp.status === 402) return onError("AI credits exhausted. Add funds to continue.");
      return onError("Failed to reach AI. Please retry.");
    }
    if (!resp.body) return onError("No response stream.");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let done = false;

    while (!done) {
      const { done: rDone, value } = await reader.read();
      if (rDone) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Unknown error");
  }
}
