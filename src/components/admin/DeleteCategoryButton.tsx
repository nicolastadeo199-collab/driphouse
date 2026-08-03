"use client";

import { deleteCategoryAction } from "@/app/admin/actions";

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  return (
    <form
      action={deleteCategoryAction}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar la categoría "${categoryName}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="categoryId" value={categoryId} />
      <button type="submit" className="text-sm text-muted hover:text-red-400">
        Eliminar
      </button>
    </form>
  );
}
