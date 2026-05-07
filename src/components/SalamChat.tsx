import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Image, Sparkles, Mic, Square, Loader2 } from "lucide-react";
import salamAvatar from "@/assets/salam-avatar.png";
import { Button } from "@/components/ui/button";
import { SalamHeader } from "@/components/SalamHeader";
import { TypingIndicator } from "@/components/TypingIndicator";
import { SalamResponseCards } from "@/components/SalamResponseCards";
import { parseSalamResponse } from "@/lib/parseSalamResponse";
import { toast } from "sonner";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useLanguage, languageInstruction } from "@/contexts/LanguageContext";
import imageCompression from "browser-image-compression";

const MAX_IMAGE_MB = 8;
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/salam-chat`;

export default function SalamChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [harmonyPoints, setHarmonyPoints] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recorder = useAudioRecorder();
  const { t, lang } = useLanguage();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleMicClick = async () => {
    try {
      if (recorder.status === "idle") {
        await recorder.start();
      } else if (recorder.status === "recording") {
        const text = await recorder.stopAndTranscribe(lang);
        if (text) {
          setInput((prev) => (prev ? prev + " " + text : text));
          setTimeout(() => textareaRef.current?.focus(), 0);
        } else {
          toast.info("No speech detected");
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Microphone error");
    }
  };

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so re-selecting the same file works
    e.target.value = "";

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported image. Use JPG, PNG, WebP or GIF.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image too large. Max ${MAX_IMAGE_MB}MB.`);
      return;
    }

    try {
      let processed: File | Blob = file;
      // Compress anything over ~1MB (skip GIF to preserve animation)
      if (file.size > 1024 * 1024 && file.type !== "image/gif") {
        processed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          initialQuality: 0.8,
        });
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(processed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to process image");
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed && !imagePreview) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      imageUrl: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImagePreview(null);
    setIsLoading(true);

    const apiMessages = messages
      .concat(userMsg)
      .map((m) => {
        if (m.imageUrl) {
          return {
            role: m.role,
            content: [
              { type: "text" as const, text: m.content || "Analyze this image" },
              { type: "image_url" as const, image_url: { url: m.imageUrl } },
            ],
          };
        }
        return { role: m.role, content: m.content };
      });

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          hasImage: !!userMsg.imageUrl,
          languageInstruction: languageInstruction(lang),
          language: lang,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.id === assistantId) {
                  return prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  { id: assistantId, role: "assistant", content: assistantContent },
                ];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Harmony points are awarded when the user adopts a Harmony Option (see SalamResponseCards).
    } catch (e: any) {
      if (e?.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error(e);
        toast.error(e.message || "Failed to get response");
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions: { key: string; sample: string }[] = [
    { key: "welcome.analyze", sample: t("sample.analyze") },
    { key: "welcome.factcheck", sample: t("sample.factcheck") },
    { key: "welcome.empathy", sample: t("sample.empathy") },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <SalamHeader harmonyPoints={harmonyPoints} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 sm:px-4 pb-4 relative z-10">
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[55vh] text-center animate-fade-scale px-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden neon-glow border border-primary/30 mb-5">
                <img src={salamAvatar} alt="Salam" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2 neon-text">
                {t("welcome.title")}
              </h2>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                {t("welcome.desc")}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6 w-full max-w-lg">
                {suggestions.map(({ key, sample }) => (
                  <button
                    key={key}
                    onClick={() => setInput(sample)}
                    className="px-3 py-2 glass neon-border rounded-xl text-xs text-foreground/80 hover:text-primary hover:border-primary/50 transition-all duration-300"
                  >
                    <Sparkles className="w-3 h-3 inline mr-1.5 text-primary" />
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const parsed = msg.role === "assistant" ? parseSalamResponse(msg.content) : null;
            const useCards = parsed?.isStructured;
            return (
              <div
                key={msg.id}
                className={`flex animate-slide-up gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-1 border border-primary/20">
                    <img src={salamAvatar} alt="Salam" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                {useCards ? (
                  <div className="flex-1 min-w-0 max-w-[92%]">
                    <SalamResponseCards
                      data={parsed!}
                      onAdoptOption={(_opt, points) => setHarmonyPoints((p) => p + points)}
                    />
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 break-words ${
                      msg.role === "user"
                        ? "gradient-primary text-primary-foreground"
                        : "glass neon-border"
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded"
                        className="max-w-full sm:max-w-[240px] rounded-lg mb-2 border border-border/30"
                        loading="lazy"
                      />
                    )}
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none [&_strong]:text-primary [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary break-words">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start animate-slide-up">
              <TypingIndicator />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-10 border-t border-border/30 bg-background/80 backdrop-blur-xl px-3 sm:px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-16 rounded-lg border border-border/50" />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
          {(recorder.status === "recording" || recorder.status === "transcribing" || recorder.status === "stopping") && (
            <div className="mb-3 flex items-center gap-2 text-xs text-foreground/80 animate-fade-scale">
              {recorder.status === "recording" ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                  </span>
                  <span className="font-display tracking-wider">{t("input.recording")} {formatElapsed(recorder.elapsed)}</span>
                  <button
                    onClick={recorder.cancel}
                    className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    {t("input.cancel")}
                  </button>
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span className="text-muted-foreground">{t("input.transcribing")}</span>
                </>
              )}
            </div>
          )}
          <div className="flex items-end gap-1.5 sm:gap-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={recorder.status !== "idle"}
              aria-label="Upload image"
              className="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary"
            >
              <Image className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              disabled={recorder.status === "transcribing" || recorder.status === "stopping"}
              aria-label={recorder.status === "recording" ? "Stop recording" : "Record voice"}
              className={`shrink-0 h-10 w-10 transition-colors ${
                recorder.status === "recording"
                  ? "text-destructive hover:text-destructive animate-pulse-glow"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {recorder.status === "recording" ? (
                <Square className="w-5 h-5 fill-current" />
              ) : recorder.status === "transcribing" || recorder.status === "stopping" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            <div className="flex-1 min-w-0 glass neon-border rounded-2xl flex items-end px-3 sm:px-4 py-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("input.placeholder")}
                rows={1}
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="flex-1 w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground resize-none outline-none min-h-[24px] max-h-[120px]"
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && !imagePreview) || recorder.status !== "idle"}
              size="icon"
              aria-label="Send"
              className="shrink-0 h-10 w-10 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 neon-glow disabled:opacity-30 disabled:shadow-none transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
