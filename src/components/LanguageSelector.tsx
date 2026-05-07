import { Globe } from "lucide-react";
import { LANGS, useLanguage, type Lang } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("lang.label")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 glass neon-border rounded-lg text-xs font-display tracking-wider text-foreground/80 hover:text-primary hover:border-primary/50 transition-all"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong border-border/50 min-w-[140px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={`gap-2 cursor-pointer text-xs ${
              l.code === lang ? "text-primary bg-primary/10" : ""
            }`}
          >
            <span className="text-base">{l.flag}</span>
            <span>{l.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
