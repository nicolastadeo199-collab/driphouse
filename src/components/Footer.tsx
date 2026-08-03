import Link from "next/link";
import { buildInstagramLink } from "@/lib/whatsapp";

export default function Footer() {
  const instagramLink = buildInstagramLink();
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USER ?? "driphouse_store_";

  return (
    <footer className="border-t border-border bg-background-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-graffiti text-xl text-accent">DripHouse</p>
          <p className="mt-1">Reseller #1 US-AR &mdash; Stock, encargos y trends.</p>
        </div>

        <div className="flex flex-col gap-1 md:items-end">
          <Link href="/info" className="hover:text-accent">
            Horarios y contacto
          </Link>
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            @{instagramUser}
          </a>
          <p className="mt-2 text-xs">
            &copy; {new Date().getFullYear()} DripHouse. Todos los articulos son 100% originales.
          </p>
        </div>
      </div>
    </footer>
  );
}
