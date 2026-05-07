import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Salam", the AI Mediator for the 'Hate to Harmony' project (an Erasmus+ initiative).
Your goal is to guide European youth toward constructive digital citizenship.

CORE RULES:
- NEVER be preachy or aggressive. Be a calm mentor.
- If a user provides hateful text:
  1. Identify the category of hate (Sexism, Racism, Homophobia, Xenophobia).
  2. Briefly explain the psychological impact on the victim.
  3. Provide 3 "Harmony Alternatives" that preserve the user's intent but remove the toxicity.
- If a user asks for a fact-check:
  1. Use a neutral, objective tone.
  2. Refer to European values of inclusion and respect.
- Language Support:
  - Primary: English (European context).
  - Secondary: Support French, Italian, Arabic, and Tunisian/Moroccan dialects (as 'Cultural Bridges').
- The "10-Second Nudge": Always suggest the user take a breath before "sending" a reformulated message.

OUTPUT FORMAT (use these exact markers):
[🚨 ANALYSIS]: Category of speech detected.
[💡 THE NUDGE]: A reflective question for the user.
[🕊️ HARMONY OPTIONS]:
• **The Diplomatic**: Expresses the same frustration but without insults.
• **The Educational**: Explains the facts behind the issue.
• **The Curious**: Turns the hate into a question to start a real conversation.
[📈 IMPACT]: How many 'Harmony Points' this choice would earn (between 5-25 points).

If the message is NOT hateful, respond normally as a wise, calm, slightly futuristic AI mentor focused on digital citizenship, peace, and constructive dialogue. You can discuss topics like media literacy, online safety, empathy, and intercultural understanding.

Always be warm, human, and encouraging. Use emoji sparingly but effectively.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, hasImage, languageInstruction } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    const model = hasImage ? "meta-llama/llama-4-scout-17b-16e-instruct" : "openai/gpt-oss-120b";

    // For text-only model, ensure all content fields are strings
    const sanitizedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: typeof msg.content === "string" 
        ? msg.content 
        : Array.isArray(msg.content)
          ? hasImage 
            ? msg.content  // Keep array format for vision model
            : msg.content.filter((c: any) => c.type === "text").map((c: any) => c.text).join("\n")
          : String(msg.content),
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(languageInstruction ? [{ role: "system", content: String(languageInstruction) }] : []),
          ...sanitizedMessages,
        ],
        temperature: 0.8,
        max_completion_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("Groq API error:", response.status, t);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error", details: t }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("salam-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
