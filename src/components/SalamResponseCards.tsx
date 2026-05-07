import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AlertTriangle, Lightbulb, Bird, TrendingUp, Check, Copy, Sparkles, MessageCircle, GraduationCap, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import type { HarmonyOption, SalamStructured } from "@/lib/parseSalamResponse";

interface Props {
  data: SalamStructured;
  onAdoptOption?: (option: HarmonyOption, points: number) => void;
}

const optionMeta = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("diplo")) return { Icon: MessageCircle, tint: "primary" as const, accent: "from-primary/20 to-primary/5" };
  if (l.includes("educ")) return { Icon: GraduationCap, tint: "accent" as const, accent: "from-accent/20 to-accent/5" };
  if (l.includes("curio") || l.includes("question")) return { Icon: HelpCircle, tint: "harmony-gold" as const, accent: "from-harmony-gold/20 to-harmony-gold/5" };
  return { Icon: Sparkles, tint: "primary" as const, accent: "from-primary/20 to-primary/5" };
};

export function SalamResponseCards({ data, onAdoptOption }: Props) {
  const [adoptedIdx, setAdoptedIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const points = data.impactPoints ?? 10;

  const handleAdopt = (opt: HarmonyOption, idx: number) => {
    if (adoptedIdx !== null) return;
    setAdoptedIdx(idx);
    navigator.clipboard.writeText(opt.text).catch(() => {});
    onAdoptOption?.(opt, points);
    toast.success(`+${points} Harmony Points`, {
      description: `"${opt.label}" rewrite copied to clipboard.`,
    });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-3 animate-fade-scale">
      {data.prelude && (
        <div className="prose prose-invert prose-sm max-w-none text-foreground/90">
          <ReactMarkdown>{data.prelude}</ReactMarkdown>
        </div>
      )}

      {data.analysis && (
        <SectionCard
          Icon={AlertTriangle}
          label="Analysis"
          tone="destructive"
          delay={0}
        >
          <ReactMarkdown>{data.analysis}</ReactMarkdown>
        </SectionCard>
      )}

      {data.nudge && (
        <SectionCard Icon={Lightbulb} label="The Nudge" tone="primary" delay={60}>
          <p className="italic text-foreground/90">{stripQuotes(data.nudge)}</p>
        </SectionCard>
      )}

      {data.options.length > 0 && (
        <div
          className="glass neon-border rounded-2xl p-4 space-y-3"
          style={{ animation: "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) 120ms both" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Bird className="w-4 h-4 text-primary" />
            </div>
            <h4 className="font-display font-semibold text-sm text-foreground tracking-wide">
              Harmony Options
            </h4>
            <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">
              Tap to adopt
            </span>
          </div>

          <div className="grid gap-2">
            {data.options.map((opt, i) => {
              const { Icon, accent } = optionMeta(opt.label);
              const isAdopted = adoptedIdx === i;
              const isDimmed = adoptedIdx !== null && !isAdopted;
              return (
                <button
                  key={i}
                  onClick={() => handleAdopt(opt, i)}
                  disabled={adoptedIdx !== null}
                  className={`group relative text-left rounded-xl border bg-gradient-to-br ${accent} p-3 transition-all duration-300 overflow-hidden ${
                    isAdopted
                      ? "border-harmony scale-[1.01] shadow-[0_0_30px_hsl(var(--harmony-green)/0.35)]"
                      : isDimmed
                      ? "border-border/30 opacity-40"
                      : "border-border/40 hover:border-primary/60 hover:scale-[1.01] hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] cursor-pointer"
                  }`}
                  style={{ animation: `slide-up 0.4s cubic-bezier(0.16,1,0.3,1) ${180 + i * 80}ms both` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-background/40 backdrop-blur border border-border/40 flex items-center justify-center">
                      {isAdopted ? (
                        <Check className="w-4 h-4 text-harmony" />
                      ) : (
                        <Icon className="w-4 h-4 text-foreground/80 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-primary">
                          {opt.label}
                        </span>
                        {isAdopted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-harmony/20 text-harmony border border-harmony/40">
                            Adopted
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{opt.text}</p>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(opt.text, i);
                      }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-background/40"
                      aria-label="Copy"
                    >
                      {copiedIdx === i ? (
                        <Check className="w-3.5 h-3.5 text-harmony" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {data.impact && (
        <div
          className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 border border-harmony-gold/30"
          style={{ animation: "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) 240ms both" }}
        >
          <div className="w-7 h-7 rounded-lg bg-harmony-gold/15 border border-harmony-gold/40 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-harmony-gold" />
          </div>
          <div className="flex-1 text-sm text-foreground/80">{stripQuotes(data.impact)}</div>
          {data.impactPoints !== undefined && (
            <div className="font-display font-bold text-harmony-gold text-sm">
              +{data.impactPoints}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  Icon,
  label,
  tone,
  delay,
  children,
}: {
  Icon: any;
  label: string;
  tone: "primary" | "destructive" | "accent";
  delay: number;
  children: React.ReactNode;
}) {
  const toneMap = {
    primary: { bg: "bg-primary/15", border: "border-primary/30", text: "text-primary" },
    destructive: { bg: "bg-destructive/15", border: "border-destructive/30", text: "text-destructive" },
    accent: { bg: "bg-accent/15", border: "border-accent/30", text: "text-accent" },
  };
  const t = toneMap[tone];
  return (
    <div
      className={`glass rounded-2xl p-4 border ${t.border}`}
      style={{ animation: `slide-up 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${t.bg} border ${t.border} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${t.text}`} />
        </div>
        <h4 className={`font-display font-semibold text-sm tracking-wide ${t.text}`}>{label}</h4>
      </div>
      <div className="prose prose-invert prose-sm max-w-none text-foreground/90 [&_p]:my-1">
        {children}
      </div>
    </div>
  );
}

function stripQuotes(s: string): string {
  return s.replace(/^["'`]|["'`]$/g, "").trim();
}
