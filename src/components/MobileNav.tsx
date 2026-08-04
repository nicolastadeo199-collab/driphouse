"use client";

import { useState } from "react";
import Link from "next/link";
import SearchAutosuggest from "@/components/SearchAutosuggest";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductHit = { slug: string; name: string; price: number; image?: string };

export default function MobileNav({
  categories,
  products,
}: {
  categories: Category[];
  products: ProductHit[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-label={open ? "Cerrar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded border border-border"
      >
        <span
          className={`h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[57px] z-30 border-b border-border bg-background px-4 py-4">
          <SearchAutosuggest products={products} categories={categories} className="mb-4" />
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link href="/" onClick={() => setOpen(false)} className="hover:text-accent">
              Catálogo
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?categoria=${category.slug}`}
                onClick={() => setOpen(false)}
                className="hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/info" onClick={() => setOpen(false)} className="hover:text-accent">
              Info
            </Link>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-accent hover:opacity-80"
            >
              Consultar por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
