type Tone = "success" | "warning" | "critical" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-bg text-success-text",
  warning: "bg-warning-bg text-warning-text",
  critical: "bg-critical-bg text-critical-text",
  neutral: "bg-neutral-bg text-neutral-text",
};

// Maps the plain-language status strings used across every entity in the
// hub to a consistent colour so the same word always reads the same way.
const STATUS_TONE: Record<string, Tone> = {
  Active: "success",
  Ongoing: "success",
  Open: "success",
  Published: "success",
  Completed: "neutral",
  Archived: "neutral",
  Past: "neutral",
  Proposed: "warning",
  Invited: "warning",
  Preview: "warning",
  Draft: "warning",
  "Closing Soon": "warning",
  Closed: "critical",
  CRITICAL: "critical",
  WARNING: "warning",
};

export default function Badge({
  children,
  tone,
}: {
  children: string;
  tone?: Tone;
}) {
  const resolved = tone ?? STATUS_TONE[children] ?? "neutral";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${TONE_CLASSES[resolved]}`}
    >
      {children}
    </span>
  );
}
