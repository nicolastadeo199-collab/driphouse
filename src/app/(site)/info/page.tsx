import { buildInstagramLink } from "@/lib/whatsapp";
import ContactButtons from "@/components/ContactButtons";
import ShippingInfo from "@/components/ShippingInfo";

export const metadata = {
  title: "Info",
  description: "Horarios de atencion, envio, retiro y datos de contacto de DripHouse.",
};

export default function InfoPage() {
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USER ?? "driphouse_store_";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-graffiti text-4xl text-accent text-glow">Info</h1>

      <div className="mt-8">
        <ShippingInfo />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Contacto</h2>
        <p className="mt-3 text-sm text-muted">
          Reseller #1 US-AR. Stock, encargos y trends &mdash; articulos 100% originales.
        </p>
        <p className="mt-2 text-sm text-muted">
          Instagram:{" "}
          <a href={buildInstagramLink()} target="_blank" rel="noopener noreferrer" className="text-accent">
            @{instagramUser}
          </a>
        </p>
      </section>

      <section className="mt-10">
        <ContactButtons productName="" />
      </section>
    </div>
  );
}
