const HOURS = [
  { day: "Lunes a Viernes", hours: "12:00 a 20:00 hs" },
  { day: "Sábados", hours: "16:00 a 00:00 hs" },
];

export default function ShippingInfo({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Retiro en punto a coordinar (CABA) o envío a todo el país. Los tiempos de encargo son
        adicionales al envío. Coordinás todo por WhatsApp una vez confirmada la compra.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-lg font-semibold text-foreground">Horarios de atención</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {HOURS.map((h) => (
            <li key={h.day}>
              <span className="text-foreground">{h.day}:</span> {h.hours}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Envío y retiro</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <span className="text-foreground">Retiro en persona:</span> punto a coordinar en CABA,
            dentro del horario de atención.
          </li>
          <li>
            <span className="text-foreground">Envíos:</span> a todo el país por correo/cadetería
            según zona, a coordinar por WhatsApp.
          </li>
          <li>
            <span className="text-foreground">Stock inmediato:</span> se coordina entrega en 24-72 hs
            desde la confirmación.
          </li>
          <li>
            <span className="text-foreground">Productos a pedido:</span> el tiempo estimado figura en
            la ficha de cada producto, y es adicional al tiempo de envío.
          </li>
        </ul>
      </section>
    </div>
  );
}
