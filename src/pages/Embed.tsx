import SalamChat from "@/components/SalamChat";

/**
 * Embed view — designed for iframe usage in LMS / school websites.
 * Strips outer chrome via CSS scope so the chat fills the iframe.
 *
 * Usage:
 *   <iframe src="https://harmony-bridge-ai.lovable.app/embed"
 *           style="width:100%;height:600px;border:0;border-radius:12px"
 *           allow="microphone"
 *           title="Salam Agent"></iframe>
 */
export default function Embed() {
  return (
    <div className="embed-root">
      <SalamChat />
    </div>
  );
}
