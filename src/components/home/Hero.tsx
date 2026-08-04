import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden border-b border-border bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, rgba(57,255,106,0.16), transparent 55%), radial-gradient(circle at 80% 75%, rgba(57,255,106,0.10), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Reseller #1 US-AR
        </p>
        <h1 className="font-graffiti text-glow mx-auto max-w-3xl text-4xl leading-tight text-accent sm:text-6xl">
          La cultura streetwear tiene casa
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted sm:text-base">
          Stock, encargos y trends — artículos 100% originales. Elegís, escribís por WhatsApp, te llega.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/catalogo" size="md" className="px-8">
            Ver catálogo
          </Button>
        </div>
      </div>
    </section>
  );
}
