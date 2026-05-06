import { LucideIcon } from "lucide-react";

interface Props { icon: LucideIcon; title: string; desc: string; }

export function PageHeader({ icon: Icon, title, desc }: Props) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow shrink-0">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
