"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type CategoryTile = { id: string; name: string; slug: string; image?: string };

export default function MegaMenu({ categories }: { categories: CategoryTile[] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  if (categories.length === 0) return null;

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
      >
        Categorías
        <svg
          viewBox="0 0 12 8"
          className={`h-2.5 w-2.5 fill-current transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(90vw,560px)] rounded-lg border border-border bg-background-elevated p-4 shadow-2xl">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?categoria=${category.slug}`}
                onClick={() => setOpen(false)}
                className="group flex flex-col items-center gap-2"
              >
                <span className="relative block aspect-square w-full overflow-hidden rounded-md border border-border bg-black">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-muted">
                      Sin foto
                    </span>
                  )}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground group-hover:text-accent">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
