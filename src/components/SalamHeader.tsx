import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import { HarmonyPoints } from "./HarmonyPoints";
import { LanguageSelector } from "./LanguageSelector";
import salamAvatar from "@/assets/salam-avatar.png";
import { useLanguage } from "@/contexts/LanguageContext";

interface SalamHeaderProps {
  harmonyPoints: number;
}

export function SalamHeader({ harmonyPoints }: SalamHeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="relative z-10 glass-strong border-b border-border/30 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 min-w-0 group" aria-label={t("nav.home")}>
          <div className="w-10 h-10 rounded-xl overflow-hidden neon-glow border border-primary/30 shrink-0 group-hover:scale-105 transition-transform">
            <img src={salamAvatar} alt="Salam" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-foreground text-lg leading-tight neon-text group-hover:text-primary transition-colors">
              Salam Agent
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase truncate">
              {t("header.subtitle")}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            aria-label={t("nav.home")}
            title={t("nav.home")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 glass neon-border rounded-lg text-xs font-display tracking-wider text-foreground/80 hover:text-primary hover:border-primary/50 transition-all"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("nav.home")}</span>
          </Link>
          <LanguageSelector />
          <HarmonyPoints points={harmonyPoints} />
        </div>
      </div>
    </header>
  );
}
