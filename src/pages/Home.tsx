import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Globe2, ShieldCheck, Code2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SalamFooter } from "@/components/SalamFooter";
import salamAvatar from "@/assets/salam-avatar.png";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    { icon: ShieldCheck, title: t("home.feature1.title"), desc: t("home.feature1.desc") },
    { icon: Sparkles, title: t("home.feature2.title"), desc: t("home.feature2.desc") },
    { icon: Globe2, title: t("home.feature3.title"), desc: t("home.feature3.desc") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 glass-strong border-b border-border/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden neon-glow border border-primary/30 shrink-0">
              <img src={salamAvatar} alt="Salam Agent" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-foreground text-lg leading-tight neon-text">
                Salam Agent
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase truncate">
                {t("home.tagline")}
              </p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-14 pb-16 text-center">
          <div className="inline-flex items-center gap-2 glass neon-border px-3 py-1 rounded-full mb-6 animate-fade-scale">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-[11px] font-display tracking-widest uppercase text-primary/90">
              Erasmus+ • Hate to Harmony
            </span>
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-tight neon-text animate-slide-up">
            {t("home.title")}
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed animate-slide-up">
            {t("home.subtitle")}
          </p>

          {/* Floating avatar */}
          <div className="mt-12 flex justify-center">
            <div className="relative animate-float">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
              <img
                src={salamAvatar}
                alt="Salam — AI Digital Diplomat"
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-primary/30 neon-glow object-cover"
              />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-slide-up">
            <Link
              to="/chat"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-display tracking-wider text-sm neon-glow hover:scale-[1.02] transition-transform"
            >
              {t("home.cta.start")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/embed-info"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass neon-border text-foreground font-display tracking-wider text-sm hover:text-primary hover:border-primary/50 transition-all"
            >
              <Code2 className="w-4 h-4" />
              {t("nav.embed")}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 pb-16 grid sm:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="glass neon-border rounded-2xl p-6 hover:border-primary/50 transition group"
            >
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </article>
          ))}
        </section>

        {/* About / Erasmus+ */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3">
            {t("home.about.title")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("home.about.desc")}
          </p>
        </section>
      </main>

      <SalamFooter />
    </div>
  );
}
