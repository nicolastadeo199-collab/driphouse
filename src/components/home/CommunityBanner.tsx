import { buildWhatsAppMessageLink } from "@/lib/whatsapp";

export default function CommunityBanner() {
  const waHref = buildWhatsAppMessageLink("Hola! Quiero sumarme al Club DripHouse.");

  return (
    <section className="border-b border-border bg-accent py-16 text-accent-ink sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-graffiti text-3xl sm:text-4xl">Sumate al Club DripHouse</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm font-medium sm:text-base">
          Acceso anticipado a drops nuevos, encargos grupales, y tu voz en qué traemos después —
          todo por WhatsApp, sin spam.
        </p>
        <div className="mt-7 flex justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-ink px-8 py-3 text-[14.5px] font-semibold text-accent transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-90"
          >
            Sumarme por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
