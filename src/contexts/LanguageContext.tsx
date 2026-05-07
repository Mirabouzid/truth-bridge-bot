import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "fr" | "it" | "ar";

export const LANGS: { code: Lang; label: string; flag: string; name: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "it", label: "IT", flag: "🇮🇹", name: "Italiano" },
  { code: "ar", label: "AR", flag: "🇸🇦", name: "العربية" },
];

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  en: {
    "header.subtitle": "Digital Diplomat • Hate to Harmony",
    "welcome.title": "Welcome to Salam",
    "welcome.desc":
      "I'm your Digital Diplomat — here to help transform harmful speech into constructive dialogue. Share a message and I'll help you find a better way to express it.",
    "welcome.analyze": "Analyze a message",
    "welcome.factcheck": "Fact-check a claim",
    "welcome.empathy": "Practice empathy",
    "input.placeholder": "Type, paste, or hit the mic to speak…",
    "input.recording": "Recording",
    "input.cancel": "Cancel",
    "input.transcribing": "Transcribing…",
    "footer.coFunded": "Co-funded by the Erasmus+ Programme of the European Union",
    "footer.project": "Hate to Harmony Project",
    "lang.label": "Language",
    "sample.analyze":
      "These immigrants are taking all the jobs, they should leave!",
    "sample.factcheck":
      "Is it true that immigrants increase crime rates in Europe?",
    "sample.empathy":
      "Help me understand how hateful messages affect people online",
    "home.tagline": "AI Digital Diplomat",
    "home.title": "From Hate to Harmony",
    "home.subtitle": "Meet Salam — the AI mediator that turns harmful speech into constructive dialogue, one message at a time.",
    "home.cta.start": "Talk to Salam",
    "home.cta.learn": "Learn more",
    "home.feature1.title": "Detect & Reflect",
    "home.feature1.desc": "Salam identifies hate speech categories and explains their human impact.",
    "home.feature2.title": "Harmony Alternatives",
    "home.feature2.desc": "Get three reformulations that keep your intent without the toxicity.",
    "home.feature3.title": "Multilingual Bridge",
    "home.feature3.desc": "Available in English, French, Italian and Arabic — built for European youth.",
    "home.about.title": "An Erasmus+ youth initiative",
    "home.about.desc": "Hate to Harmony is co-funded by the Erasmus+ Programme of the European Union, empowering young Europeans toward constructive digital citizenship.",
    "nav.home": "Home",
    "nav.chat": "Chat",
    "typing.thinking": "Salam is thinking...",
    "nav.embed": "Embed",
    "install.title": "Install Salam on your device",
    "install.desc": "Quick access from your home screen — works offline-friendly.",
    "install.cta": "Install",
    "install.dismiss": "Dismiss",
    "embed.title": "Embed Salam in your LMS",
    "embed.desc": "Drop this snippet into Moodle, Google Classroom, Canvas or any school website to give your students a Digital Diplomat in one click.",
    "embed.copy": "Copy",
    "embed.copied": "Copied!",
    "embed.preview": "Live preview",
    "embed.feat1.title": "Responsive",
    "embed.feat1.desc": "Adapts to any container size — desktop, tablet or mobile.",
    "embed.feat2.title": "Multilingual",
    "embed.feat2.desc": "EN / FR / IT / AR — students choose their language inside the widget.",
  },
  fr: {
    "header.subtitle": "Diplomate Numérique • De la Haine à l'Harmonie",
    "welcome.title": "Bienvenue chez Salam",
    "welcome.desc":
      "Je suis votre Diplomate Numérique — ici pour transformer les discours nuisibles en dialogue constructif. Partagez un message et je vous aiderai à mieux l'exprimer.",
    "welcome.analyze": "Analyser un message",
    "welcome.factcheck": "Vérifier une affirmation",
    "welcome.empathy": "Pratiquer l'empathie",
    "input.placeholder": "Tapez, collez ou appuyez sur le micro pour parler…",
    "input.recording": "Enregistrement",
    "input.cancel": "Annuler",
    "input.transcribing": "Transcription…",
    "footer.coFunded": "Cofinancé par le programme Erasmus+ de l'Union européenne",
    "footer.project": "Projet Hate to Harmony",
    "lang.label": "Langue",
    "sample.analyze":
      "Ces immigrés prennent tous les emplois, ils devraient partir !",
    "sample.factcheck":
      "Est-il vrai que les immigrés augmentent la criminalité en Europe ?",
    "sample.empathy":
      "Aide-moi à comprendre comment les messages haineux affectent les gens en ligne",
    "home.tagline": "Diplomate Numérique IA",
    "home.title": "De la Haine à l'Harmonie",
    "home.subtitle": "Découvrez Salam — le médiateur IA qui transforme les discours nuisibles en dialogue constructif, un message à la fois.",
    "home.cta.start": "Parler à Salam",
    "home.cta.learn": "En savoir plus",
    "home.feature1.title": "Détecter & Réfléchir",
    "home.feature1.desc": "Salam identifie les catégories de discours haineux et explique leur impact humain.",
    "home.feature2.title": "Alternatives Harmonieuses",
    "home.feature2.desc": "Recevez trois reformulations qui préservent votre intention sans la toxicité.",
    "home.feature3.title": "Pont Multilingue",
    "home.feature3.desc": "Disponible en anglais, français, italien et arabe — conçu pour la jeunesse européenne.",
    "home.about.title": "Une initiative jeunesse Erasmus+",
    "home.about.desc": "Hate to Harmony est cofinancé par le programme Erasmus+ de l'Union européenne, pour une citoyenneté numérique constructive.",
    "nav.home": "Accueil",
    "nav.chat": "Chat",
    "typing.thinking": "Salam réfléchit…",
    "nav.embed": "Intégrer",
    "install.title": "Installer Salam sur votre appareil",
    "install.desc": "Accès rapide depuis votre écran d'accueil.",
    "install.cta": "Installer",
    "install.dismiss": "Fermer",
    "embed.title": "Intégrer Salam dans votre LMS",
    "embed.desc": "Copiez ce code dans Moodle, Google Classroom, Canvas ou tout site scolaire pour offrir un Diplomate Numérique en un clic.",
    "embed.copy": "Copier",
    "embed.copied": "Copié !",
    "embed.preview": "Aperçu en direct",
    "embed.feat1.title": "Responsive",
    "embed.feat1.desc": "S'adapte à tout conteneur — bureau, tablette ou mobile.",
    "embed.feat2.title": "Multilingue",
    "embed.feat2.desc": "EN / FR / IT / AR — les élèves choisissent leur langue.",
  },
  it: {
    "header.subtitle": "Diplomatico Digitale • Dall'Odio all'Armonia",
    "welcome.title": "Benvenuto in Salam",
    "welcome.desc":
      "Sono il tuo Diplomatico Digitale — qui per trasformare i discorsi dannosi in dialogo costruttivo. Condividi un messaggio e ti aiuterò a esprimerlo meglio.",
    "welcome.analyze": "Analizza un messaggio",
    "welcome.factcheck": "Verifica un'affermazione",
    "welcome.empathy": "Pratica l'empatia",
    "input.placeholder": "Scrivi, incolla o premi il microfono per parlare…",
    "input.recording": "Registrazione",
    "input.cancel": "Annulla",
    "input.transcribing": "Trascrizione…",
    "footer.coFunded": "Cofinanziato dal programma Erasmus+ dell'Unione Europea",
    "footer.project": "Progetto Hate to Harmony",
    "lang.label": "Lingua",
    "sample.analyze":
      "Questi immigrati ci stanno rubando tutti i lavori, dovrebbero andarsene!",
    "sample.factcheck":
      "È vero che gli immigrati aumentano i tassi di criminalità in Europa?",
    "sample.empathy":
      "Aiutami a capire come i messaggi d'odio colpiscono le persone online",
    "home.tagline": "Diplomatico Digitale IA",
    "home.title": "Dall'Odio all'Armonia",
    "home.subtitle": "Scopri Salam — il mediatore IA che trasforma i discorsi dannosi in dialogo costruttivo, un messaggio alla volta.",
    "home.cta.start": "Parla con Salam",
    "home.cta.learn": "Scopri di più",
    "home.feature1.title": "Rileva & Rifletti",
    "home.feature1.desc": "Salam identifica le categorie di odio e ne spiega l'impatto umano.",
    "home.feature2.title": "Alternative Armoniche",
    "home.feature2.desc": "Ricevi tre riformulazioni che mantengono la tua intenzione senza la tossicità.",
    "home.feature3.title": "Ponte Multilingue",
    "home.feature3.desc": "Disponibile in inglese, francese, italiano e arabo — pensato per i giovani europei.",
    "home.about.title": "Un'iniziativa giovanile Erasmus+",
    "home.about.desc": "Hate to Harmony è cofinanziato dal programma Erasmus+ dell'Unione Europea, per una cittadinanza digitale costruttiva.",
    "nav.home": "Home",
    "nav.chat": "Chat",
    "typing.thinking": "Salam sta pensando…",
    "nav.embed": "Incorpora",
    "install.title": "Installa Salam sul tuo dispositivo",
    "install.desc": "Accesso rapido dalla schermata principale.",
    "install.cta": "Installa",
    "install.dismiss": "Chiudi",
    "embed.title": "Incorpora Salam nel tuo LMS",
    "embed.desc": "Inserisci questo snippet in Moodle, Google Classroom, Canvas o qualsiasi sito scolastico per dare ai tuoi studenti un Diplomatico Digitale in un clic.",
    "embed.copy": "Copia",
    "embed.copied": "Copiato!",
    "embed.preview": "Anteprima dal vivo",
    "embed.feat1.title": "Responsive",
    "embed.feat1.desc": "Si adatta a qualsiasi contenitore — desktop, tablet o mobile.",
    "embed.feat2.title": "Multilingue",
    "embed.feat2.desc": "EN / FR / IT / AR — gli studenti scelgono la loro lingua.",
  },
  ar: {
    "header.subtitle": "الدبلوماسي الرقمي • من الكراهية إلى الوئام",
    "welcome.title": "مرحباً بك في سلام",
    "welcome.desc":
      "أنا دبلوماسيك الرقمي — هنا لمساعدتك في تحويل الخطاب المؤذي إلى حوار بنّاء. شارك رسالة وسأساعدك على التعبير عنها بطريقة أفضل.",
    "welcome.analyze": "تحليل رسالة",
    "welcome.factcheck": "التحقق من ادعاء",
    "welcome.empathy": "ممارسة التعاطف",
    "input.placeholder": "اكتب، الصق، أو اضغط على الميكروفون للتحدث…",
    "input.recording": "جارٍ التسجيل",
    "input.cancel": "إلغاء",
    "input.transcribing": "جارٍ النسخ…",
    "footer.coFunded": "بتمويل مشترك من برنامج إيراسموس+ التابع للاتحاد الأوروبي",
    "footer.project": "مشروع من الكراهية إلى الوئام",
    "lang.label": "اللغة",
    "sample.analyze": "هؤلاء المهاجرون يستولون على كل الوظائف، يجب أن يرحلوا!",
    "sample.factcheck": "هل صحيح أن المهاجرين يزيدون من معدلات الجريمة في أوروبا؟",
    "sample.empathy": "ساعدني على فهم كيف تؤثر رسائل الكراهية على الناس عبر الإنترنت",
    "home.tagline": "دبلوماسي رقمي بالذكاء الاصطناعي",
    "home.title": "من الكراهية إلى الوئام",
    "home.subtitle": "تعرّف على سلام — الوسيط الذكي الذي يحوّل الخطاب المؤذي إلى حوار بنّاء، رسالة تلو الأخرى.",
    "home.cta.start": "تحدّث مع سلام",
    "home.cta.learn": "اعرف المزيد",
    "home.feature1.title": "اكتشف وتأمّل",
    "home.feature1.desc": "يحدّد سلام فئات خطاب الكراهية ويشرح أثرها الإنساني.",
    "home.feature2.title": "بدائل وئام",
    "home.feature2.desc": "احصل على ثلاث إعادات صياغة تحفظ مقصدك دون السمّية.",
    "home.feature3.title": "جسر متعدد اللغات",
    "home.feature3.desc": "متوفر بالإنجليزية والفرنسية والإيطالية والعربية — مصمّم لشباب أوروبا.",
    "home.about.title": "مبادرة شبابية من إيراسموس+",
    "home.about.desc": "مشروع 'من الكراهية إلى الوئام' بتمويل مشترك من برنامج إيراسموس+ التابع للاتحاد الأوروبي، لتعزيز المواطنة الرقمية البنّاءة.",
    "nav.home": "الرئيسية",
    "nav.chat": "الدردشة",
    "typing.thinking": "سلام يفكّر…",
    "nav.embed": "تضمين",
    "install.title": "ثبّت سلام على جهازك",
    "install.desc": "وصول سريع من الشاشة الرئيسية.",
    "install.cta": "تثبيت",
    "install.dismiss": "إغلاق",
    "embed.title": "ضمّن سلام في نظام التعلّم لديك",
    "embed.desc": "أدرج هذا الكود في Moodle أو Google Classroom أو Canvas أو أي موقع مدرسي لتمنح طلابك دبلوماسياً رقمياً بنقرة واحدة.",
    "embed.copy": "نسخ",
    "embed.copied": "تم النسخ!",
    "embed.preview": "معاينة مباشرة",
    "embed.feat1.title": "متجاوب",
    "embed.feat1.desc": "يتكيّف مع أي حجم — حاسوب أو لوح أو هاتف.",
    "embed.feat2.title": "متعدد اللغات",
    "embed.feat2.desc": "EN / FR / IT / AR — يختار الطلاب لغتهم.",
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("salam.lang") as Lang | null;
    if (saved && translations[saved]) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase() as Lang;
    return translations[nav] ? nav : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("salam.lang", l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: string) => translations[lang][key] ?? translations.en[key] ?? key;
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function languageInstruction(lang: Lang): string {
  const map: Record<Lang, string> = {
    en: "Always respond in English.",
    fr: "Réponds toujours en français. Garde les marqueurs de section ([🚨 ANALYSIS], [💡 THE NUDGE], [🕊️ HARMONY OPTIONS], [📈 IMPACT]) en anglais mais traduis tout le contenu en français.",
    it: "Rispondi sempre in italiano. Mantieni i marcatori di sezione ([🚨 ANALYSIS], [💡 THE NUDGE], [🕊️ HARMONY OPTIONS], [📈 IMPACT]) in inglese ma traduci tutto il contenuto in italiano.",
    ar: "أجب دائماً باللغة العربية. احتفظ بعلامات الأقسام ([🚨 ANALYSIS], [💡 THE NUDGE], [🕊️ HARMONY OPTIONS], [📈 IMPACT]) بالإنجليزية لكن ترجم كل المحتوى إلى العربية.",
  };
  return map[lang];
}

export type SamplePrompt = {
  category:
    | "sexism"
    | "racism"
    | "homophobia"
    | "xenophobia"
    | "cyberbullying"
    | "conspiracy"
    | "harassment"
    | "factcheck"
    | "empathy";
  icon: string;
  labelKey?: string; // optional translation key for short label
  text: string;
};

// Pool of rotating sample prompts covering all hate categories from the system prompt
export const samplePrompts: Record<Lang, SamplePrompt[]> = {
  en: [
    { category: "xenophobia", icon: "🌍", text: "These immigrants are taking all the jobs, they should leave!" },
    { category: "sexism", icon: "♀️", text: "Women just aren't cut out for leadership roles, it's biology." },
    { category: "racism", icon: "✊🏽", text: "People from that country are all lazy and untrustworthy." },
    { category: "homophobia", icon: "🏳️‍🌈", text: "Same-sex couples shouldn't be allowed to raise children." },
    { category: "cyberbullying", icon: "💬", text: "Nobody at school likes you, just delete your account already." },
    { category: "harassment", icon: "🛡️", text: "I keep getting nasty DMs from a stranger — what should I do?" },
    { category: "conspiracy", icon: "🕵️", text: "Is it true that a secret elite controls all European media?" },
    { category: "factcheck", icon: "🔍", text: "Is it true that immigrants increase crime rates in Europe?" },
    { category: "empathy", icon: "💗", text: "Help me understand how hateful messages affect people online." },
  ],
  fr: [
    { category: "xenophobia", icon: "🌍", text: "Ces immigrés prennent tous les emplois, ils devraient partir !" },
    { category: "sexism", icon: "♀️", text: "Les femmes ne sont pas faites pour diriger, c'est biologique." },
    { category: "racism", icon: "✊🏽", text: "Les gens de ce pays sont tous paresseux et malhonnêtes." },
    { category: "homophobia", icon: "🏳️‍🌈", text: "Les couples de même sexe ne devraient pas pouvoir élever des enfants." },
    { category: "cyberbullying", icon: "💬", text: "Personne ne t'aime à l'école, supprime ton compte." },
    { category: "harassment", icon: "🛡️", text: "Un inconnu m'envoie des messages méchants en privé, que faire ?" },
    { category: "conspiracy", icon: "🕵️", text: "Est-il vrai qu'une élite secrète contrôle tous les médias européens ?" },
    { category: "factcheck", icon: "🔍", text: "Est-il vrai que les immigrés augmentent la criminalité en Europe ?" },
    { category: "empathy", icon: "💗", text: "Aide-moi à comprendre comment les messages haineux affectent les gens en ligne." },
  ],
  it: [
    { category: "xenophobia", icon: "🌍", text: "Questi immigrati ci stanno rubando tutti i lavori, dovrebbero andarsene!" },
    { category: "sexism", icon: "♀️", text: "Le donne non sono adatte ai ruoli di comando, è biologia." },
    { category: "racism", icon: "✊🏽", text: "Le persone di quel paese sono tutte pigre e inaffidabili." },
    { category: "homophobia", icon: "🏳️‍🌈", text: "Le coppie dello stesso sesso non dovrebbero crescere figli." },
    { category: "cyberbullying", icon: "💬", text: "A scuola nessuno ti sopporta, cancella il tuo account." },
    { category: "harassment", icon: "🛡️", text: "Uno sconosciuto mi manda messaggi cattivi in privato, cosa faccio?" },
    { category: "conspiracy", icon: "🕵️", text: "È vero che un'élite segreta controlla tutti i media europei?" },
    { category: "factcheck", icon: "🔍", text: "È vero che gli immigrati aumentano i tassi di criminalità in Europa?" },
    { category: "empathy", icon: "💗", text: "Aiutami a capire come i messaggi d'odio colpiscono le persone online." },
  ],
  ar: [
    { category: "xenophobia", icon: "🌍", text: "هؤلاء المهاجرون يستولون على كل الوظائف، يجب أن يرحلوا!" },
    { category: "sexism", icon: "♀️", text: "النساء لسن مؤهلات لمناصب القيادة، إنها مسألة بيولوجية." },
    { category: "racism", icon: "✊🏽", text: "كل الناس من تلك الدولة كسالى وغير جديرين بالثقة." },
    { category: "homophobia", icon: "🏳️‍🌈", text: "لا ينبغي السماح للأزواج من نفس الجنس بتربية الأطفال." },
    { category: "cyberbullying", icon: "💬", text: "لا أحد في المدرسة يحبك، احذف حسابك فحسب." },
    { category: "harassment", icon: "🛡️", text: "يصلني سيل من الرسائل المسيئة من شخص مجهول، ماذا أفعل؟" },
    { category: "conspiracy", icon: "🕵️", text: "هل صحيح أن نخبة سرية تتحكم بكل وسائل الإعلام الأوروبية؟" },
    { category: "factcheck", icon: "🔍", text: "هل صحيح أن المهاجرين يزيدون من معدلات الجريمة في أوروبا؟" },
    { category: "empathy", icon: "💗", text: "ساعدني على فهم كيف تؤثر رسائل الكراهية على الناس عبر الإنترنت." },
  ],
};
