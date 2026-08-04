"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background-elevated">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-graffiti text-2xl text-accent">DripHouse Admin</span>
          <nav className="flex gap-4 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname.startsWith(link.href)
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-muted hover:text-foreground">
            Ver sitio
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-muted hover:text-accent">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
