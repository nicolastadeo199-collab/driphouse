import Link from "next/link";
import { buildInstagramLink } from "@/lib/whatsapp";

export default function Footer() {
  const instagramLink = buildInstagramLink();
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USER ?? "driphouse_store_";

  return (
    <footer className="border-t border-border bg-background-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between">
        <div>
          <p className="font-graffiti text-xl text-accent">DripHouse</p>
          <p className="mt-1">Reseller #1 US-AR &mdash; stock, encargos y trends.</p>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground">Navegar</span>
            <Link href="/catalogo" className="hover:text-accent">
              Catálogo
            </Link>
            <Link href="/catalogo" className="hover:text-accent">
              Categorías
            </Link>
            <Link href="/info" className="hover:text-accent">
              Info
            </Link>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground">Contacto</span>
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              @{instagramUser}
            </a>
            <span>Lun a Vie 12-20hs</span>
            <span>Sáb 16-00hs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
