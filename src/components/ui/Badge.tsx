type Variant = "nuevo" | "ultimas-unidades" | "encargo" | "agotado";

const styles: Record<Variant, string> = {
  nuevo: "bg-info/15 text-info border-info/40",
  "ultimas-unidades": "bg-warning/15 text-warning border-warning/40",
  encargo: "bg-warning/15 text-warning border-warning/40",
  agotado: "bg-black/80 text-white border-white/20",
};

const labels: Record<Variant, string> = {
  nuevo: "Nuevo",
  "ultimas-unidades": "Últimas unidades",
  encargo: "Encargo",
  agotado: "Agotado",
};

export default function Badge({ variant, className = "" }: { variant: Variant; className?: string }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[variant]} ${className}`}
    >
      {labels[variant]}
    </span>
  );
}

export type { Variant as BadgeVariant };
