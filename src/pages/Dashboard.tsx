import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

const features = [
  { url: "/email", title: "Smart Email Generator", desc: "Craft emails tuned to tone and audience.", icon: Mail },
  { url: "/meetings", title: "Meeting Notes Summarizer", desc: "Extract key points, decisions, and action items.", icon: FileText },
  { url: "/tasks", title: "AI Task Planner", desc: "Prioritize and schedule your day intelligently.", icon: ListChecks },
  { url: "/research", title: "Research Assistant", desc: "Quick briefings, insights and source ideas.", icon: Search },
  { url: "/chat", title: "AI Chatbot", desc: "Open-ended conversational productivity helper.", icon: MessageSquare },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12 shadow-glow">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs text-primary-foreground mb-4">
            <Sparkles className="h-3 w-3" /> Your AI workplace co-pilot
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight">
            Automate the busywork. Focus on the work that matters.
          </h1>
          <p className="text-primary-foreground/85 mt-3 max-w-2xl">
            Five purpose-built assistants to draft, summarize, plan, research, and brainstorm — powered by structured prompts for clear, professional output.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.url} to={f.url} className="group">
              <Card className="p-5 h-full hover:shadow-elegant hover:-translate-y-0.5 transition-all border-border/60 hover:border-primary/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg gradient-card flex items-center justify-center text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
