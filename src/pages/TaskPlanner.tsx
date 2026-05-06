import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AIOutput } from "@/components/AIOutput";
import { PageHeader } from "@/components/PageHeader";
import { streamAI } from "@/lib/ai";
import { toast } from "sonner";
import { Sparkles, Loader2, ListChecks } from "lucide-react";

export default function TaskPlanner() {
  const [tasks, setTasks] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!tasks.trim()) return toast.error("Add at least a few tasks to plan.");
    setLoading(true); setOutput("");
    const prompt = `CONTEXT: ${context || "Standard 8-hour workday."}\nTASKS:\n${tasks}`;
    await streamAI({
      feature: "tasks", input: prompt,
      onDelta: (c) => setOutput((p) => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { toast.error(m); setLoading(false); },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={ListChecks} title="AI Task Planner" desc="Prioritize and time-block your tasks using the Eisenhower matrix." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Your tasks (one per line)</Label>
            <Textarea rows={10} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"Finish Q3 report\nReview PR #482\nCall supplier about delay\nPlan Friday demo"} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Context (optional)</Label>
            <Textarea rows={3} value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. 6h available today, deep work mornings, demo deadline Friday" />
          </div>
          <Button onClick={run} disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Planning</> : <><Sparkles className="h-4 w-4 mr-2" /> Build plan</>}
          </Button>
        </Card>
        <AIOutput content={output} loading={loading} placeholder="Your prioritized plan will appear here." />
      </div>
    </div>
  );
}
