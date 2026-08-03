"use client";

import { useFormStatus } from "react-dom";
import ImageDropzone from "@/components/admin/ImageDropzone";

type Category = { id: string; name: string };

type ProductDefaults = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sizes: string;
  status: string;
  images: { id: string; url: string }[];
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-accent px-6 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Guardando..." : label}
    </button>
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
        <label htmlFor="sizes" className="mb-1 block text-sm text-muted">
          Talles disponibles (opcional, separados por coma)
        </label>
        <input
          id="sizes"
          name="sizes"
          placeholder="S, M, L, XL"
          defaultValue={defaults?.sizes}
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

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
