import { formatLeadTime } from "@/lib/format";

export default function AvailabilityIndicator({
  availability,
  leadTimeMinDays,
  leadTimeMaxDays,
}: {
  availability: string;
  leadTimeMinDays?: number | null;
  leadTimeMaxDays?: number | null;
}) {
  if (availability === "MADE_TO_ORDER") {
    return (
      <p className="inline-flex items-center gap-1.5 rounded border border-warning/40 bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
        {formatLeadTime(leadTimeMinDays, leadTimeMaxDays)}
      </p>
    );
  }

  return (
    <p className="inline-flex items-center gap-1.5 rounded border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
      Stock inmediato
    </p>
  );
}
