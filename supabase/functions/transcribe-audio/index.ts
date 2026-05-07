import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    // Expect multipart/form-data with "file" (audio blob) and optional "language"
    const incoming = await req.formData();
    const file = incoming.get("file");
    const language = incoming.get("language");

    if (!(file instanceof File) && !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: "Missing audio file" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Limit ~25MB (Groq whisper limit)
    const size = (file as Blob).size;
    if (size > 25 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Audio too large (max 25MB)" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = new FormData();
    const filename = (file as File).name || "audio.webm";
    upstream.append("file", file as Blob, filename);
    upstream.append("model", "whisper-large-v3");
    upstream.append("response_format", "json");
    upstream.append("temperature", "0");
    if (typeof language === "string" && language.length > 0) {
      upstream.append("language", language);
    }

    const resp = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
      body: upstream,
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Groq STT error:", resp.status, t);
      const status = resp.status === 429 ? 429 : 500;
      return new Response(JSON.stringify({ error: "Transcription failed", details: t }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    return new Response(JSON.stringify({ text: data.text ?? "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("transcribe-audio error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
