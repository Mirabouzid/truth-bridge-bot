import { useLanguage } from "@/contexts/LanguageContext";

export function TypingIndicator() {
  const { t } = useLanguage();
  return (
    <div className="glass neon-border rounded-2xl px-4 py-3 inline-flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-primary animate-typing" />
      <div className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "0.2s" }} />
      <div className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "0.4s" }} />
      <span className="text-xs text-muted-foreground ml-2">{t("typing.thinking")}</span>
    </div>
  );
}
