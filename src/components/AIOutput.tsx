import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  content: string;
  loading?: boolean;
  placeholder?: string;
}

export function AIOutput({ content, loading, placeholder = "Output will appear here." }: Props) {
  return (
    <Card className="p-6 min-h-[280px] relative bg-card">
      {content && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-7 w-7"
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      )}
      {!content && !loading && (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
      {loading && !content && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Generating…
        </div>
      )}
      {content && (
        <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:text-base prose-h2:mt-4 prose-table:text-xs">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      )}
      {content && (
        <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground border-t pt-3">
          <AlertTriangle className="h-3 w-3" />
          AI-generated content may require human review.
        </div>
      )}
    </Card>
  );
}
