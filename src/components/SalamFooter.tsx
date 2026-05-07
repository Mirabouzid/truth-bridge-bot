import erasmusLogo from "@/assets/erasmus-plus-logo.png";
import erasmusOfficial from "@/assets/erasmus-plus-official.png";
import { useLanguage } from "@/contexts/LanguageContext";

export function SalamFooter() {
  const { t } = useLanguage();
  return (
    <footer className="relative z-10 border-t border-border/30 bg-background/60 backdrop-blur-xl px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 text-center">
        <img
          src={erasmusLogo}
          alt="Erasmus+ Programme of the European Union"
          className="h-8 w-auto opacity-90"
          loading="lazy"
        />
        <div className="flex flex-col items-center sm:items-start text-[11px] leading-tight text-muted-foreground">
          <span>{t("footer.coFunded")}</span>
          <span className="text-primary/80 font-display tracking-wider uppercase text-[9px]">
            {t("footer.project")}
          </span>
        </div>
        <img
          src={erasmusOfficial}
          alt="Erasmus+ official emblem"
          className="h-9 w-auto opacity-90"
          loading="lazy"
        />
      </div>
    </footer>
  );
}
