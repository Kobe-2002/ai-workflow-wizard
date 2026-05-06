// AI Assistant edge function — routes feature requests to Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert business communication assistant. Generate a professional email based on the user's brief.
Follow these rules strictly:
- Match the requested TONE (formal/friendly/persuasive/concise/apologetic) precisely.
- Tailor language to the AUDIENCE (executive/client/teammate/vendor/candidate).
- Include a clear subject line, greeting, body (2-4 short paragraphs), call-to-action, and sign-off.
- Use markdown. Start with: **Subject:** ...
- Be specific, never use placeholder filler like [Your Name] unless the user provided no signature info.`,

  meeting: `You are a meeting analyst. Summarize the provided meeting notes/transcript.
Output in markdown with these exact sections:
## Summary (2-3 sentences)
## Key Points (bulleted)
## Action Items (table: Owner | Action | Deadline)
## Decisions Made
## Open Questions / Risks
Be concise, factual, and only include what is supported by the input.`,

  tasks: `You are an AI productivity coach using the Eisenhower matrix and time-blocking principles.
Given the user's task list, return a markdown plan with:
## Prioritized Plan
A table with columns: Priority (P1/P2/P3) | Task | Estimated Time | Suggested Slot | Rationale
## Today's Focus (top 3)
## This Week
## Tips
Sort by impact × urgency. Be realistic about time estimates.`,

  research: `You are a senior research analyst. Given a topic, produce a structured briefing in markdown:
## Executive Summary (3-4 sentences)
## Key Insights (5 numbered, each with a one-line rationale)
## Background & Context
## Opportunities & Risks
## Recommended Next Steps
## Suggested Sources to Verify
Be neutral, fact-grounded, and flag uncertainty explicitly.`,

  chat: `You are an AI workplace productivity assistant. Help professionals with writing, planning, summarizing, brainstorming, and analysis. Be concise, professional, and use markdown formatting (headings, bullets, code blocks) when helpful. Ask a clarifying question only when essential.`,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { feature, messages, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const system = SYSTEM_PROMPTS[feature] || SYSTEM_PROMPTS.chat;
    const chatMessages = messages && Array.isArray(messages)
      ? messages
      : [{ role: "user", content: input ?? "" }];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...chatMessages],
        stream: true,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in your workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("Gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assist error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
