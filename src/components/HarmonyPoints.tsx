import { Sparkles } from "lucide-react";

interface HarmonyPointsProps {
  points: number;
}

export function HarmonyPoints({ points }: HarmonyPointsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 glass neon-border rounded-full px-2.5 sm:px-4 py-1.5">
      <Sparkles className="w-4 h-4 text-harmony-gold" />
      <span className="text-sm font-semibold text-foreground font-display">{points}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider hidden md:inline">
        Harmony Pts
      </span>
    </div>
  );
}
