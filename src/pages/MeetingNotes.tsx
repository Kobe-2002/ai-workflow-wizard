import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AIOutput } from "@/components/AIOutput";
import { PageHeader } from "@/components/PageHeader";
import { streamAI } from "@/lib/ai";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText } from "lucide-react";

export default function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!notes.trim()) return toast.error("Paste your meeting notes or transcript first.");
    setLoading(true); setOutput("");
    await streamAI({
      feature: "meeting",
      input: notes,
      onDelta: (c) => setOutput((p) => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { toast.error(m); setLoading(false); },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" desc="Turn raw notes into structured key points, decisions, and action items." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Meeting notes or transcript</Label>
            <Textarea rows={16} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw notes, bullet points, or a meeting transcript here…" />
          </div>
          <Button onClick={run} disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Summarizing</> : <><Sparkles className="h-4 w-4 mr-2" /> Summarize</>}
          </Button>
        </Card>
        <AIOutput content={output} loading={loading} placeholder="Your structured summary will appear here." />
      </div>
    </div>
  );
}
