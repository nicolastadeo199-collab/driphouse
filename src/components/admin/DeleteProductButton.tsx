"use client";

import { deleteProductAction } from "@/app/admin/actions";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar "${productName}"? Esta accion no se puede deshacer.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" className="text-muted hover:text-red-400">
        Eliminar
      </button>
    </form>
  );
}
