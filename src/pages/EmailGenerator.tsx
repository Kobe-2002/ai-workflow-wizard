import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIOutput } from "@/components/AIOutput";
import { streamAI } from "@/lib/ai";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Mail } from "lucide-react";

export default function EmailGenerator() {
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("client");
  const [brief, setBrief] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!brief.trim()) return toast.error("Describe what the email should say.");
    setLoading(true); setOutput("");
    const prompt = `TONE: ${tone}\nAUDIENCE: ${audience}\nBRIEF:\n${brief}`;
    await streamAI({
      feature: "email",
      input: prompt,
      onDelta: (c) => setOutput((p) => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { toast.error(m); setLoading(false); },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Mail} title="Smart Email Generator" desc="Generate polished emails tuned to your tone and audience." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="teammate">Teammate</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">What should the email say?</Label>
            <Textarea
              rows={9}
              placeholder="e.g. Follow up with Acme on their Q3 proposal, ask for a meeting next week, mention pricing flexibility."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate email</>}
          </Button>
        </Card>
        <AIOutput content={output} loading={loading} placeholder="Your generated email will appear here." />
      </div>
    </div>
  );
}
