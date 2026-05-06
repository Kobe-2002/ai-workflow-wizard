import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AIOutput } from "@/components/AIOutput";
import { PageHeader } from "@/components/PageHeader";
import { streamAI } from "@/lib/ai";
import { toast } from "sonner";
import { Sparkles, Loader2, Search } from "lucide-react";

export default function Research() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return toast.error("Enter a topic to research.");
    setLoading(true); setOutput("");
    await streamAI({
      feature: "research", input: topic,
      onDelta: (c) => setOutput((p) => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { toast.error(m); setLoading(false); },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Search} title="AI Research Assistant" desc="Get an executive briefing with insights, risks and next steps." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Topic or question</Label>
            <Textarea rows={10} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Competitive landscape for AI note-taking apps in 2025, focused on enterprise" />
          </div>
          <Button onClick={run} disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Researching</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate briefing</>}
          </Button>
        </Card>
        <AIOutput content={output} loading={loading} placeholder="Your research briefing will appear here." />
      </div>
    </div>
  );
}
