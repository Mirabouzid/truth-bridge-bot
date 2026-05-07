import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SalamFooter } from "@/components/SalamFooter";
import salamAvatar from "@/assets/salam-avatar.png";

export default function EmbedInfo() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const snippet = `<iframe
  src="${origin}/embed"
  title="Salam Agent — AI Digital Diplomat"
  style="width:100%;height:640px;border:0;border-radius:16px;background:#0a0e1a"
  allow="microphone; clipboard-write"
  loading="lazy"
></iframe>`;

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="glass-strong border-b border-border/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src={salamAvatar} alt="Salam" className="w-9 h-9 rounded-lg border border-primary/30" />
            <span className="font-display font-bold text-foreground neon-text">Salam Agent</span>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> {t("nav.home")}
        </Link>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground neon-text mb-3">
          {t("embed.title")}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">{t("embed.desc")}</p>

        <div className="glass neon-border rounded-2xl p-4 sm:p-6 relative">
          <button
            onClick={copy}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-display"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t("embed.copied") : t("embed.copy")}
          </button>
          <pre className="text-xs sm:text-sm text-foreground/90 overflow-x-auto whitespace-pre pr-24">
            <code>{snippet}</code>
          </pre>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="glass neon-border rounded-2xl p-5">
            <h2 className="font-display font-semibold text-foreground mb-2">{t("embed.feat1.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("embed.feat1.desc")}</p>
          </div>
          <div className="glass neon-border rounded-2xl p-5">
            <h2 className="font-display font-semibold text-foreground mb-2">{t("embed.feat2.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("embed.feat2.desc")}</p>
          </div>
        </div>

        <h2 className="font-display font-semibold text-foreground mt-10 mb-3">{t("embed.preview")}</h2>
        <div className="rounded-2xl overflow-hidden neon-border" style={{ height: 480 }}>
          <iframe
            src="/embed"
            title="Salam Agent preview"
            className="w-full h-full"
            allow="microphone"
          />
        </div>
      </main>

      <SalamFooter />
    </div>
  );
}
