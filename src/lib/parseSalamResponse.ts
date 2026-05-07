// Parses Salam's structured output into typed sections.
// Markers: [🚨 ANALYSIS]: ... [💡 THE NUDGE]: ... [🕊️ HARMONY OPTIONS]: ... [📈 IMPACT]: ...

export type HarmonyOption = {
  label: string; // "Diplomatic" | "Educational" | "Curious" | other
  text: string;
};

export type SalamStructured = {
  isStructured: boolean;
  analysis?: string;
  nudge?: string;
  options: HarmonyOption[];
  impact?: string;
  impactPoints?: number;
  prelude?: string; // any prose before the first marker
};

const MARKERS = [
  { key: "analysis", regex: /\[\s*🚨?\s*ANALYSIS\s*\]\s*:?/i },
  { key: "nudge", regex: /\[\s*💡?\s*(?:THE\s+)?NUDGE\s*\]\s*:?/i },
  { key: "options", regex: /\[\s*🕊️?\s*HARMONY\s+OPTIONS\s*\]\s*:?/i },
  { key: "impact", regex: /\[\s*📈?\s*IMPACT\s*\]\s*:?/i },
] as const;

export function parseSalamResponse(raw: string): SalamStructured {
  const result: SalamStructured = { isStructured: false, options: [] };
  if (!raw) return result;

  // Find all marker positions
  const hits: { key: string; start: number; end: number }[] = [];
  for (const m of MARKERS) {
    const match = raw.match(m.regex);
    if (match && match.index !== undefined) {
      hits.push({ key: m.key, start: match.index, end: match.index + match[0].length });
    }
  }
  if (hits.length === 0) return result;

  hits.sort((a, b) => a.start - b.start);
  result.isStructured = true;
  if (hits[0].start > 0) {
    const pre = raw.slice(0, hits[0].start).trim();
    if (pre) result.prelude = pre;
  }

  for (let i = 0; i < hits.length; i++) {
    const cur = hits[i];
    const next = hits[i + 1];
    const body = raw.slice(cur.end, next ? next.start : raw.length).trim();
    if (cur.key === "analysis") result.analysis = body;
    else if (cur.key === "nudge") result.nudge = body;
    else if (cur.key === "options") result.options = parseOptions(body);
    else if (cur.key === "impact") {
      result.impact = body;
      const pm = body.match(/(\d+)/);
      if (pm) result.impactPoints = parseInt(pm[1], 10);
    }
  }

  return result;
}

function parseOptions(body: string): HarmonyOption[] {
  // Bullet lines like: • **The Diplomatic**: text   or  - **Diplomatic**: text
  const lines = body.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const opts: HarmonyOption[] = [];
  for (const line of lines) {
    const m = line.match(/^[•\-\*]\s*\*\*([^*]+?)\*\*\s*[:\-–]\s*(.+)$/);
    if (m) {
      opts.push({ label: cleanLabel(m[1]), text: m[2].trim() });
      continue;
    }
    const m2 = line.match(/^[•\-\*]\s*([^:]+?):\s*(.+)$/);
    if (m2) opts.push({ label: cleanLabel(m2[1]), text: m2[2].trim() });
  }
  return opts;
}

function cleanLabel(s: string): string {
  return s.replace(/^The\s+/i, "").replace(/\*+/g, "").trim();
}
