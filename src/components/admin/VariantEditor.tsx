"use client";

import { useState } from "react";

type Variant = { size: string; stock: number };
type Row = Variant & { key: string };

function makeKey() {
  return Math.random().toString(36).slice(2);
}

export default function VariantEditor({ defaultVariants }: { defaultVariants: Variant[] }) {
  const [rows, setRows] = useState<Row[]>(() => {
    const initial = defaultVariants.length ? defaultVariants : [{ size: "", stock: 0 }];
    return initial.map((v) => ({ ...v, key: makeKey() }));
  });

  function addRow() {
    setRows((r) => [...r, { key: makeKey(), size: "", stock: 0 }]);
  }

  function removeRow(key: string) {
    setRows((r) => r.filter((row) => row.key !== key));
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <input
              name="variantSize"
              defaultValue={row.size}
              placeholder="Talle (ej: M, 42, Único)"
              className="w-40 rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
            <input
              name="variantStock"
              type="number"
              min={0}
              step="1"
              defaultValue={row.stock}
              placeholder="Stock"
              className="w-28 rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeRow(row.key)}
              className="text-sm text-muted hover:text-danger"
              aria-label="Quitar talle"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 text-sm font-medium text-accent hover:underline"
      >
        + Agregar talle
      </button>
    </div>
  );
}
