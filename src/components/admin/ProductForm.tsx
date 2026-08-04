"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import ImageDropzone from "@/components/admin/ImageDropzone";
import VariantEditor from "@/components/admin/VariantEditor";
import Button from "@/components/ui/Button";

type Category = { id: string; name: string };

type ProductDefaults = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brand: string;
  color: string;
  status: string;
  availability: string;
  leadTimeMinDays: number | null;
  leadTimeMaxDays: number | null;
  sizeGuideNote: string;
  variants: { size: string; stock: number }[];
  images: { id: string; url: string }[];
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : label}
    </Button>
  );
}

export default function ProductForm({
  action,
  categories,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  defaults?: Partial<ProductDefaults>;
  submitLabel: string;
}) {
  const [availability, setAvailability] = useState(defaults?.availability ?? "IN_STOCK");

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-muted">
          Nombre del producto
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaults?.name}
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="brand" className="mb-1 block text-sm text-muted">
            Marca
          </label>
          <input
            id="brand"
            name="brand"
            placeholder="Ej: DripHouse, Nike, etc."
            defaultValue={defaults?.brand}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="color" className="mb-1 block text-sm text-muted">
            Color
          </label>
          <input
            id="color"
            name="color"
            placeholder="Ej: Negro"
            defaultValue={defaults?.color}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm text-muted">
            Precio (ARS)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="1"
            required
            defaultValue={defaults?.price}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm text-muted">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaults?.categoryId}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="" disabled>
              Elegir categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Talles y stock</label>
        <VariantEditor defaultVariants={defaults?.variants ?? []} />
      </div>

      <div>
        <label htmlFor="sizeGuideNote" className="mb-1 block text-sm text-muted">
          Nota de guía de talles (opcional)
        </label>
        <textarea
          id="sizeGuideNote"
          name="sizeGuideNote"
          rows={2}
          placeholder="Ej: Oversize, si dudás elegí el talle más chico."
          defaultValue={defaults?.sizeGuideNote}
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm text-muted">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "AVAILABLE"}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="SOLD_OUT">Agotado</option>
          </select>
        </div>

        <div>
          <label htmlFor="availability" className="mb-1 block text-sm text-muted">
            Disponibilidad
          </label>
          <select
            id="availability"
            name="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="IN_STOCK">Stock inmediato</option>
            <option value="MADE_TO_ORDER">A pedido</option>
          </select>
        </div>
      </div>

      {availability === "MADE_TO_ORDER" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="leadTimeMinDays" className="mb-1 block text-sm text-muted">
              Entrega mínima (días)
            </label>
            <input
              id="leadTimeMinDays"
              name="leadTimeMinDays"
              type="number"
              min={0}
              step="1"
              defaultValue={defaults?.leadTimeMinDays ?? undefined}
              className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="leadTimeMaxDays" className="mb-1 block text-sm text-muted">
              Entrega máxima (días)
            </label>
            <input
              id="leadTimeMaxDays"
              name="leadTimeMaxDays"
              type="number"
              min={0}
              step="1"
              defaultValue={defaults?.leadTimeMaxDays ?? undefined}
              className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="description" className="mb-1 block text-sm text-muted">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={defaults?.description}
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Fotos</label>
        <ImageDropzone existingImages={defaults?.images ?? []} />
      </div>

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
